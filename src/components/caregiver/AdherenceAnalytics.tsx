import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TrendingUp, Download, Calendar, CheckCircle2, 
  AlertTriangle, Clock, Pill, BarChart3, ShieldCheck 
} from 'lucide-react';

export const AdherenceAnalytics: React.FC = () => {
  const { activePatient, scheduledDoses, medicines } = useApp();

  const [dateRange, setDateRange] = useState<'7days' | '30days'>('7days');

  const patientDoses = scheduledDoses.filter(d => d.patientId === activePatient.id);
  const patientMeds = medicines.filter(m => m.patientId === activePatient.id);

  const totalDoses = patientDoses.length;
  const takenDoses = patientDoses.filter(d => d.status === 'taken').length;
  const missedDoses = patientDoses.filter(d => d.status === 'missed').length;
  const escalatedDoses = patientDoses.filter(d => d.status === 'escalated').length;

  const adherenceRate = totalDoses > 0 ? Math.round((takenDoses / totalDoses) * 100) : 100;

  // Simulated 7-day adherence dataset
  const weeklyTrends = [
    { day: 'Mon', adherence: 100, taken: 4, scheduled: 4 },
    { day: 'Tue', adherence: 100, taken: 4, scheduled: 4 },
    { day: 'Wed', adherence: 75, taken: 3, scheduled: 4 },
    { day: 'Thu', adherence: 100, taken: 4, scheduled: 4 },
    { day: 'Fri', adherence: 100, taken: 4, scheduled: 4 },
    { day: 'Sat', adherence: 100, taken: 4, scheduled: 4 },
    { day: 'Sun (Today)', adherence: adherenceRate, taken: takenDoses, scheduled: totalDoses },
  ];

  // CSV Report Generator
  const downloadCSVReport = () => {
    const headers = ['Patient Name', 'Medicine', 'Dosage', 'Scheduled Date', 'Scheduled Time', 'Status', 'Confirmed At', 'Method'];
    const rows = patientDoses.map(d => [
      activePatient.name,
      d.medicineName,
      d.dosage,
      d.scheduledDate,
      d.scheduledTime,
      d.status,
      d.confirmedAt || 'N/A',
      d.confirmedMethod || 'N/A'
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [headers.join(','), ...rows.map(e => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `adherence_report_${activePatient.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Export Action */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Adherence Analytics & Reports
          </h2>
          <p className="text-slate-500 text-sm">
            Clinical compliance and dose intake analytics for <strong>{activePatient.name}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-white p-1 rounded-2xl border border-slate-200 shadow-xs flex text-xs font-bold">
            <button
              onClick={() => setDateRange('7days')}
              className={`px-3 py-1.5 rounded-xl transition ${dateRange === '7days' ? 'bg-teal-700 text-white' : 'text-slate-600'}`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setDateRange('30days')}
              className={`px-3 py-1.5 rounded-xl transition ${dateRange === '30days' ? 'bg-teal-700 text-white' : 'text-slate-600'}`}
            >
              Last 30 Days
            </button>
          </div>

          <button
            onClick={downloadCSVReport}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-sm flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Report</span>
          </button>
        </div>
      </div>

      {/* Primary Adherence Overview Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-tr from-teal-800 to-teal-700 text-white p-6 rounded-3xl shadow-md">
          <div className="text-xs uppercase font-bold text-teal-200 tracking-wider">
            Overall Adherence
          </div>
          <div className="text-4xl sm:text-5xl font-black text-white mt-2">
            {adherenceRate}%
          </div>
          <div className="text-xs text-teal-100 font-semibold mt-2 flex items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-teal-300" />
            <span>Clinical Target: &gt; 80% (Optimum)</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Doses Taken on Time
          </div>
          <div className="text-3xl font-black text-emerald-700 mt-2">
            {takenDoses} <span className="text-base text-slate-400 font-medium">/ {totalDoses}</span>
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Confirmed with one-tap</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Unconfirmed / Missed
          </div>
          <div className="text-3xl font-black text-rose-700 mt-2">
            {missedDoses}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Requiring caregiver follow up</div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Escalation Events
          </div>
          <div className="text-3xl font-black text-purple-700 mt-2">
            {escalatedDoses}
          </div>
          <div className="text-xs text-slate-500 font-medium mt-1">Dispatched to clinician</div>
        </div>
      </div>

      {/* Visual Weekly Adherence Trend Chart */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-teal-700" />
            <h3 className="text-lg font-bold text-slate-900">Weekly Adherence Trend (%)</h3>
          </div>
          <div className="text-xs text-slate-500 font-semibold">
            Target benchmark: 80%
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-56 pt-6">
          {weeklyTrends.map((col, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 h-full justify-end">
              <span className="text-xs font-bold text-slate-700">{col.adherence}%</span>
              <div className="w-full bg-slate-100 rounded-2xl h-40 relative flex items-end p-1 overflow-hidden">
                <div 
                  className={`w-full rounded-xl transition-all duration-500 ${
                    col.adherence >= 80 ? 'bg-teal-600' : 'bg-amber-500'
                  }`}
                  style={{ height: `${col.adherence}%` }}
                />
              </div>
              <span className="text-[11px] sm:text-xs font-semibold text-slate-600 text-center">
                {col.day}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Medicine-specific Compliance Breakdown */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Pill className="w-5 h-5 text-teal-700" />
          <span>Medicine-by-Medicine Compliance</span>
        </h3>

        <div className="space-y-3">
          {patientMeds.map(med => {
            const medDoses = patientDoses.filter(d => d.medicineId === med.id);
            const medTaken = medDoses.filter(d => d.status === 'taken').length;
            const medPct = medDoses.length > 0 ? Math.round((medTaken / medDoses.length) * 100) : 100;

            return (
              <div key={med.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: med.colorTag || '#0d9488' }} />
                  <div>
                    <div className="font-extrabold text-sm text-slate-900">{med.name}</div>
                    <div className="text-slate-500">{med.dosage} • Prescribed by {med.prescribedBy}</div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="font-bold text-slate-900 text-sm">{medPct}% compliance</div>
                    <div className="text-slate-500 text-[11px]">{medTaken} / {medDoses.length || 1} doses taken</div>
                  </div>
                  <div className="w-24 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-teal-600 h-full rounded-full" 
                      style={{ width: `${medPct}%` }} 
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
