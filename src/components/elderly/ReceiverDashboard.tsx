import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { ElderlyTopBar } from './ElderlyTopBar';
import { translations, getFoodInstructionLabel, getDoseStatusLabel } from '../../utils/translations';
import { 
  CheckCircle2, Clock, Volume2, VolumeX, MessageSquare, 
  HelpCircle, Sparkles, AlertCircle, Calendar, Pill, ShieldCheck, 
  Send, Phone, Heart, ArrowRight
} from 'lucide-react';
import { ScheduledDose } from '../../types';
import { VoiceTranscriptionRecorder } from '../ai/VoiceTranscriptionRecorder';

export const ReceiverDashboard: React.FC = () => {
  const { 
    activePatient, scheduledDoses, confirmDose, language, 
    isAlarmRinging, stopAlarm, speakMedicineInstructions, 
    isSpeaking, stopSpeakingAudio, sendChatMessage, chatMessages
  } = useApp();

  const [currentTime, setCurrentTime] = useState(new Date());
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [confirmedDoseName, setConfirmedDoseName] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [chatInputText, setChatInputText] = useState('');

  const t = translations[language] || translations.en;

  // Real-time clock update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Filter today's doses for this patient
  const patientDoses = scheduledDoses.filter(d => d.patientId === activePatient.id);

  // Find the primary due or next upcoming dose
  const activeDueDose = patientDoses.find(d => d.status === 'due' || d.status === 'awaiting_confirmation')
    || patientDoses.find(d => d.status === 'upcoming')
    || patientDoses[patientDoses.length - 1];

  const handleTakeMedicine = (dose: ScheduledDose) => {
    if (dose.status === 'taken') return;
    setConfirmedDoseName(dose.medicineName);
    confirmDose(dose.id, 'elderly_one_tap');
    setShowConfirmationModal(true);
  };

  const handleVoiceReadAloud = (dose: ScheduledDose) => {
    if (isSpeaking) {
      stopSpeakingAudio();
    } else {
      speakMedicineInstructions(dose);
    }
  };

  const handleSendChat = (text: string) => {
    if (!text.trim()) return;
    sendChatMessage(text, 'elderly');
    setChatInputText('');
  };

  // Font size styling modifier
  const textScaleClass = activePatient.fontSize === 'xl' 
    ? 'text-2xl sm:text-3xl' 
    : activePatient.fontSize === 'large' 
      ? 'text-xl sm:text-2xl' 
      : 'text-lg sm:text-xl';

  const titleScaleClass = activePatient.fontSize === 'xl' 
    ? 'text-4xl sm:text-5xl font-black' 
    : activePatient.fontSize === 'large' 
      ? 'text-3xl sm:text-4xl font-extrabold' 
      : 'text-2xl sm:text-3xl font-bold';

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-900 pb-16 ${activePatient.highContrast ? 'high-contrast' : ''}`}>
      <ElderlyTopBar />

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Urgent Alarm Banner if Ringing */}
        {isAlarmRinging && (
          <div className="bg-rose-600 text-white p-5 rounded-3xl shadow-xl flex flex-wrap items-center justify-between gap-4 animate-bounce">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <Volume2 className="w-7 h-7 text-white animate-pulse" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black">
                  {language === 'hi' ? 'दवा का समय हो गया है!' : language === 'te' ? 'మందు వేసుకునే సమయం అయింది!' : 'Time for Your Medicine!'}
                </h2>
                <p className="text-sm text-rose-100 font-medium">
                  {language === 'hi' ? 'कृपया अपनी गोली लें और नीचे हरा बटन दबाएं' : 'Please take your scheduled tablet and tap the green button below'}
                </p>
              </div>
            </div>
            <button
              onClick={stopAlarm}
              className="bg-white text-rose-700 px-5 py-2.5 rounded-2xl font-black text-sm hover:bg-rose-50 shadow-md transition"
            >
              {language === 'hi' ? 'अलार्म बंद करें' : 'Silence Sound'}
            </button>
          </div>
        )}

        {/* Date & Big Clear Clock */}
        <section aria-label="Current Date and Time" className="bg-gradient-to-r from-teal-800 to-teal-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 translate-x-12 -translate-y-8 w-64 h-64 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-teal-300 font-semibold text-sm sm:text-base">
                <Calendar className="w-5 h-5" />
                <span>
                  {currentTime.toLocaleDateString(language === 'hi' ? 'hi-IN' : language === 'te' ? 'te-IN' : 'en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
              <p className="text-slate-300 text-xs sm:text-sm mt-1">
                {language === 'hi' ? 'आपका स्वास्थ्य, हमारा संकल्प' : language === 'te' ? 'మీ ఆరోగ్యం, మీ కుటుంబ శ్రేయస్సు' : 'Carefully monitored with love by your family'}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl sm:text-5xl font-mono font-black tracking-wider text-teal-200">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </div>
              <div className="text-xs text-teal-300 font-semibold mt-1">
                {activePatient.city} Local Time
              </div>
            </div>
          </div>
        </section>

        {/* Hero Card: Primary Next / Due Dose */}
        {activeDueDose && (
          <div className={`bg-white rounded-3xl border-4 ${
            activeDueDose.status === 'taken' 
              ? 'border-emerald-300 shadow-emerald-100' 
              : activeDueDose.status === 'due' 
                ? 'border-amber-400 shadow-amber-200 shadow-xl ring-4 ring-amber-300/40' 
                : 'border-teal-200 shadow-lg'
          } p-6 sm:p-8 transition-all`}>
            
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className={`px-4 py-1.5 rounded-full text-sm sm:text-base font-extrabold uppercase tracking-wide ${
                  activeDueDose.status === 'taken'
                    ? 'bg-emerald-100 text-emerald-800'
                    : activeDueDose.status === 'due'
                      ? 'bg-amber-100 text-amber-900 animate-pulse'
                      : 'bg-teal-100 text-teal-900'
                }`}>
                  {getDoseStatusLabel(activeDueDose.status, language)}
                </span>
                <span className="text-sm font-semibold text-slate-500">
                  {t.scheduledAt}: <strong className="text-slate-900 font-bold">{activeDueDose.scheduledTime}</strong>
                </span>
              </div>

              {/* Read Aloud Button */}
              <button
                onClick={() => handleVoiceReadAloud(activeDueDose)}
                className={`px-4 py-2 rounded-2xl font-bold text-sm sm:text-base flex items-center gap-2 transition ${
                  isSpeaking
                    ? 'bg-rose-100 text-rose-800 border-2 border-rose-300 animate-pulse'
                    : 'bg-teal-50 text-teal-800 border-2 border-teal-200 hover:bg-teal-100'
                }`}
                title="Speak dose instructions out loud"
              >
                {isSpeaking ? (
                  <>
                    <VolumeX className="w-5 h-5 text-rose-600" />
                    <span>{t.stopVoice}</span>
                  </>
                ) : (
                  <>
                    <Volume2 className="w-5 h-5 text-teal-700" />
                    <span>{t.readAloud}</span>
                  </>
                )}
              </button>
            </div>

            {/* Medicine Details */}
            <div className="flex items-start gap-4 sm:gap-6 mb-6">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg"
                style={{ backgroundColor: activeDueDose.colorTag || '#0d9488' }}
              >
                <Pill className="w-9 h-9 sm:w-11 sm:h-11" />
              </div>
              <div className="space-y-1.5">
                <h3 className={titleScaleClass + ' text-slate-900'}>
                  {activeDueDose.medicineName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm sm:text-lg text-slate-700 font-medium">
                  <span className="bg-slate-100 px-3 py-1 rounded-lg font-bold text-slate-800">
                    {activeDueDose.dosage} ({activeDueDose.dosageForm.toUpperCase()})
                  </span>
                  <span className="text-teal-800 font-bold bg-teal-50 px-3 py-1 rounded-lg border border-teal-100">
                    {getFoodInstructionLabel(activeDueDose.foodInstruction, language)}
                  </span>
                </div>
                {activeDueDose.notes && (
                  <p className="text-slate-600 text-sm sm:text-base italic pt-1">
                    ℹ️ {activeDueDose.notes}
                  </p>
                )}
              </div>
            </div>

            {/* Giant TAKEN MEDICINE button */}
            {activeDueDose.status === 'taken' ? (
              <div className="w-full bg-emerald-50 border-3 border-emerald-300 rounded-3xl p-6 text-center text-emerald-800 flex items-center justify-center gap-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                <div className="text-left">
                  <div className="text-xl sm:text-2xl font-extrabold text-emerald-900">
                    {t.alreadyTaken}
                  </div>
                  <div className="text-sm sm:text-base text-emerald-700 font-semibold">
                    {language === 'hi' 
                      ? 'पुष्टि परिवार को भेजी जा चुकी है। धन्यवाद!' 
                      : language === 'te' 
                        ? 'నిర్ధారణ సమాచారం కుటుంబానికి చేరింది. ధన్యవాదాలు!' 
                        : 'Your confirmation was sent to family. Thank you!'}
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={() => handleTakeMedicine(activeDueDose)}
                className="w-full py-6 sm:py-8 px-6 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white rounded-3xl font-black text-2xl sm:text-4xl shadow-xl shadow-emerald-600/30 border-4 border-emerald-400 flex items-center justify-center gap-4 transition-all cursor-pointer group"
              >
                <CheckCircle2 className="w-10 h-10 sm:w-14 sm:h-14 group-hover:scale-110 transition-transform text-white" />
                <span>{t.takeMedicineBtn}</span>
              </button>
            )}

            {/* Reassurance text */}
            <div className="mt-4 text-center text-xs sm:text-sm text-slate-500 font-medium flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>
                {language === 'hi' 
                  ? 'यह बटन दबाते ही आपके बेटे/बेटी को तुरंत सूचना मिल जाएगी' 
                  : language === 'te' 
                    ? 'ఈ బటన్ నొక్కగానే మీ కుటుంబ సభ్యులకు వెంటనే సమాచారం వెళ్తుంది' 
                    : 'Tapping this instantly notifies your family caregiver'}
              </span>
            </div>
          </div>
        )}

        {/* Quick Family Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => setShowChatModal(true)}
            className="bg-white hover:bg-teal-50 border-2 border-teal-200 rounded-3xl p-5 shadow-sm flex items-center justify-between text-left transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-teal-100 text-teal-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">{t.chatWithFamily}</div>
                <div className="text-xs text-slate-500">
                  {language === 'hi' ? 'परिवार को संदेश भेजें' : language === 'te' ? 'పిల్లలకు మెసేజ్ చేయండి' : 'Send message to family'}
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-teal-600" />
          </button>

          <a
            href={`tel:${activePatient.emergencyContact.phone}`}
            className="bg-white hover:bg-rose-50 border-2 border-rose-200 rounded-3xl p-5 shadow-sm flex items-center justify-between text-left transition group"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-rose-100 text-rose-800 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-slate-900">{t.emergencyHelp}</div>
                <div className="text-xs text-slate-500">
                  {activePatient.emergencyContact.name} ({activePatient.emergencyContact.phone})
                </div>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-rose-600" />
          </a>
        </div>

        {/* Today's Full Medicine Routine */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
          <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-4 flex items-center gap-2">
            <Clock className="w-6 h-6 text-teal-700" />
            <span>{t.todaysMedicines}</span>
          </h4>

          <div className="space-y-3">
            {patientDoses.map((dose) => (
              <div
                key={dose.id}
                className={`p-4 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-3 transition ${
                  dose.status === 'taken'
                    ? 'bg-emerald-50/70 border-emerald-200'
                    : dose.status === 'due'
                      ? 'bg-amber-50/70 border-amber-300'
                      : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0 font-bold"
                    style={{ backgroundColor: dose.colorTag || '#0d9488' }}
                  >
                    <Pill className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-extrabold text-base sm:text-lg text-slate-900">
                      {dose.medicineName}
                    </div>
                    <div className="text-xs sm:text-sm text-slate-600 font-semibold flex items-center gap-2">
                      <span>{dose.scheduledTime}</span>
                      <span>•</span>
                      <span>{getFoodInstructionLabel(dose.foodInstruction, language)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-3 py-1 rounded-xl text-xs sm:text-sm font-bold ${
                    dose.status === 'taken'
                      ? 'bg-emerald-200 text-emerald-900'
                      : dose.status === 'due'
                        ? 'bg-amber-200 text-amber-900'
                        : 'bg-slate-100 text-slate-700'
                  }`}>
                    {getDoseStatusLabel(dose.status, language)}
                  </span>

                  {dose.status !== 'taken' && (
                    <button
                      onClick={() => handleTakeMedicine(dose)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-sm transition"
                    >
                      {t.takeMedicineBtn}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Doctor and Clinic Info for Senior peace of mind */}
        <div className="bg-teal-50 border border-teal-200 rounded-3xl p-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-xs uppercase font-bold text-teal-800 tracking-wider">
              {language === 'hi' ? 'आपके डॉक्टर' : language === 'te' ? 'మీ వైద్యుడు' : 'Your Clinician'}
            </div>
            <div className="text-lg font-extrabold text-slate-900">
              {activePatient.doctorContact.name}
            </div>
            <div className="text-xs text-slate-600 font-medium">
              {activePatient.doctorContact.specialty} • {activePatient.doctorContact.clinic}
            </div>
          </div>
          <a
            href={`tel:${activePatient.doctorContact.phone}`}
            className="px-4 py-2 bg-white text-teal-800 font-bold text-xs rounded-xl border border-teal-300 hover:bg-teal-100 transition flex items-center gap-1.5 shadow-sm"
          >
            <Phone className="w-4 h-4 text-teal-600" />
            <span>{activePatient.doctorContact.phone}</span>
          </a>
        </div>
      </main>

      {/* Confirmation Success Modal */}
      {showConfirmationModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-center space-y-4 shadow-2xl border-4 border-emerald-400 animate-in fade-in zoom-in duration-200">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {t.confirmationSuccessTitle}
            </h3>
            <p className="text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
              {t.confirmationSuccessMsg}
            </p>
            <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-800 text-sm font-bold border border-emerald-200">
              ✅ {confirmedDoseName} recorded safely.
            </div>
            <button
              onClick={() => setShowConfirmationModal(false)}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg shadow-emerald-600/30 transition"
            >
              {t.close}
            </button>
          </div>
        </div>
      )}

      {/* Simplified Elderly Chat Modal */}
      {showChatModal && (
        <div className="fixed inset-0 bg-slate-900/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-teal-700" />
                <h3 className="text-xl font-bold text-slate-900">{t.chatWithFamily}</h3>
              </div>
              <button
                onClick={() => setShowChatModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Quick replies for seniors */}
            <div className="space-y-1">
              <div className="text-xs text-slate-500 font-semibold">
                {language === 'hi' ? 'त्वरित संदेश (एक क्लिक में भेजें):' : 'One-Tap Quick Messages:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {t.quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSendChat(reply)}
                    className="px-3 py-1.5 bg-teal-50 hover:bg-teal-100 text-teal-800 rounded-xl text-xs font-semibold border border-teal-200 transition"
                  >
                    💬 {reply}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto space-y-3 p-2 bg-slate-50 rounded-2xl border min-h-[220px]">
              {chatMessages.filter(m => m.patientId === activePatient.id).map(msg => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'elderly' ? 'items-end' : 'items-start'}`}
                >
                  <div className={`max-w-[85%] p-3.5 rounded-2xl text-sm font-medium ${
                    msg.sender === 'elderly'
                      ? 'bg-teal-700 text-white rounded-br-none shadow-sm'
                      : msg.isAutoReply
                        ? 'bg-amber-100 text-amber-950 border border-amber-300 rounded-bl-none'
                        : 'bg-white text-slate-800 border rounded-bl-none shadow-sm'
                  }`}>
                    <div className="text-[10px] font-bold opacity-75 mb-0.5">
                      {msg.senderName}
                    </div>
                    <div>{msg.text}</div>
                  </div>
                  <span className="text-[10px] text-slate-400 mt-0.5 px-1">{msg.timestamp}</span>
                </div>
              ))}
            </div>

            {/* Input Bar with Audio Microphone Transcription */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendChat(chatInputText); }} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={chatInputText}
                  onChange={(e) => setChatInputText(e.target.value)}
                  placeholder={language === 'hi' ? 'बोलें या संदेश लिखें...' : language === 'te' ? 'మాట్లాడండి లేదా టైప్ చేయండి...' : t.typeMessage}
                  className="flex-1 px-4 py-3 rounded-2xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-teal-500 text-base font-medium"
                />
                <button
                  type="submit"
                  className="px-5 py-3 bg-teal-700 hover:bg-teal-600 text-white rounded-2xl font-bold flex items-center gap-1.5 transition"
                >
                  <Send className="w-4 h-4" />
                  <span>{t.send}</span>
                </button>
              </div>

              {/* Voice Input Assistant with gemini-3.5-transcribe */}
              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <VoiceTranscriptionRecorder
                  title={language === 'hi' ? 'बोलकर संदेश भेजें (आवाज़ पहचान)' : language === 'te' ? 'వాయిస్ ద్వారా మెసేజ్ చేయండి' : 'Voice Message Transcription'}
                  placeholder={language === 'hi' ? 'माइक दबाकर बोलें, आपकी आवाज़ अपने आप टाइप हो जाएगी।' : 'Tap mic and speak, your voice will be converted to text.'}
                  onTranscriptionComplete={(text) => {
                    setChatInputText(text);
                  }}
                />
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
