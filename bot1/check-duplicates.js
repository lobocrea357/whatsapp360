import 'dotenv/config'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

/**
 * Script para verificar conversaciones duplicadas en la base de datos
 */
async function main() {
    try {
        console.log('🔍 Verificando conversaciones duplicadas...\n')
        
        // Obtener todas las conversaciones
        const { data: conversations, error } = await supabase
            .from('conversations')
            .select('id, bot_id, remote_jid, contact_name, created_at')
            .order('remote_jid', { ascending: true })
            .order('created_at', { ascending: true })

        if (error) throw error

        console.log(`Total de conversaciones: ${conversations.length}\n`)

        // Agrupar por remote_jid
        const grouped = {}
        for (const conv of conversations) {
            if (!grouped[conv.remote_jid]) {
                grouped[conv.remote_jid] = []
            }
            grouped[conv.remote_jid].push(conv)
        }

        // Mostrar duplicados
        let duplicatesFound = 0
        console.log('=' .repeat(80))
        console.log('CONVERSACIONES DUPLICADAS ENCONTRADAS:')
        console.log('=' .repeat(80))
        
        for (const [remoteJid, convs] of Object.entries(grouped)) {
            if (convs.length > 1) {
                duplicatesFound++
                console.log(`\n📱 ${remoteJid} - ${convs[0].contact_name}`)
                console.log(`   Duplicados: ${convs.length}`)
                convs.forEach((c, i) => {
                    console.log(`   ${i + 1}. ID: ${c.id.substring(0, 8)}... | Bot: ${c.bot_id.substring(0, 8)}... | Creado: ${c.created_at}`)
                })
            }
        }

        if (duplicatesFound === 0) {
            console.log('\n✅ No se encontraron conversaciones duplicadas')
        } else {
            console.log('\n' + '=' .repeat(80))
            console.log(`⚠️ Total de números con conversaciones duplicadas: ${duplicatesFound}`)
        }

        // Verificar si hay múltiples bots
        const uniqueBots = new Set(conversations.map(c => c.bot_id))
        console.log(`\n📊 Bots únicos en la base de datos: ${uniqueBots.size}`)
        if (uniqueBots.size > 1) {
            console.log('⚠️ ADVERTENCIA: Hay múltiples bots, esto puede causar duplicados')
            for (const botId of uniqueBots) {
                const botConvs = conversations.filter(c => c.bot_id === botId)
                console.log(`   - Bot ${botId.substring(0, 8)}...: ${botConvs.length} conversaciones`)
            }
        }

        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

main()
