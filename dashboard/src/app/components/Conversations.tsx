'use client'

import { useEffect, useState } from 'react'

// Define types for our data structure
interface Message {
    timestamp: string;
    body: string;
    id: string;
    type: 'text' | 'transcription';
    fromMe: boolean; // Add fromMe property
}

interface ConversationsData {
    [phoneNumber: string]: Message[];
}

export default function Conversations() {
    const [conversations, setConversations] = useState<ConversationsData>({})
    const [activeTab, setActiveTab] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await fetch('/api/conversations')
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data: ConversationsData = await response.json()
                setConversations(data)

                if (!activeTab && Object.keys(data).length > 0) {
                    setActiveTab(Object.keys(data)[0]);
                }

            } catch (error) {
                console.error('Error fetching conversations:', error)
                setError('Could not load conversations.')
            }
        }

        fetchConversations()
        const interval = setInterval(fetchConversations, 3000);
        return () => clearInterval(interval);
    }, [activeTab])

    if (error) {
        return <div className="text-red-500 p-4">Error: {error}</div>
    }

    const phoneNumbers = Object.keys(conversations);
    const activeConversation = activeTab ? conversations[activeTab] : [];

    return (
        <div className="h-screen w-full flex bg-gray-100 font-sans">
            {/* Sidebar for Conversation Tabs */}
            <div className="w-1/4 bg-white border-r border-gray-200">
            <img src="http://localhost:3008/" alt="" />
                <div className="p-4 border-b">
                    <h1 className="text-xl font-bold text-black">Chats</h1>
                </div>
                <ul className="overflow-y-auto">
                    {phoneNumbers.length > 0 ? phoneNumbers.map((phone) => (
                        <li key={phone}
                            onClick={() => setActiveTab(phone)}
                            className={`p-4 cursor-pointer border-l-4 ${activeTab === phone ? 'border-blue-500 bg-gray-50' : 'border-transparent hover:bg-gray-50'}`}
                        >
                            <div className="font-semibold text-black">{phone}</div>
                            <div className="text-sm text-gray-500 truncate">
                                {conversations[phone][conversations[phone].length - 1]?.body || 'No messages yet'}
                            </div>
                        </li>
                    )) : (
                        <p className="p-4 text-gray-500">Waiting for conversations...</p>
                    )}
                </ul>
            </div>

            {/* Main Content for Messages */}
            <div className="w-3/4 flex flex-col">
                {activeTab ? (
                    <>
                        <div className="p-4 bg-white border-b shadow-sm">
                            <h2 className="text-lg font-semibold text-black">Conversation with: {activeTab}</h2>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto bg-gray-200">
                            <div className="space-y-4">
                                {activeConversation.map((msg) => (
                                    <div key={msg.id} className={`flex ${msg.fromMe ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`rounded-lg p-3 max-w-lg shadow ${msg.fromMe ? 'bg-blue-100' : 'bg-white'}`}>
                                            {msg.type === 'transcription' && (
                                                <div className="flex items-center mb-1">
                                                    <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                                    <span className="text-xs font-semibold text-gray-600">Audio Transcription:</span>
                                                </div>
                                            )}
                                            <p className={msg.type === 'transcription' ? 'italic text-gray-700' : 'text-black'}>
                                                {msg.body}
                                            </p>
                                            <div className="text-right text-xs text-gray-500 mt-1">
                                                {new Date(msg.timestamp).toLocaleTimeString()}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">Select a conversation to see the messages.</p>
                    </div>
                )}
            </div>
        </div>
    )
}
