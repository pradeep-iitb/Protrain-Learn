import React, { useMemo, useState } from 'react';
import useSpeech from './hooks/useSpeech.js';
import { simulate, evaluate, speak } from './api.js';
import ChatPanel from './components/ChatPanel.jsx';
import FeedbackPanel from './components/FeedbackPanel.jsx';

const PERSONAS = [
  'Hardship and anxious',
  'Willing but forgetful',
  'Angry and resistant',
  'Confused about terms'
];

export default function App() {
  const [persona, setPersona] = useState(PERSONAS[0]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const { transcript, listening, start, stop, resetTranscript, supported } = useSpeech();

  const disabled = useMemo(() => !supported, [supported]);

  const send = async (text) => {
    try {
      setError('');
      if (!text?.trim()) return;
      setBusy(true);
      const res = await simulate({ message: text, persona, sessionId });
      if (!res || (!res.reply && !res.messages)) throw new Error('Unexpected response from server');
      const { reply = '', sessionId: sid, messages: updated = [] } = res;
      if (sid) setSessionId(sid);
      setMessages(updated);
      if (reply) speak(reply);
    } catch (e) {
      console.error('send() failed', e);
      setError('Failed to send message. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onStart = () => {
    resetTranscript();
    start();
  };

  const onStop = async () => {
    try {
      stop();
      const text = transcript?.trim();
      if (!text) return;
      await send(text);
    } finally {
      resetTranscript();
    }
  };

  const onEvaluate = async () => {
    try {
      setError('');
      setBusy(true);
      const res = await evaluate(sessionId);
      setFeedback(res?.feedback || null);
    } catch (e) {
      console.error('evaluate() failed', e);
      setError('Failed to evaluate. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const onReset = () => {
    setSessionId(null);
    setMessages([]);
    setFeedback(null);
    resetTranscript();
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">AI Collections Agent Trainer</h1>
      <div className="flex items-center gap-3">
        <label className="text-sm">Borrower Persona</label>
        <select value={persona} onChange={e => setPersona(e.target.value)} className="border rounded p-1">
          {PERSONAS.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
        <button onClick={onReset} className="ml-auto px-3 py-1 border rounded">Reset</button>
      </div>

      {error && (
        <div className="p-2 text-sm text-red-700 bg-red-50 border border-red-200 rounded">{error}</div>
      )}
      <ChatPanel messages={messages} />

      <div className="flex items-center gap-3">
        <button onClick={onStart} disabled={disabled || listening || busy} className="px-3 py-2 bg-blue-600 text-white rounded disabled:opacity-50">🎙️ Start</button>
        <button onClick={onStop} disabled={disabled || !listening || busy} className="px-3 py-2 bg-slate-700 text-white rounded disabled:opacity-50">⏹ Stop & Send</button>
        <span className="text-sm text-slate-600">{listening ? 'Listening...' : 'Idle'} {transcript && `– ${transcript}`}</span>
        <button onClick={onEvaluate} disabled={!sessionId || busy} className="ml-auto px-3 py-2 bg-emerald-600 text-white rounded disabled:opacity-50">{busy ? 'Working…' : 'Evaluate'}</button>
      </div>

      <FeedbackPanel feedback={feedback} />

      <footer className="text-xs text-slate-500">Tip: Use Chrome/Edge for speech recognition.</footer>
    </div>
  );
}
