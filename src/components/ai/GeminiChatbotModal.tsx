import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Bot, Send, Loader2, Sparkles, User, RefreshCw, 
  Stethoscope, Pill, HeartHandshake, X, ChevronDown 
} from 'lucide-react';
import { sendGeminiChatMessage, ChatMessageTurn } from '../../services/aiChat';

interface GeminiChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GeminiChatbotModal: React.FC<GeminiChatbotModalProps> = ({ isOpen, onClose }) => {
  const { activePatient, medicines } = useApp();

  const [model, setModel] = useState<'gemini-3.5-flash' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.5-flash');
  const [role, setRole] = useState<'geriatrician' | 'pharmacist' | 'caregiver_coach'>('geriatrician');
  const [messages, setMessages] = useState<ChatMessageTurn[]>([
    {
      role: 'model',
      text: `Hello! I am your AI clinical assistant. I am aware of ${activePatient.name}'s conditions (${activePatient.chronicConditions.join(', ')}) and current medications. How can I assist you with medication timing or adherence today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const roleInstructions: Record<string, string> = {
    geriatrician: `You are Dr. Sehat, a compassionate Senior Geriatrician specializing in elderly multi-morbidity care in India. Patient: ${activePatient.name}, Age: ${activePatient.age}, Conditions: ${activePatient.chronicConditions.join(', ')}. Active medications: ${medicines.filter(m => m.patientId === activePatient.id).map(m => m.name).join(', ')}. Provide reassuring, clinically sound geriatric guidance. Always emphasize safe hydration and never advise stopping medicines abruptly without consulting treating doctors.`,
    pharmacist: `You are a Senior Clinical Pharmacist specializing in drug-drug interactions, food-medicine timing (before/after meals), side-effect mitigation, and pill management for elderly patients. Patient: ${activePatient.name}. Highlight practical tips for dosage adherence and swallowing tablets safely.`,
    caregiver_coach: `You are an empathetic Family Caregiver Coach. You guide sons, daughters, and guardians on elderly behavioral support, patience with dementia or memory lapses, gentle reminder strategies, and reducing caregiver fatigue.`
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || loading) return;

    const userTurn: ChatMessageTurn = {
      role: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const newHistory = [...messages, userTurn];
    setMessages(newHistory);
    setInputText('');
    setLoading(true);

    try {
      const res = await sendGeminiChatMessage(newHistory, roleInstructions[role], model);
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: res.text,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err: any) {
      setMessages(prev => [
        ...prev,
        {
          role: 'model',
          text: `⚠️ Error: ${err.message || 'Could not connect to AI advisor. Please try again.'}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        role: 'model',
        text: `Conversation restarted with the ${role === 'geriatrician' ? 'Geriatric Physician' : role === 'pharmacist' ? 'Clinical Pharmacist' : 'Caregiver Coach'} role using ${model}. Ask anything regarding ${activePatient.name}'s care.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full h-[85vh] shadow-2xl flex flex-col border border-slate-200 overflow-hidden">
        
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-md">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base text-white">Medication & Health Assistant</h3>
                <span className="text-[10px] bg-teal-400 text-slate-950 font-black px-2 py-0.5 rounded-full uppercase">
                  Consultation
                </span>
              </div>
              <p className="text-[11px] text-teal-200">
                Patient context: {activePatient.name} ({activePatient.age} yrs)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetChat}
              className="p-2 text-teal-300 hover:text-white rounded-xl hover:bg-white/10 transition"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-300 hover:text-white rounded-xl hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Persona and Model Controls Bar */}
        <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          {/* Persona Role Selection */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Specialist Role:</span>
            <div className="flex gap-1 bg-white p-0.5 rounded-xl border border-slate-200">
              <button
                onClick={() => setRole('geriatrician')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  role === 'geriatrician' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Stethoscope className="w-3 h-3" />
                <span>Geriatrician</span>
              </button>
              <button
                onClick={() => setRole('pharmacist')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  role === 'pharmacist' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Pill className="w-3 h-3" />
                <span>Pharmacist</span>
              </button>
              <button
                onClick={() => setRole('caregiver_coach')}
                className={`px-2.5 py-1 rounded-lg font-bold flex items-center gap-1 transition ${
                  role === 'caregiver_coach' ? 'bg-teal-700 text-white' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <HeartHandshake className="w-3 h-3" />
                <span>Care Coach</span>
              </button>
            </div>
          </div>

          {/* Response Mode Selection */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-500 font-semibold">Intelligence Mode:</span>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value as any)}
              className="bg-white border border-slate-200 rounded-xl px-2.5 py-1 font-bold text-slate-800 focus:outline-none focus:ring-1 focus:ring-teal-500 text-xs cursor-pointer"
            >
              <option value="gemini-3.5-flash">Standard (Balanced & Accurate)</option>
              <option value="gemini-3.1-pro-preview">Comprehensive (Deep Clinical Guidance)</option>
              <option value="gemini-3.1-flash-lite">Fast (Quick Guidance)</option>
            </select>
          </div>
        </div>

        {/* Scrollable Chat Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-50/70">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className="flex items-start gap-2 max-w-[85%]">
                {m.role === 'model' && (
                  <div className="w-7 h-7 rounded-xl bg-teal-600 text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div>
                  <div
                    className={`p-4 rounded-3xl text-xs sm:text-sm font-medium leading-relaxed whitespace-pre-wrap ${
                      m.role === 'user'
                        ? 'bg-teal-700 text-white rounded-br-none shadow-xs'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none shadow-xs'
                    }`}
                  >
                    {m.text}
                  </div>
                  <div className={`text-[10px] text-slate-400 mt-1 px-1 ${m.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {m.timestamp}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-slate-500 text-xs italic p-3 bg-white rounded-2xl border border-slate-200 w-fit">
              <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
              <span>{model} is formulating medical guidance...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestion Pills */}
        <div className="px-4 py-2 bg-white border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-[11px]">
          <span className="text-slate-400 shrink-0">Ask:</span>
          {[
            'What if Metformin is taken without breakfast?',
            'How to handle elderly resistance to taking night tablets?',
            'Safe pain management for osteoarthritis in seniors',
            'Is morning blood pressure normal to fluctuate?'
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-slate-100 hover:bg-teal-50 hover:text-teal-900 rounded-lg whitespace-nowrap text-slate-600 border border-slate-200/60 transition"
            >
              💬 {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="p-3 bg-white border-t border-slate-200 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Ask ${role.replace('_', ' ')} anything regarding medication adherence...`}
            className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs sm:text-sm font-medium"
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-600 disabled:opacity-50 text-white rounded-2xl font-bold text-xs sm:text-sm flex items-center gap-2 shadow-sm transition"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Send</span>
          </button>
        </form>

      </div>
    </div>
  );
};
