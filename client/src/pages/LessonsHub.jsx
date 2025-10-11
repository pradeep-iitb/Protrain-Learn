import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS, getAllProgress, getOverallStats } from '../utils/lessonProgressStorage';
import LessonProgressSidebar from '../components/LessonProgressSidebar';

export default function LessonsHub() {
  const [allProgress, setAllProgress] = useState(null);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = () => {
    const progress = getAllProgress();
    const overallStats = getOverallStats();
    setAllProgress(progress);
    setStats(overallStats);
  };

  if (!allProgress || !stats) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <LessonProgressSidebar />
      
      <div className="max-w-7xl mx-auto px-4 py-20 pr-[400px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-display text-5xl md:text-6xl font-bold text-white mb-4">
            Interactive Training Lessons
          </h1>
          <p className="text-xl text-slate-300 mb-6">
            Master debt collection through immersive, AI-powered experiences
          </p>
          
          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-500/20 to-cyan-500/20 backdrop-blur border border-emerald-500/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">{stats.completedLessons}/{stats.totalLessons}</div>
              <div className="text-sm text-slate-300">Lessons Complete</div>
            </div>
            <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 backdrop-blur border border-violet-500/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">{stats.completedLevels}/{stats.totalLevels}</div>
              <div className="text-sm text-slate-300">Levels Complete</div>
            </div>
            <div className="bg-gradient-to-br from-amber-500/20 to-yellow-500/20 backdrop-blur border border-amber-500/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">{stats.totalXP}</div>
              <div className="text-sm text-slate-300">Total XP</div>
            </div>
            <div className="bg-gradient-to-br from-rose-500/20 to-pink-500/20 backdrop-blur border border-rose-500/30 rounded-xl p-4">
              <div className="text-3xl font-bold text-white">{stats.overallCompletion}%</div>
              <div className="text-sm text-slate-300">Overall Progress</div>
            </div>
          </div>
        </div>

        {/* Lessons Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {LESSONS.map((lesson) => {
            const progress = allProgress.lessons[lesson.id];
            const isStarted = progress.levelsCompleted.length > 0;
            const isCompleted = progress.isCompleted;
            
            return (
              <Link
                key={lesson.id}
                to={`/lessons/${lesson.id}`}
                className="group relative bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10 rounded-2xl p-6 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/20 transition-all duration-300"
              >
                {/* Completion Badge */}
                {isCompleted && (
                  <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/50">
                    <span className="text-2xl">✓</span>
                  </div>
                )}
                
                {/* Icon */}
                <div className="text-6xl mb-4">{lesson.icon}</div>
                
                {/* Lesson Info */}
                <div className="mb-4">
                  <div className="text-sm text-emerald-400 font-semibold mb-2">LESSON {lesson.id}</div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-emerald-400 transition">
                    {lesson.title}
                  </h3>
                  <p className="text-slate-300 text-sm mb-4">{lesson.description}</p>
                  
                  {/* Type Badge */}
                  <div className="inline-block px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-slate-400">
                    {lesson.type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                </div>
                
                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Progress</span>
                    <span className="text-white font-semibold">
                      {progress.levelsCompleted.length}/{lesson.totalLevels} Levels
                    </span>
                  </div>
                  <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        isCompleted
                          ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                          : isStarted
                          ? 'bg-gradient-to-r from-amber-500 to-yellow-500'
                          : 'bg-gradient-to-r from-slate-600 to-slate-500'
                      }`}
                      style={{ width: `${progress.completionPercentage}%` }}
                    ></div>
                  </div>
                  
                  {progress.averageScore > 0 && (
                    <div className="flex justify-between text-sm pt-2">
                      <span className="text-slate-400">Average Score</span>
                      <span className="text-emerald-400 font-semibold">{progress.averageScore}%</span>
                    </div>
                  )}
                </div>
                
                {/* Action Button */}
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm">
                    {isCompleted ? (
                      <span className="text-green-400 font-semibold">✓ Completed</span>
                    ) : isStarted ? (
                      <span className="text-amber-400 font-semibold">Continue Learning</span>
                    ) : (
                      <span className="text-slate-400">Start Lesson</span>
                    )}
                  </div>
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center group-hover:scale-110 transition">
                    <span className="text-white text-xl">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Info Section */}
        <div className="mt-12 p-6 bg-gradient-to-r from-emerald-500/10 to-cyan-500/10 border border-emerald-500/30 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-2">🎯 How It Works</h3>
          <ul className="space-y-2 text-slate-300">
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Each lesson contains multiple levels of increasing difficulty</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Complete levels to earn XP and unlock achievements</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Track your progress in real-time through the sidebar dashboard</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Interact with AI to practice real-world scenarios</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-emerald-400">•</span>
              <span>Get instant feedback and personalized recommendations</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
