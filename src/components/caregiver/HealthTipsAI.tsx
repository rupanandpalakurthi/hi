import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sparkles, Bot, ShieldCheck, Search, Lightbulb, 
  Send, Loader2, Globe, HeartPulse, BookOpen, Mic, 
  Radio, PhoneCall, ChevronRight 
} from 'lucide-react';
import { askAIMedicationAssistant, AIMedicationAnswer } from '../../services/gemini';
import { Language } from '../../types';
import { SearchGroundingPanel } from '../ai/SearchGroundingPanel';
import { VoiceTranscriptionRecorder } from '../ai/VoiceTranscriptionRecorder';
import { GeminiChatbotModal } from '../ai/GeminiChatbotModal';
import { LiveVoiceConversationModal } from '../ai/LiveVoiceConversationModal';

export const HealthTipsAI: React.FC = () => {
  const { activePatient, medicines, healthTips, language, setLanguage } = useApp();

  const [activeAITab, setActiveAITab] = useState<'grounding' | 'chatbot' | 'transcribe' | 'live' | 'curated'>('grounding');
  const [aiQuery, setAiQuery] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [aiResponse, setAiResponse] = useState<AIMedicationAnswer | null>(null);
  const [selectedTipCategory, setSelectedTipCategory] = useState<string>('all');

  const [showChatbotModal, setShowChatbotModal] = useState(false);
  const [showLiveVoiceModal, setShowLiveVoiceModal] = useState(false);

  const handleAskAI = async (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const queryToRun = customQuery || aiQuery;
    if (!queryToRun.trim()) return;

    setLoadingAI(true);
    setAiResponse(null);

    const medNames = medicines.filter(m => m.patientId === activePatient.id).map(m => m.name);
    try {
      const res = await askAIMedicationAssistant(
        queryToRun,
        activePatient.chronicConditions,
        medNames,
        language
      );
      setAiResponse(res);
    } catch (err) {
      console.warn('AI query failed:', err);
    } finally {
      setLoadingAI(false);
    }
  };

  const filteredTips = selectedTipCategory === 'all'
    ? healthTips
    : healthTips.filter(t => t.category === selectedTipCategory);

  return (
    <div className="space-y-6">
      
      {/* Top Banner with All AI Modalities */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold border border-teal-500/30">
              <Sparkles className="w-3.5 h-3.5 text-teal-300" />
              <span>Smart Clinical Guidance Suite</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              Clinical Intelligence & Adherence
            </h2>
            <p className="text-teal-200 text-xs sm:text-sm max-w-2xl">
              Medical knowledge verification, multi-perspective guidance, voice message transcription, and real-time voice consultations for {activePatient.name}.
            </p>
          </div>

          {/* Quick Launcher Buttons */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowChatbotModal(true)}
              className="px-4 py-2.5 bg-white text-slate-900 hover:bg-slate-100 font-extrabold rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition"
            >
              <Bot className="w-4 h-4 text-teal-700" />
              <span>Open Health Assistant</span>
            </button>
            <button
              onClick={() => setShowLiveVoiceModal(true)}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition"
            >
              <Radio className="w-4 h-4 text-slate-950 animate-pulse" />
              <span>Start Voice Consultation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feature Navigation Tabs */}
      <div className="flex items-center gap-1.5 bg-white p-1.5 rounded-2xl border border-slate-200 overflow-x-auto text-xs shadow-xs">
        <button
          onClick={() => setActiveAITab('grounding')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeAITab === 'grounding' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>Google Search Grounding (gemini-3.5-flash)</span>
        </button>

        <button
          onClick={() => setActiveAITab('chatbot')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeAITab === 'chatbot' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bot className="w-4 h-4" />
          <span>Multi-Turn Chatbot (gemini-3.1-pro-preview / 3.5-flash / 3.1-flash-lite)</span>
        </button>

        <button
          onClick={() => setActiveAITab('transcribe')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeAITab === 'transcribe' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Mic className="w-4 h-4" />
          <span>Audio Transcription (gemini-3.5-transcribe)</span>
        </button>

        <button
          onClick={() => setActiveAITab('live')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeAITab === 'live' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Radio className="w-4 h-4" />
          <span>Live Voice API (gemini-3.8-live)</span>
        </button>

        <button
          onClick={() => setActiveAITab('curated')}
          className={`px-4 py-2 rounded-xl font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeAITab === 'curated' ? 'bg-teal-700 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Curated Guidelines (Trilingual)</span>
        </button>
      </div>

      {/* Tab 1: Google Search Grounding */}
      {activeAITab === 'grounding' && (
        <SearchGroundingPanel />
      )}

      {/* Tab 2: Multi-Turn Chatbot Inline Launcher */}
      {activeAITab === 'chatbot' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mx-auto shadow-sm">
            <Bot className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-black text-slate-900">
            Interactive Healthcare Assistant
          </h3>
          <p className="text-slate-500 text-xs sm:text-sm max-w-lg mx-auto">
            Consult specialized clinical roles: Geriatrician, Clinical Pharmacist, and Family Caregiver Coach for personalized medicine schedules and care tips.
          </p>
          <button
            onClick={() => setShowChatbotModal(true)}
            className="px-6 py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-2xl font-bold text-sm shadow-sm transition inline-flex items-center gap-2"
          >
            <span>Launch Consultation Assistant</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tab 3: Audio Transcription */}
      {activeAITab === 'transcribe' && (
        <VoiceTranscriptionRecorder
          title="Senior Voice & Microphone Audio Transcription"
          placeholder="Speak into your microphone to transcribe medicine logs, symptoms, or caregiver messages."
        />
      )}

      {/* Tab 4: Live Voice Conversation */}
      {activeAITab === 'live' && (
        <div className="bg-gradient-to-tr from-slate-900 to-teal-950 text-white rounded-3xl p-8 shadow-md text-center space-y-5 border border-teal-500/30">
          <div className="w-16 h-16 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center mx-auto shadow-lg shadow-teal-500/20">
            <Radio className="w-8 h-8 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-white">
              Real-Time Hands-Free Voice Consultation
            </h3>
            <p className="text-teal-200 text-xs sm:text-sm max-w-md mx-auto">
              Engage in low-latency bidirectional voice conversations for immediate medication routine guidance.
            </p>
          </div>
          <button
            onClick={() => setShowLiveVoiceModal(true)}
            className="px-8 py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-2xl font-black text-sm shadow-xl shadow-teal-500/30 inline-flex items-center gap-2 transition"
          >
            <PhoneCall className="w-5 h-5" />
            <span>Start Voice Conversation</span>
          </button>
        </div>
      )}

      {/* Tab 5: Curated Guidelines */}
      {activeAITab === 'curated' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700" />
              <h3 className="text-lg font-bold text-slate-900">
                Verified Clinical Guidelines (Trilingual: EN / HI / TE)
              </h3>
            </div>

            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
              {['all', 'hypertension', 'diabetes', 'general'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedTipCategory(cat)}
                  className={`px-3 py-1 rounded-lg font-bold capitalize transition ${
                    selectedTipCategory === cat ? 'bg-teal-700 text-white' : 'text-slate-600'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredTips.map(tip => (
              <div key={tip.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 text-[10px] font-bold uppercase rounded-md">
                    {tip.category}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 leading-snug">
                    {tip.title[language] || tip.title.en}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {tip.content[language] || tip.content.en}
                  </p>
                </div>

                <div className="text-[10px] text-slate-400 border-t pt-2 space-y-0.5">
                  <div>Source: <strong className="text-slate-600">{tip.source}</strong></div>
                  <div>Verified by: <strong className="text-teal-700">{tip.verifiedBy}</strong></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <GeminiChatbotModal
        isOpen={showChatbotModal}
        onClose={() => setShowChatbotModal(false)}
      />

      <LiveVoiceConversationModal
        isOpen={showLiveVoiceModal}
        onClose={() => setShowLiveVoiceModal(false)}
      />

    </div>
  );
};
