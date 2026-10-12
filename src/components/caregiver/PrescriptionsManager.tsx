import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  FileText, Plus, Calendar, UserCheck, Stethoscope, 
  Pill, Download, CheckCircle2 
} from 'lucide-react';

export const PrescriptionsManager: React.FC = () => {
  const { activePatient, prescriptions, addPrescription } = useApp();

  const [showModal, setShowModal] = useState(false);
  const [doctorName, setDoctorName] = useState(activePatient.doctorContact.name);
  const [clinic, setClinic] = useState(activePatient.doctorContact.clinic);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [diagnosis, setDiagnosis] = useState('Type-2 Diabetes & Hypertension Review');
  const [medicinesStr, setMedicinesStr] = useState('Metformin 500mg, Amlodipine 5mg');
  const [notes, setNotes] = useState('Continue current regimen. Review in 3 months.');

  const patientPrescriptions = prescriptions.filter(p => p.patientId === activePatient.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPrescription({
      patientId: activePatient.id,
      doctorName,
      clinic,
      date,
      diagnosis,
      medicinesList: medicinesStr.split(',').map(s => s.trim()).filter(Boolean),
      notes
    });
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Doctor Prescriptions & Clinical Records
          </h2>
          <p className="text-slate-500 text-sm">
            Clinician records, diagnosis instructions, and medication history for <strong>{activePatient.name}</strong>.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Prescription</span>
        </button>
      </div>

      {/* Prescription Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {patientPrescriptions.map(rx => (
          <div key={rx.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-teal-50 text-teal-800 rounded-2xl flex items-center justify-center font-bold">
                  <Stethoscope className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base text-slate-900">{rx.doctorName}</h3>
                  <div className="text-xs text-slate-500">{rx.clinic}</div>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-xl">
                  {rx.date}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <span className="font-bold text-slate-700">Diagnosis / Reason:</span>
                <p className="text-slate-900 font-semibold mt-0.5">{rx.diagnosis}</p>
              </div>

              <div>
                <span className="font-bold text-slate-700">Prescribed Medications:</span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {rx.medicinesList.map((med, idx) => (
                    <span key={idx} className="bg-teal-50 text-teal-900 px-2.5 py-1 rounded-lg font-bold border border-teal-200/60 flex items-center gap-1">
                      <Pill className="w-3 h-3 text-teal-700" />
                      <span>{med}</span>
                    </span>
                  ))}
                </div>
              </div>

              {rx.notes && (
                <div className="bg-slate-50 p-3 rounded-2xl text-slate-600 text-[11px] italic mt-2">
                  Notes: "{rx.notes}"
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <h3 className="text-xl font-bold text-slate-900">Add Clinical Prescription</h3>
            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Prescription Date</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Clinic / Hospital</label>
                <input
                  type="text"
                  required
                  value={clinic}
                  onChange={(e) => setClinic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Diagnosis</label>
                <input
                  type="text"
                  required
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Prescribed Medicines (comma separated)</label>
                <input
                  type="text"
                  required
                  value={medicinesStr}
                  onChange={(e) => setMedicinesStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Doctor Instructions & Dietary Notes</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
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
                  Save Record
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
