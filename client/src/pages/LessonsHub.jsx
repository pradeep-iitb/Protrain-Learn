import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS, getAllProgress, getOverallStats, resetAllProgress } from '../utils/lessonProgressStorage';
import LessonProgressSidebar from '../components/LessonProgressSidebar';
import Navbar from '../components/Navbar';

export default function LessonsHub() {
  const [allProgress, setAllProgress] = useState(null);
  const [stats, setStats] = useState(null);
  const [godMode, setGodMode] = useState(false);

  useEffect(() => {
    loadProgress();
    // Check if God Mode is enabled in localStorage
    const savedGodMode = localStorage.getItem('protrain_god_mode') === 'true';
    setGodMode(savedGodMode);
    
    // Keyboard shortcut: Ctrl+Shift+G to toggle God Mode
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'G') {
        e.preventDefault();
        toggleGodMode();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [godMode]);

  const loadProgress = () => {
    const progress = getAllProgress();
    const overallStats = getOverallStats();
    setAllProgress(progress);
    setStats(overallStats);
  };

  const toggleGodMode = () => {
    const newGodMode = !godMode;
    setGodMode(newGodMode);
    localStorage.setItem('protrain_god_mode', newGodMode.toString());
    
    if (newGodMode) {
      // Unlock all lessons for access - don't complete them!
      const progress = getAllProgress();
      LESSONS.forEach(lesson => {
        if (progress.lessons[lesson.id]) {
          // Mark as started so they're accessible
          if (!progress.lessons[lesson.id].startedAt) {
            progress.lessons[lesson.id].startedAt = new Date().toISOString();
          }
          // Don't change completion status, scores, or XP
          // Keep everything at 0 so user can demo the actual training
        }
      });
      
      localStorage.setItem('protrain_lesson_progress', JSON.stringify(progress));
      loadProgress();
      
      // Show success message
      alert('⚡ GOD MODE ACTIVATED!\n\n✅ All lessons are now unlocked\n🎯 You can access any lesson for demo purposes\n📊 Progress tracking is still active\n\nClick the button again to return to normal mode.');
    } else {
      // When disabling god mode, reload progress to show current state
      loadProgress();
      alert('🔒 GOD MODE DEACTIVATED\n\n✅ Lessons are now locked based on your actual progress\n📚 Complete lessons in order to unlock the next ones');
    }
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
      <Navbar />
      <LessonProgressSidebar />
      
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-20 pr-[400px]">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1"></div>
            <h1 className="font-display text-5xl md:text-6xl font-bold text-white flex-1">
              Interactive Training Lessons
            </h1>
            
            {/* God Mode Toggle Button */}
            <div className="flex-1 flex justify-end">
              <button
                onClick={toggleGodMode}
                className={`group relative px-6 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                  godMode
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50 hover:shadow-purple-500/70 hover:scale-105'
                    : 'bg-slate-800/50 border-2 border-slate-700 text-slate-400 hover:border-purple-500/50 hover:text-purple-400'
                }`}
                title={godMode ? 'Disable God Mode - Lock lessons again' : 'Enable God Mode - Unlock all lessons for demo'}
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{godMode ? '⚡' : '🔒'}</span>
                  <span>{godMode ? 'God Mode Active' : 'Unlock All Lessons'}</span>
                  {godMode && (
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50" />
                  )}
                </div>
                {godMode && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50 -z-10 animate-pulse" />
                )}
              </button>
            </div>
          </div>
          
          {godMode && (
            <div className="mb-6 mx-auto max-w-2xl bg-gradient-to-r from-purple-500/20 to-pink-500/20 border-2 border-purple-500/50 rounded-xl p-4 shadow-lg shadow-purple-500/20">
              <p className="text-purple-300 font-semibold flex items-center justify-center gap-2">
                <span className="text-2xl animate-pulse">⚡</span>
                <span>GOD MODE ACTIVE - All lessons unlocked for full access!</span>
                <span className="text-2xl animate-pulse">⚡</span>
              </p>
              <p className="text-purple-400 text-xs text-center mt-2">
                Click the button again to lock lessons and return to normal progression
              </p>
            </div>
          )}
          
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

        {/* Pagination */}
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            disabled
            className="px-6 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-slate-500 cursor-not-allowed flex items-center gap-2"
          >
            <span>←</span>
            <span>Previous</span>
          </button>
          <div className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold">
            Page 1 of 3
          </div>
          <button
            onClick={() => alert('🎉 More lessons coming soon!\n\nStay tuned for updates!')}
            className="px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-lg text-white font-semibold hover:from-emerald-600 hover:to-cyan-600 transition flex items-center gap-2"
          >
            <span>Next</span>
            <span>→</span>
          </button>
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

        {/* Appendix Section */}
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/30 rounded-2xl">
          <h3 className="text-xl font-bold text-white mb-4">📚 Reference Materials</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <Link
              to="/appendix/a"
              className="group p-4 bg-slate-800/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <div className="text-3xl mb-2">📖</div>
              <div className="text-white font-semibold group-hover:text-blue-400 transition">Glossary of Terms</div>
              <div className="text-slate-400 text-sm">Appendix A</div>
            </Link>
            
            <Link
              to="/appendix/b"
              className="group p-4 bg-slate-800/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <div className="text-3xl mb-2">📍</div>
              <div className="text-white font-semibold group-hover:text-blue-400 transition">State-Specific Guide</div>
              <div className="text-slate-400 text-sm">Appendix B</div>
            </Link>
            
            <Link
              to="/appendix/c"
              className="group p-4 bg-slate-800/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <div className="text-3xl mb-2">📞</div>
              <div className="text-white font-semibold group-hover:text-blue-400 transition">Emergency Contacts</div>
              <div className="text-slate-400 text-sm">Appendix C</div>
            </Link>
            
            <Link
              to="/appendix/d"
              className="group p-4 bg-slate-800/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all"
            >
              <div className="text-3xl mb-2">✅</div>
              <div className="text-white font-semibold group-hover:text-blue-400 transition">Compliance Checklist</div>
              <div className="text-slate-400 text-sm">Appendix D</div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* God Mode Indicator - Bottom Right */}
      {godMode && (
        <div className="fixed bottom-8 right-8 z-50">
          <div className="relative group cursor-pointer" onClick={toggleGodMode}>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl animate-pulse" />
            <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
              <span className="text-xl animate-pulse">⚡</span>
              <span className="font-bold text-sm">GOD MODE ACTIVE</span>
              <span className="text-xl animate-pulse">⚡</span>
            </div>
            <div className="absolute -top-8 right-0 bg-slate-900 text-purple-300 text-xs px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Click to disable
            </div>
          </div>
        </div>
      )}
      
      {/* Keyboard Shortcut Hint */}
      <div className="fixed bottom-4 left-4 text-xs text-slate-600 opacity-50 hover:opacity-100 transition-opacity bg-slate-900/50 backdrop-blur px-3 py-2 rounded-lg border border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Shortcut:</span>
          <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400">Ctrl</kbd>
          <span className="text-slate-700">+</span>
          <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400">Shift</kbd>
          <span className="text-slate-700">+</span>
          <kbd className="px-2 py-1 bg-slate-800 rounded border border-slate-700 text-slate-400">G</kbd>
          <span className="text-slate-500">=</span>
          <span className="text-purple-500">⚡ God Mode</span>
        </div>
      </div>
    </div>
  );
}
