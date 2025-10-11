import React, { useMemo, useState, useEffect } from 'react';
import Navbar from '../components/Navbar.jsx';
import Orb from '../components/Orb.jsx';
import useSpeech from '../hooks/useSpeech.js';
import { simulate, evaluate, speak } from '../api.js';
import ChatPanel from '../components/ChatPanel.jsx';
import FeedbackPanel from '../components/FeedbackPanel.jsx';
import VoiceOrb from '../components/VoiceOrb.jsx';
import UserDashboard from '../components/UserDashboard.jsx';
import { LEVELS, getLevelById } from '../config/levels.js';
import { 
  initializeProgress, 
  getCurrentLevel, 
  setCurrentLevel, 
  isLevelUnlocked,
  unlockLevel,
  saveLevelScore,
  getLevelScore
} from '../utils/progressStorage.js';

export default function Trainer() {
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const { transcript, listening, start, stop, resetTranscript, supported } = useSpeech();
  const disabled = useMemo(() => !supported, [supported]);
  
  const currentLevel = getLevelById(currentLevelId);
  const persona = currentLevel?.persona || 'Default Borrower';
  
  // Initialize progress from localStorage
  useEffect(() => {
    const progress = initializeProgress();
    setCurrentLevelId(progress.currentLevel);
    setUnlockedLevels(progress.unlockedLevels);
  }, []);

  const send = async (text) => {
    try {
      setError('');
      if (!text?.trim()) {
        setError('Please provide a message to send.');
        return;
      }
      
      console.log('Sending message:', text, 'with persona:', persona);
      setBusy(true);
      
      const res = await simulate({ message: text, persona, sessionId });
      console.log('Simulate response:', res);
      
      if (res?.error) {
        setError(res.error);
        return;
      }
      
      const { reply = '', sessionId: sid, messages: updated = [] } = res || {};
      
      if (sid) {
        setSessionId(sid);
        console.log('Session ID:', sid);
      }
      
      setMessages(updated);
      
      if (reply) {
        console.log('Borrower reply:', reply);
        setSpeaking(true);
        
        // Use proper TTS with cleanup
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = 'en-US';
        utterance.onend = () => {
          console.log('Speech ended');
          setSpeaking(false);
        };
        utterance.onerror = (e) => {
          console.error('TTS error:', e);
          setSpeaking(false);
        };
        
        window.speechSynthesis.cancel(); // Clear any pending speech
        window.speechSynthesis.speak(utterance);
      }
    } catch (e) {
      console.error('send() failed:', e);
      setError(`Failed to send message: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const onStart = () => {
    console.log('Starting speech recognition...');
    setError('');
    resetTranscript();
    try {
      start();
      console.log('Listening started');
    } catch (e) {
      console.error('Failed to start listening:', e);
      setError('Could not start microphone. Please check permissions.');
    }
  };

  const onStop = async () => {
    console.log('Stopping speech recognition...');
    try {
      if (listening) {
        stop();
      }
      const text = transcript?.trim();
      console.log('Captured transcript:', text);
      
      if (!text) {
        setError('No speech detected. Please try again.');
        return;
      }
      
      await send(text);
    } catch (e) {
      console.error('onStop failed:', e);
      setError(`Error: ${e.message}`);
    } finally {
      resetTranscript();
    }
  };

  const onSendTyped = async () => {
    const t = typed.trim();
    if (!t) {
      setError('Please type a message first.');
      return;
    }
    await send(t);
    setTyped('');
  };

  const onEvaluate = async () => {
    if (!sessionId) {
      setError('No conversation to evaluate. Start a conversation first.');
      return;
    }
    
    try {
      console.log('Evaluating session:', sessionId);
      setError('');
      setBusy(true);
      
      const res = await evaluate(sessionId);
      console.log('Evaluation response:', res);
      
      if (res?.error) {
        setError(res.error);
        return;
      }
      
      const feedbackData = res?.feedback || null;
      setFeedback(feedbackData);
      
      // Check if level passed and save score
      if (feedbackData && feedbackData.totalScore !== undefined) {
        const totalScore = feedbackData.totalScore;
        const passed = totalScore >= currentLevel.passingScore;
        
        // Save score to localStorage
        saveLevelScore(currentLevelId, {
          persuasion: feedbackData.persuasion || 0,
          empathy: feedbackData.empathy || 0,
          negotiation: feedbackData.negotiation || 0,
          totalScore,
          passed,
          levelName: currentLevel.name
        });
        
        // Unlock next level if passed
        if (passed && currentLevelId < 25) {
          const nextLevelId = currentLevelId + 1;
          unlockLevel(nextLevelId);
          setUnlockedLevels(prev => {
            if (!prev.includes(nextLevelId)) {
              return [...prev, nextLevelId].sort((a, b) => a - b);
            }
            return prev;
          });
        }
        
        console.log(passed ? '✅ Level passed!' : '❌ Level not passed. Try again!');
      }
    } catch (e) {
      console.error('evaluate() failed:', e);
      setError(`Failed to evaluate: ${e.message}`);
    } finally {
      setBusy(false);
    }
  };

  const onReset = () => {
    console.log('Resetting conversation');
    setSessionId(null);
    setMessages([]);
    setFeedback(null);
    setError('');
    resetTranscript();
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black via-slate-900 to-black text-slate-200 overflow-hidden">
      <Navbar />

      {/* Orb background overlay */}
      <div className="fixed inset-0 z-0 opacity-30 pointer-events-none">
        <Orb hue={180} hoverIntensity={0.3} rotateOnHover={true} />
      </div>
      
      <main className="relative z-10 max-w-5xl mx-auto pt-20 pb-16 px-4 space-y-4">
        {/* Dashboard */}
        <UserDashboard />

        {/* Level Selector with animated border */}
        <div className="animated-border-box p-6 rounded-lg bg-black/40 backdrop-blur border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-emerald-400 font-display">{currentLevel?.name}</h2>
              <p className="text-sm text-slate-400 mt-1">
                {currentLevel?.difficulty} • Passing Score: {currentLevel?.passingScore}/300
              </p>
            </div>
            <button onClick={onReset} className="px-4 py-2 border border-white/10 rounded-lg hover:bg-white/10 transition">
              🔄 Reset
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-sm text-slate-300 mb-2">
              <span className="font-semibold text-emerald-400">Persona:</span> {currentLevel?.persona}
            </p>
            <p className="text-sm text-slate-300 mb-2">
              <span className="font-semibold text-emerald-400">Description:</span> {currentLevel?.description}
            </p>
            <p className="text-xs text-slate-400">
              <span className="font-semibold">Traits:</span> {currentLevel?.traits}
            </p>
          </div>
          
          {/* Level Navigation */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            {LEVELS.map(level => {
              const isUnlocked = unlockedLevels.includes(level.id);
              const isCurrent = level.id === currentLevelId;
              const levelScore = getLevelScore(level.id);
              
              return (
                <button
                  key={level.id}
                  onClick={() => {
                    if (isUnlocked) {
                      setCurrentLevelId(level.id);
                      setCurrentLevel(level.id);
                      onReset();
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`
                    flex-shrink-0 min-w-[60px] px-3 py-2 rounded-lg border-2 transition
                    ${isCurrent ? 'bg-emerald-500 border-emerald-400 text-black font-bold' : ''}
                    ${!isCurrent && isUnlocked ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}
                    ${!isUnlocked ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' : ''}
                  `}
                  title={isUnlocked ? `${level.name}\n${levelScore ? `Score: ${levelScore.totalScore}/300` : 'Not attempted'}` : 'Locked'}
                >
                  <div className="text-xs font-semibold">{level.id}</div>
                  {levelScore && (
                    <div className="text-[10px] mt-1">
                      {levelScore.passed ? '✅' : '❌'} {levelScore.totalScore}
                    </div>
                  )}
                  {!isUnlocked && <div className="text-lg">🔒</div>}
                </button>
              );
            })}
          </div>
        </div>

        {error && (<div className="p-2 text-sm text-red-300 bg-red-900/30 border border-red-800/40 rounded">{error}</div>)}

        {/* Voice status indicator */}
        <div className="animated-border-box flex items-center gap-2 p-3 rounded-lg bg-black/40 backdrop-blur border border-white/10">
          <VoiceOrb active={speaking} />
          <span className="text-sm text-slate-300">Borrower {speaking ? 'speaking…' : 'idle'}</span>
        </div>

        {/* Chat panel with animated border */}
        <div className="animated-border-box rounded-lg bg-black/40 backdrop-blur border border-white/10">
          <ChatPanel messages={messages} />
        </div>

        {/* Controls with animated border */}
        <div className="animated-border-box flex items-center gap-3 p-4 rounded-lg bg-black/40 backdrop-blur border border-white/10">
          <button onClick={onStart} disabled={disabled || listening || busy} className="px-3 py-2 bg-cyan-500 text-black rounded disabled:opacity-50 hover:bg-cyan-400 transition">🎙️ Start</button>
          <button onClick={onStop} disabled={busy || (!listening && !transcript?.trim())} className="px-3 py-2 bg-slate-800 text-white rounded disabled:opacity-50 hover:bg-slate-700 transition">⏹ Stop & Send</button>
          <span className="text-sm text-slate-400">{busy ? 'Working…' : listening ? 'Listening…' : 'Idle'} {transcript && `– ${transcript}`}</span>
          <button onClick={onEvaluate} disabled={!sessionId || busy} className="ml-auto px-3 py-2 bg-emerald-500 text-black rounded disabled:opacity-50 hover:bg-emerald-400 transition">Evaluate</button>
        </div>

        {/* Typed input with animated border */}
        <div className="animated-border-box flex items-center gap-2 p-3 rounded-lg bg-black/40 backdrop-blur border border-white/10">
          <input value={typed} onChange={e => setTyped(e.target.value)} placeholder="Type your message…" className="flex-1 bg-transparent border-none outline-none text-slate-200 placeholder:text-slate-500" />
          <button onClick={onSendTyped} disabled={busy || !typed.trim()} className="px-3 py-2 bg-slate-800 text-white rounded disabled:opacity-50 hover:bg-slate-700 transition">Send</button>
        </div>

        <FeedbackPanel feedback={feedback} currentLevelId={currentLevelId} />
      </main>
    </div>
  );
}
