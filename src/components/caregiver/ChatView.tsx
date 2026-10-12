import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  MessageSquare, Send, CheckCheck, Clock, 
  Smartphone, User, Sparkles, AlertCircle 
} from 'lucide-react';

export const ChatView: React.FC = () => {
  const { 
    activePatient, chatMessages, sendChatMessage, 
    caregiverSettings, updateSettings 
  } = useApp();

  const [inputMessage, setInputMessage] = useState('');

  const patientMessages = chatMessages.filter(m => m.patientId === activePatient.id);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;
    sendChatMessage(inputMessage.trim(), 'caregiver');
    setInputMessage('');
  };

  const handleQuickSend = (text: string) => {
    sendChatMessage(text, 'caregiver');
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Away Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Family Messaging & Check-Ins
          </h2>
          <p className="text-slate-500 text-sm">
            Two-way direct communication with <strong>{activePatient.name}</strong>.
          </p>
        </div>

        {/* Away Mode Toggle with Auto-Reply indicator */}
        <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <span className="font-bold text-slate-700">Caregiver Away Mode:</span>
          <button
            onClick={() => updateSettings({ awayMode: !caregiverSettings.awayMode })}
            className={`px-3 py-1 rounded-xl font-bold transition ${
              caregiverSettings.awayMode
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {caregiverSettings.awayMode ? 'ON (Auto-Reply Active)' : 'OFF (Available)'}
          </button>
        </div>
      </div>

      {caregiverSettings.awayMode && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            Auto-Reply is active: Whenever {activePatient.name} sends a message, they will receive: <em>"{caregiverSettings.autoReplyText}"</em>
          </span>
        </div>
      )}

      {/* Main Chat Container */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[520px] overflow-hidden">
        
        {/* Header inside chat */}
        <div className="p-4 bg-teal-50/70 border-b border-teal-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-700 text-white font-black flex items-center justify-center text-sm">
              {activePatient.name.charAt(0)}
            </div>
            <div>
              <div className="font-extrabold text-sm text-slate-900">{activePatient.name}</div>
              <div className="text-[11px] text-teal-800 font-medium">
                {activePatient.pairedDeviceName || 'Senior Companion Screen'} • Online
              </div>
            </div>
          </div>

          <div className="text-xs text-slate-500">
            {patientMessages.length} total messages
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-50/60">
          {patientMessages.length === 0 ? (
            <div className="text-center py-16 text-slate-400 text-xs">
              No messages yet. Send a greeting to {activePatient.name}!
            </div>
          ) : (
            patientMessages.map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'caregiver' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[78%] p-3.5 rounded-2xl text-xs font-medium leading-relaxed ${
                    msg.sender === 'caregiver'
                      ? 'bg-teal-700 text-white rounded-br-none shadow-xs'
                      : msg.isAutoReply
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 rounded-bl-none'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                  }`}
                >
                  <div className="text-[10px] font-bold opacity-75 mb-0.5">
                    {msg.senderName}
                  </div>
                  <div>{msg.text}</div>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5 px-1">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'caregiver' && <CheckCheck className="w-3 h-3 text-teal-600" />}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Quick Send Caregiver Chips */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-slate-400 text-[11px] shrink-0">Quick Check-ins:</span>
          {[
            'Good morning Amma, did you take your morning tablets?',
            'Please remember to drink enough water today.',
            'I saw your confirmation for Metformin, thank you!',
            'Will call you this evening after work.'
          ].map((quick, idx) => (
            <button
              key={idx}
              onClick={() => handleQuickSend(quick)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-800 rounded-lg whitespace-nowrap text-[11px] text-slate-600 transition border border-slate-200/50"
            >
              {quick}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder={`Message ${activePatient.name}...`}
            className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs font-medium"
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl font-bold text-xs shadow-sm flex items-center gap-1.5 transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Send</span>
          </button>
        </form>
      </div>
    </div>
  );
};
