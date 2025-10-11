import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LessonProgressSidebar from '../components/LessonProgressSidebar';
import {
  getLessonProgress,
  startLesson,
  saveLevelScore,
  isLevelUnlocked
} from '../utils/lessonProgressStorage';

// Compliance simulation levels
const COMPLIANCE_LEVELS = [
  { level: 1, title: 'Time Restrictions', passingScore: 80 },
  { level: 2, title: 'Third-Party Contact Rules', passingScore: 80 },
  { level: 3, title: 'Mini-Miranda Disclosure', passingScore: 85 },
  { level: 4, title: 'Harassment Prohibitions', passingScore: 85 },
  { level: 5, title: 'False Representations', passingScore: 85 },
  { level: 6, title: 'Call Frequency Limits (Reg F)', passingScore: 90 },
  { level: 7, title: 'Validation Notice Requirements', passingScore: 90 },
  { level: 8, title: 'Complex Compliance Scenarios', passingScore: 90 }
];

export default function Lesson4() {
  const navigate = useNavigate();
  const [lessonProgress, setLessonProgress] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);

  useEffect(() => {
    const progress = startLesson(3);
    setLessonProgress(progress);
    if (progress.currentLevel > 1) {
      setCurrentLevel(progress.currentLevel);
    }
  }, []);

  if (!lessonProgress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <Navbar />
      <LessonProgressSidebar currentLessonId={3} />
      
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-20 pr-[420px]">
        <div className="mb-8">
          <button
            onClick={() => navigate('/lessons')}
            className="mb-4 text-slate-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Lessons
          </button>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            ⚖️ The Regulatory Landscape
          </h1>
          <p className="text-slate-300">
            Master compliance with AI-powered simulation
          </p>
        </div>

        {/* Level Progress */}
        <div className="mb-8 grid grid-cols-4 gap-2">
          {COMPLIANCE_LEVELS.map((level) => {
            const isCompleted = lessonProgress.levelsCompleted.includes(level.level);
            const isCurrent = level.level === currentLevel;
            const isLocked = !isLevelUnlocked(3, level.level);

            return (
              <button
                key={level.level}
                onClick={() => !isLocked && setCurrentLevel(level.level)}
                disabled={isLocked}
                className={`p-3 rounded-lg border transition ${
                  isCurrent
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 border-blue-400'
                    : isCompleted
                    ? 'bg-green-500/20 border-green-500/50'
                    : isLocked
                    ? 'bg-slate-800/30 border-slate-700 opacity-50 cursor-not-allowed'
                    : 'bg-slate-800/50 border-slate-600 hover:border-slate-500'
                }`}
              >
                <div className="text-sm font-semibold text-white">L{level.level}</div>
                {isCompleted && <div className="text-xs text-green-400">✓</div>}
                {isLocked && <div className="text-xs text-slate-500">🔒</div>}
              </button>
            );
          })}
        </div>

        {/* Main Content */}
        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10 rounded-2xl p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-3xl font-bold text-white mb-4">Compliance Simulation</h2>
            <p className="text-xl text-slate-300 mb-8">
              Interactive compliance training coming soon!
            </p>
            <p className="text-slate-400 mb-8">
              This lesson will feature AI-powered compliance auditing, real-time violation detection,
              and detailed feedback on FDCPA, TCPA, and Regulation F compliance.
            </p>
            <button
              onClick={() => navigate('/lessons')}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white font-semibold text-lg hover:from-blue-600 hover:to-cyan-600 transition"
            >
              Return to Lessons Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
