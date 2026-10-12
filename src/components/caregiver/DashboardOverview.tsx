import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Users, CheckCircle2, Clock, AlertTriangle, ShieldAlert, 
  RefreshCw, TrendingUp, Calendar, Pill, Smartphone, 
  MessageSquare, Volume2, ArrowUpRight, Sparkles, Phone, ShieldCheck, Plus, Edit3
} from 'lucide-react';
import { getFoodInstructionLabel, getDoseStatusLabel } from '../../utils/translations';
import { AddMedicineModal } from './AddMedicineModal';

interface DashboardOverviewProps {
  setCurrentTab: (tab: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({ setCurrentTab }) => {
  const { 
    activePatient, patients, medicines, scheduledDoses, 
    notifications, caregiverSettings, confirmDose, 
    triggerSimulatedAlarm, setPortalMode, language,
    authUser, updateSettings
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState('');

  const registeredAccountName = authUser?.displayName 
    || (authUser?.email ? authUser.email.split('@')[0].replace(/[0-9_.]/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase()) : '')
    || caregiverSettings.name
    || 'Caregiver';

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter doses for active patient
  const patientDoses = scheduledDoses.filter(d => d.patientId === activePatient.id);
  const patientMeds = medicines.filter(m => m.patientId === activePatient.id && m.active);

  const totalScheduledToday = patientDoses.length;
  const takenToday = patientDoses.filter(d => d.status === 'taken').length;
  const dueAwaiting = patientDoses.filter(d => d.status === 'due' || d.status === 'awaiting_confirmation').length;
  const missedCount = patientDoses.filter(d => d.status === 'missed').length;
  const escalatedCount = patientDoses.filter(d => d.status === 'escalated').length;
  const lowStockMeds = patientMeds.filter(m => m.stockQuantity <= m.refillThreshold);

  // Adherence percentage
  const adherenceRate = totalScheduledToday > 0 
    ? Math.round((takenToday / totalScheduledToday) * 100) 
    : 100;

  // Next upcoming dose
  const nextDose = patientDoses.find(d => d.status === 'due' || d.status === 'awaiting_confirmation')
    || patientDoses.find(d => d.status === 'upcoming');

  return (
    <div className="space-y-6">
      
      {/* Welcome & Senior Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 bg-teal-500/20 text-teal-300 px-3 py-1 rounded-full text-xs font-semibold border border-teal-500/30">
              <ShieldCheck className="w-4 h-4 text-teal-400" />
              <span>Real-time Medication Adherence Engine</span>
            </div>
            {isEditingName ? (
              <div className="flex items-center gap-2 flex-wrap py-1">
                <span className="text-xl sm:text-2xl font-bold text-teal-200">Good day,</span>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Enter registered account name"
                  className="px-3 py-1 bg-white text-slate-900 rounded-xl font-extrabold text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
                  autoFocus
                />
                <button
                  onClick={() => {
                    if (tempName.trim()) {
                      updateSettings({ name: tempName.trim() });
                    }
                    setIsEditingName(false);
                  }}
                  className="px-3 py-1.5 bg-teal-400 hover:bg-teal-300 text-slate-950 font-black rounded-xl text-xs shadow-xs transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditingName(false)}
                  className="px-2.5 py-1.5 bg-white/20 hover:bg-white/30 text-white font-bold rounded-xl text-xs transition"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Good day, {registeredAccountName}
                </h1>
                <button
                  onClick={() => {
                    setTempName(registeredAccountName);
                    setIsEditingName(true);
                  }}
                  className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-teal-200 hover:text-white transition"
                  title="Change Registered Account Name"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              </div>
            )}
            <p className="text-teal-200 text-sm max-w-xl">
              Currently monitoring <strong>{activePatient.name}</strong> ({activePatient.relation}). 
              Device is paired with {activePatient.pairedDeviceName || 'Elderly Tablet'}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowAddMedicineModal(true)}
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Medicine</span>
            </button>
            <button
              onClick={() => setPortalMode('elderly')}
              className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs sm:text-sm shadow-md flex items-center gap-2 transition"
            >
              <Smartphone className="w-4 h-4" />
              <span>Open Elderly Screen View</span>
            </button>
            <button
              onClick={() => triggerSimulatedAlarm()}
              className="px-4 py-2.5 bg-teal-700/80 hover:bg-teal-700 text-white font-bold rounded-2xl text-xs sm:text-sm border border-teal-500/40 flex items-center gap-2 transition"
              title="Test reminder chime"
            >
              <Volume2 className="w-4 h-4" />
              <span>Test Chime</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        
        {/* Total Scheduled */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <div className="text-slate-500 text-xs font-semibold flex items-center justify-between">
            <span>Scheduled Today</span>
            <Calendar className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">
            {totalScheduledToday}
          </div>
          <div className="text-[11px] text-slate-500 font-medium mt-1">Dose instances</div>
        </div>

        {/* Doses Taken */}
        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs bg-emerald-50/20">
          <div className="text-emerald-700 text-xs font-semibold flex items-center justify-between">
            <span>Taken Doses</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-800 mt-2">
            {takenToday}
          </div>
          <div className="text-[11px] text-emerald-600 font-medium mt-1">Confirmed safely</div>
        </div>

        {/* Awaiting Confirmation */}
        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs bg-amber-50/20">
          <div className="text-amber-700 text-xs font-semibold flex items-center justify-between">
            <span>Due / Awaiting</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-800 mt-2">
            {dueAwaiting}
          </div>
          <div className="text-[11px] text-amber-600 font-medium mt-1">Ready for intake</div>
        </div>

        {/* Missed Doses */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-xs bg-rose-50/20">
          <div className="text-rose-700 text-xs font-semibold flex items-center justify-between">
            <span>Missed Doses</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-800 mt-2">
            {missedCount}
          </div>
          <div className="text-[11px] text-rose-600 font-medium mt-1">Past grace period</div>
        </div>

        {/* Escalated Doses */}
        <div className="bg-white p-4 rounded-2xl border border-purple-200 shadow-xs bg-purple-50/20">
          <div className="text-purple-700 text-xs font-semibold flex items-center justify-between">
            <span>Escalated</span>
            <ShieldAlert className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-purple-800 mt-2">
            {escalatedCount}
          </div>
          <div className="text-[11px] text-purple-600 font-medium mt-1">Doctor alert dispatched</div>
        </div>

        {/* Adherence Rate */}
        <div className="bg-white p-4 rounded-2xl border border-teal-200 shadow-xs bg-teal-50/30">
          <div className="text-teal-800 text-xs font-semibold flex items-center justify-between">
            <span>Adherence Rate</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-teal-900 mt-2">
            {adherenceRate}%
          </div>
          <div className="text-[11px] text-teal-700 font-medium mt-1">On-time compliance</div>
        </div>
      </div>

      {/* Main Focus: Next Dose Countdown & Status Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Next Scheduled Dose Highlight Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-2">
              <Pill className="w-5 h-5 text-teal-700" />
              <h2 className="text-lg font-bold text-slate-900">Next Upcoming Dose for {activePatient.name}</h2>
            </div>
            <button
              onClick={() => setCurrentTab('schedule')}
              className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-1"
            >
              <span>Full Schedule</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {nextDose ? (
            <div className={`p-6 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-4 ${
              nextDose.status === 'due' 
                ? 'bg-amber-50/80 border-amber-300' 
                : 'bg-teal-50/40 border-teal-200'
            }`}>
              <div className="flex items-start gap-4">
                <div 
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md"
                  style={{ backgroundColor: nextDose.colorTag || '#0d9488' }}
                >
                  <Pill className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-slate-900">{nextDose.medicineName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      nextDose.status === 'due' ? 'bg-amber-200 text-amber-900 animate-pulse' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {nextDose.status}
                    </span>
                  </div>
                  <div className="text-sm text-slate-600 font-medium">
                    {nextDose.dosage} • {getFoodInstructionLabel(nextDose.foodInstruction, language)}
                  </div>
                  <div className="text-xs text-slate-500">
                    Scheduled at: <strong className="text-slate-800">{nextDose.scheduledTime}</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {nextDose.status !== 'taken' && (
                  <button
                    onClick={() => confirmDose(nextDose.id, 'caregiver_manual')}
                    className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Confirm as Taken</span>
                  </button>
                )}
                <button
                  onClick={() => triggerSimulatedAlarm(nextDose.id)}
                  className="px-3 py-2.5 bg-teal-100 hover:bg-teal-200 text-teal-900 rounded-xl text-xs font-bold transition flex items-center gap-1"
                  title="Ring elderly reminder device"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>Ring Alarm</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              All scheduled doses for today have been completed. Excellent adherence!
            </div>
          )}

          {/* Today's Timeline Pills */}
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Today's Medication Timeline
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {patientDoses.map(dose => (
                <div
                  key={dose.id}
                  className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition ${
                    dose.status === 'taken' 
                      ? 'bg-emerald-50/50 border-emerald-200' 
                      : dose.status === 'due' 
                        ? 'bg-amber-50 border-amber-300' 
                        : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: dose.colorTag || '#0d9488' }} />
                    <div>
                      <div className="font-bold text-slate-900">{dose.medicineName}</div>
                      <div className="text-[11px] text-slate-500">{dose.scheduledTime} • {dose.dosage}</div>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded-md font-bold text-[10px] ${
                    dose.status === 'taken' ? 'bg-emerald-100 text-emerald-800' :
                    dose.status === 'due' ? 'bg-amber-100 text-amber-800' :
                    dose.status === 'missed' ? 'bg-rose-100 text-rose-800' :
                    'bg-slate-200 text-slate-700'
                  }`}>
                    {dose.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Medications for Senior */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pill className="w-4 h-4 text-teal-700" />
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Active Prescribed Medications ({patientMeds.length})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddMedicineModal(true)}
                  className="px-2.5 py-1 bg-teal-700 hover:bg-teal-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
                <button
                  onClick={() => setCurrentTab('medicines')}
                  className="text-xs text-teal-700 hover:text-teal-900 font-bold flex items-center gap-0.5"
                >
                  <span>All</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {patientMeds.length === 0 ? (
              <div className="p-6 bg-slate-50 border border-dashed border-slate-200 rounded-2xl text-center space-y-2">
                <p className="text-xs text-slate-500 font-medium">No medications added yet for {activePatient.name}.</p>
                <button
                  onClick={() => setShowAddMedicineModal(true)}
                  className="px-3.5 py-1.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold inline-flex items-center gap-1.5 transition shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add First Medicine</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {patientMeds.map(med => (
                  <div
                    key={med.id}
                    className="p-3 bg-slate-50 hover:bg-teal-50/40 border border-slate-200 hover:border-teal-200 rounded-2xl transition space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: med.colorTag }} />
                        <span className="font-extrabold text-xs text-slate-900 truncate">{med.name}</span>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-teal-100 text-teal-800 capitalize">
                        {med.dosageForm}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 font-medium">
                      {med.dosage} • {getFoodInstructionLabel(med.foodInstruction, language)}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-500 pt-1 border-t border-slate-200/60">
                      <span>Times: {med.scheduleTimes.join(', ')}</span>
                      <span className={med.stockQuantity <= med.refillThreshold ? 'text-amber-700 font-bold' : 'text-slate-500'}>
                        Stock: {med.stockQuantity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Low Stock & Quick Actions */}
        <div className="space-y-6">
          
          {/* Low Stock Alerts */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-5 h-5 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-base">Refill Watch</h3>
              </div>
              <button
                onClick={() => setCurrentTab('refills')}
                className="text-xs text-teal-700 hover:text-teal-900 font-bold"
              >
                Manage
              </button>
            </div>

            {lowStockMeds.length === 0 ? (
              <div className="text-xs text-slate-500 bg-slate-50 p-3 rounded-xl text-center">
                All medications have adequate stock.
              </div>
            ) : (
              <div className="space-y-2.5">
                {lowStockMeds.map(m => (
                  <div key={m.id} className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <div className="font-bold text-slate-900">{m.name}</div>
                      <div className="text-[11px] text-amber-800 font-semibold">
                        {m.stockQuantity} tablets left (reorder below {m.refillThreshold})
                      </div>
                    </div>
                    <button
                      onClick={() => setCurrentTab('refills')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg font-bold text-[11px]"
                    >
                      Refill
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Support & Doctor Card */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-3">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Assigned Clinician
            </div>
            <div className="space-y-1">
              <div className="font-extrabold text-slate-900 text-base">
                {activePatient.doctorContact.name}
              </div>
              <div className="text-xs text-slate-600">
                {activePatient.doctorContact.specialty}
              </div>
              <div className="text-xs text-slate-500">
                {activePatient.doctorContact.clinic}
              </div>
            </div>
            <a
              href={`tel:${activePatient.doctorContact.phone}`}
              className="mt-2 w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Phone className="w-3.5 h-3.5 text-teal-700" />
              <span>Call Clinic ({activePatient.doctorContact.phone})</span>
            </a>
          </div>

          {/* Quick Chat with Senior */}
          <div className="bg-teal-900 text-white rounded-3xl p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 text-teal-300 font-bold text-xs uppercase tracking-wider">
              <MessageSquare className="w-4 h-4" />
              <span>Direct Senior Messaging</span>
            </div>
            <p className="text-xs text-teal-100">
              Send a warm greeting or quick check-in to {activePatient.name}.
            </p>
            <button
              onClick={() => setCurrentTab('chat')}
              className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-950 font-black rounded-xl text-xs transition"
            >
              Open Family Chat
            </button>
          </div>
        </div>

      </div>

      {/* Add Medicine Modal from Dashboard */}
      <AddMedicineModal
        isOpen={showAddMedicineModal}
        onClose={() => setShowAddMedicineModal(false)}
        patientId={activePatient.id}
        defaultDoctorName={activePatient.doctorContact.name}
      />
    </div>
  );
};
