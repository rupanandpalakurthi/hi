import { Patient, Medicine, ScheduledDose, ChatMessage, Prescription, LabReport, HealthTip, NotificationEvent, CaregiverSettings, RefillRecord } from '../types';

export const initialCaregiverSettings: CaregiverSettings = {
  name: 'Rupanand Palakurthi',
  phone: '+91 98490 12345',
  email: 'rupanandpalakurthi798@gmail.com',
  awayMode: false,
  autoReplyText: 'Thank you for your message. Your family member is currently unavailable or in a meeting. They will call you back shortly. Please take your medicine as prescribed.',
  gracePeriodMinutes: 15,
  escalationGraceMinutes: 30,
  notifyBrowser: false,
  notifySound: true,
  notifySmsFallback: true,
  notifyIvrCall: false,
  smsApiKeyConfigured: true
};

export const initialPatients: Patient[] = [
  {
    id: 'p1',
    name: 'Lakshmi Devi',
    age: 72,
    relation: 'Mother (अम्मा / తల్లి)',
    phone: '+91 94401 23456',
    emergencyContact: {
      name: 'Priya Sharma (Daughter)',
      phone: '+91 98490 12345',
      relation: 'Daughter'
    },
    doctorContact: {
      name: 'Dr. S. K. Venkataraman',
      specialty: 'Senior Diabetologist & Physician',
      phone: '+91 98200 44556',
      clinic: 'Apollo Health City, Jubilee Hills'
    },
    pairingCode: '748291',
    isPaired: true,
    pairedDeviceName: 'Lakshmi’s Living Room Tablet (Android)',
    lastActive: 'Just now',
    preferredLanguage: 'hi',
    fontSize: 'large',
    highContrast: false,
    soundVolume: 85,
    voiceReadAloud: true,
    chronicConditions: ['Type-2 Diabetes', 'Hypertension', 'Osteoarthritis'],
    city: 'Hyderabad'
  },
  {
    id: 'p2',
    name: 'Ramachandra Rao',
    age: 78,
    relation: 'Father-in-law (पिताजी / మావయ్య)',
    phone: '+91 98850 78901',
    emergencyContact: {
      name: 'Arjun Rao (Son)',
      phone: '+91 98480 99887',
      relation: 'Son'
    },
    doctorContact: {
      name: 'Dr. Ananya Kulkarni',
      specialty: 'Consultant Cardiologist',
      phone: '+91 99490 33221',
      clinic: 'Fortis Heart Centre'
    },
    pairingCode: '319502',
    isPaired: true,
    pairedDeviceName: 'Bedside Screen (iPad)',
    lastActive: '12 mins ago',
    preferredLanguage: 'te',
    fontSize: 'xl',
    highContrast: true,
    soundVolume: 95,
    voiceReadAloud: true,
    chronicConditions: ['Post-CABG Cardiac Care', 'Hypercholesterolemia'],
    city: 'Bengaluru'
  },
  {
    id: 'p3',
    name: 'Savitri Amma',
    age: 69,
    relation: 'Aunt (मासी / పిన్ని)',
    phone: '+91 97000 11223',
    emergencyContact: {
      name: 'Priya Sharma',
      phone: '+91 98490 12345',
      relation: 'Niece'
    },
    doctorContact: {
      name: 'Dr. Rajesh Nair',
      specialty: 'Internal Medicine',
      phone: '+91 98401 55667',
      clinic: 'Vijaya Hospital'
    },
    pairingCode: '882314',
    isPaired: false,
    preferredLanguage: 'en',
    fontSize: 'normal',
    highContrast: false,
    soundVolume: 75,
    voiceReadAloud: false,
    chronicConditions: ['Mild Asthma', 'Joint Pain'],
    city: 'Chennai'
  }
];

