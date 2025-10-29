import 'dotenv/config'
import { getOrCreateBot, cleanDuplicateConversations, cleanDuplicateMessages } from './src/supabase.js'

/**
 * Script para limpiar conversaciones y mensajes duplicados
 * Ejecutar con: node cleanup-duplicates.js
 */
async function main() {
    try {
        console.log('🧹 Iniciando limpieza de duplicados...\n')
        
        // Obtener el bot
        const bot = await getOrCreateBot()
        console.log(`Bot: ${bot.name} (ID: ${bot.id})\n`)
        
        // Limpiar conversaciones duplicadas
        console.log('=' .repeat(60))
        console.log('PASO 1: Limpiando conversaciones duplicadas')
        console.log('=' .repeat(60))
        const convResult = await cleanDuplicateConversations(bot.id)
        
        console.log('\n' + '=' .repeat(60))
        console.log('PASO 2: Limpiando mensajes duplicados')
        console.log('=' .repeat(60))
        const msgCount = await cleanDuplicateMessages()
        
        console.log('\n' + '=' .repeat(60))
        console.log('✅ LIMPIEZA COMPLETADA')
        console.log('=' .repeat(60))
        console.log(`📊 Resumen:`)
        console.log(`   - Conversaciones duplicadas eliminadas: ${convResult.duplicatesRemoved}`)
        console.log(`   - Mensajes migrados: ${convResult.messagesMigrated}`)
        console.log(`   - Mensajes duplicados eliminados: ${msgCount}`)
        console.log(`   - Conversaciones únicas finales: ${convResult.uniqueConversations}`)
        console.log('=' .repeat(60))
        
        process.exit(0)
    } catch (error) {
        console.error('❌ Error durante la limpieza:', error)
        process.exit(1)
    }
}

main()
