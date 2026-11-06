import React, { useState, useEffect, useRef } from 'react';
import { FloatingRobotAvatar } from './FloatingRobotAvatar';
import { UserProfile, FinancialProfile } from '../types';
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  MessageSquare,
  Sparkles,
  Send,
  AlertCircle,
  Radio,
  CheckCircle2,
} from 'lucide-react';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  finances: FinancialProfile;
  onSaveMessageToSession: (userMsg: string, aiMsg: string) => void;
  onOpenTextChat: () => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  user,
  finances,
  onSaveMessageToSession,
  onOpenTextChat,
}) => {
  const [robotState, setRobotState] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [aiSpeechResponse, setAiSpeechResponse] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isListeningActive, setIsListeningActive] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [micPermissionState, setMicPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'error'>('prompt');
  const [micAudioVolume, setMicAudioVolume] = useState<number>(0);
  const [permissionNotice, setPermissionNotice] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const isComponentMounted = useRef(true);

  // Suggested Voice Prompts
  const quickVoicePrompts = [
    'How do I budget with the 50/30/20 rule?',
    'Should I pay off my high-interest debt or invest?',
    'How does compound interest grow over 20 years?',
    'Calculate EMI for a $25,000 car loan at 6%',
    'Tell me a fun financial tip for saving money!',
    'How are you doing today, AetherBot?',
  ];

  // Initialize Web Speech Synthesis
  useEffect(() => {
    isComponentMounted.current = true;
    if (typeof window !== 'undefined') {
      synthRef.current = window.speechSynthesis;
    }

    return () => {
      isComponentMounted.current = false;
      cleanupAudioAndSpeech();
    };
  }, []);

  // When modal opens, initialize and start voice listening
  useEffect(() => {
    if (isOpen) {
      setTranscript('');
      setPermissionNotice(null);
      const greeting = `Hello ${user.name.split(' ')[0]}! I'm AetherBot. I'm ready to listen. Click the microphone or pick a prompt to talk!`;
      setAiSpeechResponse(greeting);
      speakText(`Hello ${user.name.split(' ')[0]}! I'm AetherBot. I'm ready to listen.`);
      startMicrophoneAndRecognition();
    } else {
      cleanupAudioAndSpeech();
    }
  }, [isOpen]);

  const cleanupAudioAndSpeech = () => {
    // Stop Speech Recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    // Stop Web Audio analyser loop
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    // Stop MediaStream tracks
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }

    // Close AudioContext
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }

    // Stop TTS
    if (synthRef.current) {
      synthRef.current.cancel();
    }

    setIsListeningActive(false);
    setMicAudioVolume(0);
    setRobotState('idle');
  };

  // Start real microphone access via getUserMedia + Speech Recognition
  const startMicrophoneAndRecognition = async () => {
    stopSpeaking();
    setTranscript('');
    setPermissionNotice(null);

    // 1. Request actual hardware microphone stream (triggers browser permission prompt)
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        setMicPermissionState('granted');
        setIsListeningActive(true);
        setRobotState('listening');

        // Setup AudioContext for real volume analysis
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioContextClass) {
          const audioCtx = new AudioContextClass();
          audioContextRef.current = audioCtx;
          const source = audioCtx.createMediaStreamSource(stream);
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          source.connect(analyser);

          const bufferLength = analyser.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);

          const updateVolume = () => {
            if (!isComponentMounted.current || !mediaStreamRef.current) return;
            analyser.getByteFrequencyData(dataArray);
            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
              sum += dataArray[i];
            }
            const avg = sum / bufferLength;
            setMicAudioVolume(Math.min(100, Math.round(avg * 1.5)));
            animationFrameRef.current = requestAnimationFrame(updateVolume);
          };
          updateVolume();
        }
      } catch (err: any) {
        console.warn('Microphone permission or hardware access issue:', err);
        setMicPermissionState('denied');
        setPermissionNotice(
          'Microphone permission was not granted. You can click any question below or type to converse!'
        );
      }
    }

    // 2. Setup Web Speech Recognition
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        if (recognitionRef.current) {
          try {
            recognitionRef.current.abort();
          } catch {}
        }

        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsListeningActive(true);
          setRobotState('listening');
        };

        recognition.onresult = (event: any) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript;
          }
          if (currentTranscript) {
            setTranscript(currentTranscript);
          }
        };

        recognition.onend = () => {
          // If transcript has text, submit it
          setTranscript((latest) => {
            if (latest.trim()) {
              handleProcessVoicePrompt(latest);
            }
            return latest;
          });
          setIsListeningActive(false);
        };

        recognition.onerror = (event: any) => {
          console.warn('SpeechRecognition error:', event.error);
          if (event.error === 'not-allowed') {
            setMicPermissionState('denied');
            setPermissionNotice('Microphone blocked. Please allow mic in browser settings.');
          } else if (event.error === 'no-speech') {
            // No speech detected, keep listening or idle
            setRobotState('idle');
          }
          setIsListeningActive(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.warn('Failed to start speech recognition instance:', err);
      }
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
    }
  };

  const speakText = (text: string) => {
    if (isMuted || !synthRef.current) {
      setRobotState('idle');
      return;
    }

    stopSpeaking();
    const cleanSpeech = text
      .replace(/[*#_`~>]/g, '')
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
      .slice(0, 380);

    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;

    const voices = synthRef.current.getVoices();
    const naturalVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Google') ||
          v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Daniel') ||
          v.name.includes('Alex'))
    );
    if (naturalVoice) utterance.voice = naturalVoice;

    utterance.onstart = () => {
      setRobotState('speaking');
    };

    utterance.onend = () => {
      setRobotState('idle');
    };

    utterance.onerror = () => {
      setRobotState('idle');
    };

    synthRef.current.speak(utterance);
  };

  const handleProcessVoicePrompt = async (promptText: string) => {
    if (!promptText.trim()) return;

    cleanupAudioAndSpeech();
    setRobotState('thinking');
    setTranscript(promptText);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: promptText }],
          userProfile: user,
          userFinances: {
            monthlyIncome: finances.monthlyIncome,
            monthlySavings: finances.monthlySavings,
            monthlyDebt: finances.debts.reduce((sum, d) => sum + d.minPayment, 0),
            emergencyMonths: finances.emergencyFundMonths,
            portfolioValue: finances.investments.reduce((sum, i) => sum + i.shares * i.currentPrice, 0),
          },
        }),
      });

      const data = await response.json();
      const reply = data.text || 'I analyzed your request. How else can I assist with your finances?';

      setAiSpeechResponse(reply);
      onSaveMessageToSession(promptText, reply);
      speakText(reply);
    } catch (err) {
      console.error('Error fetching voice response:', err);
      const fallbackMsg = `Regarding "${promptText}": Keep your savings automated and maintain 3-to-6 months in cash reserves.`;
      setAiSpeechResponse(fallbackMsg);
      speakText(fallbackMsg);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualInput.trim()) return;
    const prompt = manualInput;
    setManualInput('');
    handleProcessVoicePrompt(prompt);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/50 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel-accent rounded-3xl p-6 sm:p-8 border border-white/95 shadow-2xl flex flex-col items-center overflow-hidden max-h-[92vh]">
        {/* Ambient Top Light Beam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-28 bg-gradient-to-b from-cyan-400/20 via-blue-400/10 to-transparent blur-2xl pointer-events-none" />

        {/* Top Control Bar */}
        <div className="w-full flex items-center justify-between mb-2 z-20">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 border border-white/80 shadow-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isListeningActive
                  ? 'bg-cyan-500 animate-ping'
                  : robotState === 'thinking'
                  ? 'bg-purple-500 animate-spin'
                  : robotState === 'speaking'
                  ? 'bg-emerald-500 animate-bounce'
                  : 'bg-blue-500'
              }`}
            />
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              {isListeningActive
                ? 'Mic Active • Listening...'
                : robotState === 'thinking'
                ? 'Gemini 3.8 Reasoning...'
                : robotState === 'speaking'
                ? 'AetherBot Speaking'
                : 'AetherBot Ready'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Mute / Unmute speech button */}
            <button
              type="button"
              onClick={() => {
                if (!isMuted) stopSpeaking();
                setIsMuted(!isMuted);
              }}
              aria-label={isMuted ? 'Unmute voice output' : 'Mute voice output'}
              className="p-2 rounded-xl bg-white/70 hover:bg-white text-slate-600 hover:text-slate-900 border border-white/80 shadow-xs transition-all cursor-pointer"
              title={isMuted ? 'Unmute voice output' : 'Mute voice output'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
            </button>

            {/* Switch to Text Chatbot Drawer */}
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTextChat();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white text-slate-700 text-xs font-semibold border border-white/80 shadow-xs transition-all cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              <span>Text Chat</span>
            </button>

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close voice assistant"
              className="p-2 rounded-xl bg-white/70 hover:bg-white text-slate-500 hover:text-slate-900 border border-white/80 shadow-xs transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Center: Full Body Floating Robot Avatar with Glowing Lights */}
        <div className="my-1 sm:my-2">
          <FloatingRobotAvatar
            state={robotState}
            size="lg"
            showSpeechWaves={true}
          />
        </div>

        {/* Real Hardware Microphone Audio Visualizer Meter */}
        {isListeningActive && (
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50/80 border border-cyan-200/60 mb-2 z-20">
            <Radio className="w-3 h-3 text-cyan-600 animate-pulse" />
            <span className="text-[11px] font-bold text-cyan-800">
              Live Mic Amplitude:
            </span>
            <div className="w-24 h-2 rounded-full bg-cyan-100 overflow-hidden">
              <div
                className="h-full bg-cyan-500 transition-all duration-75"
                style={{ width: `${Math.max(12, micAudioVolume)}%` }}
              />
            </div>
          </div>
        )}

        {/* Permission warning banner if microphone was blocked */}
        {permissionNotice && (
          <div className="w-full max-w-lg mb-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between gap-2 z-20">
            <div className="flex items-center gap-2 min-w-0">
              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span className="truncate">{permissionNotice}</span>
            </div>
            <button
              type="button"
              onClick={startMicrophoneAndRecognition}
              className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[10px] hover:bg-amber-700 cursor-pointer"
            >
              Retry Mic
            </button>
          </div>
        )}

        {/* Live Subtitle / Speech Bubble */}
        <div className="w-full max-w-lg mb-3 z-20">
          <div className="p-4 rounded-2xl glass-panel border border-white/90 shadow-sm text-center min-h-[70px] flex flex-col justify-center">
            {transcript ? (
              <p className="text-xs sm:text-sm font-bold text-blue-700 italic">
                "{transcript}"
              </p>
            ) : aiSpeechResponse ? (
              <p className="text-xs sm:text-sm text-slate-700 line-clamp-3 font-medium leading-relaxed">
                {aiSpeechResponse.replace(/[#*`]/g, '')}
              </p>
            ) : (
              <p className="text-xs text-slate-400 font-medium">
                Click the microphone button and ask AetherBot any question...
              </p>
            )}
          </div>
        </div>

        {/* Microphone Toggle / Action Button */}
        <div className="flex items-center justify-center gap-4 mb-4 z-20">
          <button
            type="button"
            aria-label={isListeningActive ? 'Stop listening' : 'Start microphone listening'}
            onClick={() => {
              if (isListeningActive) {
                cleanupAudioAndSpeech();
                if (transcript.trim()) {
                  handleProcessVoicePrompt(transcript);
                }
              } else {
                startMicrophoneAndRecognition();
              }
            }}
            className={`relative p-5 rounded-full transition-all duration-300 shadow-xl cursor-pointer ${
              isListeningActive
                ? 'bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-cyan-500/35 ring-8 ring-cyan-400/25 scale-105'
                : 'bg-white hover:bg-slate-50 text-slate-700 shadow-slate-300/40 border border-slate-200'
            }`}
          >
            {isListeningActive ? (
              <Mic className="w-7 h-7 animate-pulse" />
            ) : (
              <MicOff className="w-7 h-7 text-slate-400" />
            )}
          </button>
        </div>

        {/* Fallback & Quick Prompts Pills */}
        <div className="w-full space-y-2 z-20">
          <div className="text-[11px] font-bold text-slate-400 text-center uppercase tracking-wider">
            Quick Inquiries (Click to Ask AetherBot Instantly)
          </div>
          <div className="flex flex-wrap justify-center gap-1.5 max-h-24 overflow-y-auto px-1 py-1">
            {quickVoicePrompts.map((q, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleProcessVoicePrompt(q)}
                className="px-3 py-1.5 rounded-xl bg-white/70 hover:bg-white text-slate-700 hover:text-blue-700 text-xs font-medium border border-white/80 shadow-2xs hover:shadow-xs transition-all text-left cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Quick text input bar inside voice modal */}
          <form onSubmit={handleManualSubmit} className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="Or type a financial question to speak with AetherBot..."
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              className="flex-1 px-4 py-2 rounded-xl bg-white/80 border border-slate-200/80 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <button
              type="submit"
              className="px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Ask</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
