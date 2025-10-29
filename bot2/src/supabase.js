import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

// Validar que las variables de entorno estén configuradas
if (!process.env.SUPABASE_URL) {
    throw new Error('SUPABASE_URL no está configurada en el archivo .env')
}

if (!process.env.SUPABASE_ANON_KEY) {
    throw new Error('SUPABASE_ANON_KEY no está configurada en el archivo .env')
}

// Crear cliente de Supabase
const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

/**
 * Obtiene o crea el bot principal
 * @returns {Promise<Object>} El bot
 */
export async function getOrCreateBot() {
    const BOT_NAME = process.env.BOT_NAME || 'Asesor 1'
    const BOT_IDENTIFIER = process.env.BOT_IDENTIFIER || 'bot1'
    
    try {
        // Intentar obtener el bot por su identificador único
        const { data: bots, error } = await supabase
            .from('bots')
            .select('*')
            .eq('phone_number', BOT_IDENTIFIER)
            .limit(1)

        if (error) throw error

        if (bots && bots.length > 0) {
            console.log(`✅ Bot encontrado: ${bots[0].name}`)
            return bots[0]
        }

        // Si no existe, crear uno nuevo
        const { data: newBot, error: createError } = await supabase
            .from('bots')
            .insert([
                { 
                    name: BOT_NAME, 
                    phone_number: BOT_IDENTIFIER,
                    status: 'active' 
                }
            ])
            .select()
            .single()

        if (createError) throw createError

        console.log(`✅ Bot creado en Supabase: ${newBot.name} (ID: ${newBot.id})`)
        return newBot
    } catch (error) {
        console.error('❌ Error al obtener o crear bot:', error)
        throw error
    }
}

/**
 * Obtiene o crea una conversación
 * @param {string} botId - ID del bot
 * @param {string} remoteJid - ID remoto de WhatsApp
 * @param {string} contactName - Nombre del contacto
 * @returns {Promise<Object>} La conversación
 */
export async function getOrCreateConversation(botId, remoteJid, contactName) {
    try {
        // Intentar obtener la conversación existente - IMPORTANTE: usar .single() para evitar duplicados
        const { data: existingConv, error: fetchError } = await supabase
            .from('conversations')
            .select('*')
            .eq('bot_id', botId)
            .eq('remote_jid', remoteJid)
            .maybeSingle() // Usa maybeSingle() en lugar de limit(1) para manejar mejor los casos

        if (fetchError && fetchError.code !== 'PGRST116') {
            throw fetchError
        }

        if (existingConv) {
            // Actualizar el nombre del contacto si cambió
            if (existingConv.contact_name !== contactName) {
                const { error: updateError } = await supabase
                    .from('conversations')
                    .update({ contact_name: contactName })
                    .eq('id', existingConv.id)
                
                if (!updateError) {
                    console.log(`✅ Nombre actualizado: ${contactName}`)
                }
            }
            return existingConv
        }

        // Si no existe, crear una nueva
        const { data: newConversation, error: createError } = await supabase
            .from('conversations')
            .insert([
                {
                    bot_id: botId,
                    remote_jid: remoteJid,
                    contact_name: contactName
                }
            ])
            .select()
            .single()

        if (createError) {
            // Si el error es por duplicado, intentar obtener la conversación nuevamente
            if (createError.code === '23505') {
                console.log(`⚠️ Conversación duplicada detectada, obteniendo existente...`)
                const { data: retryConv } = await supabase
                    .from('conversations')
                    .select('*')
                    .eq('bot_id', botId)
                    .eq('remote_jid', remoteJid)
                    .single()
                return retryConv
            }
            throw createError
        }

        console.log(`✅ Conversación creada para ${contactName} (${remoteJid})`)
        return newConversation
    } catch (error) {
        console.error('❌ Error al obtener o crear conversación:', error)
        throw error
    }
}

/**
 * Guarda un mensaje en la base de datos (con verificación de duplicados)
 * @param {string} conversationId - ID de la conversación
 * @param {string} body - Cuerpo del mensaje
 * @param {boolean} fromMe - Si el mensaje es del bot
 * @param {string} messageType - Tipo de mensaje (text, audio, etc.)
 * @param {Date} timestamp - Timestamp del mensaje
 * @returns {Promise<Object>} El mensaje guardado o existente
 */
