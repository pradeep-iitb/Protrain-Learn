import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LessonProgressSidebar from '../components/LessonProgressSidebar';
import ProtrainAI, { AIMessage } from '../components/ProtrainAI';
import { generateAIFeedback } from '../api';
import {
  getLessonProgress,
  startLesson,
  saveLevelScore,
  isLevelUnlocked
} from '../utils/lessonProgressStorage';

// Story levels with branching narratives
const STORY_LEVELS = [
  {
    level: 1,
    title: 'The Beginning: A Simple Toll',
    passingScore: 70,
    scenario: {
      intro: "Meet Sarah, a 28-year-old marketing professional. She's driving to visit her parents using a toll road for the first time.",
      initialSituation: "Sarah passes through the toll plaza. She notices cameras but doesn't see a payment booth. She assumes it's handled automatically.",
      question: "What should Sarah do?",
      choices: [
        {
          id: 'a',
          text: 'Check the toll authority website later to see if payment is needed',
          isCorrect: true,
          outcome: 'Sarah visits the website that evening and discovers she needs to pay within 7 days. She pays the $3.50 toll online. Crisis averted!',
          score: 100,
          feedback: 'Excellent choice! Proactive research prevents problems. This is exactly what informed drivers do.'
        },
        {
          id: 'b',
          text: 'Wait for a bill to arrive in the mail',
          isCorrect: false,
          outcome: 'A bill arrives 3 weeks later with a $50 administrative fee added to the $3.50 toll. Sarah is shocked.',
          score: 60,
          feedback: 'This is a common assumption, but waiting can be costly. Many tolls require prompt payment before bills are sent.'
        },
        {
          id: 'c',
          text: 'Ignore it - tolls should have payment booths',
          isCorrect: false,
          outcome: 'No bill arrives initially. Sarah forgets about it. 60 days later, she receives a violation notice for $150.',
          score: 30,
          feedback: 'This attitude leads to serious problems. Modern toll systems use automated billing, and ignoring them has consequences.'
        },
        {
          id: 'd',
          text: 'Call the toll authority to ask about payment',
          isCorrect: true,
          outcome: 'Sarah calls and gets clear instructions. She pays immediately and even signs up for an E-ZPass for future convenience.',
          score: 100,
          feedback: 'Perfect! When in doubt, asking directly is always smart. Toll authorities want to help people pay correctly.'
        }
      ]
    }
  },
  {
    level: 2,
    title: 'The Forgotten Bill',
    passingScore: 70,
    scenario: {
      intro: "Three months have passed. Sarah moved apartments and forgot to update her vehicle registration address.",
      initialSituation: "Sarah used the same toll road 15 times last month. Bills were sent to her old address. She hasn't received anything.",
      question: "From Sarah's perspective, what would be the responsible action?",
      choices: [
        {
          id: 'a',
          text: 'Proactively check online for any unpaid tolls',
          isCorrect: true,
          outcome: 'Sarah logs into the toll authority website and discovers 15 unpaid tolls totaling $52.50. She pays immediately before any penalties are added.',
          score: 100,
          feedback: 'Excellent responsibility! Being proactive about your obligations, especially after an address change, prevents problems.'
        },
        {
          id: 'b',
          text: 'Assume everything is fine since no bills arrived',
          isCorrect: false,
          outcome: 'Six months later, a collection notice arrives at her new address. The $52.50 in tolls has become $837.50 with administrative fees and penalties.',
          score: 40,
          feedback: 'Unfortunately, not receiving bills doesn\'t mean there\'s no debt. When you move, it\'s your responsibility to check on obligations.'
        },
        {
          id: 'c',
          text: 'Wait until tax time to update her address',
          isCorrect: false,
          outcome: 'By tax time, the debt has been placed with a collection agency. Sarah faces credit reporting and possible legal action.',
          score: 30,
          feedback: 'Waiting to update official records can have serious consequences. Address changes should be handled immediately.'
        },
        {
          id: 'd',
          text: 'Update her address with the DMV and check for any missed bills',
          isCorrect: true,
          outcome: 'Sarah updates her DMV records and checks the toll website. She finds and pays the tolls, then sets up an E-ZPass account to avoid future issues.',
          score: 100,
          feedback: 'Perfect response! This shows true financial responsibility - fixing the root cause and addressing any existing problems.'
        }
      ]
    }
  },
  {
    level: 3,
    title: 'The Collection Call',
    passingScore: 75,
    scenario: {
      intro: "Unfortunately, Sarah chose poorly in Level 2. She now has a $837.50 debt in collections. She receives a call from Resolve First Collections.",
      initialSituation: "The collector is professional and explains the situation. Sarah is shocked - she had no idea the debt existed.",
      question: "What should Sarah do now?",
      choices: [
        {
          id: 'a',
          text: 'Dispute the debt and refuse to pay',
          isCorrect: false,
          outcome: 'Sarah disputes, but the toll authority provides photo evidence of her license plate. The debt is valid. Legal action becomes more likely.',
          score: 30,
          feedback: 'Disputing valid debt wastes time and can lead to legal action. If the debt is legitimate, it\'s better to work on a solution.'
        },
        {
          id: 'b',
          text: 'Ask about payment options and work out a plan',
          isCorrect: true,
          outcome: 'The collector offers a 6-month payment plan of $140/month. Sarah agrees, makes regular payments, and clears the debt. Her credit is protected.',
          score: 100,
          feedback: 'Excellent! Working cooperatively with collectors is the best path forward. Payment plans make debt manageable.'
        },
        {
          id: 'c',
          text: 'Hang up and ignore future calls',
          isCorrect: false,
          outcome: 'The collection agency reports the debt to credit bureaus. Sarah\'s credit score drops 80 points. Six months later, she\'s sued and wages are garnished.',
          score: 20,
          feedback: 'Avoiding collectors makes everything worse. They have legal remedies and will use them. Communication is always better than avoidance.'
        },
        {
          id: 'd',
          text: 'Verify the debt details and negotiate if valid',
          isCorrect: true,
          outcome: 'Sarah requests verification. Once confirmed, she negotiates a settlement for $650 paid in full. The collector agrees, and the matter is resolved.',
          score: 100,
          feedback: 'Smart approach! Verifying debt is your right, and collectors often have settlement authority. This saves Sarah money legally.'
        }
      ]
    }
  },
  {
    level: 4,
    title: 'The Ripple Effect: Credit Impact',
    passingScore: 75,
    scenario: {
      intro: "Let's explore what happens when Sarah ignores the collection effort. Six months have passed.",
      initialSituation: "Sarah applied for a car loan. She was shocked when denied. The reason: a collection account for $837.50 on her credit report.",
      question: "What has Sarah learned about the impact of unpaid debt?",
      choices: [
        {
          id: 'a',
          text: "Small debts don't affect credit scores",
          isCorrect: false,
          outcome: 'This is a myth. Sarah learns that even small collection accounts can significantly impact credit, especially when they result from unpaid obligations.',
          score: 40,
          feedback: 'Wrong. Collection accounts are serious negative marks, regardless of amount. They signal irresponsibility to lenders.'
        },
        {
          id: 'b',
          text: 'Collection accounts severely damage credit and opportunities',
          isCorrect: true,
          outcome: 'Sarah realizes this $837 debt is now costing her thousands in higher interest rates and lost opportunities. She resolves it immediately.',
          score: 100,
          feedback: 'Exactly right. The true cost of unpaid debt goes far beyond the original amount. It affects your financial future.'
        },
        {
          id: 'c',
          text: "Credit reports don't matter for car loans",
          isCorrect: false,
          outcome: 'Sarah learns the hard way that credit reports affect nearly every major financial decision - loans, apartments, even some jobs.',
          score: 30,
          feedback: 'Very wrong. Credit reports are crucial for major life decisions. Ignoring them can derail your plans.'
        },
        {
          id: 'd',
          text: 'Paying the debt now will immediately fix her credit',
          isCorrect: false,
          outcome: 'Sarah pays the debt but learns the collection account stays on her credit for 7 years, though its impact lessens over time.',
          score: 60,
          feedback: "Partially correct. Paying is essential, but negative marks don't disappear immediately. However, paid collections are better than unpaid ones."
        }
      ]
    }
  },
  {
    level: 5,
    title: 'The Full Picture: Your Role as a Collector',
    passingScore: 80,
    scenario: {
      intro: "Now you understand Sarah's journey from both sides. As a collection specialist, you have the power to help people like Sarah.",
      initialSituation: "You receive Sarah's account. She's overwhelmed, scared, and didn't know this debt existed. How do you approach this call?",
      question: "What is your professional responsibility in this situation?",
      choices: [
        {
          id: 'a',
          text: 'Be aggressive to ensure payment',
          isCorrect: false,
          outcome: 'Sarah becomes defensive and refuses to engage. She hangs up and blocks the number. The account becomes uncollectible.',
          score: 20,
          feedback: 'Aggression violates regulations and is counterproductive. It creates resistance instead of cooperation.'
        },
        {
          id: 'b',
          text: 'Show empathy while offering solutions',
          isCorrect: true,
          outcome: 'Sarah feels heard and understood. She trusts you and accepts a payment plan. The debt is resolved, and everyone benefits.',
          score: 100,
          feedback: 'Perfect! Empathy + professionalism = results. You help the consumer, your client, and society by facilitating resolution.'
        },
        {
          id: 'c',
          text: 'Only focus on getting money quickly',
          isCorrect: false,
          outcome: "Sarah feels pressured and makes a promise she can't keep. She defaults, and the account requires more expensive recovery efforts.",
          score: 40,
          feedback: 'Short-term thinking fails. Sustainable payment arrangements are better than broken promises.'
        },
        {
          id: 'd',
          text: 'Educate her about debt consequences and offer multiple solutions',
          isCorrect: true,
          outcome: 'Sarah understands the full situation and her options. She chooses a solution that works for her budget. She even thanks you for your help.',
          score: 100,
          feedback: 'Excellent! Education empowers consumers to make good decisions. This is professional debt collection at its best.'
        }
      ]
    }
  }
];

