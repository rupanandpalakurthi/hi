import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  HeartHandshake, Smartphone, KeyRound, ShieldCheck, 
  ArrowRight, CheckCircle2, AlertCircle, Sparkles, Volume2, Globe 
} from 'lucide-react';
import { Language } from '../../types';

export const PairingScreen: React.FC = () => {
  const { 
    pairPatientWithCode, setPortalMode, language, setLanguage, 
    patients 
  } = useApp();

  const [code, setCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successInfo, setSuccessInfo] = useState<{ name: string; device: string } | null>(null);

  const handlePair = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (code.trim().length < 6) {
      setErrorMsg('Please enter a valid 6-digit pairing code.');
      return;
    }

    const res = pairPatientWithCode(code);
    if (res.success && res.patient) {
      setSuccessInfo({
        name: res.patient.name,
        device: res.patient.pairedDeviceName || 'Connected Device'
      });
      setTimeout(() => {
        setPortalMode('elderly');
      }, 1500);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleQuickDemoPair = (demoCode: string) => {
    setCode(demoCode);
    const res = pairPatientWithCode(demoCode);
    if (res.success && res.patient) {
      setSuccessInfo({
        name: res.patient.name,
        device: res.patient.pairedDeviceName || 'Companion Device'
      });
      setTimeout(() => {
        setPortalMode('elderly');
      }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-900 via-teal-950 to-slate-950 text-white flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        
        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-teal-500 text-white rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-teal-500/30">
            <HeartHandshake className="w-9 h-9" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Pair Elderly Device
          </h2>
          <p className="text-teal-200 text-sm">
            Enter the 6-digit code provided on the caregiver dashboard to connect this screen.
          </p>
        </div>

        {/* Language Selection */}
        <div className="flex items-center justify-center gap-2 bg-black/20 p-1.5 rounded-2xl border border-white/10">
          {(['en', 'hi', 'te'] as Language[]).map(lang => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                language === lang 
                  ? 'bg-teal-500 text-white shadow-sm' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {lang === 'en' ? 'English' : lang === 'hi' ? 'हिन्दी' : 'తెలుగు'}
            </button>
          ))}
        </div>

        {/* Pairing Form */}
        {successInfo ? (
          <div className="bg-emerald-500/20 border border-emerald-400 rounded-2xl p-6 text-center space-y-3 animate-in fade-in zoom-in">
            <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
            <h3 className="text-xl font-bold text-white">Successfully Connected!</h3>
            <p className="text-emerald-200 text-sm">
              Paired with <strong>{successInfo.name}</strong>. Opening elderly medicine companion...
            </p>
          </div>
        ) : (
          <form onSubmit={handlePair} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-teal-300 mb-2 text-center">
                6-Digit Pairing Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="e.g. 748291"
                  className="w-full text-center text-3xl font-mono tracking-widest px-4 py-3.5 bg-black/30 border-2 border-teal-500/50 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-400/40"
                  autoFocus
                />
                <KeyRound className="w-5 h-5 text-teal-400 absolute right-4 top-4.5 opacity-60" />
              </div>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 text-rose-300 bg-rose-500/20 border border-rose-400/30 p-3 rounded-xl text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl text-base shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 transition"
            >
              <span>Connect Device</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>
        )}

        {/* Quick Pairing Helper */}
        <div className="border-t border-white/10 pt-4 space-y-2">
          <div className="text-xs text-teal-300 font-semibold text-center">
            Registered Family Devices (Click to pair):
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {patients.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleQuickDemoPair(p.pairingCode)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-left transition flex items-center justify-between"
              >
                <div>
                  <div className="font-bold text-white">{p.name.split(' ')[0]}</div>
                  <div className="text-[10px] text-teal-300 font-mono">Code: {p.pairingCode}</div>
                </div>
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
              </button>
            ))}
          </div>
        </div>

        {/* Return to caregiver */}
        <div className="text-center pt-2">
          <button
            onClick={() => setPortalMode('caregiver')}
            className="text-xs text-teal-300 hover:text-white underline transition"
          >
            ← Return to Caregiver Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};
