import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { 
  Patient, Medicine, ScheduledDose, ChatMessage, Prescription, 
  LabReport, HealthTip, NotificationEvent, CaregiverSettings, 
  RefillRecord, Language 
} from '../types';
import { 
  initialCaregiverSettings, initialPatients, initialMedicines, 
  generateTodayDoses, initialChatMessages, initialPrescriptions, 
  initialLabReports, initialHealthTips, initialNotifications, 
  initialRefillRecords 
} from '../utils/mockData';
import { 
  playSuccessChime, startMedicineAlarm, stopMedicineAlarm, 
  playNotificationPing, speakText, stopSpeech 
} from '../services/sound';
import { 
  auth, db, googleProvider, handleFirestoreError, 
  OperationType, testFirestoreConnection 
} from '../services/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

interface AppContextType {
  portalMode: 'caregiver' | 'elderly' | 'pairing';
  setPortalMode: (mode: 'caregiver' | 'elderly' | 'pairing') => void;
  activePatient: Patient;
  patients: Patient[];
  medicines: Medicine[];
  scheduledDoses: ScheduledDose[];
  chatMessages: ChatMessage[];
  prescriptions: Prescription[];
  labReports: LabReport[];
  healthTips: HealthTip[];
  notifications: NotificationEvent[];
  caregiverSettings: CaregiverSettings;
  refillRecords: RefillRecord[];
  language: Language;
  setLanguage: (lang: Language) => void;
  isAlarmRinging: boolean;
  activeAlarmDose: ScheduledDose | null;
  isSpeaking: boolean;
  
  // Actions
  switchPatient: (patientId: string) => void;
  confirmDose: (doseId: string, method?: 'elderly_one_tap' | 'caregiver_manual' | 'voice_command') => void;
  skipDose: (doseId: string) => void;
  addMedicine: (medicine: Omit<Medicine, 'id'>) => void;
  updateMedicine: (medicine: Medicine) => void;
  deleteMedicine: (id: string) => void;
  addPatient: (patient: Omit<Patient, 'id'>) => void;
  updatePatient: (patient: Patient) => void;
  pairPatientWithCode: (code: string) => { success: boolean; message: string; patient?: Patient };
  sendChatMessage: (text: string, sender: 'caregiver' | 'elderly') => void;
  addPrescription: (prescription: Omit<Prescription, 'id'>) => void;
  addLabReport: (report: Omit<LabReport, 'id'>) => void;
  recordRefill: (medicineId: string, quantity: number, note?: string) => void;
  updateSettings: (settings: Partial<CaregiverSettings>) => void;
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;
  
  // Audio & Speech
  triggerSimulatedAlarm: (doseId?: string) => void;
  stopAlarm: () => void;
  speakMedicineInstructions: (dose: ScheduledDose) => void;
  stopSpeakingAudio: () => void;
  
  // Firebase Auth & Cloud Sync
  authUser: any | null;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
  isFirestoreConnected: boolean;

