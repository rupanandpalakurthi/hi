import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Patient, Language } from '../../types';
import { 
  Users, Plus, Smartphone, ShieldCheck, KeyRound, 
  Phone, Stethoscope, Check, Edit2, RotateCcw, Heart 
} from 'lucide-react';

export const PatientManager: React.FC = () => {
  const { 
    patients, activePatient, switchPatient, addPatient, 
    updatePatient, setPortalMode 
  } = useApp();

  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [age, setAge] = useState(70);
  const [relation, setRelation] = useState('Mother');
  const [phone, setPhone] = useState('+91 98490 00000');
  const [city, setCity] = useState('Hyderabad');
  const [preferredLanguage, setPreferredLanguage] = useState<Language>('hi');
  const [doctorName, setDoctorName] = useState('Dr. S. K. Venkataraman');
  const [doctorPhone, setDoctorPhone] = useState('+91 98200 44556');
  const [clinic, setClinic] = useState('Apollo Hospitals');
  const [emergencyName, setEmergencyName] = useState('Priya Sharma');
  const [emergencyPhone, setEmergencyPhone] = useState('+91 98490 12345');
  const [conditions, setConditions] = useState('Type-2 Diabetes, Hypertension');

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    addPatient({
      name,
      age,
      relation,
      phone,
      city,
      preferredLanguage,
      fontSize: 'large',
      highContrast: false,
      soundVolume: 85,
      voiceReadAloud: true,
      chronicConditions: conditions.split(',').map(s => s.trim()).filter(Boolean),
      pairingCode: newCode,
      isPaired: false,
      emergencyContact: {
        name: emergencyName,
        phone: emergencyPhone,
        relation: 'Family Guardian'
      },
      doctorContact: {
        name: doctorName,
        specialty: 'Senior Physician',
        phone: doctorPhone,
        clinic
      }
    });
    setShowAddModal(false);
  };

  const regenerateCode = (patient: Patient) => {
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    updatePatient({ ...patient, pairingCode: newCode, isPaired: false });
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-900">
            Connected Seniors & Family Profiles
          </h2>
          <p className="text-slate-500 text-sm">
            Manage device pairing keys, contact directories, and personalized accessibility for elderly members.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-2xl font-bold text-xs sm:text-sm shadow-sm flex items-center gap-2 transition"
        >
          <Plus className="w-4 h-4" />
          <span>Add Family Member</span>
        </button>
      </div>

      {/* Patient Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map(p => {
          const isActive = p.id === activePatient.id;
          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl border-2 p-6 shadow-xs space-y-4 transition ${
                isActive ? 'border-teal-500 ring-2 ring-teal-400/30' : 'border-slate-200'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-2xl bg-teal-600 text-white flex items-center justify-center font-black text-xl shadow-md">
                    {p.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-lg text-slate-900">{p.name}</h3>
                    <div className="text-xs text-slate-500">
                      {p.relation} • {p.age} yrs • {p.city}
                    </div>
                  </div>
                </div>

                {isActive && (
                  <span className="px-2.5 py-0.5 bg-teal-100 text-teal-800 rounded-full text-[10px] font-black uppercase">
                    ACTIVE
                  </span>
                )}
              </div>

              {/* Pairing Status Box */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-700 flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-teal-700" />
                    <span>Device Companion:</span>
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded ${
                    p.isPaired ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {p.isPaired ? 'Paired & Active' : 'Pending Pairing'}
                  </span>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-200/60">
                  <span className="text-slate-500">6-Digit Pairing Code:</span>
                  <div className="flex items-center gap-1.5 font-mono font-black text-sm text-slate-900">
                    <KeyRound className="w-3.5 h-3.5 text-teal-600" />
                    <span>{p.pairingCode}</span>
                    <button
                      onClick={() => regenerateCode(p)}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded"
                      title="Re-generate code"
                    >
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Doctor & Emergency Info */}
              <div className="space-y-1.5 text-xs text-slate-600">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <Stethoscope className="w-3.5 h-3.5 text-teal-600" />
                  <span>{p.doctorContact.name} ({p.doctorContact.phone})</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500">
                  <Phone className="w-3.5 h-3.5 text-rose-500" />
                  <span>Emergency: {p.emergencyContact.name} ({p.emergencyContact.phone})</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                {!isActive ? (
                  <button
                    onClick={() => switchPatient(p.id)}
                    className="flex-1 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold text-xs transition"
                  >
                    Select for Monitoring
                  </button>
                ) : (
                  <button
                    onClick={() => setPortalMode('elderly')}
                    className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Open Elderly Companion</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold text-slate-900">Add Senior Family Member</h3>
            <form onSubmit={handleAddPatient} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Savitri Devi"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Age</label>
                  <input
                    type="number"
                    min={40}
                    max={110}
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Relationship</label>
                  <input
                    type="text"
                    value={relation}
                    onChange={(e) => setRelation(e.target.value)}
                    placeholder="e.g. Mother, Father"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Preferred Language for Voice & Screen</label>
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value as Language)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium bg-white"
                >
                  <option value="en">English</option>
                  <option value="hi">Hindi (हिन्दी)</option>
                  <option value="te">Telugu (తెలుగు)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Name</label>
                  <input
                    type="text"
                    value={doctorName}
                    onChange={(e) => setDoctorName(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Doctor Contact Phone</label>
                  <input
                    type="text"
                    value={doctorPhone}
                    onChange={(e) => setDoctorPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Chronic Conditions (comma separated)</label>
                <input
                  type="text"
                  value={conditions}
                  onChange={(e) => setConditions(e.target.value)}
                  placeholder="e.g. Hypertension, Diabetes"
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 font-medium"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-slate-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-teal-700 hover:bg-teal-600 text-white font-bold rounded-xl shadow-sm"
                >
                  Add Senior Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
