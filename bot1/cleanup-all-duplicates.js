import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

/**
 * Script para limpiar TODAS las conversaciones duplicadas
 * independientemente del bot_id (mantiene solo la más antigua por remote_jid)
 */
async function cleanAllDuplicates() {
    try {
        console.log('🧹 Iniciando limpieza GLOBAL de conversaciones duplicadas...\n')
        
        // Obtener todas las conversaciones
        const { data: allConversations, error } = await supabase
            .from('conversations')
            .select('*')
            .order('created_at', { ascending: true })

        if (error) throw error

        console.log(`Total de conversaciones: ${allConversations.length}`)

        // Agrupar por remote_jid (sin importar bot_id)
        const conversationsByJid = {}
        for (const conv of allConversations) {
            if (!conversationsByJid[conv.remote_jid]) {
                conversationsByJid[conv.remote_jid] = []
            }
            conversationsByJid[conv.remote_jid].push(conv)
        }

        let duplicatesRemoved = 0
        let messagesMigrated = 0
        let conversationsProcessed = 0

        console.log('\n' + '='.repeat(80))
        console.log('PROCESANDO DUPLICADOS:')
        console.log('='.repeat(80))

        // Para cada grupo de conversaciones con el mismo remote_jid
        for (const [remoteJid, conversations] of Object.entries(conversationsByJid)) {
            if (conversations.length > 1) {
                conversationsProcessed++
                console.log(`\n📱 ${conversations[0].contact_name || remoteJid}`)
                console.log(`   Remote JID: ${remoteJid}`)
                console.log(`   Duplicados encontrados: ${conversations.length}`)
                
                // Mantener la primera (más antigua)
                const keepConversation = conversations[0]
                const duplicates = conversations.slice(1)

                console.log(`   ✅ Manteniendo: ${keepConversation.id.substring(0, 8)}... (Bot: ${keepConversation.bot_id.substring(0, 8)}...)`)

                // Migrar mensajes de las duplicadas a la conversación principal
                for (const duplicate of duplicates) {
                    console.log(`   🗑️  Eliminando: ${duplicate.id.substring(0, 8)}... (Bot: ${duplicate.bot_id.substring(0, 8)}...)`)
                    
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
                        } else {
                            console.error(`      ❌ Error migrando mensajes: ${updateError.message}`)
                        }
                    }

                    // Eliminar la conversación duplicada
                    const { error: deleteError } = await supabase
                        .from('conversations')
                        .delete()
                        .eq('id', duplicate.id)

                    if (!deleteError) {
                        duplicatesRemoved++
                    } else {
                        console.error(`      ❌ Error eliminando conversación: ${deleteError.message}`)
                    }
                }
            }
        }

        console.log('\n' + '='.repeat(80))
        console.log('✅ LIMPIEZA DE CONVERSACIONES COMPLETADA')
        console.log('='.repeat(80))
        console.log(`📊 Resumen:`)
        console.log(`   - Números con duplicados procesados: ${conversationsProcessed}`)
        console.log(`   - Conversaciones duplicadas eliminadas: ${duplicatesRemoved}`)
        console.log(`   - Mensajes migrados: ${messagesMigrated}`)
        console.log(`   - Conversaciones únicas finales: ${Object.keys(conversationsByJid).length}`)

        return {
            conversationsProcessed,
            duplicatesRemoved,
            messagesMigrated,
            uniqueConversations: Object.keys(conversationsByJid).length
        }
    } catch (error) {
        console.error('❌ Error al limpiar conversaciones duplicadas:', error)
        throw error
    }
}

async function cleanAllDuplicateMessages() {
    try {
        console.log('\n' + '='.repeat(80))
        console.log('LIMPIANDO MENSAJES DUPLICADOS:')
        console.log('='.repeat(80))
        
        const { data: allMessages, error } = await supabase
            .from('messages')
            .select('*')
            .order('timestamp', { ascending: true })

        if (error) throw error

        console.log(`Total de mensajes: ${allMessages.length}`)

        // Agrupar mensajes por clave única
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
                    if (duplicates.length > 5) {
                        console.log(`  ✅ ${duplicates.length} mensajes duplicados eliminados`)
                    }
                }
            }
        }

        console.log(`\n✅ Limpieza de mensajes completada: ${duplicatesRemoved} duplicados eliminados`)
        return duplicatesRemoved
    } catch (error) {
        console.error('❌ Error al limpiar mensajes duplicados:', error)
        throw error
    }
}

async function main() {
    try {
        console.log('🚀 LIMPIEZA GLOBAL DE DUPLICADOS\n')
        
        // Paso 1: Limpiar conversaciones duplicadas
        const convResult = await cleanAllDuplicates()
        
        // Paso 2: Limpiar mensajes duplicados
        const msgCount = await cleanAllDuplicateMessages()
        
        console.log('\n' + '='.repeat(80))
        console.log('🎉 LIMPIEZA GLOBAL COMPLETADA')
        console.log('='.repeat(80))
        console.log(`📊 Resumen Final:`)
        console.log(`   - Conversaciones duplicadas eliminadas: ${convResult.duplicatesRemoved}`)
        console.log(`   - Mensajes migrados: ${convResult.messagesMigrated}`)
        console.log(`   - Mensajes duplicados eliminados: ${msgCount}`)
        console.log(`   - Conversaciones únicas finales: ${convResult.uniqueConversations}`)
        console.log('='.repeat(80))
        
        process.exit(0)
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error)
        process.exit(1)
    }
}

main()
