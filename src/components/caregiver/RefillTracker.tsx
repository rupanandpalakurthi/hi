import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  RefreshCw, Plus, AlertCircle, CheckCircle2, 
  Calendar, History, Pill, ArrowUpRight 
} from 'lucide-react';

export const RefillTracker: React.FC = () => {
  const { activePatient, medicines, refillRecords, recordRefill } = useApp();

  const [selectedMedId, setSelectedMedId] = useState<string>('');
  const [refillQty, setRefillQty] = useState<number>(30);
  const [note, setNote] = useState<string>('Purchased from local pharmacy');
  const [showModal, setShowModal] = useState<boolean>(false);

  const patientMeds = medicines.filter(m => m.patientId === activePatient.id);
  const patientRefills = refillRecords.filter(r => r.patientId === activePatient.id);

  const handleOpenRefill = (medId: string) => {
    setSelectedMedId(medId);
    setShowModal(true);
  };

  const handleConfirmRefill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMedId) return;
    recordRefill(selectedMedId, Number(refillQty), note);
    setShowModal(false);
    setNote('Purchased from local pharmacy');
    setRefillQty(30);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Medication Refill & Stock Tracker
          </h2>
          <p className="text-slate-500 text-sm">
            Monitor inventory, depleted stock warnings, and refill records for <strong>{activePatient.name}</strong>.
          </p>
        </div>
      </div>

      {/* Medicines Stock Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patientMeds.map(med => {
          const isLow = med.stockQuantity <= med.refillThreshold;
          return (
            <div
              key={med.id}
              className={`bg-white rounded-3xl border-2 p-5 shadow-xs space-y-4 transition ${
                isLow ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 font-bold"
                    style={{ backgroundColor: med.colorTag || '#0d9488' }}
                  >
                    <Pill className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">{med.name}</h3>
                    <div className="text-xs text-slate-500">{med.dosage}</div>
                  </div>
                </div>

                {isLow && (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-900 rounded-full text-[11px] font-black uppercase tracking-wider">
                    LOW STOCK
                  </span>
                )}
              </div>

              {/* Stock Numbers */}
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 font-semibold">Current Stock:</span>
                  <span className={`text-xl font-black ${isLow ? 'text-amber-700' : 'text-slate-900'}`}>
                    {med.stockQuantity} <span className="text-xs font-normal text-slate-500">tablets</span>
                  </span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Reorder Threshold:</span>
                  <span className="font-bold text-slate-700">≤ {med.refillThreshold} units</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    isLow ? 'bg-amber-500' : 'bg-teal-600'
                  }`}
                  style={{ width: `${Math.min(100, (med.stockQuantity / 60) * 100)}%` }}
                />
              </div>

              <button
                onClick={() => handleOpenRefill(med.id)}
                className="w-full py-2.5 bg-teal-50 hover:bg-teal-100 text-teal-800 border border-teal-200 rounded-2xl font-bold text-xs flex items-center justify-center gap-1.5 transition"
              >
                <Plus className="w-4 h-4" />
                <span>Record Stock Refill</span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Refill Audit History */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <History className="w-5 h-5 text-teal-700" />
          <span>Refill Audit Trail</span>
        </h3>

        {patientRefills.length === 0 ? (
          <div className="text-center py-6 text-xs text-slate-400">
            No refills recorded yet.
          </div>
        ) : (
          <div className="space-y-2">
            {patientRefills.map(rec => (
              <div key={rec.id} className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900">{rec.medicineName}</div>
                  <div className="text-slate-500 text-[11px]">{rec.note} • {rec.date}</div>
                </div>
                <div className="text-right">
                  <span className="text-emerald-700 font-bold bg-emerald-100 px-2 py-0.5 rounded">
                    +{rec.addedQuantity} units
                  </span>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {rec.previousQuantity} → {rec.newQuantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Refill Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-lg font-bold text-slate-900">Add Medicine Stock</h3>
            <form onSubmit={handleConfirmRefill} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Quantity to Add
                </label>
                <input
                  type="number"
                  min={1}
                  required
                  value={refillQty}
                  onChange={(e) => setRefillQty(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-bold text-slate-900 text-sm"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Notes / Pharmacy Source
                </label>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-3 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-700 text-white rounded-xl font-bold shadow-sm"
                >
                  Add to Inventory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
