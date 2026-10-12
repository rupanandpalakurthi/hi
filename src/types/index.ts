export type Language = 'en' | 'hi' | 'te';

export type DoseStatus = 
  | 'upcoming' 
  | 'due' 
  | 'awaiting_confirmation' 
  | 'taken' 
  | 'missed' 
  | 'escalated' 
  | 'skipped' 
  | 'cancelled';

export type DosageForm = 'tablet' | 'capsule' | 'syrup' | 'drops' | 'injection' | 'inhaler';

export type FoodInstruction = 'before_food' | 'after_food' | 'with_food' | 'empty_stomach' | 'anytime';

export interface Patient {
  id: string;
  name: string;
  age: number;
  relation: string; // e.g., 'Mother', 'Father'
  avatarUrl?: string;
  phone: string;
  emergencyContact: {
    name: string;
    phone: string;
    relation: string;
  };
  doctorContact: {
    name: string;
    specialty: string;
    phone: string;
    clinic: string;
  };
  pairingCode: string;
  isPaired: boolean;
  pairedDeviceName?: string;
  lastActive?: string;
  preferredLanguage: Language;
  fontSize: 'normal' | 'large' | 'xl';
  highContrast: boolean;
  soundVolume: number; // 0 - 100
  voiceReadAloud: boolean;
  chronicConditions: string[];
  city: string;
}

export interface Medicine {
  id: string;
  patientId: string;
  name: string;
  brandName?: string;
  dosage: string; // e.g., '500 mg', '10 ml', '1 puff'
  dosageForm: DosageForm;
  foodInstruction: FoodInstruction;
  colorTag: string; // hex or tailwind color
  prescribedBy: string;
  scheduleTimes: string[]; // ['08:00', '20:00']
  daysOfWeek: number[]; // [0,1,2,3,4,5,6] (0 = Sunday)
  stockQuantity: number;
  refillThreshold: number;
  active: boolean;
  startDate: string;
  endDate?: string;
  instructionsNote?: string;
  iconType?: string;
}

export interface ScheduledDose {
  id: string;
  patientId: string;
  medicineId: string;
  medicineName: string;
  dosage: string;
  dosageForm: DosageForm;
  foodInstruction: FoodInstruction;
  colorTag: string;
  scheduledDate: string; // YYYY-MM-DD
  scheduledTime: string; // HH:mm
  status: DoseStatus;
  confirmedAt?: string;
  confirmedMethod?: 'elderly_one_tap' | 'caregiver_manual' | 'voice_command';
  escalatedAt?: string;
  escalationLevel?: 'none' | 'caregiver_alert' | 'emergency_alert' | 'doctor_alert';
  notes?: string;
}

export interface ChatMessage {
  id: string;
  patientId: string;
  sender: 'caregiver' | 'elderly' | 'system';
  senderName: string;
  text: string;
  timestamp: string;
  isAudio?: boolean;
  isAutoReply?: boolean;
  read: boolean;
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorName: string;
  clinic: string;
  date: string;
  diagnosis: string;
  medicinesList: string[];
  imageUrl?: string;
  notes?: string;
}

export interface LabReport {
  id: string;
  patientId: string;
  testName: string;
  category: 'Blood' | 'Lipid' | 'Diabetes' | 'Kidney' | 'General';
  labName: string;
  date: string;
  resultSummary: string;
  abnormalFlags: boolean;
  keyValues: {
    metric: string;
    value: string;
    unit: string;
    referenceRange: string;
    isAbnormal: boolean;
  }[];
  fileUrl?: string;
}

export interface HealthTip {
  id: string;
  title: Record<Language, string>;
  category: 'hypertension' | 'diabetes' | 'hydration' | 'sleep' | 'general';
  content: Record<Language, string>;
  source: string;
  verifiedBy: string;
  updatedDate: string;
}

export interface NotificationEvent {
  id: string;
  patientId: string;
  patientName: string;
  type: 'dose_taken' | 'dose_due' | 'dose_missed' | 'escalation' | 'refill_alert' | 'message';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface RefillRecord {
  id: string;
  medicineId: string;
  medicineName: string;
  patientId: string;
  addedQuantity: number;
  previousQuantity: number;
  newQuantity: number;
  date: string;
  note?: string;
}

export interface CaregiverSettings {
  name: string;
  phone: string;
  email: string;
  awayMode: boolean; // Auto-reply active
  autoReplyText: string;
  gracePeriodMinutes: number; // e.g. 15 mins before marked missed
  escalationGraceMinutes: number; // e.g. 30 mins before escalating to doctor
  notifyBrowser: boolean;
  notifySound: boolean;
  notifySmsFallback: boolean; // Simulated SMS integration
  notifyIvrCall: boolean; // Simulated IVR phone call
  smsApiKeyConfigured: boolean;
}
