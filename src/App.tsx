import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { DashboardOverview } from './components/caregiver/DashboardOverview';
import { MedicineManager } from './components/caregiver/MedicineManager';
import { ScheduleCalendar } from './components/caregiver/ScheduleCalendar';
import { AdherenceAnalytics } from './components/caregiver/AdherenceAnalytics';
import { AlertsEscalation } from './components/caregiver/AlertsEscalation';
import { RefillTracker } from './components/caregiver/RefillTracker';
import { PrescriptionsManager } from './components/caregiver/PrescriptionsManager';
import { LabReportsManager } from './components/caregiver/LabReportsManager';
import { ChatView } from './components/caregiver/ChatView';
import { HealthTipsAI } from './components/caregiver/HealthTipsAI';
import { PatientManager } from './components/caregiver/PatientManager';
import { SettingsView } from './components/caregiver/SettingsView';
import { ReceiverDashboard } from './components/elderly/ReceiverDashboard';
import { PairingScreen } from './components/pairing/PairingScreen';
import { HeartHandshake, ShieldCheck, Heart } from 'lucide-react';

import { GeminiChatbotModal } from './components/ai/GeminiChatbotModal';
import { LiveVoiceConversationModal } from './components/ai/LiveVoiceConversationModal';

function AppContent() {
  const { portalMode } = useApp();
  const [currentTab, setCurrentTab] = useState('dashboard');
  const [showAIChatModal, setShowAIChatModal] = useState(false);
  const [showLiveVoiceModal, setShowLiveVoiceModal] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-teal-500 selection:text-white">
      {portalMode === 'elderly' && (
        <ReceiverDashboard />
      )}

      {portalMode === 'pairing' && (
        <PairingScreen />
      )}

      {portalMode === 'caregiver' && (
        <div className="flex-1 flex flex-col">
          <Navbar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            onOpenAIChat={() => setShowAIChatModal(true)}
            onOpenLiveVoice={() => setShowLiveVoiceModal(true)}
          />

          <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
            {currentTab === 'dashboard' && <DashboardOverview setCurrentTab={setCurrentTab} />}
            {currentTab === 'patients' && <PatientManager />}
            {currentTab === 'medicines' && <MedicineManager />}
            {currentTab === 'schedule' && <ScheduleCalendar />}
            {currentTab === 'adherence' && <AdherenceAnalytics />}
            {currentTab === 'alerts' && <AlertsEscalation />}
            {currentTab === 'refills' && <RefillTracker />}
            {currentTab === 'prescriptions' && <PrescriptionsManager />}
            {currentTab === 'labReports' && <LabReportsManager />}
            {currentTab === 'chat' && <ChatView />}
            {currentTab === 'healthTips' && <HealthTipsAI />}
            {currentTab === 'settings' && <SettingsView />}
          </main>

          {/* Global AI Modals */}
          <GeminiChatbotModal 
            isOpen={showAIChatModal} 
            onClose={() => setShowAIChatModal(false)} 
          />
          <LiveVoiceConversationModal 
            isOpen={showLiveVoiceModal} 
            onClose={() => setShowLiveVoiceModal(false)} 
          />

          {/* Caregiver Portal Footer */}
          <footer className="bg-white border-t border-slate-200 py-6 mt-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-teal-700 text-white flex items-center justify-center font-bold text-[10px]">
                  SS
                </div>
                <span className="font-bold text-slate-800">Sehat Saathi — Medication Adherence</span>
                <span>• AI-Assisted Elderly Care Companion</span>
              </div>

              <div className="flex items-center gap-4">
                <span>ICMR & Geriatric Safety Standards</span>
                <span>•</span>
                <span>Trilingual: EN / HI / TE</span>
                <span>•</span>
                <span className="flex items-center gap-1 text-teal-700 font-semibold">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure Family Sync</span>
                </span>
              </div>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