export async function saveMessage(conversationId, body, fromMe, messageType = 'text', timestamp = new Date()) {
    try {
        const timestampISO = timestamp.toISOString()
        
        // Verificar si el mensaje ya existe (por timestamp, body y conversation_id)
        const { data: existingMessage, error: checkError } = await supabase
            .from('messages')
            .select('*')
            .eq('conversation_id', conversationId)
            .eq('timestamp', timestampISO)
            .eq('body', body)
            .eq('from_me', fromMe)
            .maybeSingle()

        if (checkError && checkError.code !== 'PGRST116') {
            throw checkError
        }

        // Si el mensaje ya existe, retornarlo sin insertar
        if (existingMessage) {
            // console.log(`⏭️ Mensaje ya existe, omitiendo: ${body.substring(0, 30)}...`)
            return existingMessage
        }

        // Si no existe, insertar el nuevo mensaje
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    conversation_id: conversationId,
                    body,
                    from_me: fromMe,
                    message_type: messageType,
                    timestamp: timestampISO
                }
            ])
            .select()
            .single()

        if (error) {
            // Si es error de duplicado, intentar obtener el mensaje
            if (error.code === '23505') {
                const { data: retryMsg } = await supabase
                    .from('messages')
                    .select('*')
                    .eq('conversation_id', conversationId)
                    .eq('timestamp', timestampISO)
                    .eq('body', body)
                    .single()
                return retryMsg
            }
            throw error
        }

        console.log(`✅ Mensaje guardado: ${body.substring(0, 50)}...`)
        
        // Actualizar last_message_at de la conversación
        await supabase
            .from('conversations')
            .update({ last_message_at: timestampISO })
            .eq('id', conversationId)

        return data
    } catch (error) {
        console.error('❌ Error al guardar mensaje:', error.message)
        throw error
    }
}

/**
 * Obtiene todas las conversaciones con sus mensajes
 * @param {string} botId - ID del bot
 * @returns {Promise<Array>} Array de conversaciones con mensajes
 */
export async function getAllConversations(botId) {
    try {
        const { data: conversations, error } = await supabase
            .from('conversations')
            .select(`
                *,
                messages (
                    id,
                    body,
                    from_me,
                    message_type,
                    timestamp,
                    created_at
                )
            `)
            .eq('bot_id', botId)
            .order('last_message_at', { ascending: false })

        if (error) throw error

        // Ordenar mensajes por timestamp dentro de cada conversación
        const conversationsWithSortedMessages = conversations.map(conv => ({
            ...conv,
            messages: conv.messages.sort((a, b) => 
                new Date(a.timestamp) - new Date(b.timestamp)
            )
        }))

        return conversationsWithSortedMessages
    } catch (error) {
        console.error('❌ Error al obtener conversaciones:', error)
        throw error
    }
}

/**
 * Obtiene una conversación específica con sus mensajes
 * @param {string} conversationId - ID de la conversación
 * @returns {Promise<Object>} La conversación con sus mensajes
 */
export async function getConversationById(conversationId) {
    try {
        const { data, error } = await supabase
            .from('conversations')
            .select(`
                *,
                messages (
                    id,
                    body,
                    from_me,
                    message_type,
                    timestamp,
                    created_at
                )
            `)
            .eq('id', conversationId)
            .single()

        if (error) throw error

        // Ordenar mensajes por timestamp
        data.messages = data.messages.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        )

        return data
    } catch (error) {
        console.error('❌ Error al obtener conversación:', error)
        throw error
    }
}

/**
 * Limpia conversaciones duplicadas SOLO dentro del mismo bot
 * Mantiene solo la más antigua por remote_jid dentro del bot_id especificado
 * @param {string} botId - ID del bot
 * @returns {Promise<Object>} Resultado de la limpieza
 */
