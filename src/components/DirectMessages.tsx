import React, { useState } from 'react';
import { Send, Image, Smile } from 'lucide-react';

interface Message {
  id: number;
  sender: 'me' | 'other';
  text: string;
  time: string;
}

export const DirectMessages: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'other', text: 'أهلاً أمير! كيف يسير العمل على المنصة الجديدة؟', time: '10:30 ص' },
    { id: 2, sender: 'me', text: 'أهلاً علي! الأمور ممتازة، قمنا بإكمال الهيكل الأساسي ونظام الردود الآن 🚀', time: '10:32 ص' },
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: Message = {
      id: Date.now(),
      sender: 'me',
      text: input,
      time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages([...messages, newMessage]);
    setInput('');
  };

  return (
    <div className="flex flex-col h-[600px] border border-gray-200 dark:border-gray-800 rounded-2xl bg-white dark:bg-black overflow-hidden shadow-sm">
      {/* رأس المحادثة */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-800 flex items-center space-x-3 rtl:space-x-reverse bg-gray-50/50 dark:bg-gray-900/30">
        <img
          src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"
          alt="علي الحسين"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">علي الحسين</h3>
          <span className="text-xs text-green-500 font-medium">نشط الآن</span>
        </div>
      </div>

      {/* قائمة الرسائل */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'me' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm ${
                msg.sender === 'me'
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-bl-none'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[10px] text-gray-400 mt-1 px-1">{msg.time}</span>
          </div>
        ))}
      </div>

      {/* حقل إدخال الرسالة */}
      <form onSubmit={handleSend} className="p-3 border-t border-gray-200 dark:border-gray-800 flex items-center space-x-2 rtl:space-x-reverse">
        <button type="button" className="text-gray-400 hover:text-gray-600 p-2">
          <Image className="w-5 h-5" />
        </button>
        <button type="button" className="text-gray-400 hover:text-gray-600 p-2">
          <Smile className="w-5 h-5" />
        </button>
        <input
          type="text"
          placeholder="اكتب رسالتك..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 bg-gray-100 dark:bg-gray-900 border-0 rounded-xl px-4 py-2 text-sm outline-none text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!input.trim()}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-all disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
