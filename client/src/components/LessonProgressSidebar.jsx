import React, { useState, useEffect } from 'react';
import { getOverallStats, getAllProgress, LESSONS } from '../utils/lessonProgressStorage';

export default function LessonProgressSidebar({ currentLessonId = null }) {
  const [stats, setStats] = useState(null);
  const [allProgress, setAllProgress] = useState(null);
  const [isExpanded, setIsExpanded] = useState(true);

  useEffect(() => {
    loadProgress();
    
    // Refresh every 2 seconds to show real-time updates
    const interval = setInterval(loadProgress, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadProgress = () => {
    const overallStats = getOverallStats();
    const progress = getAllProgress();
    setStats(overallStats);
    setAllProgress(progress);
  };

  if (!stats || !allProgress) {
    return (
      <div className="fixed right-0 top-20 h-[calc(100vh-5rem)] w-80 bg-slate-900/95 backdrop-blur border-l border-white/10 p-6 overflow-y-auto">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-700 rounded mb-4"></div>
          <div className="h-20 bg-slate-700 rounded mb-4"></div>
          <div className="h-40 bg-slate-700 rounded"></div>
        </div>
      </div>
    );
  }

  const getXPLevel = (xp) => {
    return Math.floor(xp / 1000) + 1;
  };

  const getXPProgress = (xp) => {
    const level = getXPLevel(xp);
    const xpForCurrentLevel = (level - 1) * 1000;
    const xpForNextLevel = level * 1000;
    const progress = ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    return Math.min(progress, 100);
  };

  return (
    <div className={`fixed right-0 top-20 h-[calc(100vh-5rem)] bg-slate-900/95 backdrop-blur border-l border-white/10 overflow-y-auto transition-all duration-300 ${
      isExpanded ? 'w-96' : 'w-16'
    }`}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute top-4 left-4 z-10 p-2 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg hover:from-emerald-600 hover:to-cyan-600 transition"
      >
        {isExpanded ? '→' : '←'}
      </button>

      {isExpanded && (
        <div className="p-6 pt-16">
          {/* User Header */}
          <div className="mb-6 text-center">
            <div className="w-20 h-20 mx-auto mb-3 bg-gradient-to-br from-emerald-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <h2 className="text-xl font-bold text-white mb-1">{stats.userName}</h2>
            <div className="flex items-center justify-center gap-2 text-sm">
              <span className="px-3 py-1 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 border border-amber-500/30 rounded-full text-amber-400">
                Level {getXPLevel(stats.totalXP)}
              </span>
              <span className="text-slate-400">{stats.totalXP} XP</span>
            </div>
            
            {/* XP Progress Bar */}
            <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-yellow-500 transition-all duration-500"
                style={{ width: `${getXPProgress(stats.totalXP)}%` }}
              ></div>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {Math.round(getXPProgress(stats.totalXP))}% to Level {getXPLevel(stats.totalXP) + 1}
            </p>
          </div>

          {/* Overall Stats */}
          <div className="mb-6 p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10">
            <h3 className="text-sm font-semibold text-emerald-400 mb-3">📊 Overall Progress</h3>
            
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Lessons Completed</span>
                  <span className="text-white font-bold">{stats.completedLessons}/{stats.totalLessons}</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-500"
                    style={{ width: `${(stats.completedLessons / stats.totalLessons) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-slate-300">Levels Completed</span>
                  <span className="text-white font-bold">{stats.completedLevels}/{stats.totalLevels}</span>
                </div>
                <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${stats.overallCompletion}%` }}
                  ></div>
                </div>
              </div>

              {stats.overallAverageScore > 0 && (
                <div className="pt-2 border-t border-white/10">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300">Average Score</span>
                    <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                      {stats.overallAverageScore}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Lessons Progress */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-cyan-400 mb-3">📚 Lessons</h3>
            <div className="space-y-2">
              {LESSONS.map((lesson) => {
                const progress = allProgress.lessons[lesson.id];
                const isCurrent = currentLessonId === lesson.id;
                
                return (
                  <div
                    key={lesson.id}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? 'bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border-emerald-500/50 shadow-lg shadow-emerald-500/20'
                        : progress.isCompleted
                        ? 'bg-slate-800/50 border-green-500/30'
                        : progress.levelsCompleted.length > 0
                        ? 'bg-slate-800/50 border-amber-500/30'
                        : 'bg-slate-800/30 border-white/10'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <span className="text-2xl">{lesson.icon}</span>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-semibold text-white truncate mb-1">
                          Lesson {lesson.id}
                        </h4>
                        <div className="flex items-center gap-2 mb-1">
                          <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full transition-all duration-500 ${
                                progress.isCompleted
                                  ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                                  : 'bg-gradient-to-r from-amber-500 to-yellow-500'
                              }`}
                              style={{ width: `${progress.completionPercentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-400 whitespace-nowrap">
                            {progress.levelsCompleted.length}/{lesson.totalLevels}
                          </span>
                        </div>
                        {progress.averageScore > 0 && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="text-slate-400">Avg:</span>
                            <span className="text-emerald-400 font-semibold">{progress.averageScore}%</span>
                          </div>
                        )}
                        {progress.isCompleted && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-green-500/20 border border-green-500/30 rounded text-xs text-green-400">
                            ✓ Completed
                          </span>
                        )}
                        {isCurrent && !progress.isCompleted && (
                          <span className="inline-block mt-1 px-2 py-0.5 bg-emerald-500/20 border border-emerald-500/30 rounded text-xs text-emerald-400">
                            ▶ In Progress
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Achievements */}
          {stats.achievements.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-amber-400 mb-3">🏆 Recent Achievements</h3>
              <div className="space-y-2">
                {stats.achievements.slice(-3).reverse().map((achievement, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-lg"
                  >
                    <h4 className="text-sm font-semibold text-amber-400 mb-1">{achievement.title}</h4>
                    <p className="text-xs text-slate-400">{achievement.description}</p>
                    {achievement.xp && (
                      <span className="inline-block mt-1 text-xs text-amber-300">+{achievement.xp} XP</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Last Updated */}
          <div className="text-center text-xs text-slate-500 mt-4">
            Last updated: {new Date(stats.lastUpdated).toLocaleTimeString()}
          </div>
        </div>
      )}

      {!isExpanded && (
        <div className="flex flex-col items-center gap-4 pt-20">
          {LESSONS.map((lesson) => {
            const progress = allProgress.lessons[lesson.id];
            const isCurrent = currentLessonId === lesson.id;
            
            return (
              <div
                key={lesson.id}
                className={`relative w-10 h-10 rounded-full flex items-center justify-center text-xl ${
                  isCurrent
                    ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-lg shadow-emerald-500/50'
                    : progress.isCompleted
                    ? 'bg-green-500/30 border-2 border-green-500'
                    : progress.levelsCompleted.length > 0
                    ? 'bg-amber-500/30 border-2 border-amber-500'
                    : 'bg-slate-800 border-2 border-slate-600'
                }`}
                title={`Lesson ${lesson.id}: ${progress.completionPercentage}%`}
              >
                {lesson.icon}
                {progress.isCompleted && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