export async function cleanDuplicateConversations(botId) {
    try {
        console.log(`🧹 Limpiando duplicados para bot ${botId.substring(0, 8)}...`)
        
        // Obtener SOLO las conversaciones de ESTE bot específico
        const { data: allConversations, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('bot_id', botId)
            .order('created_at', { ascending: true })

        if (error) throw error

        if (!allConversations || allConversations.length === 0) {
            console.log('   No hay conversaciones para este bot')
            return { duplicatesRemoved: 0, messagesMigrated: 0, uniqueConversations: 0 }
        }

        // Agrupar por remote_jid DENTRO de este bot
        const conversationsByJid = {}
        for (const conv of allConversations) {
            if (!conversationsByJid[conv.remote_jid]) {
                conversationsByJid[conv.remote_jid] = []
            }
            conversationsByJid[conv.remote_jid].push(conv)
        }

        let duplicatesRemoved = 0
        let messagesMigrated = 0

        // Para cada grupo de conversaciones con el mismo remote_jid EN ESTE BOT
        for (const [remoteJid, conversations] of Object.entries(conversationsByJid)) {
            if (conversations.length > 1) {
                console.log(`   ⚠️ ${conversations.length} duplicados de ${remoteJid} en este bot`)
                
                // Mantener la primera (más antigua)
                const keepConversation = conversations[0]
                const duplicates = conversations.slice(1)

                // Migrar mensajes de las duplicadas a la conversación principal
                for (const duplicate of duplicates) {
                    // Obtener mensajes de la conversación duplicada
                    const { data: messages } = await supabase
                        .from('messages')
                        .select('*')
                        .eq('conversation_id', duplicate.id)

                    if (messages && messages.length > 0) {
                        console.log(`      📦 Migrando ${messages.length} mensajes...`)
                        
                        // Actualizar conversation_id de los mensajes
                        const { error: updateError } = await supabase
                            .from('messages')
                            .update({ conversation_id: keepConversation.id })
                            .eq('conversation_id', duplicate.id)

                        if (!updateError) {
                            messagesMigrated += messages.length
                        }
                    }

                    // Eliminar la conversación duplicada
                    const { error: deleteError } = await supabase
                        .from('conversations')
                        .delete()
                        .eq('id', duplicate.id)

                    if (!deleteError) {
                        duplicatesRemoved++
                    }
                }
            }
        }

        const result = {
            duplicatesRemoved,
            messagesMigrated,
            uniqueConversations: Object.keys(conversationsByJid).length
        }

        if (duplicatesRemoved > 0) {
            console.log(`   ✅ ${duplicatesRemoved} duplicados eliminados, ${messagesMigrated} mensajes migrados`)
        } else {
            console.log(`   ✅ No se encontraron duplicados en este bot`)
        }

        return result
    } catch (error) {
        console.error('❌ Error al limpiar conversaciones duplicadas:', error)
        throw error
    }
}

/**
 * Limpia mensajes duplicados en una conversación
 * @param {string} conversationId - ID de la conversación (opcional, si no se proporciona limpia todas)
 * @returns {Promise<number>} Número de mensajes duplicados eliminados
 */
export async function cleanDuplicateMessages(conversationId = null) {
    try {
        console.log('🧹 Iniciando limpieza de mensajes duplicados...')
        
        let query = supabase
            .from('messages')
            .select('*')
            .order('timestamp', { ascending: true })

        if (conversationId) {
            query = query.eq('conversation_id', conversationId)
        }

        const { data: allMessages, error } = await query

        if (error) throw error

        // Agrupar mensajes por clave única (conversation_id + timestamp + body + from_me)
        const messagesByKey = {}
        for (const msg of allMessages) {
            const key = `${msg.conversation_id}_${msg.timestamp}_${msg.body}_${msg.from_me}`
            if (!messagesByKey[key]) {
                messagesByKey[key] = []
            }
            messagesByKey[key].push(msg)
        }

        let duplicatesRemoved = 0

        // Eliminar duplicados manteniendo el primero
        for (const [key, messages] of Object.entries(messagesByKey)) {
            if (messages.length > 1) {
                const duplicates = messages.slice(1)
                const duplicateIds = duplicates.map(m => m.id)

                const { error: deleteError } = await supabase
                    .from('messages')
                    .delete()
                    .in('id', duplicateIds)

                if (!deleteError) {
                    duplicatesRemoved += duplicates.length
                    console.log(`  ✅ ${duplicates.length} mensajes duplicados eliminados`)
                }
            }
        }

        console.log(`✅ Limpieza de mensajes completada: ${duplicatesRemoved} duplicados eliminados`)
        return duplicatesRemoved
    } catch (error) {
        console.error('❌ Error al limpiar mensajes duplicados:', error)
        throw error
    }
}

export default supabase
