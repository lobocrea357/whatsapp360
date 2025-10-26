import { join } from 'path'
import { readFile, watch } from 'fs/promises'
import { existsSync } from 'fs'
import { getOrCreateBot, getOrCreateConversation, saveMessage } from './supabase.js'

const DB_PATH = join(process.cwd(), 'db.json')
let lastProcessedData = null
let bot = null

/**
 * Inicializa el bot en Supabase
 */
async function initializeBot() {
    try {
        bot = await getOrCreateBot()
        console.log(`✅ Bot inicializado en Supabase: ${bot.name} (ID: ${bot.id})`)
    } catch (error) {
        console.error('❌ Error al inicializar bot:', error)
        throw error
    }
}

/**
 * Sincroniza los mensajes del archivo JSON a Supabase
 */
async function syncMessagesToSupabase() {
    try {
        if (!existsSync(DB_PATH)) {
            console.log('⏳ Esperando que se cree db.json...')
            return
        }

        const data = await readFile(DB_PATH, 'utf8')
        if (!data || data.trim() === '') {
            return
        }

        const conversations = JSON.parse(data)
        
        // Evitar procesar los mismos datos múltiples veces
        const currentDataHash = JSON.stringify(conversations)
        if (currentDataHash === lastProcessedData) {
            return
        }

        console.log(`🔄 Sincronizando ${conversations.length} conversaciones a Supabase...`)

        for (const conv of conversations) {
            try {
                // Obtener o crear la conversación en Supabase
                const conversation = await getOrCreateConversation(
                    bot.id,
                    conv.from,
                    conv.name || conv.from
                )

                // Sincronizar mensajes
                for (const msg of conv.messages) {
                    // Verificar si el mensaje ya existe (por timestamp y body)
                    // Para evitar duplicados, podrías implementar una verificación adicional
                    await saveMessage(
                        conversation.id,
                        msg.body,
                        msg.fromMe,
                        'text',
                        new Date(msg.timestamp)
                    )
                }

                console.log(`✅ Conversación sincronizada: ${conv.name} (${conv.messages.length} mensajes)`)
            } catch (error) {
                console.error(`❌ Error sincronizando conversación ${conv.from}:`, error.message)
            }
        }

        lastProcessedData = currentDataHash
        console.log('✅ Sincronización completada')

    } catch (error) {
        console.error('❌ Error en sincronización:', error)
    }
}

/**
 * Inicia el servicio de sincronización
 */
export async function startMessageSync() {
    try {
        console.log('🚀 Iniciando servicio de sincronización de mensajes...')
        
        // Inicializar bot
        await initializeBot()

        // Sincronización inicial
        await syncMessagesToSupabase()

        // Observar cambios en db.json
        console.log('👀 Observando cambios en db.json...')
        
        // Sincronizar cada vez que se detecte un cambio
        const watcher = watch(DB_PATH)
        
        for await (const event of watcher) {
            if (event.eventType === 'change') {
                console.log('📝 Cambio detectado en db.json, sincronizando...')
                await syncMessagesToSupabase()
            }
        }

    } catch (error) {
        console.error('❌ Error fatal en servicio de sincronización:', error)
        // Reintentar después de 5 segundos
        setTimeout(() => {
            console.log('🔄 Reintentando iniciar servicio de sincronización...')
            startMessageSync()
        }, 5000)
    }
}

// Si se ejecuta directamente
if (import.meta.url === `file://${process.argv[1]}`) {
    startMessageSync()
}
