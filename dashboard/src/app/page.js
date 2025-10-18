'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

// URL de la API del bot (puede venir de variable de entorno o usar valor por defecto)
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://testbot.novapolointranet.xyz'

export default function Home() {
  const [conversations, setConversations] = useState([])
  const [selectedConversation, setSelectedConversation] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setError(null)
        const response = await axios.get(`${API_URL}/conversations`)
        const sortedConversations = response.data.sort((a, b) => {
          const lastMsgA = a.messages[a.messages.length - 1];
          const lastMsgB = b.messages[b.messages.length - 1];
          if (!lastMsgA || !lastMsgB) return 0;
          return new Date(lastMsgB.timestamp) - new Date(lastMsgA.timestamp);
        });
        setConversations(sortedConversations)
        setSelectedConversation(currentSelected => {
          if (!currentSelected) return null
          const updated = sortedConversations.find(c => c.from === currentSelected.from)
          return updated || currentSelected
        })
      } catch (err) {
        console.error('Error fetching conversations:', err)
        setError('No se pudo conectar con el servidor del bot. ¿Está encendido?')
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
    const intervalId = setInterval(fetchConversations, 2000)

    return () => clearInterval(intervalId)
  }, [])

  const handleSelectConversation = (conv) => {
    setSelectedConversation(conv)
  }

  const handleDownloadConversation = () => {
    if (!selectedConversation) return;

    const { name, from, messages } = selectedConversation;
    const contactIdentifier = name || from;

    let conversationText = `Conversación con ${contactIdentifier}\n\n`;

    messages.forEach(msg => {
      const sender = msg.fromMe ? 'Yo' : contactIdentifier;
      const formattedTimestamp = new Date(msg.timestamp).toLocaleString();
      conversationText += `[${formattedTimestamp}] ${sender}: ${msg.body}\n`;
    });

    const blob = new Blob([conversationText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `conversacion_${contactIdentifier}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  return (
    <div className="flex h-screen font-sans antialiased text-whatsapp-text-primary">
      {/* Sidebar */}
      <aside className="w-1/3 flex flex-col bg-whatsapp-sidebar border-r border-whatsapp-border">
        <header className="p-4 border-b border-whatsapp-border bg-whatsapp-header flex items-center">
          <img src={`${API_URL}/qr`} alt='botqr' width={100}/>
          <h1 className="text-3xl font-bold text-whatsapp-text-primary ml-4">Bot #1 JosniB</h1>
        </header>
        <div className="flex-1 overflow-y-auto">
          {loading && <p className="text-center text-whatsapp-text-secondary p-4">Cargando conversaciones...</p>}
          {error && <p className="text-center text-red-500 p-4">{error}</p>}
          {!loading && !error && (
            <ul>
              {conversations.map((conv) => (
                <li
                  key={conv.from}
                  onClick={() => handleSelectConversation(conv)}
                  className={`p-3 flex items-center cursor-pointer hover:bg-whatsapp-background border-b border-whatsapp-border ${
                    selectedConversation?.from === conv.from ? 'bg-whatsapp-background' : ''
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{conv.name || conv.from}</p>
                    <p className="text-sm text-whatsapp-text-secondary truncate">
                      {conv.messages[conv.messages.length - 1]?.body ?? 'No messages yet'}
                    </p>
                  </div>
                  <span className="text-xs text-whatsapp-text-secondary ml-2">
                    {formatDate(conv.messages[conv.messages.length - 1]?.timestamp)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>

      {/* Main Chat Area */}
      <main className="flex-1 flex flex-col bg-whatsapp-chat-background">
        {selectedConversation ? (
          <>
            <header className="bg-whatsapp-header p-4 border-b border-whatsapp-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">{selectedConversation.name || selectedConversation.from}</h2>
              <button
                onClick={handleDownloadConversation}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
              >
                Descargar Conversación
              </button>
            </header>
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="space-y-2">
                {selectedConversation.messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-lg p-2 px-3 rounded-lg shadow-sm ${
                        msg.fromMe
                          ? 'bg-whatsapp-outgoing-bubble'
                          : 'bg-whatsapp-incoming-bubble'
                      }`}
                    >
                      <p className="text-sm">{msg.body}</p>
                      <p className="text-xs text-whatsapp-text-secondary text-right mt-1">
                        {formatDate(msg.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-whatsapp-text-secondary">
            <div className="text-center">
              <h2 className="text-2xl">Bienvenido al Dashboard</h2>
              <p>Selecciona una conversación para ver los mensajes.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
