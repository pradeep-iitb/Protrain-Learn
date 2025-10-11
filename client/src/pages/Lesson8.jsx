import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LessonProgressSidebar from '../components/LessonProgressSidebar';
import Orb from '../components/Orb';
import VoiceOrb from '../components/VoiceOrb';
import ChatPanel from '../components/ChatPanel';
import FeedbackPanel from '../components/FeedbackPanel';
import useSpeech from '../hooks/useSpeech';
import { simulate, evaluate } from '../api';
import { LEVELS, getLevelById } from '../config/levels';
import {
  getLessonProgress,
  startLesson,
  saveLevelScore
} from '../utils/lessonProgressStorage';

export default function Lesson8() {
  const navigate = useNavigate();
  const [lessonProgress, setLessonProgress] = useState(null);
  const [currentLevelId, setCurrentLevelId] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [sessionId, setSessionId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [feedback, setFeedback] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [typed, setTyped] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [showIdleSuggestion, setShowIdleSuggestion] = useState(false);
  const [idleTimer, setIdleTimer] = useState(null);
  const { transcript, listening, start, stop, resetTranscript, supported } = useSpeech();
  const disabled = useMemo(() => !supported, [supported]);
  
  const currentLevel = getLevelById(currentLevelId);
  const persona = currentLevel?.persona || 'Default Borrower';

  useEffect(() => {
    const progress = startLesson(6);
    if (progress) {
      setLessonProgress(progress);
      // Initialize unlocked levels from progress
      const completedLevels = progress.levelsCompleted || [];
      const unlocked = completedLevels.length > 0 ? 
        Array.from({length: Math.min(completedLevels.length + 1, 25)}, (_, i) => i + 1) : 
        [1];
      setUnlockedLevels(unlocked);
      if (progress.currentLevel > 1) {
        setCurrentLevelId(Math.min(progress.currentLevel, 25));
      }
    } else {
      console.error('Failed to load lesson 8 progress');
    }
  }, []);

  // Idle detection - show suggestions after 15 seconds of inactivity
  useEffect(() => {
    if (sessionId && !busy && !speaking) {
      const timer = setTimeout(() => {
        setShowIdleSuggestion(true);
      }, 15000); // 15 seconds
      setIdleTimer(timer);
      return () => clearTimeout(timer);
    }
  }, [sessionId, busy, speaking, messages.length]);

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
        
        // Use proper TTS with cleanup and enhanced voice settings
        const utterance = new SpeechSynthesisUtterance(reply);
        utterance.lang = 'en-US';
        utterance.rate = 1.0;  // Normal speed
        utterance.pitch = 1.0;  // Normal pitch
        utterance.volume = 1.0;  // Full volume
        
        utterance.onstart = () => {
          console.log('Speech started');
          setSpeaking(true);
        };
        
        utterance.onend = () => {
          console.log('Speech ended');
          setSpeaking(false);
        };
        
        utterance.onerror = (e) => {
          console.error('TTS error:', e);
          setSpeaking(false);
          setError(`Voice synthesis error: ${e.error}. Make sure your browser supports text-to-speech.`);
        };
        
        // Cancel any pending speech and speak new message
        window.speechSynthesis.cancel();
        
        // Small delay to ensure cancel completes before starting new speech
        setTimeout(() => {
          window.speechSynthesis.speak(utterance);
        }, 100);
      } else {
        console.warn('No reply text to speak');
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
    setShowIdleSuggestion(false); // Hide suggestion when user starts speaking
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
    setShowIdleSuggestion(false); // Hide suggestion when sending voice message
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
    setShowIdleSuggestion(false); // Hide suggestion when sending message
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
        
        // Save score to lesson progress
        const scoreData = {
          score: totalScore,
          passed,
          attempts: 1,
          timestamp: new Date().toISOString(),
          persuasion: feedbackData.persuasion || 0,
          empathy: feedbackData.empathy || 0,
          negotiation: feedbackData.negotiation || 0
        };
        
        saveLevelScore(6, currentLevelId, scoreData);
        
        // Unlock next level if passed
        if (passed && currentLevelId < 25) {
          const nextLevelId = currentLevelId + 1;
          setUnlockedLevels(prev => {
            if (!prev.includes(nextLevelId)) {
              return [...prev, nextLevelId].sort((a, b) => a - b);
            }
            return prev;
          });
        }
        
        console.log(passed ? '✅ Level passed!' : '❌ Level not passed. Try again!');
        
        // Reload progress
        const updatedProgress = getLessonProgress(6);
        setLessonProgress(updatedProgress);
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

  const getLevelScore = (levelId) => {
    if (!lessonProgress || !lessonProgress.levelScores) return null;
    return lessonProgress.levelScores[levelId];
  };

  if (!lessonProgress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 overflow-hidden">
      <Navbar />
      
      {/* Orb background overlay */}
      <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
        <Orb hue={0} hoverIntensity={0.3} rotateOnHover={true} />
      </div>
      
      <LessonProgressSidebar currentLessonId={6} />
      
      <div className="relative z-10 max-w-5xl mx-auto px-4 pt-24 pb-20 pr-[420px]">
        <div className="mb-8">
          <button
            onClick={() => navigate('/lessons')}
            className="mb-4 text-slate-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Lessons
          </button>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            🎭 25 AI Personas - Practice Arena
          </h1>
          <p className="text-slate-300">
            Master debt collection with 25 dynamic AI-powered scenarios and voice interaction
          </p>
        </div>

        {/* Level Selector */}
        <div className="mb-6 p-6 rounded-xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-red-400 font-display">{currentLevel?.name}</h2>
              <p className="text-sm text-slate-400 mt-1">
                {currentLevel?.difficulty} • Passing Score: {currentLevel?.passingScore}/300
              </p>
            </div>
            <button 
              onClick={onReset} 
              className="px-4 py-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition text-white"
            >
              🔄 Reset
            </button>
          </div>
          
          <div className="mb-4 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
            <p className="text-sm text-slate-300 mb-2">
              <span className="font-semibold text-red-400">Persona:</span> {currentLevel?.persona}
            </p>
            <p className="text-sm text-slate-300 mb-2">
              <span className="font-semibold text-red-400">Description:</span> {currentLevel?.description}
            </p>
            <p className="text-xs text-slate-400">
              <span className="font-semibold">Traits:</span> {currentLevel?.traits}
            </p>
          </div>
          
          {/* Level Navigation Grid */}
          <div className="grid grid-cols-5 gap-2">
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
                      onReset();
                    }
                  }}
                  disabled={!isUnlocked}
                  className={`
                    p-3 rounded-lg border-2 transition relative
                    ${isCurrent ? 'bg-red-500 border-red-400 text-white font-bold shadow-lg shadow-red-500/50' : ''}
                    ${!isCurrent && isUnlocked ? 'bg-slate-700 border-slate-600 text-white hover:bg-slate-600' : ''}
                    ${!isUnlocked ? 'bg-slate-900 border-slate-800 text-slate-600 cursor-not-allowed' : ''}
                  `}
                  title={isUnlocked ? `${level.name}\n${levelScore ? `Score: ${levelScore.score}/300` : 'Not attempted'}` : 'Complete previous level to unlock'}
                >
                  <div className="text-sm font-bold">Level {level.id}</div>
                  {levelScore && (
                    <div className="text-xs mt-1">
                      {levelScore.passed ? '✅' : '❌'} {levelScore.score}
                    </div>
                  )}
                  {!isUnlocked && <div className="text-xl">🔒</div>}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 text-sm text-red-300 bg-red-900/30 border border-red-800/40 rounded-lg">
            {error}
          </div>
        )}

        {/* Voice Status */}
        <div className={`mb-4 flex items-center gap-3 p-4 rounded-lg backdrop-blur border transition-all duration-300 ${
          speaking 
            ? 'bg-gradient-to-br from-green-500/20 to-emerald-500/20 border-green-500/50 shadow-lg shadow-green-500/20' 
            : 'bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-white/10'
        }`}>
          <VoiceOrb active={speaking} />
          <div className="flex-1">
            <span className={`text-sm font-semibold transition-colors ${speaking ? 'text-green-400' : 'text-slate-300'}`}>
              AI Borrower {speaking ? 'speaking…' : 'idle'}
            </span>
            {speaking && (
              <div className="text-xs text-green-300 mt-1 animate-pulse">
                🔊 Voice output active
              </div>
            )}
          </div>
          {speaking && (
            <button
              onClick={() => {
                window.speechSynthesis.cancel();
                setSpeaking(false);
              }}
              className="px-3 py-1 bg-red-500/20 border border-red-500/50 rounded text-red-400 text-xs hover:bg-red-500/30 transition"
              title="Stop speaking"
            >
              ⏹ Stop
            </button>
          )}
        </div>

        {/* Chat Panel */}
        <div className="mb-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10 overflow-hidden">
          <ChatPanel messages={messages} />
        </div>

        {/* Voice Controls */}
        <div className="mb-4 flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10">
          <button 
            onClick={onStart} 
            disabled={disabled || listening || busy} 
            className="px-4 py-2 bg-cyan-500 text-black rounded-lg font-semibold disabled:opacity-50 hover:bg-cyan-400 transition"
          >
            🎙️ Start Voice
          </button>
          <button 
            onClick={onStop} 
            disabled={busy || (!listening && !transcript?.trim())} 
            className="px-4 py-2 bg-slate-700 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-slate-600 transition"
          >
            ⏹ Stop & Send
          </button>
          <span className="text-sm text-slate-400 flex-1">
            {busy ? '⏳ Working…' : listening ? '🎤 Listening…' : '💤 Idle'} 
            {transcript && <span className="ml-2 text-cyan-400">"{transcript}"</span>}
          </span>
          <button 
            onClick={onEvaluate} 
            disabled={!sessionId || busy} 
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-semibold disabled:opacity-50 hover:from-emerald-600 hover:to-green-600 transition"
          >
            📊 Evaluate
          </button>
        </div>

        {/* Idle Suggestion Box */}
        {showIdleSuggestion && (
          <div className="mb-4 relative animate-fade-in">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 border-2 border-amber-500/50 rounded-lg p-4">
              <button
                onClick={() => setShowIdleSuggestion(false)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white transition"
              >
                ✕
              </button>
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div className="flex-1">
                  <h4 className="text-amber-400 font-semibold mb-2">Need help? Try this:</h4>
                  <div className="text-slate-300 space-y-1 text-sm">
                    {currentLevel?.difficulty === 'Beginner' && (
                      <>
                        <p>• "Hi, I'm calling about your account..."</p>
                        <p>• "I understand this might be difficult..."</p>
                        <p>• Try using the 🎙️ Voice feature!</p>
                      </>
                    )}
                    {currentLevel?.difficulty === 'Intermediate' && (
                      <>
                        <p>• Show empathy for their situation</p>
                        <p>• Ask about payment options that work for them</p>
                        <p>• Use the voice feature for more natural conversation</p>
                      </>
                    )}
                    {currentLevel?.difficulty === 'Advanced' && (
                      <>
                        <p>• Stay calm and professional</p>
                        <p>• Acknowledge their concerns without escalating</p>
                        <p>• Offer concrete solutions and next steps</p>
                      </>
                    )}
                    {currentLevel?.difficulty === 'Expert' && (
                      <>
                        <p>• Handle complex objections with confidence</p>
                        <p>• Find creative payment solutions</p>
                        <p>• Build rapport even in difficult situations</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Text Input */}
        <div className="mb-4 flex items-center gap-3 p-4 rounded-lg bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10">
          <input 
            value={typed} 
            onChange={e => {
              setTyped(e.target.value);
              setShowIdleSuggestion(false); // Hide suggestion when user starts typing
            }} 
            onKeyPress={(e) => e.key === 'Enter' && onSendTyped()}
            placeholder="Or type your message here…" 
            className="flex-1 px-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-white placeholder:text-slate-500 focus:outline-none focus:border-red-500"
            disabled={busy}
          />
          <button 
            onClick={onSendTyped} 
            disabled={busy || !typed.trim()} 
            className="px-6 py-2 bg-red-500 text-white rounded-lg font-semibold disabled:opacity-50 hover:bg-red-600 transition"
          >
            Send
          </button>
        </div>

        {/* Feedback Panel */}
        <FeedbackPanel feedback={feedback} currentLevelId={currentLevelId} />

        {/* Instructions */}
        {messages.length === 0 && (
          <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-rose-500/10 border border-red-500/30">
            <h3 className="text-xl font-bold text-red-400 mb-3">🎯 How to Practice</h3>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400">1.</span>
                <span>Click <strong>🎙️ Start Voice</strong> to use your microphone, or type your message</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">2.</span>
                <span>Have a natural conversation - <strong className="text-green-400">AI speaks back to you with voice! 🔊</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">3.</span>
                <span>Watch the <strong className="text-green-400">Voice Status</strong> indicator turn green when AI is speaking</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">4.</span>
                <span>After 3-5 exchanges, click <strong>📊 Evaluate</strong> to get detailed feedback</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">5.</span>
                <span>Score {currentLevel?.passingScore}/300 or higher to unlock the next level</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400">6.</span>
                <span>Complete all 25 personas to master debt collection communication!</span>
              </li>
            </ul>
            <div className="mt-4 p-3 bg-green-500/10 border border-green-500/30 rounded-lg">
              <p className="text-green-300 text-sm">
                <strong>🔊 Voice Feature:</strong> Make sure your device volume is up! The AI borrower will respond to you with realistic voice synthesis for an immersive practice experience.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
