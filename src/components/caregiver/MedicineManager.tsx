import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Medicine, DosageForm, FoodInstruction } from '../../types';
import { 
  Pill, Plus, Edit2, Trash2, Check, X, AlertCircle, 
  Clock, Calendar, RefreshCw, Sparkles, Filter 
} from 'lucide-react';
import { getFoodInstructionLabel } from '../../utils/translations';

export const MedicineManager: React.FC = () => {
  const { 
    activePatient, medicines, addMedicine, updateMedicine, 
    deleteMedicine, language 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [dosage, setDosage] = useState('');
  const [dosageForm, setDosageForm] = useState<DosageForm>('tablet');
  const [foodInstruction, setFoodInstruction] = useState<FoodInstruction>('after_food');
  const [prescribedBy, setPrescribedBy] = useState(activePatient.doctorContact.name);
  const [time1, setTime1] = useState('08:00');
  const [time2, setTime2] = useState('');
  const [stockQuantity, setStockQuantity] = useState(30);
  const [refillThreshold, setRefillThreshold] = useState(10);
  const [instructionsNote, setInstructionsNote] = useState('');
  const [colorTag, setColorTag] = useState('#0d9488');
  const [errorMessage, setErrorMessage] = useState('');

  const patientMedicines = medicines.filter(m => m.patientId === activePatient.id);

  const resetForm = () => {
    setName('');
    setBrandName('');
    setDosage('');
    setDosageForm('tablet');
    setFoodInstruction('after_food');
    setPrescribedBy(activePatient.doctorContact.name);
    setTime1('08:00');
    setTime2('');
    setStockQuantity(30);
    setRefillThreshold(10);
    setInstructionsNote('');
    setColorTag('#0d9488');
    setEditingMedicine(null);
    setErrorMessage('');
  };

  const handleOpenEdit = (med: Medicine) => {
    setEditingMedicine(med);
    setName(med.name);
    setBrandName(med.brandName || '');
    setDosage(med.dosage);
    setDosageForm(med.dosageForm);
    setFoodInstruction(med.foodInstruction);
    setPrescribedBy(med.prescribedBy);
    setTime1(med.scheduleTimes[0] || '08:00');
    setTime2(med.scheduleTimes[1] || '');
    setStockQuantity(med.stockQuantity);
    setRefillThreshold(med.refillThreshold);
    setInstructionsNote(med.instructionsNote || '');
    setColorTag(med.colorTag);
    setShowAddModal(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Medicine name is required.');
      return;
    }
    if (!dosage.trim()) {
      setErrorMessage('Prescribed dosage is required (e.g. 500 mg).');
      return;
    }
    if (!time1) {
      setErrorMessage('At least one schedule time is required.');
      return;
    }

    const scheduleTimes = [time1];
    if (time2.trim()) scheduleTimes.push(time2);

    if (editingMedicine) {
      updateMedicine({
        ...editingMedicine,
        name: name.trim(),
        brandName: brandName.trim() || undefined,
        dosage: dosage.trim(),
        dosageForm,
        foodInstruction,
        prescribedBy: prescribedBy.trim(),
        scheduleTimes,
        stockQuantity: Number(stockQuantity),
        refillThreshold: Number(refillThreshold),
        instructionsNote: instructionsNote.trim() || undefined,
        colorTag
      });
    } else {
      addMedicine({
        patientId: activePatient.id,
        name: name.trim(),
        brandName: brandName.trim() || undefined,
        dosage: dosage.trim(),
        dosageForm,
        foodInstruction,
        prescribedBy: prescribedBy.trim(),
        scheduleTimes,
        daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
        stockQuantity: Number(stockQuantity),
        refillThreshold: Number(refillThreshold),
        active: true,
        startDate: new Date().toISOString().split('T')[0],
        instructionsNote: instructionsNote.trim() || undefined,
        colorTag
      });
    }

    setShowAddModal(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      
      {/* Top Header & Add Button */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Medication Management
          </h2>
          <p className="text-slate-500 text-sm">
            Active prescribed medicines for <strong>{activePatient.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => { resetForm(); setShowAddModal(true); }}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-2xl font-bold text-sm shadow-sm flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Prescribed Medicine</span>
        </button>
      </div>

      {/* Medicines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {patientMedicines.map(med => (
          <div
            key={med.id}
            className={`bg-white rounded-3xl border-2 p-5 shadow-xs transition hover:shadow-md ${
              med.stockQuantity <= med.refillThreshold ? 'border-amber-300' : 'border-slate-200'
            }`}
          >
            {/* Top pill color & status */}
            <div className="flex items-start justify-between gap-2 mb-3">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-sm"
                  style={{ backgroundColor: med.colorTag || '#0d9488' }}
                >
                  <Pill className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{med.name}</h3>
                  {med.brandName && (
                    <div className="text-xs text-slate-500 font-medium">({med.brandName})</div>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(med)}
                  className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-lg transition"
                  title="Edit medicine"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => deleteMedicine(med.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 rounded-lg transition"
                  title="Delete record"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs border-t border-slate-100 pt-3">
              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Prescribed Dosage:</span>
                <span className="font-bold text-slate-900">{med.dosage} ({med.dosageForm})</span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Food Timing:</span>
                <span className="font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded">
                  {getFoodInstructionLabel(med.foodInstruction, language)}
                </span>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Schedule Alarms:</span>
                <div className="flex gap-1 font-bold text-slate-900">
                  {med.scheduleTimes.map((t, idx) => (
                    <span key={idx} className="bg-slate-100 px-2 py-0.5 rounded">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex justify-between text-slate-600">
                <span className="font-semibold">Remaining Stock:</span>
                <span className={`font-bold ${
                  med.stockQuantity <= med.refillThreshold ? 'text-amber-700 font-extrabold' : 'text-slate-900'
                }`}>
                  {med.stockQuantity} tablets
                  {med.stockQuantity <= med.refillThreshold && ' ⚠️ Low'}
                </span>
              </div>

              {med.instructionsNote && (
                <div className="bg-slate-50 p-2 rounded-xl text-slate-600 italic text-[11px] mt-2">
                  "{med.instructionsNote}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Medicine Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Pill className="w-6 h-6 text-teal-700" />
                <h3 className="text-xl font-bold text-slate-900">
                  {editingMedicine ? 'Edit Medicine Details' : 'Add Prescribed Medicine'}
                </h3>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1"
              >
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Medicine Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Metformin 500mg"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Brand Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Glycomet SR"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Dosage Unit *
                  </label>
                  <input
                    type="text"
                    required
                    value={dosage}
                    onChange={(e) => setDosage(e.target.value)}
                    placeholder="e.g. 500 mg, 1 tablet"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Form
                  </label>
                  <select
                    value={dosageForm}
                    onChange={(e) => setDosageForm(e.target.value as DosageForm)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white"
                  >
                    <option value="tablet">Tablet (गोली)</option>
                    <option value="capsule">Capsule</option>
                    <option value="syrup">Syrup (सिरप)</option>
                    <option value="drops">Eye/Ear Drops</option>
                    <option value="inhaler">Inhaler</option>
                    <option value="injection">Insulin / Injection</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Food Instructions *
                </label>
                <select
                  value={foodInstruction}
                  onChange={(e) => setFoodInstruction(e.target.value as FoodInstruction)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium"
                >
                  <option value="after_food">After Food (भोजन के बाद / భోజనం తర్వాత)</option>
                  <option value="before_food">Before Food (भोजन से पहले / ఖాళీ కడుపున)</option>
                  <option value="with_food">With Food (भोजन के साथ)</option>
                  <option value="empty_stomach">Empty Stomach Morning (सुबह खाली पेट)</option>
                  <option value="anytime">Anytime as Needed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Morning Schedule (HH:mm) *
                  </label>
                  <input
                    type="time"
                    required
                    value={time1}
                    onChange={(e) => setTime1(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Second Schedule (Optional)
                  </label>
                  <input
                    type="time"
                    value={time2}
                    onChange={(e) => setTime2(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Current Stock Quantity
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={stockQuantity}
                    onChange={(e) => setStockQuantity(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Low Stock Alert Threshold
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={refillThreshold}
                    onChange={(e) => setRefillThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Color Badge
                  </label>
                  <div className="flex gap-2 items-center">
                    {['#0d9488', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'].map(c => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setColorTag(c)}
                        className={`w-6 h-6 rounded-full border-2 transition ${
                          colorTag === c ? 'scale-125 border-slate-900' : 'border-transparent'
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Prescribed Clinician
                  </label>
                  <input
                    type="text"
                    value={prescribedBy}
                    onChange={(e) => setPrescribedBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Special Instructions for Senior (Spoken in Voice)
                </label>
                <textarea
                  rows={2}
                  value={instructionsNote}
                  onChange={(e) => setInstructionsNote(e.target.value)}
                  placeholder="e.g. Take with warm water after dinner to maintain smooth night glucose."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl font-bold shadow-sm"
                >
                  {editingMedicine ? 'Update Medicine' : 'Save Medicine'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
