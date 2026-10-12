import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  TestTube, Plus, AlertCircle, CheckCircle2, 
  Calendar, FileSpreadsheet, Activity 
} from 'lucide-react';
import { LabReport } from '../../types';

export const LabReportsManager: React.FC = () => {
  const { activePatient, labReports, addLabReport } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [testName, setTestName] = useState('Quarterly HbA1c & Lipid Panel');
  const [category, setCategory] = useState<'Blood' | 'Lipid' | 'Diabetes' | 'Kidney' | 'General'>('Diabetes');
  const [labName, setLabName] = useState('Vijaya Diagnostic Centre');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [metric1, setMetric1] = useState('HbA1c');
  const [val1, setVal1] = useState('7.1');
  const [unit1, setUnit1] = useState('%');
  const [ref1, setRef1] = useState('< 7.0');
  const [isAbnormal1, setIsAbnormal1] = useState(true);
  const [summary, setSummary] = useState('Good glycemic trend compared to last quarter.');

  const patientReports = labReports.filter(l => l.patientId === activePatient.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newReport: Omit<LabReport, 'id'> = {
      patientId: activePatient.id,
      testName,
      category,
      labName,
      date,
      resultSummary: summary,
      abnormalFlags: isAbnormal1,
      keyValues: [
        {
          metric: metric1,
          value: val1,
          unit: unit1,
          referenceRange: ref1,
          isAbnormal: isAbnormal1
        }
      ]
    };
    addLabReport(newReport);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Laboratory Diagnostics & Health Tests
          </h2>
          <p className="text-slate-500 text-sm">
            Blood sugar, lipid profile, and biometric panels for <strong>{activePatient.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Lab Report</span>
        </button>
      </div>

      {/* Reports Grid */}
      <div className="space-y-4">
        {patientReports.map(lab => (
          <div key={lab.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-50 text-teal-800 rounded-2xl flex items-center justify-center font-bold">
                  <TestTube className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-extrabold text-base text-slate-900">{lab.testName}</h3>
                    <span className="px-2 py-0.5 bg-slate-100 text-slate-700 text-[10px] font-bold rounded-md">
                      {lab.category}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500">{lab.labName} • {lab.date}</div>
                </div>
              </div>

              {lab.abnormalFlags ? (
                <span className="px-3 py-1 bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Values Need Clinical Review</span>
                </span>
              ) : (
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Within Normal Limits</span>
                </span>
              )}
            </div>

            {/* Values Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="text-slate-400 font-bold border-b text-[11px]">
                    <th className="pb-2">Biomarker Metric</th>
                    <th className="pb-2">Measured Result</th>
                    <th className="pb-2">Reference Range</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {lab.keyValues.map((kv, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="py-2.5 font-bold text-slate-800">{kv.metric}</td>
                      <td className="py-2.5 font-black text-slate-900">
                        {kv.value} {kv.unit}
                      </td>
                      <td className="py-2.5 text-slate-500">{kv.referenceRange}</td>
                      <td className="py-2.5">
                        {kv.isAbnormal ? (
                          <span className="px-2 py-0.5 bg-amber-100 text-amber-900 font-bold rounded text-[10px]">
                            High / Review
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-bold rounded text-[10px]">
                            Normal
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {lab.resultSummary && (
              <div className="bg-slate-50 p-3 rounded-2xl text-slate-600 text-xs font-medium">
                Summary: {lab.resultSummary}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Add Lab Test Report</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Test Name</label>
                  <input
                    type="text"
                    required
                    value={testName}
                    onChange={(e) => setTestName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
                  >
                    <option value="Diabetes">Diabetes / Glycemic</option>
                    <option value="Lipid">Lipid Profile</option>
                    <option value="Blood">Blood / CBC</option>
                    <option value="Kidney">Kidney / Renal</option>
                    <option value="General">General</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Laboratory Name</label>
                  <input
                    type="text"
                    required
                    value={labName}
                    onChange={(e) => setLabName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Report Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="border-t pt-2 space-y-2">
                <span className="font-bold text-slate-800 block">Primary Biomarker Result:</span>
                <div className="grid grid-cols-4 gap-2">
                  <input
                    type="text"
                    placeholder="Metric (e.g. HbA1c)"
                    value={metric1}
                    onChange={(e) => setMetric1(e.target.value)}
                    className="px-2 py-1.5 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 7.1)"
                    value={val1}
                    onChange={(e) => setVal1(e.target.value)}
                    className="px-2 py-1.5 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Unit (e.g. %)"
                    value={unit1}
                    onChange={(e) => setUnit1(e.target.value)}
                    className="px-2 py-1.5 border rounded-lg"
                  />
                  <input
                    type="text"
                    placeholder="Ref (e.g. < 7.0)"
                    value={ref1}
                    onChange={(e) => setRef1(e.target.value)}
                    className="px-2 py-1.5 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinical Summary Note</label>
                <textarea
                  rows={2}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Save Lab Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
