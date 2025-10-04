import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, Bot, User, X, MessageCircle } from 'lucide-react';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'https://task-tracker-backend-vtvb.onrender.com/'}/api/tasks`;

const Chatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            type: 'bot',
            content: 'Hello! Welcome to Task Tracker. I am your AI assistant. Ask me anything about your tasks or general questions!',
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const getAuthHeaders = () => {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No auth token found');
        return { Authorization: `Bearer ${token}` };
    };

    const handleSendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = { type: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Prepare conversation history to send to backend
        const conversationHistory = messages.map(msg => ({
            role: msg.type === 'user' ? 'user' : 'assistant',
            content: msg.content
        }));

        try {
            const response = await axios.post(`${API_URL}/chatbot/query`, { query: input, history: conversationHistory }, {
                headers: getAuthHeaders()
            });

            if (response.data.success) {
                const botMessage = {
                    type: 'bot',
                    content: response.data.analysis || response.data.message,
                    task: response.data.task,
                    suggestions: response.data.suggestions
                };
                setMessages(prev => [...prev, botMessage]);
            } else {
                setMessages(prev => [...prev, {
                    type: 'bot',
                    content: 'Sorry, I couldn\'t find any tasks matching your query.'
                }]);
            }
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again.'
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

return (
    <>
        {/* Floating Chat Button */}
        <button
            onClick={() => setIsOpen(!isOpen)}
            className="fixed bottom-6 right-6 w-12 h-12 rounded-full bg-purple-600 text-white flex items-center justify-center shadow-lg hover:bg-purple-700 focus:outline-none z-50"
            aria-label={isOpen ? "Close chat" : "Open chat"}
        >
            {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </button>

        {/* Chat Window */}
        {isOpen && (
            <div className="fixed bottom-20 right-6 bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col z-50">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <div className="flex items-center gap-2">
                        <Bot className="w-6 h-6 text-purple-500" />
                        <h3 className="font-semibold text-gray-800">Task Assistant</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`flex gap-2 max-w-xs ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                    message.type === 'user' ? 'bg-purple-500' : 'bg-gray-200'
                                }`}>
                                    {message.type === 'user' ? (
                                        <User className="w-4 h-4 text-white" />
                                    ) : (
                                        <Bot className="w-4 h-4 text-gray-600" />
                                    )}
                                </div>
                                <div className={`rounded-lg p-3 ${
                                    message.type === 'user'
                                        ? 'bg-purple-500 text-white'
                                        : 'bg-gray-100 text-gray-800'
                                }`}>
                                    <p className="text-sm">{message.content}</p>
                                    {message.task && (
                                        <div className="mt-2 p-2 bg-white bg-opacity-20 rounded text-xs">
                                            <p><strong>Task:</strong> {message.task.title}</p>
                                            {/* <p><strong>Status:</strong> {message.task.completed}</p> */}
                                            <p><strong>Priority:</strong> {message.task.priority}</p>
                                        </div>
                                    )}
                                    {message.suggestions && message.suggestions.length > 0 && (
                                        <div className="mt-2">
                                            <p className="text-xs font-semibold">Similar tasks:</p>
                                            {message.suggestions.map(suggestion => (
                                                <p key={suggestion.id} className="text-xs">- {suggestion.title}</p>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="flex gap-2 max-w-xs">
                                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-gray-600" />
                                </div>
                                <div className="bg-gray-100 rounded-lg p-3">
                                    <div className="flex space-x-1">
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                            disabled={isLoading}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={isLoading || !input.trim()}
                            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        )}
    </>
);
};

export default Chatbot;
