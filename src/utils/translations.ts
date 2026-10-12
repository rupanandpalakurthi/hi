import { Language, FoodInstruction, DoseStatus } from '../types';

export const translations = {
  en: {
    appName: 'Sehat Saathi',
    tagline: 'AI-Powered Medicine Adherence Companion for Elderly Care',
    caregiverPortal: 'Caregiver Portal',
    elderlyPortal: 'Elderly Portal',
    switchPortal: 'Switch Portal',
    demoControls: 'Simulation & Demo Lab',
    
    // Navigation
    dashboard: 'Dashboard',
    patients: 'Family Members',
    medicines: 'Medicines',
    schedule: 'Schedule & Alarms',
    adherence: 'Adherence Reports',
    prescriptions: 'Prescriptions',
    labReports: 'Lab Reports',
    chat: 'Family Chat',
    healthTips: 'Health Tips & AI',
    alerts: 'Alerts & Escalations',
    refills: 'Refill Tracker',
    settings: 'Settings',

    // Elderly Dashboard
    namaste: 'Namaste',
    nextMedicine: 'Next Medicine',
    todaysMedicines: 'Today\'s Medicines',
    scheduledAt: 'Scheduled At',
    takeWith: 'Instructions',
    liveCountdown: 'Time Remaining',
    takeMedicineBtn: 'TAKEN MEDICINE',
    confirming: 'Recording Confirmation...',
    alreadyTaken: 'Already Taken for this slot',
    readAloud: 'Read Aloud (Voice)',
    stopVoice: 'Stop Voice',
    chatWithFamily: 'Chat with Family',
    emergencyHelp: 'Call Family (SOS)',
    fontSizeToggle: 'Text Size',
    highContrast: 'High Contrast',
    soundAlerts: 'Sound Alert',
    
    // Statuses
    status_upcoming: 'Upcoming',
    status_due: 'Due Now',
    status_awaiting_confirmation: 'Awaiting Confirmation',
    status_taken: 'Taken',
    status_missed: 'Missed',
    status_escalated: 'Doctor Escalated',
    status_skipped: 'Skipped',
    status_cancelled: 'Cancelled',

    // Food instructions
    food_before_food: 'Before Food (खाली पेट)',
    food_after_food: 'After Food (भोजन के बाद)',
    food_with_food: 'With Food (भोजन के साथ)',
    food_empty_stomach: 'Empty Stomach (सुबह खाली पेट)',
    food_anytime: 'Anytime',

    // Elderly confirmation reassuring modal
    confirmationSuccessTitle: 'Well Done!',
    confirmationSuccessMsg: 'Your medicine confirmation has been sent to your family. They know you have taken it safely.',
    close: 'Close',

    // Caregiver metrics
    totalPatients: 'Connected Seniors',
    scheduledToday: 'Scheduled Today',
    dosesTakenToday: 'Doses Taken',
    awaitingConfirmation: 'Awaiting Confirmation',
    missedDoses: 'Missed Doses',
    adherenceRate: 'Adherence Rate',
    nextDueDose: 'Next Upcoming Dose',
    recentConfirmations: 'Live Dose Confirmations',
    
    // Chat
    typeMessage: 'Type message to family...',
    send: 'Send',
    caregiverAwayNotice: 'Family is currently away. Auto-reply is active.',
    quickReplies: [
      'I took my medicine with water',
      'Please call me when you are free',
      'Feeling good today',
      'I need a refill soon'
    ]
  },
  hi: {
    appName: 'सेहत साथी',
    tagline: 'बुजुर्गों की देखभाल और दवा समय पर लेने का सच्चा साथी',
    caregiverPortal: 'केयरगिवर पोर्टल',
    elderlyPortal: 'बुजुर्ग साथी पोर्टल',
    switchPortal: 'पोर्टल बदलें',
    demoControls: 'सिमुलेशन और टेस्ट लैब',

    // Navigation
    dashboard: 'डैशबोर्ड',
    patients: 'परिवार के सदस्य',
    medicines: 'दवाइयाँ',
    schedule: 'समय सारणी व अलार्म',
    adherence: 'दवा रिपोर्ट व ट्रैकिंग',
    prescriptions: 'डॉक्टर पर्चे (प्रिस्क्रिप्शन)',
    labReports: 'लैब रिपोर्ट',
    chat: 'परिवार से बातचीत',
    healthTips: 'स्वास्थ्य सुझाव व AI',
    alerts: 'अलर्ट और सूचनाएं',
    refills: 'दवा स्टॉक व रीफिल',
    settings: 'सेटिंग्स',

    // Elderly Dashboard
    namaste: 'नमस्ते',
    nextMedicine: 'अगली दवा का समय',
    todaysMedicines: 'आज की सभी दवाइयाँ',
    scheduledAt: 'निर्धारित समय',
    takeWith: 'निर्देश',
    liveCountdown: 'बचा हुआ समय',
    takeMedicineBtn: 'दवा ले ली (TAKEN)',
    confirming: 'दर्ज हो रहा है...',
    alreadyTaken: 'यह दवा ली जा चुकी है',
    readAloud: 'बोलकर सुनाएं (आवाज़)',
    stopVoice: 'आवाज़ रोकें',
    chatWithFamily: 'परिवार से संदेश',
    emergencyHelp: 'परिवार को कॉल करें (SOS)',
    fontSizeToggle: 'अक्षर का आकार',
    highContrast: 'हाई कंट्रास्ट',
    soundAlerts: 'अलार्म आवाज़',

    // Statuses
    status_upcoming: 'आने वाली है',
    status_due: 'अभी लेने का समय',
    status_awaiting_confirmation: 'पुष्टि की प्रतीक्षा',
    status_taken: 'ले ली गई',
    status_missed: 'छूट गई',
    status_escalated: 'डॉक्टर को सूचित',
    status_skipped: 'छोड़ दी गई',
    status_cancelled: 'रद्द',

    // Food instructions
    food_before_food: 'भोजन से पहले (खाली पेट)',
    food_after_food: 'भोजन के बाद',
    food_with_food: 'भोजन के साथ',
    food_empty_stomach: 'सुबह खाली पेट',
    food_anytime: 'किसी भी समय',

    // Elderly confirmation modal
    confirmationSuccessTitle: 'बहुत खूब!',
    confirmationSuccessMsg: 'दवा लेने की सूचना आपके परिवार को तुरंत भेज दी गई है। वे निश्चिंत हैं।',
    close: 'बंद करें',

    // Caregiver metrics
    totalPatients: 'जुड़े हुए बुजुर्ग',
    scheduledToday: 'आज की कुल खुराक',
    dosesTakenToday: 'ली गई खुराक',
    awaitingConfirmation: 'पुष्टि प्रतीक्षित',
    missedDoses: 'छूटी हुई खुराक',
    adherenceRate: 'नियमितता दर',
    nextDueDose: 'अगली खुराक',
    recentConfirmations: 'हाल ही में ली गई दवाइयां',

    // Chat
    typeMessage: 'परिवार को संदेश लिखें...',
    send: 'भेजें',
    caregiverAwayNotice: 'परिवार के सदस्य अभी व्यस्त हैं। स्वचालित संदेश सक्रिय है।',
    quickReplies: [
      'मैंने पानी के साथ दवा ले ली है',
      'समय मिलने पर मुझे फोन करें',
      'आज सेहत बहुत अच्छी है',
      'दवाइयाँ जल्द खत्म होने वाली हैं'
    ]
  },
  te: {
    appName: 'సేహత్ సాథీ',
    tagline: 'పెద్దల సంరక్షణ & ఔషధ క్రమశిక్షణ డిజిటల్ తోడు',
    caregiverPortal: 'సంరక్షకుల పోర్టల్',
    elderlyPortal: 'పెద్దల పోర్టల్',
    switchPortal: 'పోర్టల్ మార్చు',
    demoControls: 'సిమ్యులేషన్ ల్యాబ్',

    // Navigation
    dashboard: 'డాష్‌బోర్డ్',
    patients: 'కుటుంబ సభ్యులు',
    medicines: 'మందులు',
    schedule: 'షెడ్యూల్ & అలారంలు',
    adherence: 'ఔషధ నివేదికలు',
    prescriptions: 'డాక్టర్ ప్రిస్క్రిప్షన్లు',
    labReports: 'ల్యాబ్ రిపోర్టులు',
    chat: 'కుటుంబంతో చాట్',
    healthTips: 'ఆరోగ్య సూచనలు & AI',
    alerts: 'హెచ్చరికలు & సమాచారం',
    refills: 'మందుల స్టాక్ & రీఫిల్',
    settings: 'సెట్టింగ్‌లు',

    // Elderly Dashboard
    namaste: 'నమస్కారం',
    nextMedicine: 'తదుపరి మందు',
    todaysMedicines: 'ఈ రోజు మందులు',
    scheduledAt: 'నిర్ణీత సమయం',
    takeWith: 'సూచనలు',
    liveCountdown: 'మిగిలిన సమయం',
    takeMedicineBtn: 'మందు వేసుకున్నాను (TAKEN)',
    confirming: 'నమోదు అవుతోంది...',
    alreadyTaken: 'ఇప్పటికే తీసుకున్నారు',
    readAloud: 'వినండి (వాయిస్)',
    stopVoice: 'వాయిస్ ఆపు',
    chatWithFamily: 'పిల్లలతో మాట్లాడండి',
    emergencyHelp: 'అత్యవసర కాల్ (SOS)',
    fontSizeToggle: 'అక్షరాల పరిమాణం',
    highContrast: 'హై కాంట్రాస్ట్',
    soundAlerts: 'శబ్ద హెచ్చరిక',

    // Statuses
    status_upcoming: 'రాబోయే సమయం',
    status_due: 'ఇప్పుడే వేసుకోవాలి',
    status_awaiting_confirmation: 'నిర్ధారణ కోసం వేచి ఉంది',
    status_taken: 'తీసుకున్నారు',
    status_missed: 'తీసుకోలేదు',
    status_escalated: 'డాక్టర్‌కు సమాచారం',
    status_skipped: 'వదిలివేశారు',
    status_cancelled: 'రద్దు చేయబడింది',

    // Food instructions
    food_before_food: 'భోజనానికి ముందు (ఖాళీ కడుపున)',
    food_after_food: 'భోజనం తర్వాత',
    food_with_food: 'భోజనంతో పాటు',
    food_empty_stomach: 'ఉదయం పరగడుపున',
    food_anytime: 'ఎప్పుడైనా',

    // Elderly confirmation modal
    confirmationSuccessTitle: 'చాలా మంచిది!',
    confirmationSuccessMsg: 'మీరు మందు వేసుకున్న విషయం మీ కుటుంబ సభ్యులకు చేరింది. వాళ్లు నిశ్చింతగా ఉంటారు.',
    close: 'మూసివేయి',

    // Caregiver metrics
    totalPatients: 'కనెక్ట్ అయిన పెద్దలు',
    scheduledToday: 'ఈ రోజు డోసులు',
    dosesTakenToday: 'వేసుకున్న డోసులు',
    awaitingConfirmation: 'నిర్ధారణ కావాలి',
    missedDoses: 'తప్పిపోయినవి',
    adherenceRate: 'క్రమశిక్షణ శాతం',
    nextDueDose: 'తదుపరి డోస్',
    recentConfirmations: 'తాజా డోస్ నిర్ధారణలు',

    // Chat
    typeMessage: 'సందేశం పంపండి...',
    send: 'పంపు',
    caregiverAwayNotice: 'కుటుంబ సభ్యుడు అందుబాటులో లేరు. ఆటో రిప్లై ఆన్‌లో ఉంది.',
    quickReplies: [
      'నేను నీళ్లతో మందు వేసుకున్నాను',
      'ఖాళీగా ఉన్నప్పుడు ఫోన్ చేయండి',
      'ఈ రోజు ఆరోగ్యం బాగుంది',
      'మందులు త్వరలో అయిపోతాయి'
    ]
  }
};

export function getTranslation(lang: Language, key: keyof typeof translations['en']): string {
  const dict = translations[lang] || translations.en;
  return (dict[key] as string) || (translations.en[key] as string) || key;
}

export function getFoodInstructionLabel(instruction: FoodInstruction, lang: Language): string {
  const key = `food_${instruction}` as keyof typeof translations['en'];
  return getTranslation(lang, key);
}

export function getDoseStatusLabel(status: DoseStatus, lang: Language): string {
  const key = `status_${status}` as keyof typeof translations['en'];
  return getTranslation(lang, key);
}
