import React, { useMemo, useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import Galaxy from '../components/Galaxy.jsx';
import useSpeech from '../hooks/useSpeech.js';
import { simulate, evaluate, speak } from '../api.js';
import ChatPanel from '../components/ChatPanel.jsx';
import FeedbackPanel from '../components/FeedbackPanel.jsx';
import VoiceOrb from '../components/VoiceOrb.jsx';

const PERSONAS = [
  'Hardship and anxious',
  'Willing but forgetful',
  'Angry and resistant',
  'Confused about terms'
];

export default function Trainer() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const { transcript, listening, start, stop, resetTranscript, supported } = useSpeech();
  const disabled = useMemo(() => !supported, [supported]);

  const send = async (text) => {
    try {
      setError('');
      if (!text?.trim()) return;
      setBusy(true);
      const res = await simulate({ message: text, persona, sessionId });
      const { reply = '', sessionId: sid, messages: updated = [] } = res || {};
      if (sid) setSessionId(sid);
      setMessages(updated);
      if (reply) {
        setSpeaking(true);
        speak(reply);
        const onEnd = () => setSpeaking(false);
        // Attach a small end listener using the SpeechSynthesis queue
        const check = setInterval(() => {
          if (!window.speechSynthesis.speaking) { clearInterval(check); onEnd(); }
        }, 150);
      }
    } catch (e) {
      console.error('send() failed', e);
      setError('Failed to send message. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onStart = () => { resetTranscript(); start(); };
  const onStop = async () => {
    try { if (listening) stop(); const text = transcript?.trim(); if (!text) return; await send(text); }
    finally { resetTranscript(); }
  };
  const onSendTyped = async () => { const t = typed.trim(); if (!t) return; await send(t); setTyped(''); };
  const onEvaluate = async () => {
    try { setError(''); setBusy(true); const res = await evaluate(sessionId); setFeedback(res?.feedback || null); }
    catch (e) { console.error('evaluate() failed', e); setError('Failed to evaluate. Please try again.'); }
    finally { setBusy(false); }
  };
  const onReset = () => { setSessionId(null); setMessages([]); setFeedback(null); resetTranscript(); };

  return (
    <div className="min-h-screen bg-black text-slate-200">
      <Navbar />
      <div className="absolute inset-0 -z-10">
        <Galaxy mouseRepulsion density={1.1} glowIntensity={0.45} saturation={0.6} hueShift={190} />
      </div>
      <main className="max-w-5xl mx-auto pt-20 pb-16 px-4 space-y-4">
        <div className="flex items-center gap-3">
          <label className="text-sm text-slate-300">Borrower Persona</label>
          <select value={persona} onChange={e => setPersona(e.target.value)} className="bg-black/40 border border-white/10 rounded p-2 text-slate-200">
            {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <button onClick={onReset} className="ml-auto px-3 py-1 border border-white/10 rounded hover:bg-white/10">Reset</button>
        </div>

        {error && (<div className="p-2 text-sm text-red-300 bg-red-900/30 border border-red-800/40 rounded">{error}</div>)}

        <div className="flex items-center gap-2">
          <VoiceOrb active={speaking} />
          <span className="text-sm text-slate-300">Borrower {speaking ? 'speaking…' : 'idle'}</span>
        </div>

        <ChatPanel messages={messages} />

        <div className="flex items-center gap-3">
          <button onClick={onStart} disabled={disabled || listening || busy} className="px-3 py-2 bg-cyan-500 text-black rounded disabled:opacity-50">🎙️ Start</button>
          <button onClick={onStop} disabled={busy || (!listening && !transcript?.trim())} className="px-3 py-2 bg-slate-800 text-white rounded disabled:opacity-50">⏹ Stop & Send</button>
          <span className="text-sm text-slate-400">{busy ? 'Working…' : listening ? 'Listening…' : 'Idle'} {transcript && `– ${transcript}`}</span>
          <button onClick={onEvaluate} disabled={!sessionId || busy} className="ml-auto px-3 py-2 bg-emerald-500 text-black rounded disabled:opacity-50">Evaluate</button>
        </div>

        <div className="flex items-center gap-2">
          <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="Type your message…" className="flex-1 bg-black/40 border border-white/10 rounded px-3 py-2" />
          <button onClick={onSendTyped} disabled={busy || !typed.trim()} className="px-3 py-2 bg-slate-800 text-white rounded disabled:opacity-50">Send</button>
        </div>

        <FeedbackPanel feedback={feedback} />
      </main>
    </div>
  );
}