export default function Lesson2() {
  const navigate = useNavigate();
  const [lessonProgress, setLessonProgress] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [gameState, setGameState] = useState('intro'); // intro, question, outcome, completed
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [outcome, setOutcome] = useState(null);
  const [score, setScore] = useState(0);
  const [aiFeedback, setAiFeedback] = useState(null);
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const [decisionStartTime, setDecisionStartTime] = useState(Date.now());

  useEffect(() => {
    const progress = startLesson(1);
    setLessonProgress(progress);
    if (progress.currentLevel > 1) {
      setCurrentLevel(progress.currentLevel);
    }
  }, []);

  useEffect(() => {
    // Reset decision timer when level changes
    setDecisionStartTime(Date.now());
  }, [currentLevel]);

  const getLevelData = () => STORY_LEVELS.find(l => l.level === currentLevel);

  const handleChoiceSelect = (choice) => {
    setSelectedChoice(choice);
  };

  const handleSubmitChoice = async () => {
    if (!selectedChoice) return;

    const timeTaken = Math.round((Date.now() - decisionStartTime) / 1000);
    
    setOutcome(selectedChoice);
    setScore(selectedChoice.score);
    setGameState('outcome');
    setIsGeneratingFeedback(true);

    // Generate AI feedback
    try {
      const levelData = getLevelData();
      const feedback = await generateAIFeedback({
        lessonId: 1,
        levelNumber: currentLevel,
        userChoice: selectedChoice.id,
        choiceText: selectedChoice.text,
        scenario: `${levelData.scenario.intro} - ${levelData.scenario.question}`,
        isCorrect: selectedChoice.isCorrect,
        timeTaken,
        previousAttempts: lessonProgress?.levelScores?.[currentLevel]?.attempts || 0,
        userHistory: {
          averageScore: lessonProgress?.averageScore || 0,
          levelsCompleted: lessonProgress?.levelsCompleted?.length || 0
        }
      });
      
      setAiFeedback(feedback);
    } catch (error) {
      console.error('Error generating AI feedback:', error);
      setAiFeedback({
        mainFeedback: selectedChoice.feedback,
        timeAnalysis: timeTaken < 5 ? "Quick decision!" : timeTaken > 30 ? "Take time to think, but trust your instincts." : "Good decision timing.",
        keyInsight: "Professional debt collection requires both empathy and strategic thinking.",
        nextSteps: "Consider all perspectives before making your choice.",
        encouragement: "Keep learning and improving!",
        score: selectedChoice.score,
        badges: selectedChoice.isCorrect ? ["Good Choice"] : ["Learning Experience"]
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  const handleNextLevel = () => {
    const passed = (aiFeedback?.score || score) >= getLevelData().passingScore;
    
    // Save progress
    saveLevelScore(1, currentLevel, {
      score: aiFeedback?.score || score,
      passed,
      attempts: 1,
      timestamp: new Date().toISOString()
    });

    if (passed && currentLevel < STORY_LEVELS.length) {
      setCurrentLevel(currentLevel + 1);
      setGameState('intro');
      setSelectedChoice(null);
      setOutcome(null);
      setScore(0);
      setAiFeedback(null);
      
      // Reload progress
      const progress = getLessonProgress(1);
      setLessonProgress(progress);
    } else if (passed && currentLevel === STORY_LEVELS.length) {
      setGameState('completed');
    } else {
      // Failed - retry level
      setGameState('intro');
      setSelectedChoice(null);
      setOutcome(null);
      setScore(0);
      setAiFeedback(null);
    }
  };

  const handleRetry = () => {
    setGameState('intro');
    setSelectedChoice(null);
    setOutcome(null);
    setScore(0);
  };

  if (!lessonProgress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  const levelData = getLevelData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950">
      <LessonProgressSidebar currentLessonId={1} />
      
      <div className="max-w-5xl mx-auto px-4 py-20 pr-[420px]">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/lessons')}
            className="mb-4 text-slate-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Lessons
          </button>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            📚 Understanding Debt and Why It Matters
          </h1>
          <p className="text-slate-300">
            Follow Sarah's interactive story and learn about debt consequences
          </p>
        </div>

        {/* Level Progress */}
        <div className="mb-8 flex items-center gap-2">
          {STORY_LEVELS.map((level) => {
            const isCompleted = lessonProgress.levelsCompleted.includes(level.level);
            const isCurrent = level.level === currentLevel;
            const isLocked = !isLevelUnlocked(1, level.level);

            return (
              <button
                key={level.level}
                onClick={() => {
                  if (!isLocked) {
                    setCurrentLevel(level.level);
                    setGameState('intro');
                    setSelectedChoice(null);
                    setOutcome(null);
                    setScore(0);
                  }
                }}
                disabled={isLocked}
                className={`flex-1 p-3 rounded-lg border transition ${
                  isCurrent
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 border-emerald-400 shadow-lg shadow-emerald-500/50'
                    : isCompleted
                    ? 'bg-green-500/20 border-green-500/50'
                    : isLocked
                    ? 'bg-slate-800/30 border-slate-700 opacity-50 cursor-not-allowed'
                    : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="text-sm font-semibold text-white">Level {level.level}</div>
                {isCompleted && <div className="text-xs text-green-400">✓ Complete</div>}
                {isLocked && <div className="text-xs text-slate-500">🔒 Locked</div>}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10 rounded-2xl p-8">
          
          {gameState === 'intro' && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-white mb-4">{levelData.title}</h2>
              
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/30 rounded-lg">
                <p className="text-slate-200 text-lg leading-relaxed">{levelData.scenario.intro}</p>
              </div>

              <div className="p-4 bg-slate-700/30 rounded-lg">
                <p className="text-slate-300 leading-relaxed">{levelData.scenario.initialSituation}</p>
              </div>

              <button
                onClick={() => setGameState('question')}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold text-lg hover:from-emerald-600 hover:to-cyan-600 transition"
              >
                Continue →
              </button>
            </div>
          )}

          {gameState === 'question' && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white mb-4">{levelData.scenario.question}</h2>
              
              <div className="space-y-3">
                {levelData.scenario.choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handleChoiceSelect(choice)}
                    className={`w-full p-4 rounded-lg border-2 transition text-left ${
                      selectedChoice?.id === choice.id
                        ? 'bg-emerald-500/20 border-emerald-500'
                        : 'bg-slate-700/30 border-slate-600 hover:border-slate-500'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        selectedChoice?.id === choice.id
                          ? 'border-emerald-500 bg-emerald-500'
                          : 'border-slate-500'
                      }`}>
                        {selectedChoice?.id === choice.id && (
                          <div className="w-3 h-3 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="text-slate-200">{choice.text}</span>
                    </div>
                  </button>
                ))}
              </div>

              <button
                onClick={handleSubmitChoice}
                disabled={!selectedChoice}
                className="w-full py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold text-lg hover:from-emerald-600 hover:to-cyan-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Answer
              </button>
            </div>
          )}

          {gameState === 'outcome' && outcome && (
            <div className="space-y-6">
              {/* Scenario Outcome */}
              <div className={`p-6 rounded-xl border-2 ${
                outcome.isCorrect
                  ? 'bg-green-500/10 border-green-500'
                  : 'bg-amber-500/10 border-amber-500'
              }`}>
                <div className="text-4xl mb-3">{outcome.isCorrect ? '✅' : '⚠️'}</div>
                <h3 className="text-2xl font-bold text-white mb-3">What Happened</h3>
                <p className="text-slate-200 text-lg leading-relaxed mb-4">{outcome.outcome}</p>
              </div>

              {/* AI Feedback Section */}
              <div className="bg-gradient-to-br from-slate-900/80 to-slate-800/80 border border-blue-500/30 rounded-2xl p-6 shadow-2xl">
                <div className="text-center mb-4">
                  <ProtrainAI isThinking={isGeneratingFeedback} isPulsing={!isGeneratingFeedback && aiFeedback !== null} />
                  <h3 className="text-xl font-bold text-blue-400 mb-1">ProTrain.AI Analysis</h3>
                  <p className="text-sm text-slate-400">Your Personal Training Coach</p>
                </div>

                {isGeneratingFeedback ? (
                  <div className="text-center py-8">
                    <div className="flex items-center justify-center gap-2 text-blue-400">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                    <p className="text-slate-300 mt-3">Analyzing your performance...</p>
                  </div>
                ) : aiFeedback && (
                  <div className="space-y-4">
                    {/* Main Feedback */}
                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-blue-400 mb-2">📊 Performance Analysis</h4>
                      <p className="text-slate-200 leading-relaxed">{aiFeedback.mainFeedback}</p>
                    </div>

                    {/* Time Analysis */}
                    <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-cyan-400 mb-2">⏱️ Decision Speed</h4>
                      <p className="text-slate-200 leading-relaxed">{aiFeedback.timeAnalysis}</p>
                    </div>

                    {/* Key Insight */}
                    <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-purple-400 mb-2">💡 Key Insight</h4>
                      <p className="text-slate-200 leading-relaxed">{aiFeedback.keyInsight}</p>
                    </div>

                    {/* Next Steps */}
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
                      <h4 className="text-sm font-semibold text-emerald-400 mb-2">🎯 Next Steps</h4>
                      <p className="text-slate-200 leading-relaxed">{aiFeedback.nextSteps}</p>
                    </div>

                    {/* Badges */}
                    {aiFeedback.badges && aiFeedback.badges.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {aiFeedback.badges.map((badge, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full text-amber-400 text-sm font-semibold"
                          >
                            🏆 {badge}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Encouragement */}
                    <div className="bg-gradient-to-r from-pink-500/10 to-rose-500/10 border border-pink-500/30 rounded-xl p-4 text-center">
                      <p className="text-slate-200 leading-relaxed italic">"{aiFeedback.encouragement}"</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Score Display */}
              <div className="p-4 bg-slate-700/30 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Your Score</span>
                  <span className="text-3xl font-bold text-white">{aiFeedback?.score || score}/100</span>
                </div>
                <div className="mt-2 bg-slate-600 rounded-full h-2">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full transition-all duration-500"
                    style={{ width: `${aiFeedback?.score || score}%` }}
                  ></div>
                </div>
                <div className="mt-2 text-sm text-slate-400">
                  Passing Score: {levelData.passingScore}/100
                </div>
              </div>

              <div className="flex gap-3">
                {score >= levelData.passingScore ? (
                  <button
                    onClick={handleNextLevel}
                    className="flex-1 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold text-lg hover:from-emerald-600 hover:to-cyan-600 transition"
                  >
                    {currentLevel < STORY_LEVELS.length ? 'Next Level →' : 'Complete Lesson ✓'}
                  </button>
                ) : (
                  <button
                    onClick={handleRetry}
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
                You've mastered understanding debt and why it matters.
              </p>
              
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{lessonProgress.levelsCompleted.length}/{STORY_LEVELS.length}</div>
                  <div className="text-sm text-slate-300">Levels Complete</div>
                </div>
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{lessonProgress.averageScore}%</div>
                  <div className="text-sm text-slate-300">Average Score</div>
                </div>
              </div>

              <button
                onClick={() => navigate('/lessons')}
                className="px-8 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold text-lg hover:from-emerald-600 hover:to-cyan-600 transition"
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
