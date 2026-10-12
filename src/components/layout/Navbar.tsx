import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Language } from '../../types';
import { 
  HeartHandshake, Users, Pill, CalendarClock, Activity, 
  FileText, TestTube, MessageSquare, Sparkles, Bell, 
  Settings, Smartphone, ChevronDown, Check, LogOut, 
  AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw 
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenAIChat?: () => void;
  onOpenLiveVoice?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab, onOpenAIChat, onOpenLiveVoice }) => {
  const { 
    activePatient, patients, switchPatient, setPortalMode, 
    notifications, markNotificationRead, clearAllNotifications, 
    language, setLanguage, caregiverSettings, updateSettings,
    authUser, signInWithGoogle, signOutUser, isFirestoreConnected
  } = useApp();

  const [showPatientMenu, setShowPatientMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Activity },
    { id: 'patients', label: 'Family Members', icon: Users },
    { id: 'medicines', label: 'Medicines', icon: Pill },
    { id: 'schedule', label: 'Schedule', icon: CalendarClock },
    { id: 'adherence', label: 'Adherence', icon: Activity },
    { id: 'alerts', label: 'Alerts & Escalations', icon: AlertTriangle, badge: notifications.filter(n => n.type === 'escalation' || n.type === 'dose_missed').length },
    { id: 'refills', label: 'Refill Tracker', icon: RefreshCw },
    { id: 'prescriptions', label: 'Prescriptions', icon: FileText },
    { id: 'labReports', label: 'Lab Reports', icon: TestTube },
    { id: 'chat', label: 'Family Chat', icon: MessageSquare },
    { id: 'healthTips', label: 'AI Health & Grounding', icon: Sparkles },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setCurrentTab('dashboard')}
              className="flex items-center gap-2.5 text-left focus:outline-none group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-700 to-teal-500 text-white flex items-center justify-center shadow-md shadow-teal-700/20 group-hover:scale-105 transition-transform">
                <HeartHandshake className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-slate-900 text-lg tracking-tight">Sehat Saathi</span>
                  <span className="text-[10px] bg-teal-100 text-teal-800 font-bold px-1.5 py-0.5 rounded">CARE</span>
                </div>
                <div className="text-[11px] text-slate-500 font-medium hidden sm:block">
                  Medication Adherence Companion
                </div>
              </div>
            </button>
          </div>

          {/* Active Patient Switcher Pill */}
          <div className="relative">
            <button
              onClick={() => setShowPatientMenu(!showPatientMenu)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 transition"
            >
              <div className="w-5 h-5 rounded-full bg-teal-600 text-white text-[10px] font-bold flex items-center justify-center">
                {activePatient.name.charAt(0)}
              </div>
              <div className="text-left hidden md:block">
                <span className="text-slate-500 text-[10px] block leading-none">Monitoring Senior:</span>
                <span className="text-slate-900 font-bold text-xs">{activePatient.name}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
            </button>

            {/* Dropdown Menu */}
            {showPatientMenu && (
              <div className="absolute left-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Family Member
                </div>
                {patients.map(p => (
                  <button
                    key={p.id}
                    onClick={() => { switchPatient(p.id); setShowPatientMenu(false); }}
                    className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 text-xs transition ${
                      p.id === activePatient.id ? 'bg-teal-50 font-bold text-teal-900' : 'text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-teal-100 text-teal-800 flex items-center justify-center font-bold text-xs">
                        {p.name.charAt(0)}
                      </div>
                      <div>
                        <div className="text-slate-900 font-semibold">{p.name}</div>
                        <div className="text-[10px] text-slate-500">{p.relation} • {p.city}</div>
                      </div>
                    </div>
                    {p.id === activePatient.id && <Check className="w-4 h-4 text-teal-600" />}
                  </button>
                ))}
                <div className="border-t border-slate-100 mt-1 pt-1 px-2">
                  <button
                    onClick={() => { setCurrentTab('patients'); setShowPatientMenu(false); }}
                    className="w-full text-center text-xs font-semibold text-teal-700 hover:text-teal-800 py-1.5"
                  >
                    + Manage All Family Members
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Items: Notifications & Elderly Portal Switch */}
          <div className="flex items-center gap-2">
            
            {/* Notifications Popover */}
            <div className="relative">
              <button
                onClick={() => setShowNotifMenu(!showNotifMenu)}
                className="p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 relative transition"
                title="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifs.length > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-rose-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotifs.length}
                  </span>
                )}
              </button>

              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in zoom-in-95">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="font-bold text-xs text-slate-900">Notifications & Alerts</span>
                    <button
                      onClick={clearAllNotifications}
                      className="text-[11px] text-slate-500 hover:text-slate-800"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 mt-2">
                    {notifications.length === 0 ? (
                      <div className="text-center py-6 text-xs text-slate-400">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map(n => (
                        <div
                          key={n.id}
                          onClick={() => markNotificationRead(n.id)}
                          className={`p-2.5 rounded-xl text-xs transition cursor-pointer border ${
                            !n.read ? 'bg-teal-50/60 border-teal-200' : 'bg-slate-50 border-slate-100'
                          }`}
                        >
                          <div className="flex items-center justify-between font-bold text-slate-900 mb-0.5">
                            <span className="flex items-center gap-1.5">
                              {n.type === 'dose_taken' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                              {n.type === 'escalation' && <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />}
                              {n.type === 'refill_alert' && <RefreshCw className="w-3.5 h-3.5 text-amber-600" />}
                              {n.title}
                            </span>
                            <span className="text-[10px] text-slate-400 font-normal">{n.timestamp}</span>
                          </div>
                          <p className="text-[11px] text-slate-600 leading-relaxed">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Live Voice API Call */}
            {onOpenLiveVoice && (
              <button
                onClick={onOpenLiveVoice}
                className="px-3 py-1.5 bg-gradient-to-r from-teal-600 to-indigo-700 hover:from-teal-500 hover:to-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                title="Launch Voice Health Assistant"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="hidden md:inline">Voice Assistant</span>
              </button>
            )}

            {/* Health Assistant Chatbot Trigger */}
            {onOpenAIChat && (
              <button
                onClick={onOpenAIChat}
                className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                title="Open Health Assistant Chat"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span className="hidden md:inline">Health Assistant</span>
              </button>
            )}

            {/* Google Sign-In */}
            {authUser ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-1.5 p-1 rounded-xl hover:bg-slate-100 border border-slate-200 transition"
                  title={authUser.email || 'Authenticated User'}
                >
                  {authUser.photoURL ? (
                    <img src={authUser.photoURL} alt="User" className="w-7 h-7 rounded-lg object-cover" />
                  ) : (
                    <div className="w-7 h-7 rounded-lg bg-teal-700 text-white font-bold text-xs flex items-center justify-center">
                      {(authUser.displayName || authUser.email || 'U').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <ChevronDown className="w-3 h-3 text-slate-400" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in fade-in text-xs space-y-2">
                    <div className="border-b pb-2">
                      <div className="font-bold text-slate-900 truncate">{authUser.displayName || 'Family Caregiver'}</div>
                      <div className="text-[11px] text-slate-500 truncate">{authUser.email}</div>
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md w-fit">
                        <Check className="w-3 h-3" />
                        <span>Verified Account</span>
                      </div>
                    </div>
                    <button
                      onClick={() => { signOutUser(); setShowUserMenu(false); }}
                      className="w-full text-left px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg font-bold flex items-center gap-1.5 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={signInWithGoogle}
                className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition"
                title="Sign in with Google"
              >
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                <span>Google Sign-In</span>
              </button>
            )}

            {/* Launch Elderly Portal Companion Button */}
            <button
              onClick={() => setPortalMode('elderly')}
              className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm flex items-center gap-1.5 transition"
              title="Switch to elderly screen"
            >
              <Smartphone className="w-4 h-4" />
              <span className="hidden sm:inline">Elderly Portal</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation Menu (Horizontal Scrollable) */}
        <div className="flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-100 scrollbar-none text-xs">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`px-3 py-1.5 rounded-xl font-semibold whitespace-nowrap flex items-center gap-1.5 transition ${
                  isActive
                    ? 'bg-teal-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge ? (
                  <span className="w-4 h-4 bg-rose-600 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                    {item.badge}
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
