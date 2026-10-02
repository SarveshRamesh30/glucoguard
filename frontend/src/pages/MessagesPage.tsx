import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { messagesAPI } from '../services/api';
import { Message, ConversationSummary } from '../types';
import {
  MessageSquare,
  Send,
  User,
  Stethoscope,
  Search,
  Check,
  CheckCheck,
  Plus,
  Loader2,
  Clock,
  Sparkles,
  ChevronLeft
} from 'lucide-react';

export const MessagesPage: React.FC = () => {
  const { user, isDoctor } = useAuth();

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [activeContactId, setActiveContactId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState<string>('');
  
  const [loadingConv, setLoadingConv] = useState<boolean>(true);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [sending, setSending] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Contacts directory modal
  const [contactsModalOpen, setContactsModalOpen] = useState<boolean>(false);
  const [contactsList, setContactsList] = useState<any[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (activeContactId) {
      fetchThread(activeContactId);
      const interval = setInterval(() => {
        fetchThread(activeContactId, false);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [activeContactId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      setLoadingConv(true);
      const data = await messagesAPI.getConversations();
      setConversations(data);
      // Auto-select on desktop if screens are wider than 768px
      if (data.length > 0 && !activeContactId && window.innerWidth >= 768) {
        setActiveContactId(data[0].contact_user_id);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConv(false);
    }
  };

  const fetchThread = async (contactId: number, showLoader = true) => {
    try {
      if (showLoader) setLoadingMessages(true);
      const data = await messagesAPI.getThread(contactId);
      setMessages(data);
    } catch (err) {
      console.error('Failed to load message thread:', err);
    } finally {
      if (showLoader) setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() || !activeContactId) return;

    const content = inputText.trim();
    setInputText('');

    try {
      setSending(true);
      const newMsg = await messagesAPI.send(activeContactId, content);
      setMessages((prev) => [...prev, newMsg]);
      fetchConversations();
    } catch (err) {
      alert('Failed to send message.');
    } finally {
      setSending(false);
    }
  };

  const handleOpenNewChat = async () => {
    try {
      const contacts = await messagesAPI.getContacts();
      setContactsList(contacts);
      setContactsModalOpen(true);
    } catch (err) {
      console.error('Failed to load contacts directory:', err);
    }
  };

  const handleSelectContact = (contactUserId: number) => {
    setActiveContactId(contactUserId);
    setContactsModalOpen(false);
  };

  const activeContact = conversations.find((c) => c.contact_user_id === activeContactId);

  const filteredConversations = conversations.filter((c) =>
    c.contact_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.last_message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50/70 py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto h-[84vh] bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden grid grid-cols-1 md:grid-cols-12">
        
        {/* Left Sidebar: Conversations & Contacts */}
        <div className={`${activeContactId ? 'hidden md:flex' : 'flex'} md:col-span-4 border-r border-slate-100 flex-col h-full bg-slate-50/40`}>
          
          {/* Header */}
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <h2 className="font-extrabold text-slate-900 text-base">Messages</h2>
            </div>

            <button
              onClick={handleOpenNewChat}
              className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1 text-xs font-bold"
              title="Start conversation with specialist or patient"
            >
              <Plus className="w-4 h-4" />
              <span>New</span>
            </button>
          </div>

          {/* Search */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConv ? (
              <div className="py-12 flex flex-col items-center justify-center gap-2">
                <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                <span className="text-xs text-slate-400">Loading inbox...</span>
              </div>
            ) : filteredConversations.length > 0 ? (
              filteredConversations.map((conv) => {
                const isActive = conv.contact_user_id === activeContactId;
                return (
                  <div
                    key={conv.contact_user_id}
                    onClick={() => setActiveContactId(conv.contact_user_id)}
                    className={`p-3.5 flex items-start gap-3 cursor-pointer transition-colors ${
                      isActive ? 'bg-indigo-50/80 border-l-4 border-indigo-600' : 'hover:bg-slate-100/60'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                      {conv.contact_role === 'doctor' ? (
                        <Stethoscope className="w-5 h-5 text-teal-600" />
                      ) : (
                        <User className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-bold text-xs text-slate-900 truncate">
                          {conv.contact_name}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(conv.last_message_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 truncate">
                        {conv.last_message}
                      </p>

                      {conv.contact_specialization_or_dob && (
                        <p className="text-[10px] text-slate-400 truncate mt-0.5">
                          {conv.contact_specialization_or_dob}
                        </p>
                      )}
                    </div>

                    {conv.unread_count > 0 && (
                      <span className="w-5 h-5 rounded-full bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unread_count}
                      </span>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="py-12 text-center text-xs text-slate-400 p-4">
                No conversation threads yet. Click "+ New" to initiate consultation chat.
              </div>
            )}
          </div>

        </div>

        {/* Right Area: Active Chat Window */}
        <div className={`${activeContactId ? 'flex' : 'hidden md:flex'} md:col-span-8 flex-col h-full bg-white`}>
          {activeContactId ? (
            <>
              {/* Chat Window Header */}
              <div className="px-4 sm:px-6 py-3.5 border-b border-slate-100 flex items-center justify-between bg-white/90 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  {/* Mobile Back Button */}
                  <button
                    onClick={() => setActiveContactId(null)}
                    className="md:hidden p-1.5 -ml-1 rounded-lg text-slate-600 hover:bg-slate-100"
                    title="Back to conversations"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  <div className="w-9 h-9 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {activeContact?.contact_role === 'doctor' ? (
                      <Stethoscope className="w-5 h-5 text-teal-600" />
                    ) : (
                      <User className="w-5 h-5 text-emerald-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 leading-tight">
                      {activeContact?.contact_name || 'Consultation Chat'}
                    </h3>
                    <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      <span>{activeContact?.contact_specialization_or_dob || 'Online'}</span>
                    </p>
                  </div>
                </div>
              </div>

              {/* Chat Message Stream */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/40">
                {loadingMessages ? (
                  <div className="py-20 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-indigo-600" />
                    <span className="text-xs text-slate-400">Loading conversation...</span>
                  </div>
                ) : messages.length > 0 ? (
                  messages.map((msg) => {
                    const isMyMessage = msg.sender_id === user?.user_id;
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[85%] sm:max-w-md rounded-2xl px-4 py-3 text-xs leading-relaxed shadow-2xs space-y-1 ${
                            isMyMessage
                              ? 'bg-emerald-600 text-white rounded-br-none'
                              : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-none'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <div
                            className={`flex items-center justify-end gap-1 text-[10px] ${
                              isMyMessage ? 'text-emerald-100' : 'text-slate-400'
                            }`}
                          >
                            <span>{new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {isMyMessage && (
                              msg.is_read ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="py-20 text-center text-xs text-slate-400">
                    Send a message to start this clinical conversation.
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Template Chips */}
              <div className="px-4 sm:px-6 py-2 bg-white border-t border-slate-100 flex items-center gap-2 overflow-x-auto text-[11px] no-scrollbar">
                <span className="text-slate-400 font-semibold shrink-0">Quick reply:</span>
                {[
                  isDoctor
                    ? "Please share your latest fasting glucose test."
                    : "I just completed my new ML risk assessment.",
                  "Looking forward to our scheduled appointment.",
                  "Thank you for the dietary recommendations!"
                ].map((chip, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputText(chip)}
                    className="px-2.5 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 shrink-0 transition-colors"
                  >
                    {chip}
                  </button>
                ))}
              </div>

              {/* Input Area */}
              <form onSubmit={handleSendMessage} className="p-3 sm:p-4 bg-white border-t border-slate-100 flex items-center gap-2">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Type your message or clinical query..."
                  className="flex-1 px-3.5 sm:px-4 py-2.5 rounded-xl border border-slate-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-xs font-medium"
                />
                <button
                  type="submit"
                  disabled={sending || !inputText.trim()}
                  className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-50 transition-colors shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 space-y-3">
              <MessageSquare className="w-12 h-12 text-slate-300" />
              <h3 className="font-bold text-slate-700 text-sm">Doctor-Patient Messaging Center</h3>
              <p className="text-xs max-w-sm">Select an existing conversation on the left or click "+ New" to initiate clinical communication.</p>
            </div>
          )}
        </div>

      </div>

      {/* Contacts Directory Modal */}
      {contactsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-slate-100 space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              Select {isDoctor ? 'Patient' : 'Doctor Specialist'} to Message
            </h3>
            <div className="max-h-64 overflow-y-auto divide-y divide-slate-100">
              {contactsList.map((contact) => (
                <div
                  key={contact.user_id}
                  onClick={() => handleSelectContact(contact.user_id)}
                  className="py-3 px-2 flex items-center justify-between hover:bg-slate-50 cursor-pointer rounded-xl transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
                      {contact.role === 'doctor' ? <Stethoscope className="w-4 h-4" /> : <User className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900">{contact.full_name}</h4>
                      <p className="text-[10px] text-slate-500">{contact.specialization || contact.email}</p>
                    </div>
                  </div>
                  <button className="px-3 py-1 bg-indigo-50 text-indigo-700 font-bold text-[11px] rounded-lg">
                    Chat
                  </button>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setContactsModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
