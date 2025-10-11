import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonProgressSidebar from '../components/LessonProgressSidebar';
import {
  getLessonProgress,
  startLesson,
  saveLevelScore,
  isLevelUnlocked
} from '../utils/lessonProgressStorage';
import { evaluateFeedback } from '../api';

const ADVENTURE_LEVELS = [
  {
    level: 1,
    title: 'The First Contact',
    passingScore: 75,
    scenario: {
      character: 'Michael',
      situation: 'Overwhelmed single father with $1,200 in unpaid tolls',
      emotion: 'Anxious and defensive',
      background: 'Michael used toll roads daily for work but lost his job 3 months ago. Bills went unpaid.'
    }
  },
  {
    level: 2,
    title: 'The Disputer',
    passingScore: 75,
    scenario: {
      character: 'Jennifer',
      situation: 'Claims the tolls aren\'t hers - vehicle was sold',
      emotion: 'Angry and confrontational',
      background: 'Jennifer sold her car 6 months ago but didn\'t transfer the plates properly.'
    }
  },
  {
    level: 3,
    title: 'The Silent Treatment',
    passingScore: 80,
    scenario: {
      character: 'Robert',
      situation: 'Refuses to engage, gives one-word answers',
      emotion: 'Avoidant and passive-aggressive',
      background: 'Robert knows about the debt but hopes avoiding it will make it go away.'
    }
  },
  {
    level: 4,
    title: 'The Negotiator',
    passingScore: 80,
    scenario: {
      character: 'Lisa',
      situation: 'Wants to pay but can only afford small amounts',
      emotion: 'Cooperative but financially stressed',
      background: 'Lisa is on a fixed income and genuinely wants to resolve the $890 debt.'
    }
  },
  {
    level: 5,
    title: 'The Complex Case',
    passingScore: 85,
    scenario: {
      character: 'David',
      situation: 'Multiple issues: bankruptcy mention, disputed amount, hostile tone',
      emotion: 'Hostile and threatening legal action',
      background: 'David is dealing with multiple debts and feels overwhelmed and attacked.'
    }
  },
  {
    level: 6,
    title: 'The Success Story',
    passingScore: 85,
    scenario: {
      character: 'Maria',
      situation: 'Cooperative consumer who had genuine hardship',
      emotion: 'Relieved to find a solution',
      background: 'Maria had medical emergency that derailed her finances. She wants to fix everything.'
    }
  }
];

