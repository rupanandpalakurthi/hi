import React from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { 
  PhoneCall, Volume2, Globe, Eye, Type, HeartHandshake, UserCircle2 
} from 'lucide-react';
import { translations } from '../../utils/translations';

export const ElderlyTopBar: React.FC = () => {
  const { 
    activePatient, updatePatient, language, setLanguage, 
    setPortalMode, caregiverSettings 
  } = useApp();

  const t = translations[language] || translations.en;

  const cycleFontSize = () => {
    const nextSize = activePatient.fontSize === 'normal' 
      ? 'large' 
      : activePatient.fontSize === 'large' 
        ? 'xl' 
        : 'normal';
    updatePatient({ ...activePatient, fontSize: nextSize });
  };

  const toggleHighContrast = () => {
    updatePatient({ ...activePatient, highContrast: !activePatient.highContrast });
  };

  return (
    <header className="bg-white border-b border-teal-100 shadow-sm sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Senior Welcome & Profile */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-teal-400">
            {activePatient.name.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-semibold text-teal-800 flex items-center gap-1.5">
              <span>{t.namaste},</span>
              <span className="text-slate-900 font-extrabold text-lg">{activePatient.name}</span>
            </div>
            <div className="text-xs text-slate-500 font-medium">
              {activePatient.city} • {activePatient.pairedDeviceName || 'Connected Companion'}
            </div>
          </div>
        </div>

        {/* Accessibility & Language Controls */}
        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-100 rounded-xl p-1 border border-slate-200">
            {(['en', 'hi', 'te'] as Language[]).map(lang => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  language === lang 
                    ? 'bg-teal-700 text-white shadow-sm' 
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {lang === 'en' ? 'EN' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
              </button>
            ))}
          </div>

          {/* Font Size Booster */}
          <button
            onClick={cycleFontSize}
            className="h-10 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold text-xs flex items-center gap-1 border border-slate-200 transition"
            title="Adjust text size"
          >
            <Type className="w-4 h-4 text-teal-700" />
            <span>{activePatient.fontSize === 'xl' ? 'A+++' : activePatient.fontSize === 'large' ? 'A++' : 'A+'}</span>
          </button>

          {/* High Contrast Toggle */}
          <button
            onClick={toggleHighContrast}
            className={`h-10 px-2.5 rounded-xl text-xs font-bold flex items-center gap-1 border transition ${
              activePatient.highContrast 
                ? 'bg-amber-100 text-amber-900 border-amber-300' 
                : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200'
            }`}
            title="High contrast mode"
          >
            <Eye className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Contrast</span>
          </button>

          {/* Emergency SOS Call */}
          <a
            href={`tel:${activePatient.emergencyContact.phone}`}
            className="h-10 px-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md shadow-rose-200 transition animate-pulse"
            title="Call Family Emergency Contact"
          >
            <PhoneCall className="w-4 h-4" />
            <span>SOS Help</span>
          </a>

          {/* Switch to Caregiver Portal */}
          <button
            onClick={() => setPortalMode('caregiver')}
            className="h-10 px-3 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold text-xs flex items-center gap-1.5 border border-slate-200 transition"
            title="Switch back to Caregiver Portal"
          >
            <UserCircle2 className="w-4 h-4 text-teal-700" />
            <span className="hidden sm:inline">Caregiver View</span>
          </button>
        </div>
      </div>
    </header>
  );
};