export const initialMedicines: Medicine[] = [
  {
    id: 'm1',
    patientId: 'p1',
    name: 'Metformin 500mg',
    brandName: 'Glycomet SR',
    dosage: '500 mg',
    dosageForm: 'tablet',
    foodInstruction: 'after_food',
    colorTag: '#0d9488', // teal
    prescribedBy: 'Dr. S. K. Venkataraman',
    scheduleTimes: ['08:00', '20:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    stockQuantity: 24,
    refillThreshold: 10,
    active: true,
    startDate: '2026-01-10',
    instructionsNote: 'Take with warm water after dinner to maintain smooth night glucose.'
  },
  {
    id: 'm2',
    patientId: 'p1',
    name: 'Amlodipine 5mg',
    brandName: 'Amlong 5',
    dosage: '5 mg',
    dosageForm: 'tablet',
    foodInstruction: 'before_food',
    colorTag: '#3b82f6', // blue
    prescribedBy: 'Dr. S. K. Venkataraman',
    scheduleTimes: ['08:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    stockQuantity: 14,
    refillThreshold: 7,
    active: true,
    startDate: '2026-01-15',
    instructionsNote: 'Morning blood pressure control tablet. Do not skip.'
  },
  {
    id: 'm3',
    patientId: 'p1',
    name: 'Atorvastatin 10mg',
    brandName: 'Atorva 10',
    dosage: '10 mg',
    dosageForm: 'tablet',
    foodInstruction: 'after_food',
    colorTag: '#f59e0b', // amber
    prescribedBy: 'Dr. S. K. Venkataraman',
    scheduleTimes: ['21:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    stockQuantity: 4, // LOW STOCK TRIGGER
    refillThreshold: 10,
    active: true,
    startDate: '2026-01-20',
    instructionsNote: 'Cholesterol protection at bedtime.'
  },
  {
    id: 'm4',
    patientId: 'p1',
    name: 'Calcium + Vit D3',
    brandName: 'Shelcal 500',
    dosage: '500 mg + 250 IU',
    dosageForm: 'tablet',
    foodInstruction: 'with_food',
    colorTag: '#8b5cf6', // purple
    prescribedBy: 'Dr. S. K. Venkataraman',
    scheduleTimes: ['13:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    stockQuantity: 38,
    refillThreshold: 10,
    active: true,
    startDate: '2026-02-01',
    instructionsNote: 'Bone strength for osteoarthritis support.'
  },
  {
    id: 'm5',
    patientId: 'p2',
    name: 'Ecosprin 75mg',
    brandName: 'Ecosprin AV',
    dosage: '75 mg',
    dosageForm: 'tablet',
    foodInstruction: 'after_food',
    colorTag: '#ef4444', // red
    prescribedBy: 'Dr. Ananya Kulkarni',
    scheduleTimes: ['09:00'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    stockQuantity: 18,
    refillThreshold: 8,
    active: true,
    startDate: '2026-01-01',
    instructionsNote: 'Antiplatelet cardiac maintenance.'
  },
  {
    id: 'm6',
    patientId: 'p2',
    name: 'Telmisartan 40mg',
    brandName: 'Telma 40',
    dosage: '40 mg',
    dosageForm: 'tablet',
    foodInstruction: 'before_food',
    colorTag: '#10b981',
    prescribedBy: 'Dr. Ananya Kulkarni',
    scheduleTimes: ['08:30'],
    daysOfWeek: [0, 1, 2, 3, 4, 5, 6],
    stockQuantity: 5, // LOW STOCK
    refillThreshold: 7,
    active: true,
    startDate: '2026-01-05'
  }
];

export function generateTodayDoses(patients: Patient[], medicines: Medicine[]): ScheduledDose[] {
  const todayStr = new Date().toISOString().split('T')[0];
  const doses: ScheduledDose[] = [];

  // Generate for patient 1 (Lakshmi Devi)
  doses.push({
    id: 'dose_p1_1',
    patientId: 'p1',
    medicineId: 'm2',
    medicineName: 'Amlodipine 5mg',
    dosage: '5 mg',
    dosageForm: 'tablet',
    foodInstruction: 'before_food',
    colorTag: '#3b82f6',
    scheduledDate: todayStr,
    scheduledTime: '08:00',
    status: 'taken',
    confirmedAt: `${todayStr}T08:04:12`,
    confirmedMethod: 'elderly_one_tap'
  });

  doses.push({
    id: 'dose_p1_2',
    patientId: 'p1',
    medicineId: 'm1',
    medicineName: 'Metformin 500mg',
    dosage: '500 mg',
    dosageForm: 'tablet',
    foodInstruction: 'after_food',
    colorTag: '#0d9488',
    scheduledDate: todayStr,
    scheduledTime: '08:00',
    status: 'taken',
    confirmedAt: `${todayStr}T08:12:45`,
    confirmedMethod: 'elderly_one_tap'
  });

  doses.push({
    id: 'dose_p1_3',
    patientId: 'p1',
    medicineId: 'm4',
    medicineName: 'Calcium + Vit D3',
    dosage: '500 mg',
    dosageForm: 'tablet',
    foodInstruction: 'with_food',
    colorTag: '#8b5cf6',
    scheduledDate: todayStr,
    scheduledTime: '13:30',
    status: 'taken',
    confirmedAt: `${todayStr}T13:42:00`,
    confirmedMethod: 'elderly_one_tap'
  });

  doses.push({
    id: 'dose_p1_4',
    patientId: 'p1',
    medicineId: 'm1',
    medicineName: 'Metformin 500mg',
    dosage: '500 mg',
    dosageForm: 'tablet',
    foodInstruction: 'after_food',
    colorTag: '#0d9488',
    scheduledDate: todayStr,
    scheduledTime: '20:00',
    status: 'due', // ACTIVE CURRENT DOSE FOR TESTING
    notes: 'Dinner dose'
  });

  doses.push({
    id: 'dose_p1_5',
    patientId: 'p1',
    medicineId: 'm3',
    medicineName: 'Atorvastatin 10mg',
    dosage: '10 mg',
    dosageForm: 'tablet',
    foodInstruction: 'after_food',
    colorTag: '#f59e0b',
    scheduledDate: todayStr,
    scheduledTime: '21:00',
    status: 'upcoming',
    notes: 'Bedtime lipid dose'
  });

  // Patient 2 (Ramachandra Rao)
  doses.push({
    id: 'dose_p2_1',
    patientId: 'p2',
    medicineId: 'm6',
    medicineName: 'Telmisartan 40mg',
    dosage: '40 mg',
    dosageForm: 'tablet',
    foodInstruction: 'before_food',
    colorTag: '#10b981',
    scheduledDate: todayStr,
    scheduledTime: '08:30',
    status: 'taken',
    confirmedAt: `${todayStr}T08:35:10`,
    confirmedMethod: 'elderly_one_tap'
  });

  doses.push({
    id: 'dose_p2_2',
    patientId: 'p2',
    medicineId: 'm5',
    medicineName: 'Ecosprin 75mg',
    dosage: '75 mg',
    dosageForm: 'tablet',
    foodInstruction: 'after_food',
    colorTag: '#ef4444',
    scheduledDate: todayStr,
    scheduledTime: '09:00',
    status: 'taken',
    confirmedAt: `${todayStr}T09:08:44`,
    confirmedMethod: 'elderly_one_tap'
  });

  return doses;
}

export const initialChatMessages: ChatMessage[] = [
  {
    id: 'msg1',
    patientId: 'p1',
    sender: 'caregiver',
    senderName: 'Priya (Daughter)',
    text: 'Good morning Amma! Please have your warm idlis and do not forget to take your morning medicines.',
    timestamp: 'Today, 07:30 AM',
    read: true
  },
  {
    id: 'msg2',
    patientId: 'p1',
    sender: 'elderly',
    senderName: 'Lakshmi Devi',
    text: 'Morning beta. Yes, I had breakfast and pressed the big green button after taking both tablets.',
    timestamp: 'Today, 08:14 AM',
    read: true
  },
  {
    id: 'msg3',
    patientId: 'p1',
    sender: 'caregiver',
    senderName: 'Priya (Daughter)',
    text: 'Saw the notification on my phone immediately! Thank you Amma. Drink enough water today.',
    timestamp: 'Today, 08:20 AM',
    read: true
  },
  {
    id: 'msg4',
    patientId: 'p1',
    sender: 'elderly',
    senderName: 'Lakshmi Devi',
    text: 'Yes Priya, kept the water bottle nearby. I also received your voice reminder clearly.',
    timestamp: 'Today, 13:45 PM',
    read: true
  }
];

export const initialPrescriptions: Prescription[] = [
  {
    id: 'rx1',
    patientId: 'p1',
    doctorName: 'Dr. S. K. Venkataraman, MD, DM',
    clinic: 'Apollo Health City, Department of Endocrinology',
    date: '2026-01-10',
    diagnosis: 'Type-2 Diabetes Mellitus with Essential Hypertension, Stage 1',
    medicinesList: ['Metformin 500mg SR (twice daily)', 'Amlodipine 5mg (morning)', 'Atorvastatin 10mg (night)', 'Shelcal 500 (afternoon)'],
    notes: 'Target HbA1c < 7.0%. Low sodium diet recommended. Avoid skipping dinner.'
  },
  {
    id: 'rx2',
    patientId: 'p2',
    doctorName: 'Dr. Ananya Kulkarni, DM Cardiology',
    clinic: 'Fortis Heart Centre',
    date: '2026-01-05',
    diagnosis: 'Post-CABG follow up (stable), Hypertension',
    medicinesList: ['Ecosprin 75mg (morning after food)', 'Telmisartan 40mg (morning)', 'Rosuvastatin 20mg (night)'],
    notes: 'Regular morning walks 20 mins. Immediate emergency review if chest discomfort.'
  }
];

export const initialLabReports: LabReport[] = [
  {
    id: 'lab1',
    patientId: 'p1',
    testName: 'Comprehensive Metabolic & Glycemic Panel',
    category: 'Diabetes',
    labName: 'Vijaya Diagnostic Centre',
    date: '2026-02-15',
    resultSummary: 'HbA1c slightly elevated at 7.2%. Fasting glucose 128 mg/dL. Renal profile within normal limits.',
    abnormalFlags: true,
    keyValues: [
      { metric: 'HbA1c', value: '7.2', unit: '%', referenceRange: '< 7.0 (Target)', isAbnormal: true },
      { metric: 'Fasting Blood Sugar', value: '128', unit: 'mg/dL', referenceRange: '70 - 100', isAbnormal: true },
      { metric: 'Serum Creatinine', value: '0.88', unit: 'mg/dL', referenceRange: '0.6 - 1.2', isAbnormal: false },
      { metric: 'eGFR', value: '82', unit: 'mL/min/1.73m²', referenceRange: '> 60', isAbnormal: false }
    ]
  },
  {
    id: 'lab2',
    patientId: 'p1',
    testName: 'Lipid Profile (Fasting)',
    category: 'Lipid',
    labName: 'Apollo Diagnostics',
    date: '2026-01-20',
    resultSummary: 'Total Cholesterol 182 mg/dL. LDL cholesterol well controlled on Atorvastatin at 88 mg/dL.',
    abnormalFlags: false,
    keyValues: [
      { metric: 'Total Cholesterol', value: '182', unit: 'mg/dL', referenceRange: '< 200', isAbnormal: false },
      { metric: 'LDL Cholesterol', value: '88', unit: 'mg/dL', referenceRange: '< 100', isAbnormal: false },
      { metric: 'HDL Good Cholesterol', value: '46', unit: 'mg/dL', referenceRange: '> 40', isAbnormal: false },
      { metric: 'Triglycerides', value: '142', unit: 'mg/dL', referenceRange: '< 150', isAbnormal: false }
    ]
  }
];

export const initialHealthTips: HealthTip[] = [
  {
    id: 'tip1',
    title: {
      en: 'Safe Water Hydration with Blood Pressure Medicine',
      hi: 'ब्लड प्रेशर की दवा के साथ भरपूर पानी का महत्व',
      te: 'రక్తపోటు మందులతో తగినంత నీరు త్రాగడం'
    },
    category: 'hypertension',
    content: {
      en: 'Blood pressure medicines work best when your body is gently hydrated. Drink a full glass of lukewarm water 15 minutes after taking your morning tablet.',
      hi: 'ब्लड प्रेशर की दवाएं शरीर में पानी का संतुलन बनाए रखने पर सबसे अच्छा काम करती हैं। सुबह की गोली लेने के बाद एक पूरा गिलास गुनगुना पानी अवश्य पिएं।',
      te: 'శరీరంలో తగినంత నీరు ఉన్నప్పుడు రక్తపోటు మందులు బాగా పనిచేస్తాయి. ఉదయం టాబ్లెట్ వేసుకున్న 15 నిమిషాల తర్వాత పూర్తి గ్లాస్ గోరువెచ్చని నీరు త్రాగండి.'
    },
    source: 'Indian Council of Medical Research (ICMR) Geriatric Guidelines',
    verifiedBy: 'Dr. S. K. Venkataraman (MD)',
    updatedDate: '2026-02-01'
  },
  {
    id: 'tip2',
    title: {
      en: 'Why Metformin Should Always Follow a Meal',
      hi: 'मेटफॉर्मिन हमेशा भोजन के बाद ही क्यों लेनी चाहिए',
      te: 'మెట్‌ఫార్మిన్ ఎల్లప్పుడూ భోజనం తర్వాత ఎందుకు తీసుకోవాలి'
    },
    category: 'diabetes',
    content: {
      en: 'Metformin can occasionally cause mild stomach fullness or bloating if taken empty stomach. Taking it right after your breakfast or dinner keeps your digestion completely comfortable.',
      hi: 'खाली पेट मेटफॉर्मिन लेने से पेट में भारीपन या गैस हो सकती है। भोजन के 15 मिनट बाद लेने से पाचन सहज रहता है और शुगर नियंत्रण बेहतर होता है।',
      te: 'ఖాళీ కడుపున మెట్‌ఫార్మిన్ తీసుకుంటే కడుపుబ్బరం రావచ్చు. అల్పాహారం లేదా భోజనం తర్వాత తీసుకోవడం వల్ల ఎటువంటి ఇబ్బంది ఉండదు.'
    },
    source: 'Association of Physicians of India (API)',
    verifiedBy: 'Clinical Pharmacy Board',
    updatedDate: '2026-02-10'
  },
  {
    id: 'tip3',
    title: {
      en: 'Never Double Doses After a Missed Schedule',
      hi: 'दवा छूटने पर अगली बार कभी दोहरी खुराक न लें',
      te: 'మందు మరిచిపోతే తదుపరి సమయంలో డబుల్ డోస్ వేయవద్దు'
    },
    category: 'general',
    content: {
      en: 'If an alarm was missed by more than 4 hours, do not take two tablets together next time. Simply take the next scheduled dose as usual to prevent sudden drops in blood sugar or blood pressure.',
      hi: 'यदि दवा का समय 4 घंटे से अधिक निकल चुका है, तो अगली बार दो गोलियां एक साथ न लें। अचानक बीपी या शुगर कम होने से बचने के लिए अगली निर्धारित गोली ही लें।',
      te: 'ఒకవేళ మందు సమయం బాగా దాటిపోతే, తర్వాతి సారి రెండు మాత్రలు కలపి వేయకండి. రక్తపోటు లేదా షుగర్ హఠాత్తుగా పడిపోకుండా ఉండటానికి మామూలు డోస్ మాత్రమే తీసుకోండి.'
    },
    source: 'World Health Organization (WHO) Patient Safety',
    verifiedBy: 'Geriatric Safety Council',
    updatedDate: '2026-01-25'
  }
];

export const initialNotifications: NotificationEvent[] = [
  {
    id: 'notif1',
    patientId: 'p1',
    patientName: 'Lakshmi Devi',
    type: 'dose_taken',
    title: 'Morning Doses Confirmed',
    message: 'Lakshmi Devi confirmed taking Amlodipine 5mg and Metformin 500mg at 08:12 AM.',
    timestamp: 'Today, 08:12 AM',
    read: true
  },
  {
    id: 'notif2',
    patientId: 'p1',
    patientName: 'Lakshmi Devi',
    type: 'refill_alert',
    title: 'Low Stock Alert: Atorvastatin 10mg',
    message: 'Only 4 tablets remaining (threshold is 10). Reorder recommended this week.',
    timestamp: 'Today, 06:00 AM',
    read: false
  }
];

export const initialRefillRecords: RefillRecord[] = [
  {
    id: 'ref1',
    medicineId: 'm1',
    medicineName: 'Metformin 500mg',
    patientId: 'p1',
    addedQuantity: 30,
    previousQuantity: 4,
    newQuantity: 34,
    date: '2026-02-01',
    note: 'Purchased from Apollo Pharmacy'
  }
];
