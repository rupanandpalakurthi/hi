import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Settings, Bell, ShieldCheck, Smartphone, 
  MessageSquare, Volume2, Globe, RotateCcw, Check, User, Mail
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const { caregiverSettings, updateSettings, resetDemoData, authUser } = useApp();
  const [editingName, setEditingName] = useState(caregiverSettings.name);
  const [nameSavedNotice, setNameSavedNotice] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingName.trim()) {
      updateSettings({ name: editingName.trim() });
      setNameSavedNotice(true);
      setTimeout(() => setNameSavedNotice(false), 2500);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-900">
          Account & Notification Settings
        </h2>
        <p className="text-slate-500 text-sm">
          Manage your registered caregiver account name, notification dispatch channels, and clinical grace intervals.
        </p>
      </div>

      {/* Registered Caregiver Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <User className="w-5 h-5 text-teal-700" />
            <span>Registered Caregiver Profile</span>
          </h3>
          {authUser ? (
            <span className="flex items-center gap-1.5 text-xs text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              <Check className="w-3.5 h-3.5" />
              <span>Registered Account Verified</span>
            </span>
          ) : (
            <span className="text-xs text-slate-500 font-medium bg-slate-100 px-3 py-1 rounded-full">
              Local Caregiver Profile
            </span>
          )}
        </div>

        <form onSubmit={handleSaveName} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Registered Account Name *
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  required
                  value={editingName}
                  onChange={(e) => setEditingName(e.target.value)}
                  placeholder="e.g. Rupanand Palakurthi"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl text-xs transition shadow-xs whitespace-nowrap"
                >
                  Save Name
                </button>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                This name is displayed in the main Dashboard greeting and all care communications.
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Registered Email Address
              </label>
              <div className="flex items-center gap-2 px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-semibold text-sm">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="truncate">{authUser?.email || caregiverSettings.email}</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">
                Associated Google / Caregiver account login.
              </p>
            </div>
          </div>

          {nameSavedNotice && (
            <div className="p-2.5 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl font-bold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Registered account name updated successfully!</span>
            </div>
          )}
        </form>
      </div>

      {/* Notification Channels */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Bell className="w-5 h-5 text-teal-700" />
          <span>Notification & Alert Channels</span>
        </h3>

        <div className="space-y-4 text-xs">
          {/* Sound Alerts */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="font-extrabold text-sm text-slate-900">Audible Reminders & Sound Pings</div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Play synthesized chimes on dose confirmations and reminders.
              </p>
            </div>
            <button
              onClick={() => updateSettings({ notifySound: !caregiverSettings.notifySound })}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                caregiverSettings.notifySound ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-xs ${
                caregiverSettings.notifySound ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Browser Web Push Notifications */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="font-extrabold text-sm text-slate-900">Browser System Notifications</div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Display native desktop or phone notification banners when doses are due or confirmed.
              </p>
            </div>
            <button
              onClick={() => {
                if ('Notification' in window && Notification.permission !== 'granted') {
                  try {
                    Notification.requestPermission().catch(() => {});
                  } catch {
                    // Ignore iframe permission rejection
                  }
                }
                updateSettings({ notifyBrowser: !caregiverSettings.notifyBrowser });
              }}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                caregiverSettings.notifyBrowser ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-xs ${
                caregiverSettings.notifyBrowser ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Rural SMS Fallback simulation */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>SMS Gateway Fallback (Rural India)</span>
                <span className="bg-teal-100 text-teal-800 text-[10px] px-2 py-0.5 rounded font-bold">
                  Configured
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Dispatches cellular SMS alerts if senior device is offline or internet connectivity is poor.
              </p>
            </div>
            <button
              onClick={() => updateSettings({ notifySmsFallback: !caregiverSettings.notifySmsFallback })}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                caregiverSettings.notifySmsFallback ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-xs ${
                caregiverSettings.notifySmsFallback ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>

          {/* Automated IVR Call simulation */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <div>
              <div className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
                <span>Automated IVR Phone Call Escalation</span>
                <span className="bg-slate-200 text-slate-700 text-[10px] px-2 py-0.5 rounded font-bold">
                  Optional
                </span>
              </div>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Triggers an automated voice phone call to family caregiver on missed critical cardiac or diabetes medications.
              </p>
            </div>
            <button
              onClick={() => updateSettings({ notifyIvrCall: !caregiverSettings.notifyIvrCall })}
              className={`w-12 h-7 rounded-full transition-colors relative ${
                caregiverSettings.notifyIvrCall ? 'bg-teal-600' : 'bg-slate-300'
              }`}
            >
              <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-transform shadow-xs ${
                caregiverSettings.notifyIvrCall ? 'right-1' : 'left-1'
              }`} />
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Reply Away Settings */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-teal-700" />
          <span>Caregiver Away Mode & Auto-Reply Text</span>
        </h3>

        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-slate-700">Activate Away Mode</span>
            <button
              onClick={() => updateSettings({ awayMode: !caregiverSettings.awayMode })}
              className={`px-3 py-1.5 rounded-xl font-bold transition ${
                caregiverSettings.awayMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-200 text-slate-600'
              }`}
            >
              {caregiverSettings.awayMode ? 'ACTIVE (Will reply to senior)' : 'INACTIVE'}
            </button>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Custom Automatic Reply Text
            </label>
            <textarea
              rows={3}
              value={caregiverSettings.autoReplyText}
              onChange={(e) => updateSettings({ autoReplyText: e.target.value })}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium text-slate-800"
            />
          </div>
        </div>
      </div>

      {/* Reset System */}
      <div className="bg-rose-50 border border-rose-200 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="font-bold text-rose-900 text-sm">Reset Application Data</div>
          <div className="text-xs text-rose-700">
            Restore initial state with default family schedules, care contacts, and prescriptions.
          </div>
        </div>
        <button
          onClick={resetDemoData}
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 transition shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Application Data</span>
        </button>
      </div>

    </div>
  );
};
