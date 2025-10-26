import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Obtiene todos los bots con el conteo de conversaciones
 */
export async function getAllBots() {
  const { data: bots, error } = await supabase
    .from('bots')
    .select(`
      *,
      conversations:conversations(count)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  
  return bots.map(bot => ({
    ...bot,
    conversation_count: bot.conversations[0]?.count || 0
  }))
}

/**
 * Obtiene las conversaciones de un bot específico
 */
export async function getConversationsByBot(botId) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      messages:messages(count)
    `)
    .eq('bot_id', botId)
    .order('last_message_at', { ascending: false, nullsFirst: false })

  if (error) throw error

  return data.map(conv => ({
    ...conv,
    message_count: conv.messages[0]?.count || 0
  }))
}

/**
 * Obtiene una conversación con todos sus mensajes
 */
export async function getConversationWithMessages(conversationId) {
  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      bot:bots(*),
      messages:messages(*)
    `)
    .eq('id', conversationId)
    .single()

  if (error) throw error

  // Ordenar mensajes por timestamp
  data.messages = data.messages.sort((a, b) => 
    new Date(a.timestamp) - new Date(b.timestamp)
  )

  return data
}

/**
 * Descarga una conversación en formato TXT
 */
export function downloadConversationAsTxt(conversation) {
  const { contact_name, remote_jid, messages } = conversation
  const contactIdentifier = contact_name || remote_jid

  let conversationText = `Conversación con ${contactIdentifier}\n`
  conversationText += `ID: ${remote_jid}\n`
  conversationText += `Fecha: ${new Date().toLocaleString()}\n`
  conversationText += `Total de mensajes: ${messages.length}\n`
  conversationText += `\n${'='.repeat(60)}\n\n`

  messages.forEach(msg => {
    const sender = msg.from_me ? 'Bot' : contactIdentifier
    const formattedTimestamp = new Date(msg.timestamp).toLocaleString()
    conversationText += `[${formattedTimestamp}] ${sender}:\n${msg.body}\n\n`
  })

  const blob = new Blob([conversationText], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `conversacion_${contactIdentifier}_${Date.now()}.txt`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Descarga una conversación en formato Markdown
 */
export function downloadConversationAsMarkdown(conversation) {
  const { contact_name, remote_jid, messages, bot } = conversation
  const contactIdentifier = contact_name || remote_jid

  let markdown = `# Conversación con ${contactIdentifier}\n\n`
  markdown += `**Bot:** ${bot?.name || 'N/A'}\n`
  markdown += `**ID de WhatsApp:** \`${remote_jid}\`\n`
  markdown += `**Fecha de descarga:** ${new Date().toLocaleString()}\n`
  markdown += `**Total de mensajes:** ${messages.length}\n\n`
  markdown += `---\n\n`

  messages.forEach(msg => {
    const sender = msg.from_me ? '🤖 **Bot**' : `👤 **${contactIdentifier}**`
    const formattedTimestamp = new Date(msg.timestamp).toLocaleString()
    markdown += `### ${sender}\n`
    markdown += `*${formattedTimestamp}*\n\n`
    markdown += `${msg.body}\n\n`
    markdown += `---\n\n`
  })

  const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', `conversacion_${contactIdentifier}_${Date.now()}.md`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
