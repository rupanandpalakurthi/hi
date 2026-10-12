// Web Audio API Synthesizer and Web Speech API service for accessible alerts

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

/**
 * Plays a cheerful ascending chime when a medicine dose is taken
 */
export function playSuccessChime() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);

      gain.gain.setValueAtTime(0, now + idx * 0.1);
      gain.gain.linearRampToValueAtTime(0.25, now + idx * 0.1 + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.4);
    });
  } catch (e) {
    console.warn('Audio play failed:', e);
  }
}

/**
 * Plays a pleasant but noticeable medicine reminder chime sequence
 */
let alarmIntervalId: ReturnType<typeof setInterval> | null = null;

export function startMedicineAlarm(volume = 0.8): () => void {
  stopMedicineAlarm();
  try {
    const playChimeSequence = () => {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      // Gentle 3-pulse medical reminder: 587Hz (D5), 880Hz (A5), 784Hz (G5)
      const freqs = [587.33, 880.00, 783.99];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.2);

        gain.gain.setValueAtTime(0, now + idx * 0.2);
        gain.gain.linearRampToValueAtTime(0.3 * (volume / 100 || 0.3), now + idx * 0.2 + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.2 + 0.4);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + idx * 0.2);
        osc.stop(now + idx * 0.2 + 0.45);
      });
    };

    playChimeSequence();
    alarmIntervalId = setInterval(playChimeSequence, 3500);
  } catch (e) {
    console.warn('Alarm audio error:', e);
  }

  return stopMedicineAlarm;
}

export function stopMedicineAlarm() {
  if (alarmIntervalId) {
    clearInterval(alarmIntervalId);
    alarmIntervalId = null;
  }
}

/**
 * Plays a discrete ping notification for caregiver
 */
export function playNotificationPing() {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.15);

    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.25);
  } catch (e) {
    console.warn('Ping error:', e);
  }
}

/**
 * Speaks text out loud using browser SpeechSynthesis with language localization
 */
export function speakText(text: string, language: 'en' | 'hi' | 'te' = 'en', onEnd?: () => void) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any ongoing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.88; // Slightly slower, clear pace for elderly listeners
    utterance.pitch = 1.05;

    // Pick language tag
    let langTag = 'en-IN';
    if (language === 'hi') langTag = 'hi-IN';
    if (language === 'te') langTag = 'te-IN';
    utterance.lang = langTag;

    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang.startsWith(langTag.split('-')[0]));
    if (matchedVoice) {
      utterance.voice = matchedVoice;
    }

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (e) {
    console.warn('Text-to-speech error:', e);
  }
}

export function stopSpeech() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
