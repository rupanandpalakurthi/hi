import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DosageForm, FoodInstruction } from '../../types';
import { Pill, AlertCircle, X, Plus } from 'lucide-react';

interface AddMedicineModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientId: string;
  defaultDoctorName?: string;
}

export const AddMedicineModal: React.FC<AddMedicineModalProps> = ({
  isOpen,
  onClose,
  patientId,
  defaultDoctorName = ''
}) => {
  const { addMedicine } = useApp();

  const [name, setName] = useState('');
  const [brandName, setBrandName] = useState('');
  const [dosage, setDosage] = useState('');
  const [dosageForm, setDosageForm] = useState<DosageForm>('tablet');
  const [foodInstruction, setFoodInstruction] = useState<FoodInstruction>('after_food');
  const [prescribedBy, setPrescribedBy] = useState(defaultDoctorName);
  const [time1, setTime1] = useState('08:00');
  const [time2, setTime2] = useState('');
  const [stockQuantity, setStockQuantity] = useState(30);
  const [refillThreshold, setRefillThreshold] = useState(10);
  const [instructionsNote, setInstructionsNote] = useState('');
  const [colorTag, setColorTag] = useState('#0d9488');
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setName('');
    setBrandName('');
    setDosage('');
    setDosageForm('tablet');
    setFoodInstruction('after_food');
    setPrescribedBy(defaultDoctorName);
    setTime1('08:00');
    setTime2('');
    setStockQuantity(30);
    setRefillThreshold(10);
    setInstructionsNote('');
    setColorTag('#0d9488');
    setErrorMessage('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
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

    addMedicine({
      patientId,
      name: name.trim(),
      brandName: brandName.trim() || undefined,
      dosage: dosage.trim(),
      dosageForm,
      foodInstruction,
      prescribedBy: prescribedBy.trim() || 'Attending Physician',
      scheduleTimes,
      daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
      startDate: new Date().toISOString().split('T')[0],
      stockQuantity: Number(stockQuantity) || 30,
      refillThreshold: Number(refillThreshold) || 10,
      colorTag,
      instructionsNote: instructionsNote.trim() || undefined,
      active: true
    });

    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Pill className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Add Prescribed Medicine
              </h3>
              <p className="text-xs text-slate-500 font-medium">
                Set schedules, dosage instructions, and refill thresholds
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMessage && (
          <div className="bg-rose-50 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2 border border-rose-200">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
                autoFocus
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Form
              </label>
              <select
                value={dosageForm}
                onChange={(e) => setDosageForm(e.target.value as DosageForm)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium"
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
              className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white font-medium"
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
                Schedule Time 1 (HH:mm) *
              </label>
              <input
                type="time"
                required
                value={time1}
                onChange={(e) => setTime1(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Schedule Time 2 (Optional)
              </label>
              <input
                type="time"
                value={time2}
                onChange={(e) => setTime2(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Stock Quantity
              </label>
              <input
                type="number"
                min={0}
                value={stockQuantity}
                onChange={(e) => setStockQuantity(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Refill Threshold
              </label>
              <input
                type="number"
                min={1}
                value={refillThreshold}
                onChange={(e) => setRefillThreshold(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Color Tag
              </label>
              <div className="flex gap-2 items-center pt-1">
                {['#0d9488', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#10b981'].map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setColorTag(c)}
                    className={`w-6 h-6 rounded-full border-2 transition ${
                      colorTag === c ? 'scale-125 border-slate-900 shadow-xs' : 'border-transparent'
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
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Instructions for Senior (Spoken in Voice Reminders)
            </label>
            <textarea
              rows={2}
              value={instructionsNote}
              onChange={(e) => setInstructionsNote(e.target.value)}
              placeholder="e.g. Take with warm water after dinner to maintain smooth night glucose."
              className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-xs"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2.5 text-slate-600 hover:text-slate-800 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-xl font-bold shadow-sm transition flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Save Medicine</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
