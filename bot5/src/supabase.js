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
    const BOT_NAME = process.env.BOT_NAME || 'Asesor 5'
    const BOT_IDENTIFIER = process.env.BOT_IDENTIFIER || 'bot5'

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
        // Intentar obtener la conversación existente
        const { data: conversations, error } = await supabase
            .from('conversations')
            .select('*')
            .eq('bot_id', botId)
            .eq('remote_jid', remoteJid)
            .limit(1)

        if (error) throw error

        if (conversations && conversations.length > 0) {
            return conversations[0]
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

        if (createError) throw createError

        console.log(`✅ Conversación creada para ${contactName} (${remoteJid})`)
        return newConversation
    } catch (error) {
        console.error('❌ Error al obtener o crear conversación:', error)
        throw error
    }
}

/**
 * Guarda un mensaje en la base de datos
 * @param {string} conversationId - ID de la conversación
 * @param {string} body - Cuerpo del mensaje
 * @param {boolean} fromMe - Si el mensaje es del bot
 * @param {string} messageType - Tipo de mensaje (text, audio, etc.)
 * @param {Date} timestamp - Timestamp del mensaje
 * @returns {Promise<Object>} El mensaje guardado
 */
export async function saveMessage(conversationId, body, fromMe, messageType = 'text', timestamp = new Date()) {
    try {
        const { data, error } = await supabase
            .from('messages')
            .insert([
                {
                    conversation_id: conversationId,
                    body,
                    from_me: fromMe,
                    message_type: messageType,
                    timestamp: timestamp.toISOString()
                }
            ])
            .select()
            .single()

        if (error) throw error

        console.log(`✅ Mensaje guardado en Supabase: ${body.substring(0, 50)}...`)
        return data
    } catch (error) {
        console.error('❌ Error al guardar mensaje:', error)
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

export default supabase
