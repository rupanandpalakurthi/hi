import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Check, Copy, Volume2, Sparkles, AlertCircle } from 'lucide-react';
import { transcribeAudioWithGemini } from '../../services/aiChat';

interface VoiceTranscriptionRecorderProps {
  onTranscriptionComplete?: (text: string) => void;
  title?: string;
  placeholder?: string;
}

export const VoiceTranscriptionRecorder: React.FC<VoiceTranscriptionRecorderProps> = ({
  onTranscriptionComplete,
  title = 'Voice Speech-to-Text Transcription',
  placeholder = 'Speak to transcribe medicine notes, symptoms, or caregiver voice messages...'
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedText, setTranscribedText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copied, setCopied] = useState(false);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startRecording = async () => {
    try {
      setErrorMessage('');
      setTranscribedText('');
      audioChunksRef.current = [];

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        // Stop audio tracks
        stream.getTracks().forEach(track => track.stop());

        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await handleProcessAudio(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } catch (err: any) {
      console.warn('Microphone access:', err);
      setErrorMessage('Microphone access was denied or is unavailable. Please check browser permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  const handleProcessAudio = async (blob: Blob) => {
    setIsTranscribing(true);
    try {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        if (!base64Data) {
          throw new Error('Failed to encode audio file.');
        }

        const transcript = await transcribeAudioWithGemini(base64Data, 'audio/webm');
        setTranscribedText(transcript);
        if (onTranscriptionComplete) {
          onTranscriptionComplete(transcript);
        }
        setIsTranscribing(false);
      };
      reader.readAsDataURL(blob);
    } catch (err: any) {
      setIsTranscribing(false);
      setErrorMessage(err.message || 'Transcription failed.');
    }
  };

  const handleCopy = () => {
    if (!transcribedText) return;
    navigator.clipboard.writeText(transcribedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
            <Mic className="w-4 h-4" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm text-slate-900">{title}</h4>
            <span className="text-[10px] text-teal-700 font-bold bg-teal-50 px-2 py-0.5 rounded">
              Model: gemini-3.5-transcribe
            </span>
          </div>
        </div>

        {isRecording && (
          <div className="flex items-center gap-2 text-rose-600 font-mono text-xs font-bold animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
            <span>Recording: {recordingSeconds}s</span>
          </div>
        )}
      </div>

      <p className="text-xs text-slate-500">
        {placeholder}
      </p>

      {/* Record Action Bar */}
      <div className="flex items-center gap-3">
        {!isRecording ? (
          <button
            onClick={startRecording}
            disabled={isTranscribing}
            className="px-5 py-2.5 bg-teal-700 hover:bg-teal-600 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition disabled:opacity-50"
          >
            <Mic className="w-4 h-4" />
            <span>Start Voice Recording</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-md animate-pulse transition"
          >
            <Square className="w-4 h-4" />
            <span>Stop & Transcribe Audio</span>
          </button>
        )}

        {isTranscribing && (
          <div className="flex items-center gap-2 text-xs font-bold text-teal-800">
            <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
            <span>gemini-3.5-transcribe is processing speech...</span>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Transcription Output */}
      {transcribedText && (
        <div className="p-4 bg-teal-50/70 border border-teal-200 rounded-2xl space-y-2 animate-in fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-teal-900 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span>Transcribed Output</span>
            </span>
            <button
              onClick={handleCopy}
              className="px-2.5 py-1 bg-white hover:bg-teal-50 border border-teal-200 rounded-lg text-[11px] font-bold text-slate-700 flex items-center gap-1 transition"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>
          </div>
          <p className="text-xs sm:text-sm text-slate-800 font-semibold leading-relaxed">
            "{transcribedText}"
          </p>
        </div>
      )}
    </div>
  );
};