export default function Lesson3() {
  const navigate = useNavigate();
  const [lessonProgress, setLessonProgress] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('briefing'); // briefing, conversation, evaluation, outcome
  const [transcript, setTranscript] = useState([]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [evaluation, setEvaluation] = useState(null);
  const [conversationTurn, setConversationTurn] = useState(0);

  useEffect(() => {
    const progress = startLesson(3);
    setLessonProgress(progress);
    if (progress.currentLevel > 1) {
      setCurrentLevel(progress.currentLevel);
    }
  }, []);

  const getLevelData = () => ADVENTURE_LEVELS.find(l => l.level === currentLevel);

  const startConversation = () => {
    const level = getLevelData();
    setGameState('conversation');
    setTranscript([
      {
        speaker: 'system',
        text: `You are speaking with ${level.scenario.character}. Remember: ${level.scenario.emotion}`
      },
      {
        speaker: level.scenario.character,
        text: getInitialResponse(level.scenario)
      }
    ]);
  };

  const getInitialResponse = (scenario) => {
    const responses = {
      'Michael': "Hello? Who is this? Look, I don't have time for sales calls...",
      'Jennifer': "What do YOU want? I'm tired of getting calls about tolls I don't owe!",
      'Robert': "Yeah?",
      'Lisa': "Oh... is this about those toll bills? I've been so worried about those...",
      'David': "Let me guess, another debt collector? I'm talking to a lawyer about all this, so you better watch what you say!",
      'Maria': "Hi, yes, I've been meaning to call about this. I had some problems but I want to fix things."
    };
    return responses[scenario.character] || "Hello?";
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newTranscript = [
      ...transcript,
      { speaker: 'You', text: userInput }
    ];
    setTranscript(newTranscript);
    setConversationTurn(conversationTurn + 1);
    
    const currentMessage = userInput;
    setUserInput('');
    setIsLoading(true);

    try {
      // Get AI response
      const level = getLevelData();
      const prompt = `You are ${level.scenario.character}, ${level.scenario.situation}. You are feeling ${level.scenario.emotion}. Background: ${level.scenario.background}. 
      
The collector just said: "${currentMessage}"

Respond realistically as this character. Keep response under 50 words. Show your emotional state.`;

      const response = await fetch('http://localhost:3001/api/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          persona: level.scenario.character,
          userMessage: prompt
        })
      });

      const data = await response.json();
      
      setTranscript([
        ...newTranscript,
        { speaker: level.scenario.character, text: data.message }
      ]);

      // After 4-5 turns, allow evaluation
      if (conversationTurn >= 3) {
        setTimeout(() => {
          setGameState('readyToEvaluate');
        }, 1000);
      }
    } catch (error) {
      console.error('Error:', error);
      setTranscript([
        ...newTranscript,
        { speaker: 'system', text: 'Connection error. Please try again.' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEvaluate = async () => {
    setIsLoading(true);
    setGameState('evaluation');

    try {
      const level = getLevelData();
      const conversationText = transcript
        .filter(t => t.speaker !== 'system')
        .map(t => `${t.speaker}: ${t.text}`)
        .join('\n');

      const evalPrompt = `Evaluate this debt collection conversation where the collector is dealing with ${level.scenario.character} (${level.scenario.situation}, ${level.scenario.emotion}):

${conversationText}

Evaluate the collector's performance on:
1. Professionalism (stayed calm, professional language)
2. Empathy (showed understanding of the consumer's situation)
3. Compliance (followed regulations, gave proper disclosures)
4. Problem-solving (offered solutions, worked toward resolution)

Provide scores and feedback.`;

      const feedback = await evaluateFeedback(evalPrompt);
      
      // Calculate score
      const avgScore = Math.round(
        (feedback.persuasion + feedback.empathy + feedback.negotiation) / 3
      );

      setEvaluation({
        ...feedback,
        averageScore: avgScore
      });

      // Save progress
      const passed = avgScore >= level.passingScore;
      saveLevelScore(3, currentLevel, {
        score: avgScore,
        passed,
        attempts: 1,
        timestamp: new Date().toISOString()
      });

      setGameState('outcome');
      
      // Reload progress
      const progress = getLessonProgress(3);
      setLessonProgress(progress);

    } catch (error) {
      console.error('Evaluation error:', error);
      setEvaluation({
        persuasion: 70,
        empathy: 70,
        negotiation: 70,
        averageScore: 70,
        overall_feedback: 'Unable to get detailed evaluation. Try again.',
        suggestions: ['Check your connection', 'Review the conversation']
      });
      setGameState('outcome');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNextLevel = () => {
    if (evaluation.averageScore >= getLevelData().passingScore && currentLevel < ADVENTURE_LEVELS.length) {
      setCurrentLevel(currentLevel + 1);
      resetLevel();
    } else if (evaluation.averageScore >= getLevelData().passingScore) {
      setGameState('completed');
    } else {
      resetLevel();
    }
  };

  const resetLevel = () => {
    setGameState('briefing');
    setTranscript([]);
    setUserInput('');
    setEvaluation(null);
    setConversationTurn(0);
  };

  if (!lessonProgress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const levelData = getLevelData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
      <LessonProgressSidebar currentLessonId={3} />
      
      <div className="max-w-5xl mx-auto px-4 py-20 pr-[420px]">
        <div className="mb-8">
          <button
            onClick={() => navigate('/lessons')}
            className="mb-4 text-slate-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Lessons
          </button>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            🎯 Professional Debt Collection
          </h1>
          <p className="text-slate-300">
            Navigate complex scenarios with empathy and professionalism
          </p>
        </div>

        {/* Level Progress */}
        <div className="mb-8 flex items-center gap-2">
          {ADVENTURE_LEVELS.map((level) => {
            const isCompleted = lessonProgress.levelsCompleted.includes(level.level);
            const isCurrent = level.level === currentLevel;
            const isLocked = !isLevelUnlocked(3, level.level);

            return (
              <button
                key={level.level}
                onClick={() => {
                  if (!isLocked) {
                    setCurrentLevel(level.level);
                    resetLevel();
                  }
                }}
                disabled={isLocked}
                className={`flex-1 p-3 rounded-lg border transition ${
                  isCurrent
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 border-purple-400'
                    : isCompleted
                    ? 'bg-green-500/20 border-green-500/50'
                    : isLocked
                    ? 'bg-slate-800/30 border-slate-700 opacity-50 cursor-not-allowed'
                    : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="text-sm font-semibold text-white">Level {level.level}</div>
                {isCompleted && <div className="text-xs text-green-400">✓</div>}
                {isLocked && <div className="text-xs text-slate-500">🔒</div>}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10 rounded-2xl p-8">
          
          {gameState === 'briefing' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-4">{levelData.title}</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <h3 className="text-sm font-semibold text-purple-400 mb-2">👤 Consumer</h3>
                  <p className="text-white font-semibold">{levelData.scenario.character}</p>
                </div>
                <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-lg">
                  <h3 className="text-sm font-semibold text-rose-400 mb-2">😤 Emotional State</h3>
                  <p className="text-white">{levelData.scenario.emotion}</p>
                </div>
                <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg md:col-span-2">
                  <h3 className="text-sm font-semibold text-amber-400 mb-2">📋 Situation</h3>
                  <p className="text-slate-200">{levelData.scenario.situation}</p>
                </div>
                <div className="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg md:col-span-2">
                  <h3 className="text-sm font-semibold text-cyan-400 mb-2">📖 Background</h3>
                  <p className="text-slate-200">{levelData.scenario.background}</p>
                </div>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
                <h3 className="text-sm font-semibold text-emerald-400 mb-2">🎯 Your Goal</h3>
                <p className="text-slate-200">
                  Build rapport, show empathy, maintain professionalism, and work toward a resolution.
                  You need {levelData.passingScore}% or higher to pass.
                </p>
              </div>

              <button
                onClick={startConversation}
                className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition"
              >
                Begin Conversation →
              </button>
            </div>
          )}

          {(gameState === 'conversation' || gameState === 'readyToEvaluate') && (
            <div className="space-y-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">Conversation with {levelData.scenario.character}</h2>
                {gameState === 'readyToEvaluate' && (
                  <button
                    onClick={handleEvaluate}
                    className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition"
                  >
                    Evaluate Performance
                  </button>
                )}
              </div>

              {/* Transcript */}
              <div className="bg-slate-900/50 rounded-lg p-4 max-h-96 overflow-y-auto space-y-3">
                {transcript.map((message, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      message.speaker === 'system'
                        ? 'bg-slate-700/30 text-slate-400 text-sm italic'
                        : message.speaker === 'You'
                        ? 'bg-emerald-500/20 border border-emerald-500/30 ml-8'
                        : 'bg-purple-500/20 border border-purple-500/30 mr-8'
                    }`}
                  >
                    <div className="text-xs font-semibold mb-1 text-slate-400">{message.speaker}</div>
                    <div className="text-slate-200">{message.text}</div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 text-slate-400">
                    <div className="animate-pulse">●</div>
                    <div className="animate-pulse delay-100">●</div>
                    <div className="animate-pulse delay-200">●</div>
                    <span className="ml-2">{levelData.scenario.character} is typing...</span>
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={userInput}
                  onChange={(e) => setUserInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Type your response..."
                  className="flex-1 px-4 py-3 bg-slate-900/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                  disabled={isLoading || gameState === 'readyToEvaluate'}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={isLoading || !userInput.trim() || gameState === 'readyToEvaluate'}
                  className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>

              <div className="text-sm text-slate-400 text-center">
                Turn {conversationTurn}/4 • {gameState === 'readyToEvaluate' ? 'Ready to evaluate!' : 'Keep the conversation professional'}
              </div>
            </div>
          )}

          {gameState === 'evaluation' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="text-white text-xl">Evaluating your performance...</div>
            </div>
          )}

          {gameState === 'outcome' && evaluation && (
            <div className="space-y-6">
              <div className={`p-6 rounded-xl border-2 ${
                evaluation.averageScore >= levelData.passingScore
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-amber-500/10 border-amber-500'
              }`}>
                <div className="text-4xl mb-3">{evaluation.averageScore >= levelData.passingScore ? '✅' : '⚠️'}</div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {evaluation.averageScore >= levelData.passingScore ? 'Level Passed!' : 'Keep Practicing'}
                </h3>
                <div className="text-3xl font-bold text-white mb-2">{evaluation.averageScore}%</div>
                <div className="text-slate-300">Passing Score: {levelData.passingScore}%</div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Professionalism</div>
                  <div className="text-2xl font-bold text-emerald-400">{evaluation.persuasion}%</div>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Empathy</div>
                  <div className="text-2xl font-bold text-cyan-400">{evaluation.empathy}%</div>
                </div>
                <div className="p-4 bg-slate-700/30 rounded-lg">
                  <div className="text-sm text-slate-400 mb-1">Problem-Solving</div>
                  <div className="text-2xl font-bold text-violet-400">{evaluation.negotiation}%</div>
                </div>
              </div>

              <div className="p-6 bg-indigo-500/10 border border-indigo-500/30 rounded-xl">
                <h4 className="text-lg font-semibold text-indigo-400 mb-2">Overall Feedback</h4>
                <p className="text-slate-200 leading-relaxed">{evaluation.overall_feedback}</p>
              </div>

              {evaluation.suggestions && evaluation.suggestions.length > 0 && (
                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <h4 className="text-lg font-semibold text-purple-400 mb-3">Suggestions for Improvement</h4>
                  <ul className="space-y-2">
                    {evaluation.suggestions.map((suggestion, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-slate-200">
                        <span className="text-purple-400">•</span>
                        <span>{suggestion}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex gap-3">
                {evaluation.averageScore >= levelData.passingScore ? (
                  <button
                    onClick={handleNextLevel}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold text-lg hover:from-emerald-600 hover:to-cyan-600 transition"
                  >
                    {currentLevel < ADVENTURE_LEVELS.length ? 'Next Level →' : 'Complete Lesson ✓'}
                  </button>
                ) : (
                  <button
                    onClick={resetLevel}
                    className="flex-1 py-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg text-white font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition"
                  >
                    Try Again
                  </button>
                )}
              </div>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="text-center space-y-6">
              <div className="text-6xl">🎉</div>
              <h2 className="text-3xl font-bold text-white">Lesson Complete!</h2>
              <p className="text-xl text-slate-300">
                You've mastered professional debt collection scenarios!
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{lessonProgress.levelsCompleted.length}/{ADVENTURE_LEVELS.length}</div>
                  <div className="text-sm text-slate-300">Levels Complete</div>
                </div>
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{lessonProgress.averageScore}%</div>
                  <div className="text-sm text-slate-300">Average Score</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/lessons')}
                className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg text-white font-semibold text-lg hover:from-purple-600 hover:to-pink-600 transition"
              >
                Return to Lessons Hub
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
