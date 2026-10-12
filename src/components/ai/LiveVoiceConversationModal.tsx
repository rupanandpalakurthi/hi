import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, Mic, MicOff, Volume2, X, PhoneCall, 
  Sparkles, AlertCircle, Loader2, Heart, ShieldCheck 
} from 'lucide-react';

interface LiveVoiceConversationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LiveVoiceConversationModal: React.FC<LiveVoiceConversationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { activePatient } = useApp();

  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [liveTranscriptNotes, setLiveTranscriptNotes] = useState<string[]>([]);

  const wsRef = useRef<WebSocket | null>(null);
  const inputAudioCtxRef = useRef<AudioContext | null>(null);
  const outputAudioCtxRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const nextStartTimeRef = useRef<number>(0);

  const handleDisconnect = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioCtxRef.current) {
      inputAudioCtxRef.current.close().catch(() => {});
      inputAudioCtxRef.current = null;
    }
    if (outputAudioCtxRef.current) {
      outputAudioCtxRef.current.close().catch(() => {});
      outputAudioCtxRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
    nextStartTimeRef.current = 0;
  }, []);

  useEffect(() => {
    if (!isOpen) {
      handleDisconnect();
    }
    return () => {
      handleDisconnect();
    };
  }, [isOpen, handleDisconnect]);

  if (!isOpen) return null;

  // Float32 PCM to 16-bit PCM Base64 string
  const pcmToBase64 = (float32Array: Float32Array): string => {
    const int16Array = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      int16Array[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    const bytes = new Uint8Array(int16Array.buffer);
    let binary = '';
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  };

  // Play incoming 24kHz raw PCM chunk
  const playAudioChunk = (audioCtx: AudioContext, base64Audio: string) => {
    try {
      const binaryString = atob(base64Audio);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const int16 = new Int16Array(bytes.buffer);
      const float32 = new Float32Array(int16.length);
      for (let i = 0; i < int16.length; i++) {
        float32[i] = int16[i] / 32768.0;
      }

      const buffer = audioCtx.createBuffer(1, float32.length, 24000);
      buffer.getChannelData(0).set(float32);

      const source = audioCtx.createBufferSource();
      source.buffer = buffer;
      source.connect(audioCtx.destination);

      const currentTime = audioCtx.currentTime;
      if (nextStartTimeRef.current < currentTime) {
        nextStartTimeRef.current = currentTime;
      }

      source.start(nextStartTimeRef.current);
      nextStartTimeRef.current += buffer.duration;
      setIsSpeaking(true);

      source.onended = () => {
        if (audioCtx.currentTime >= nextStartTimeRef.current - 0.05) {
          setIsSpeaking(false);
        }
      };
    } catch (e) {
      console.warn('Playback error:', e);
    }
  };

  const handleConnect = async () => {
    try {
      setErrorMsg('');
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/api/live`;

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      // Audio contexts
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      const inputCtx = new AudioCtxClass({ sampleRate: 16000 });
      const outputCtx = new AudioCtxClass({ sampleRate: 24000 });
      inputAudioCtxRef.current = inputCtx;
      outputAudioCtxRef.current = outputCtx;

      ws.onopen = async () => {
        setIsConnected(true);
        setLiveTranscriptNotes(prev => [...prev, 'Connected to live voice session.']);

        // Start mic stream
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          mediaStreamRef.current = stream;

          const source = inputCtx.createMediaStreamSource(stream);
          const processor = inputCtx.createScriptProcessor(4096, 1, 1);
          processorRef.current = processor;

          source.connect(processor);
          processor.connect(inputCtx.destination);

          processor.onaudioprocess = (e) => {
            if (ws.readyState === WebSocket.OPEN && !isMuted) {
              const base64 = pcmToBase64(e.inputBuffer.getChannelData(0));
              ws.send(JSON.stringify({ audio: base64 }));
            }
          };
        } catch {
          setErrorMsg('Microphone access is unavailable or was denied. Please allow microphone permissions.');
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          if (msg.audio && outputAudioCtxRef.current) {
            playAudioChunk(outputAudioCtxRef.current, msg.audio);
          }
          if (msg.interrupted) {
            nextStartTimeRef.current = 0;
            setIsSpeaking(false);
          }
          if (msg.error) {
            setErrorMsg(msg.error);
          }
        } catch (e) {
          console.error('Error handling live message:', e);
        }
      };

      ws.onerror = (e) => {
        console.error('Live WebSocket error:', e);
        setErrorMsg('Live Voice connection error. Check server logs.');
      };

      ws.onclose = () => {
        setIsConnected(false);
        setIsSpeaking(false);
      };

    } catch (err: any) {
      console.error('Live connect failed:', err);
      setErrorMsg(err.message || 'Microphone or WebSocket connection failed.');
      setIsConnected(false);
    }
  };


  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border-2 border-teal-500/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 text-white space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow backdrop */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500 text-slate-950 flex items-center justify-center font-bold shadow-lg shadow-teal-500/20">
              <Radio className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Live Voice Consultation</h3>
                <span className="text-[10px] bg-teal-500/20 text-teal-300 font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                  Real-Time
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Bidirectional hands-free voice consultation
              </p>
            </div>
          </div>

          <button
            onClick={() => { handleDisconnect(); onClose(); }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Visual Pulse Waveform */}
        <div className="py-8 flex flex-col items-center justify-center space-y-4">
          <div className={`relative w-36 h-36 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
            isSpeaking 
              ? 'border-teal-400 shadow-2xl shadow-teal-400/50 scale-110' 
              : isConnected 
                ? 'border-emerald-500 shadow-lg shadow-emerald-500/30 animate-pulse' 
                : 'border-slate-700 bg-slate-800/40'
          }`}>
            <div className={`w-28 h-28 rounded-full flex items-center justify-center transition-colors ${
              isSpeaking ? 'bg-teal-500 text-slate-950' : isConnected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
            }`}>
              {isSpeaking ? (
                <Volume2 className="w-12 h-12 animate-bounce" />
              ) : (
                <Mic className="w-12 h-12" />
              )}
            </div>
          </div>

          <div className="text-center space-y-1">
            <div className="text-base font-extrabold text-white">
              {isSpeaking ? 'Assistant is speaking...' : isConnected ? 'Listening to your voice...' : 'Ready to start live voice call'}
            </div>
            <div className="text-xs text-slate-400">
              {isConnected ? `Conversing with ${activePatient.name}'s caregiver assistant` : 'Click Start Voice Call to connect in real-time'}
            </div>
          </div>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-500/20 border border-rose-400/30 rounded-2xl text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          {!isConnected ? (
            <button
              onClick={handleConnect}
              className="px-8 py-4 bg-teal-500 hover:bg-teal-400 text-slate-950 rounded-2xl font-black text-sm shadow-xl shadow-teal-500/30 flex items-center gap-2 transition"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Start Live Voice Call</span>
            </button>
          ) : (
            <>
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-3.5 rounded-2xl font-bold transition flex items-center gap-2 text-xs border ${
                  isMuted 
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                    : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                <span>{isMuted ? 'Muted' : 'Mute Mic'}</span>
              </button>

              <button
                onClick={handleDisconnect}
                className="px-6 py-3.5 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-lg transition"
              >
                <span>End Call</span>
              </button>
            </>
          )}
        </div>

        <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1.5 pt-2 border-t border-slate-800">
          <ShieldCheck className="w-3.5 h-3.5 text-teal-400" />
          <span>Real-time PCM stream over low-latency WebSocket connection</span>
        </div>

      </div>
    </div>
  );
};
