import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User } from 'lucide-react';
import Button from '../components/shared/Button';
import { askDonationExpertStream } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';
import { ChatMessage } from '../types';
import { useI18n } from '../contexts/I18nContext';

const AboutPage: React.FC = () => {
    const { t } = useI18n();
    const [history, setHistory] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [history]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const newUserMessage: ChatMessage = { role: 'user', parts: [{ text: input }] };
        const currentHistory = [...history, newUserMessage];
        setHistory([...currentHistory, { role: 'model', parts: [{ text: '' }] }]);
        setInput('');
        setIsLoading(true);
        
        try {
            const stream = askDonationExpertStream(history, input);
            for await (const chunk of stream) {
                setHistory(prev => {
                    const lastMessage = prev[prev.length - 1];
                    if (lastMessage?.role === 'model') {
                        // Fix: Reconstructing the message object to ensure type correctness for the 'parts' tuple.
                        const updatedMessage: ChatMessage = { role: 'model', parts: [{ text: lastMessage.parts[0].text + chunk }] };
                        const newHistory = [...prev.slice(0, -1), updatedMessage];
                        return newHistory;
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error(error);
             setHistory(prev => {
                const lastMessage = prev[prev.length - 1];
                if (lastMessage?.role === 'model') {
                    // Fix: Reconstructing the message object to ensure type correctness for the 'parts' tuple.
                    const updatedMessage: ChatMessage = { role: 'model', parts: [{ text: t('aiExpertPage.genericError') }] };
                    const newHistory = [...prev.slice(0, -1), updatedMessage];
                    return newHistory;
                }
                return prev;
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)] bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <div className="p-4 border-b dark:border-gray-700">
                 <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100 text-center">{t('aiExpertPage.title')}</h2>
            </div>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-start">
                    <Bot className="text-primary mr-4 rtl:ml-4 rtl:mr-0 flex-shrink-0" size={32} />
                    <div>
                        <p className="font-semibold text-gray-800 dark:text-gray-200">{t('global.aiExpert')}</p>
                        <p className="text-gray-700 dark:text-gray-300">{t('aiExpertPage.welcome')}</p>
                    </div>
                </div>
                {history.map((msg, index) => (
                    <div key={index} className={`flex items-start gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                         {msg.role === 'model' && <Bot className="text-primary flex-shrink-0" size={24} />}
                         <div className={`rounded-lg px-4 py-2 max-w-lg prose dark:prose-invert ${msg.role === 'user' ? 'bg-white dark:bg-gray-600 border dark:border-gray-500' : 'bg-gray-100 dark:bg-gray-700'}`}>
                            <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
                         </div>
                         {msg.role === 'user' && <User className="text-gray-600 dark:text-gray-400 flex-shrink-0" size={24} />}
                    </div>
                ))}
            </div>
            <div className="border-t dark:border-gray-700 p-4 bg-white dark:bg-gray-800">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder={t('aiExpertPage.inputPlaceholder')}
                        className="flex-1 px-4 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                        disabled={isLoading}
                    />
                    <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="rounded-full !p-3">
                        <Send size={20} />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