  // Simulator triggers
  simulateDueDoseNow: () => void;
  simulateMissedDoseNow: () => void;
  simulateDoctorEscalationNow: () => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'sehat_saathi_store_v1';

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial or persisted state
  const [portalMode, setPortalMode] = useState<'caregiver' | 'elderly' | 'pairing'>('caregiver');
  const [patients, setPatients] = useState<Patient[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_patients');
    return saved ? JSON.parse(saved) : initialPatients;
  });
  const [currentPatientId, setCurrentPatientId] = useState<string>('p1');
  const [medicines, setMedicines] = useState<Medicine[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_medicines');
    return saved ? JSON.parse(saved) : initialMedicines;
  });
  const [scheduledDoses, setScheduledDoses] = useState<ScheduledDose[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_doses');
    return saved ? JSON.parse(saved) : generateTodayDoses(initialPatients, initialMedicines);
  });
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_chats');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });
  const [prescriptions, setPrescriptions] = useState<Prescription[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_rx');
    return saved ? JSON.parse(saved) : initialPrescriptions;
  });
  const [labReports, setLabReports] = useState<LabReport[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_labs');
    return saved ? JSON.parse(saved) : initialLabReports;
  });
  const [healthTips] = useState<HealthTip[]>(initialHealthTips);
  const [notifications, setNotifications] = useState<NotificationEvent[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_notifs');
    return saved ? JSON.parse(saved) : initialNotifications;
  });
  const [caregiverSettings, setCaregiverSettings] = useState<CaregiverSettings>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_settings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.name === 'Priya Sharma') {
        parsed.name = initialCaregiverSettings.name;
        parsed.email = initialCaregiverSettings.email;
      }
      return parsed;
    }
    return initialCaregiverSettings;
  });
  const [refillRecords, setRefillRecords] = useState<RefillRecord[]>(() => {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY + '_refills');
    return saved ? JSON.parse(saved) : initialRefillRecords;
  });

  const [language, setLanguageState] = useState<Language>('en');
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [activeAlarmDose, setActiveAlarmDose] = useState<ScheduledDose | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Firebase Auth and Firestore states
  const [authUser, setAuthUser] = useState<User | null>(null);
  const [isFirestoreConnected, setIsFirestoreConnected] = useState<boolean>(true);

  // Listen to Firebase Auth state changes
  useEffect(() => {
    testFirestoreConnection().then(connected => setIsFirestoreConnected(connected));
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setAuthUser(currentUser);
      if (currentUser) {
        const registeredName = currentUser.displayName 
          || (currentUser.email ? currentUser.email.split('@')[0].replace(/[0-9_.]/g, ' ').trim().replace(/\b\w/g, l => l.toUpperCase()) : '')
          || 'Caregiver';

        setCaregiverSettings(prev => ({
          ...prev,
          name: currentUser.displayName || registeredName,
          email: currentUser.email || prev.email
        }));

        // Save/Sync user profile to Firestore
        try {
          await setDoc(doc(db, 'users', currentUser.uid), {
            uid: currentUser.uid,
            email: currentUser.email || '',
            displayName: currentUser.displayName || registeredName,
            photoURL: currentUser.photoURL || '',
            role: 'caregiver',
            createdAt: new Date().toISOString()
          }, { merge: true });
        } catch (err) {
          console.warn('User profile sync error:', err);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err: any) {
      console.error('Google Sign-In failed:', err);
      throw err;
    }
  };

  const signOutUser = async () => {
    try {
      await signOut(auth);
    } catch (err: any) {
      console.error('Sign-out failed:', err);
    }
  };

  // Active patient object
  const activePatient = patients.find(p => p.id === currentPatientId) || patients[0];

  // Sync language with active patient preference when switched
  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    setPatients(prev => prev.map(p => p.id === currentPatientId ? { ...p, preferredLanguage: lang } : p));
  }, [currentPatientId]);

  // Persist important entities to localStorage
  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY + '_patients', JSON.stringify(patients));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_medicines', JSON.stringify(medicines));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_doses', JSON.stringify(scheduledDoses));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_chats', JSON.stringify(chatMessages));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_notifs', JSON.stringify(notifications));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_settings', JSON.stringify(caregiverSettings));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_refills', JSON.stringify(refillRecords));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_rx', JSON.stringify(prescriptions));
    localStorage.setItem(LOCAL_STORAGE_KEY + '_labs', JSON.stringify(labReports));
  }, [patients, medicines, scheduledDoses, chatMessages, notifications, caregiverSettings, refillRecords, prescriptions, labReports]);

  // Synchronize language with active patient profile
  useEffect(() => {
    if (activePatient?.preferredLanguage) {
      setLanguageState(activePatient.preferredLanguage);
    }
  }, [activePatient]);

  const switchPatient = (patientId: string) => {
    const found = patients.find(p => p.id === patientId);
    if (found) {
      setCurrentPatientId(patientId);
      setLanguageState(found.preferredLanguage);
    }
  };

  // Audio Alarm management
  const triggerSimulatedAlarm = useCallback((doseId?: string) => {
    const targetDose = doseId 
      ? scheduledDoses.find(d => d.id === doseId)
      : scheduledDoses.find(d => d.patientId === currentPatientId && (d.status === 'due' || d.status === 'awaiting_confirmation')) || scheduledDoses[0];

    if (!targetDose) return;

    setActiveAlarmDose(targetDose);
    setIsAlarmRinging(true);
    startMedicineAlarm(activePatient.soundVolume);

    // If voice read aloud enabled, speak it after initial chime
    if (activePatient.voiceReadAloud) {
      setTimeout(() => {
        speakMedicineInstructions(targetDose);
      }, 1200);
    }
  }, [scheduledDoses, currentPatientId, activePatient]);

  const stopAlarm = useCallback(() => {
    stopMedicineAlarm();
    setIsAlarmRinging(false);
    stopSpeech();
    setIsSpeaking(false);
  }, []);

  const stopSpeakingAudio = () => {
    stopSpeech();
    setIsSpeaking(false);
  };

  const speakMedicineInstructions = useCallback((dose: ScheduledDose) => {
    setIsSpeaking(true);
    let speechContent = '';

    if (language === 'hi') {
      speechContent = `नमस्ते ${activePatient.name} जी! आपकी ${dose.medicineName} ${dose.dosage} लेने का समय हो गया है। इसे ${dose.foodInstruction === 'after_food' ? 'भोजन के बाद' : 'भोजन से पहले'} सादे पानी के साथ लें और हरा बटन दबाएं।`;
    } else if (language === 'te') {
      speechContent = `నమస్కారం ${activePatient.name} గారు! మీ ${dose.medicineName} ${dose.dosage} వేసుకునే సమయం అయింది. దీనిని ఒక గ్లాసు నీటితో తీసుకొని ఆకుపచ్చ బటన్ నొక్కండి.`;
    } else {
      speechContent = `Hello ${activePatient.name}! It is time to take your ${dose.medicineName} ${dose.dosage}. Please take it ${dose.foodInstruction.replace('_', ' ')} with water and tap the green button.`;
    }

    speakText(speechContent, language, () => {
      setIsSpeaking(false);
    });
  }, [activePatient, language]);

  // One-tap dose confirmation
  const confirmDose = useCallback((doseId: string, method: 'elderly_one_tap' | 'caregiver_manual' | 'voice_command' = 'elderly_one_tap') => {
    stopAlarm();
    playSuccessChime();

    // Trigger joyful confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0d9488', '#14b8a6', '#f59e0b', '#3b82f6', '#10b981']
      });
    } catch {
      // Ignore in unsupported environments
    }

    const now = new Date();
    const timestampStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setScheduledDoses(prevDoses => {
      return prevDoses.map(dose => {
        if (dose.id === doseId) {
          return {
            ...dose,
            status: 'taken',
            confirmedAt: now.toISOString(),
            confirmedMethod: method
          };
        }
        return dose;
      });
    });

    // Find the dose & decrement medicine stock
    const dose = scheduledDoses.find(d => d.id === doseId);
    if (dose) {
      setMedicines(prevMeds => {
        return prevMeds.map(med => {
          if (med.id === dose.medicineId) {
            const newStock = Math.max(0, med.stockQuantity - 1);
            // Check refill threshold
            if (newStock <= med.refillThreshold) {
              const refillNotif: NotificationEvent = {
                id: 'notif_refill_' + Date.now(),
                patientId: dose.patientId,
                patientName: activePatient.name,
                type: 'refill_alert',
                title: `Low Stock: ${med.name}`,
                message: `Only ${newStock} units left for ${activePatient.name}. Please reorder soon.`,
                timestamp: 'Just now',
                read: false
              };
              setNotifications(prev => [refillNotif, ...prev]);
            }
            return { ...med, stockQuantity: newStock };
          }
          return med;
        });
      });

      // Add instant notification for Caregiver
      const notif: NotificationEvent = {
        id: 'notif_' + Date.now(),
        patientId: dose.patientId,
        patientName: activePatient.name,
        type: 'dose_taken',
        title: `Dose Taken: ${dose.medicineName}`,
        message: `${activePatient.name} tapped "TAKEN MEDICINE" for ${dose.medicineName} (${dose.dosage}) at ${timestampStr}.`,
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);

      // Play caregiver ping if sound is enabled
      if (caregiverSettings.notifySound) {
        setTimeout(playNotificationPing, 600);
      }

      // If browser push notification supported
      if (caregiverSettings.notifyBrowser && typeof window !== 'undefined' && 'Notification' in window) {
        try {
          if (Notification.permission === 'granted') {
            new Notification(`Dose Confirmed - ${dose.medicineName}`, {
              body: `${activePatient.name} took their medication at ${timestampStr}.`,
              icon: '/favicon.ico'
            });
          }
        } catch {
          // Ignore notification permission errors in sandboxed iframes
        }
      }
    }
  }, [activePatient, scheduledDoses, caregiverSettings, stopAlarm]);

  const skipDose = (doseId: string) => {
    stopAlarm();
    setScheduledDoses(prev => prev.map(d => d.id === doseId ? { ...d, status: 'skipped' } : d));
  };

  const addMedicine = (med: Omit<Medicine, 'id'>) => {
    const newMed: Medicine = {
      ...med,
      id: 'm_' + Date.now()
    };
    setMedicines(prev => [...prev, newMed]);

    // Generate scheduled doses for today
    const todayStr = new Date().toISOString().split('T')[0];
    const newDoses: ScheduledDose[] = newMed.scheduleTimes.map((time, idx) => ({
      id: `dose_${newMed.id}_${idx}_${Date.now()}`,
      patientId: newMed.patientId,
      medicineId: newMed.id,
      medicineName: newMed.name,
      dosage: newMed.dosage,
      dosageForm: newMed.dosageForm,
      foodInstruction: newMed.foodInstruction,
      colorTag: newMed.colorTag,
      scheduledDate: todayStr,
      scheduledTime: time,
      status: 'upcoming'
    }));

    setScheduledDoses(prev => [...prev, ...newDoses]);
  };

  const updateMedicine = (updatedMed: Medicine) => {
    setMedicines(prev => prev.map(m => m.id === updatedMed.id ? updatedMed : m));
  };

  const deleteMedicine = (id: string) => {
    setMedicines(prev => prev.filter(m => m.id !== id));
    setScheduledDoses(prev => prev.filter(d => d.medicineId !== id));
  };

  const addPatient = (patientData: Omit<Patient, 'id'>) => {
    const newPatient: Patient = {
      ...patientData,
      id: 'p_' + Date.now()
    };
    setPatients(prev => [...prev, newPatient]);
    setCurrentPatientId(newPatient.id);
  };

  const updatePatient = (updatedPatient: Patient) => {
    setPatients(prev => prev.map(p => p.id === updatedPatient.id ? updatedPatient : p));
  };

  const pairPatientWithCode = (code: string) => {
    const trimmed = code.trim();
    const matched = patients.find(p => p.pairingCode === trimmed);
    if (matched) {
      const updated = {
        ...matched,
        isPaired: true,
        pairedDeviceName: 'Browser Companion (' + (navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop') + ')',
        lastActive: 'Just now'
      };
      setPatients(prev => prev.map(p => p.id === matched.id ? updated : p));
      setCurrentPatientId(matched.id);
      setLanguageState(matched.preferredLanguage);
      setPortalMode('elderly');
      return { success: true, message: `Connected with ${matched.name}! Welcome to the elderly portal.`, patient: updated };
    }
    return { success: false, message: 'Invalid 6-digit code. Please check the caregiver dashboard.' };
  };

  // Chat message sending with instant auto-reply simulation
  const sendChatMessage = (text: string, sender: 'caregiver' | 'elderly') => {
    if (!text.trim()) return;

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: ChatMessage = {
      id: 'msg_' + Date.now(),
      patientId: currentPatientId,
      sender,
      senderName: sender === 'caregiver' ? caregiverSettings.name : activePatient.name,
      text: text.trim(),
      timestamp: `Today, ${timeStr}`,
      read: true
    };

    setChatMessages(prev => [...prev, newMsg]);
    playNotificationPing();

    // If elderly sent message and caregiver is in away mode, trigger automatic reply
    if (sender === 'elderly' && caregiverSettings.awayMode) {
      setTimeout(() => {
        const autoReply: ChatMessage = {
          id: 'msg_auto_' + Date.now(),
          patientId: currentPatientId,
          sender: 'caregiver',
          senderName: `${caregiverSettings.name} (Auto-Reply)`,
          text: caregiverSettings.autoReplyText,
          timestamp: `Today, ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
          isAutoReply: true,
          read: false
        };
        setChatMessages(prev => [...prev, autoReply]);
        playNotificationPing();
      }, 1500);
    }
  };

  const addPrescription = (rx: Omit<Prescription, 'id'>) => {
    setPrescriptions(prev => [{ ...rx, id: 'rx_' + Date.now() }, ...prev]);
  };

  const addLabReport = (lab: Omit<LabReport, 'id'>) => {
    setLabReports(prev => [{ ...lab, id: 'lab_' + Date.now() }, ...prev]);
  };

  const recordRefill = (medicineId: string, quantity: number, note?: string) => {
    const med = medicines.find(m => m.id === medicineId);
    if (!med) return;

    const prevQty = med.stockQuantity;
    const newQty = prevQty + quantity;

    setMedicines(prev => prev.map(m => m.id === medicineId ? { ...m, stockQuantity: newQty } : m));

    const record: RefillRecord = {
      id: 'ref_' + Date.now(),
      medicineId,
      medicineName: med.name,
      patientId: med.patientId,
      addedQuantity: quantity,
      previousQuantity: prevQty,
      newQuantity: newQty,
      date: new Date().toISOString().split('T')[0],
      note: note || `Added ${quantity} units`
    };
    setRefillRecords(prev => [record, ...prev]);

    // Clear refill alert from notifications if any
    setNotifications(prev => prev.filter(n => !(n.type === 'refill_alert' && n.title.includes(med.name))));
  };

  const updateSettings = (partial: Partial<CaregiverSettings>) => {
    setCaregiverSettings(prev => ({ ...prev, ...partial }));
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Demo simulator functions
  const simulateDueDoseNow = () => {
    const dose = scheduledDoses.find(d => d.patientId === currentPatientId && d.status === 'upcoming') || scheduledDoses[0];
    if (dose) {
      setScheduledDoses(prev => prev.map(d => d.id === dose.id ? { ...d, status: 'due' } : d));
      triggerSimulatedAlarm(dose.id);
    }
  };

  const simulateMissedDoseNow = () => {
    const dose = scheduledDoses.find(d => d.patientId === currentPatientId && (d.status === 'due' || d.status === 'upcoming')) || scheduledDoses[0];
    if (dose) {
      setScheduledDoses(prev => prev.map(d => d.id === dose.id ? { ...d, status: 'missed' } : d));
      const notif: NotificationEvent = {
        id: 'notif_missed_' + Date.now(),
        patientId: dose.patientId,
        patientName: activePatient.name,
        type: 'dose_missed',
        title: `Missed Dose Alert: ${dose.medicineName}`,
        message: `${activePatient.name} did not confirm ${dose.medicineName} scheduled at ${dose.scheduledTime} within the ${caregiverSettings.gracePeriodMinutes}-minute grace window.`,
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
      playNotificationPing();
    }
  };

  const simulateDoctorEscalationNow = () => {
    const dose = scheduledDoses.find(d => d.patientId === currentPatientId && d.status === 'missed') || scheduledDoses[0];
    if (dose) {
      setScheduledDoses(prev => prev.map(d => d.id === dose.id ? { 
        ...d, 
        status: 'escalated',
        escalatedAt: new Date().toISOString(),
        escalationLevel: 'doctor_alert' 
      } : d));
      const notif: NotificationEvent = {
        id: 'notif_esc_' + Date.now(),
        patientId: dose.patientId,
        patientName: activePatient.name,
        type: 'escalation',
        title: `CRITICAL ESCALATION: ${dose.medicineName}`,
        message: `Dose missed over ${caregiverSettings.escalationGraceMinutes} mins. Automated escalation dispatched to Dr. ${activePatient.doctorContact.name} (${activePatient.doctorContact.phone}) and emergency contact.`,
        timestamp: 'Just now',
        read: false
      };
      setNotifications(prev => [notif, ...prev]);
      playNotificationPing();
    }
  };

  const resetDemoData = () => {
    localStorage.clear();
    setPatients(initialPatients);
    setMedicines(initialMedicines);
    setScheduledDoses(generateTodayDoses(initialPatients, initialMedicines));
    setChatMessages(initialChatMessages);
    setPrescriptions(initialPrescriptions);
    setLabReports(initialLabReports);
    setNotifications(initialNotifications);
    setCaregiverSettings(initialCaregiverSettings);
    setRefillRecords(initialRefillRecords);
    setCurrentPatientId('p1');
    setLanguageState('hi');
    stopAlarm();
  };

  return (
    <AppContext.Provider value={{
      portalMode,
      setPortalMode,
      activePatient,
      patients,
      medicines,
      scheduledDoses,
      chatMessages,
      prescriptions,
      labReports,
      healthTips,
      notifications,
      caregiverSettings,
      refillRecords,
      language,
      setLanguage,
      isAlarmRinging,
      activeAlarmDose,
      isSpeaking,
      switchPatient,
      confirmDose,
      skipDose,
      addMedicine,
      updateMedicine,
      deleteMedicine,
      addPatient,
      updatePatient,
      pairPatientWithCode,
      sendChatMessage,
      addPrescription,
      addLabReport,
      recordRefill,
      updateSettings,
      markNotificationRead,
      clearAllNotifications,
      triggerSimulatedAlarm,
      stopAlarm,
      speakMedicineInstructions,
      stopSpeakingAudio,
      authUser,
      signInWithGoogle,
      signOutUser,
      isFirestoreConnected,
      simulateDueDoseNow,
      simulateMissedDoseNow,
      simulateDoctorEscalationNow,
      resetDemoData
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
