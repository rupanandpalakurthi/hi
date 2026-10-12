import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  CalendarClock, CheckCircle2, Clock, Volume2, 
  AlertTriangle, ShieldAlert, SkipForward, Check, 
  Calendar, Pill, Filter 
} from 'lucide-react';
import { getFoodInstructionLabel, getDoseStatusLabel } from '../../utils/translations';
import { DoseStatus } from '../../types';

export const ScheduleCalendar: React.FC = () => {
  const { 
    activePatient, scheduledDoses, confirmDose, skipDose, 
    triggerSimulatedAlarm, language 
  } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('all');

  const patientDoses = scheduledDoses.filter(d => d.patientId === activePatient.id);

  const filteredDoses = statusFilter === 'all' 
    ? patientDoses 
    : patientDoses.filter(d => d.status === statusFilter);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Medicine Schedules & Alarms
          </h2>
          <p className="text-slate-500 text-sm">
            Daily dose timeline, alarm triggers, and adherence tracking for <strong>{activePatient.name}</strong>.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 bg-white p-1 rounded-2xl border border-slate-200 shadow-xs text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 ml-2" />
          {['all', 'due', 'taken', 'upcoming', 'missed'].map(st => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl font-bold transition capitalize ${
                statusFilter === st
                  ? 'bg-teal-700 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-4">
        {filteredDoses.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 text-slate-400">
            No scheduled doses matching "{statusFilter}".
          </div>
        ) : (
          filteredDoses.map(dose => (
            <div
              key={dose.id}
              className={`bg-white rounded-3xl border-2 p-5 sm:p-6 shadow-xs flex flex-wrap items-center justify-between gap-4 transition ${
                dose.status === 'taken' 
                  ? 'border-emerald-200 bg-emerald-50/20' 
                  : dose.status === 'due' 
                    ? 'border-amber-300 bg-amber-50/30 ring-2 ring-amber-200/50' 
                    : dose.status === 'missed' 
                      ? 'border-rose-300 bg-rose-50/20' 
                      : dose.status === 'escalated'
                        ? 'border-purple-300 bg-purple-50/20'
                        : 'border-slate-200'
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 font-bold shadow-sm"
                  style={{ backgroundColor: dose.colorTag || '#0d9488' }}
                >
                  <Pill className="w-7 h-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-lg text-slate-900">{dose.medicineName}</h3>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                      dose.status === 'taken' ? 'bg-emerald-100 text-emerald-800' :
                      dose.status === 'due' ? 'bg-amber-100 text-amber-800 animate-pulse' :
                      dose.status === 'missed' ? 'bg-rose-100 text-rose-800' :
                      dose.status === 'escalated' ? 'bg-purple-100 text-purple-800' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {getDoseStatusLabel(dose.status, language)}
                    </span>
                  </div>

                  <div className="text-xs text-slate-600 font-medium mt-1 flex flex-wrap items-center gap-2">
                    <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded">
                      {dose.scheduledTime}
                    </span>
                    <span>•</span>
                    <span>{dose.dosage}</span>
                    <span>•</span>
                    <span className="text-teal-800 font-semibold bg-teal-50 px-2 py-0.5 rounded">
                      {getFoodInstructionLabel(dose.foodInstruction, language)}
                    </span>
                  </div>

                  {dose.confirmedAt && (
                    <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                      ✅ Confirmed at {new Date(dose.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} via {dose.confirmedMethod?.replace('_', ' ')}
                    </div>
                  )}

                  {dose.escalatedAt && (
                    <div className="text-[11px] text-rose-700 font-bold mt-1">
                      🚨 Escalation dispatched at {new Date(dose.escalatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {dose.status !== 'taken' && (
                  <>
                    <button
                      onClick={() => confirmDose(dose.id, 'caregiver_manual')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-sm transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Mark Taken</span>
                    </button>

                    <button
                      onClick={() => triggerSimulatedAlarm(dose.id)}
                      className="px-3 py-2 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
                      title="Trigger audible alarm chime on senior device"
                    >
                      <Volume2 className="w-4 h-4 text-teal-600" />
                      <span>Ring Device</span>
                    </button>

                    <button
                      onClick={() => skipDose(dose.id)}
                      className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition flex items-center gap-1"
                    >
                      <SkipForward className="w-3.5 h-3.5" />
                      <span>Skip</span>
                    </button>
                  </>
                )}

                {dose.status === 'taken' && (
                  <div className="flex items-center gap-1 text-emerald-700 font-bold text-xs bg-emerald-100/70 px-3 py-1.5 rounded-xl">
                    <Check className="w-4 h-4" />
                    <span>Completed</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
