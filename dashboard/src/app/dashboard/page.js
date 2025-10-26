'use client'
import { useState, useEffect } from 'react'
import { supabase, getAllBots } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { Bot, MessageSquare, LogOut, RefreshCw } from 'lucide-react'

export default function DashboardPage() {
  const [bots, setBots] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push('/login')
      return
    }
    
    setUser(user)
    fetchBots()
  }

  const fetchBots = async () => {
    try {
      setLoading(true)
      const botsData = await getAllBots()
      setBots(botsData)
    } catch (error) {
      console.error('Error fetching bots:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const handleBotClick = (botId) => {
    router.push(`/dashboard/bot/${botId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 text-indigo-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard de Bots</h1>
              <p className="text-sm text-gray-600 mt-1">
                Bienvenido, {user?.email}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={fetchBots}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Actualizar
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Bots
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {bots.length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                <MessageSquare className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Total de Conversaciones
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {bots.reduce((sum, bot) => sum + bot.conversation_count, 0)}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0 bg-blue-500 rounded-md p-3">
                <Bot className="h-6 w-6 text-white" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Bots Activos
                  </dt>
                  <dd className="text-3xl font-semibold text-gray-900">
                    {bots.filter(bot => bot.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Bots List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Bots Disponibles</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {bots.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <Bot className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No hay bots</h3>
                <p className="mt-1 text-sm text-gray-500">
                  No se encontraron bots en la base de datos.
                </p>
              </div>
            ) : (
              bots.map((bot) => (
                <div
                  key={bot.id}
                  onClick={() => handleBotClick(bot.id)}
                  className="px-6 py-4 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className={`h-12 w-12 rounded-full flex items-center justify-center ${
                          bot.status === 'active' ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          <Bot className={`h-6 w-6 ${
                            bot.status === 'active' ? 'text-green-600' : 'text-gray-600'
                          }`} />
                        </div>
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{bot.name}</h3>
                        <div className="flex items-center gap-4 mt-1">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            bot.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {bot.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                          {bot.phone_number && (
                            <span className="text-sm text-gray-500">
                              📱 {bot.phone_number}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-900">
                          {bot.conversation_count}
                        </div>
                        <div className="text-xs text-gray-500">Conversaciones</div>
                      </div>
                      <div className="text-gray-400">
                        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
