import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  AlertTriangle, ShieldAlert, Phone, Clock, 
  CheckCircle2, BellRing, Settings, RefreshCw 
} from 'lucide-react';

export const AlertsEscalation: React.FC = () => {
  const { 
    activePatient, scheduledDoses, caregiverSettings, 
    updateSettings, confirmDose, notifications 
  } = useApp();

  const patientDoses = scheduledDoses.filter(d => d.patientId === activePatient.id);
  const missedDoses = patientDoses.filter(d => d.status === 'missed' || d.status === 'escalated');

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Alerts & Doctor Escalation Protocol
          </h2>
          <p className="text-slate-500 text-sm">
            Automated monitoring for missed doses and emergency contacts for <strong>{activePatient.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="font-semibold text-slate-500">Grace Window:</span>
          <span className="bg-amber-100 text-amber-900 font-bold px-2.5 py-1 rounded-xl">
            {caregiverSettings.gracePeriodMinutes} mins
          </span>
          <span className="font-semibold text-slate-500">Doctor Escalation:</span>
          <span className="bg-rose-100 text-rose-900 font-bold px-2.5 py-1 rounded-xl">
            {caregiverSettings.escalationGraceMinutes} mins
          </span>
        </div>
      </div>

      {/* Active Escalation Protocol Status */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-rose-600" />
          <span>Active Overdue & Escalation Queue</span>
        </h3>

        {missedDoses.length === 0 ? (
          <div className="p-8 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-center space-y-2">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <div className="font-extrabold text-slate-900 text-base">
              No Overdue or Escalated Doses
            </div>
            <p className="text-slate-600 text-xs">
              All scheduled doses for {activePatient.name} are either confirmed on time or scheduled for upcoming hours.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {missedDoses.map(dose => (
              <div 
                key={dose.id}
                className="p-5 bg-rose-50 border-2 border-rose-300 rounded-2xl flex flex-wrap items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 bg-rose-600 text-white font-extrabold text-xs rounded-full uppercase">
                      {dose.status === 'escalated' ? 'CRITICAL ESCALATED' : 'MISSED GRACE PERIOD'}
                    </span>
                    <h4 className="font-black text-lg text-slate-900">{dose.medicineName}</h4>
                  </div>
                  <div className="text-xs text-slate-600">
                    Scheduled at: <strong>{dose.scheduledTime}</strong> • {dose.dosage}
                  </div>
                  <div className="text-[11px] text-rose-800 font-semibold">
                    {dose.status === 'escalated' 
                      ? `Alert dispatched to ${activePatient.doctorContact.name} & ${activePatient.emergencyContact.name}.`
                      : `Awaiting senior confirmation for > ${caregiverSettings.gracePeriodMinutes} minutes.`}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${activePatient.phone}`}
                    className="px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-teal-400" />
                    <span>Call Senior</span>
                  </a>

                  <a
                    href={`tel:${activePatient.doctorContact.phone}`}
                    className="px-3.5 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-500 flex items-center gap-1.5 transition"
                  >
                    <Phone className="w-3.5 h-3.5 text-white" />
                    <span>Call Clinician</span>
                  </a>

                  <button
                    onClick={() => confirmDose(dose.id, 'caregiver_manual')}
                    className="px-3.5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-500 flex items-center gap-1.5 transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Mark Handled</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Escalation Rules Configuration Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Settings className="w-5 h-5 text-teal-700" />
          <span>Configurable Grace Thresholds</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="font-bold text-slate-800 block">
              Missed Dose Grace Period (Minutes)
            </label>
            <p className="text-slate-500 text-[11px]">
              How long after scheduled alarm time to wait before notifying family caregiver.
            </p>
            <input
              type="number"
              min={5}
              max={60}
              value={caregiverSettings.gracePeriodMinutes}
              onChange={(e) => updateSettings({ gracePeriodMinutes: Number(e.target.value) })}
              className="px-3 py-2 bg-white rounded-xl border border-slate-300 w-32 font-bold text-slate-900"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
            <label className="font-bold text-slate-800 block">
              Emergency & Doctor Escalation Window (Minutes)
            </label>
            <p className="text-slate-500 text-[11px]">
              If dose remains unconfirmed, automatically dispatch alert to emergency contact & clinic.
            </p>
            <input
              type="number"
              min={15}
              max={120}
              value={caregiverSettings.escalationGraceMinutes}
              onChange={(e) => updateSettings({ escalationGraceMinutes: Number(e.target.value) })}
              className="px-3 py-2 bg-white rounded-xl border border-slate-300 w-32 font-bold text-slate-900"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
