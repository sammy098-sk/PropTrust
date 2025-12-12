import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, ChatContact, User } from '../types';
import { Send, Search, MoreVertical, Phone, Video, ArrowLeft } from 'lucide-react';

interface ChatProps {
  currentUser: User;
}

const MOCK_CONTACTS: ChatContact[] = [
  { id: '2', name: 'Sarah Jenkins', avatar: 'https://i.pravatar.cc/150?u=2', lastMessage: 'That sounds like a great deal!', lastMessageTime: new Date(Date.now() - 1000 * 60 * 5), unreadCount: 2 },
  { id: '3', name: 'Marcus Thorne', avatar: 'https://i.pravatar.cc/150?u=3', lastMessage: 'Can we schedule a call?', lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 2), unreadCount: 0 },
  { id: '4', name: 'Elena Rodriguez', avatar: 'https://i.pravatar.cc/150?u=4', lastMessage: 'Docs have been uploaded.', lastMessageTime: new Date(Date.now() - 1000 * 60 * 60 * 24), unreadCount: 0 },
];

const MOCK_MESSAGES: ChatMessage[] = [
  { id: '1', senderId: '2', recipientId: '1', content: 'Hi there! I saw your profile and I am interested in GreenSprout.', timestamp: new Date(Date.now() - 1000 * 60 * 10), read: true },
  { id: '2', senderId: '1', recipientId: '2', content: 'Hi Sarah! Thanks for reaching out. What would you like to know?', timestamp: new Date(Date.now() - 1000 * 60 * 9), read: true },
  { id: '3', senderId: '2', recipientId: '1', content: 'I am curious about your manufacturing costs.', timestamp: new Date(Date.now() - 1000 * 60 * 5), read: false },
  { id: '4', senderId: '2', recipientId: '1', content: 'That sounds like a great deal!', timestamp: new Date(Date.now() - 1000 * 60 * 5), read: false },
];

const ChatSystem: React.FC<ChatProps> = ({ currentUser }) => {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_MESSAGES);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !selectedContact) return;

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      recipientId: selectedContact.id,
      content: inputText,
      timestamp: new Date(),
      read: false
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Simulate response
    setTimeout(() => {
       const response: ChatMessage = {
        id: (Date.now() + 1).toString(),
        senderId: selectedContact.id,
        recipientId: currentUser.id,
        content: "Thanks for the info! I'll review it shortly.",
        timestamp: new Date(),
        read: false
      };
      setMessages(prev => [...prev, response]);
    }, 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 md:py-6 h-[calc(100vh-64px)]">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden flex h-full border border-slate-200">
        
        {/* Sidebar */}
        <div className={`${selectedContact ? 'hidden md:flex' : 'flex w-full'} md:w-80 flex-col border-r border-slate-200 bg-slate-50`}>
          <div className="p-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-4">Messages</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input 
                type="text" 
                placeholder="Search conversations..." 
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-sm"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {MOCK_CONTACTS.map(contact => (
              <div 
                key={contact.id}
                onClick={() => setSelectedContact(contact)}
                className={`p-4 flex items-center cursor-pointer hover:bg-slate-100 transition-colors border-b border-slate-100 ${selectedContact?.id === contact.id ? 'bg-white border-l-4 border-l-brand-600 shadow-sm' : ''}`}
              >
                <div className="relative">
                   <img src={contact.avatar} alt={contact.name} className="w-12 h-12 rounded-full object-cover" />
                   {contact.id === '2' && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>}
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className={`text-sm font-semibold truncate ${selectedContact?.id === contact.id ? 'text-brand-900' : 'text-slate-900'}`}>{contact.name}</h3>
                    <span className="text-xs text-slate-400 whitespace-nowrap">
                       {contact.lastMessageTime.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className={`text-sm truncate ${contact.unreadCount > 0 ? 'font-semibold text-slate-800' : 'text-slate-500'}`}>
                    {contact.lastMessage}
                  </p>
                </div>
                {contact.unreadCount > 0 && (
                  <div className="ml-2 bg-brand-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {contact.unreadCount}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={`${selectedContact ? 'flex w-full' : 'hidden md:flex'} flex-1 flex-col bg-white`}>
          {selectedContact ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white shadow-sm z-10">
                <div className="flex items-center">
                  <button 
                    onClick={() => setSelectedContact(null)} 
                    className="md:hidden mr-3 p-2 text-slate-600 hover:bg-slate-100 rounded-full"
                    aria-label="Back to messages"
                  >
                    <ArrowLeft size={20} />
                  </button>
                  <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full object-cover" />
                  <div className="ml-3">
                    <h3 className="font-bold text-slate-900">{selectedContact.name}</h3>
                    <span className="text-xs text-green-600 flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>Online</span>
                  </div>
                </div>
                <div className="flex items-center space-x-1 sm:space-x-3 text-slate-400">
                  <button className="p-2 hover:bg-slate-100 rounded-full"><Phone size={20} /></button>
                  <button className="p-2 hover:bg-slate-100 rounded-full"><Video size={20} /></button>
                  <button className="p-2 hover:bg-slate-100 rounded-full"><MoreVertical size={20} /></button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50">
                {messages.map(msg => {
                  const isMe = msg.senderId === currentUser.id;
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-2 sm:px-5 sm:py-3 shadow-sm ${
                        isMe 
                          ? 'bg-brand-600 text-white rounded-br-none' 
                          : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                      }`}>
                        <p className="text-sm sm:text-base">{msg.content}</p>
                        <p className={`text-[10px] mt-1 text-right ${isMe ? 'text-brand-100' : 'text-slate-400'}`}>
                          {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <form onSubmit={handleSend} className="p-3 sm:p-4 bg-white border-t border-slate-200">
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 border border-slate-300 rounded-full px-4 py-2 sm:py-3 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-slate-50 text-sm sm:text-base"
                  />
                  <button 
                    type="submit" 
                    disabled={!inputText.trim()}
                    className="bg-brand-600 text-white p-2.5 sm:p-3 rounded-full hover:bg-brand-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md flex-shrink-0"
                  >
                    <Send size={20} />
                  </button>
                </div>
              </form>
            </>
          ) : (
             <div className="flex-1 flex flex-col items-center justify-center text-slate-400 bg-slate-50 p-4 text-center">
               <div className="bg-slate-100 p-6 rounded-full mb-4">
                  <Search size={48} />
               </div>
               <p className="text-lg font-medium">Select a conversation to start chatting</p>
             </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatSystem;