import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LESSONS, getAllProgress, getOverallStats } from '../utils/lessonProgressStorage';
import Navbar from '../components/Navbar';
import Dashboard from '../components/Dashboard';

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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20">
        {/* Dashboard Section */}
        <div className="mb-12">
          <Dashboard />
        </div>

        {/* Training Modes Section */}
        <div className="mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2 text-center">
            Choose Your Training Mode
          </h2>
          <p className="text-slate-400 text-center mb-8">
            Practice with different methods to master debt collection
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Chat Mode Card */}
            <Link
              to="/lessons/2"
              className="group relative bg-gradient-to-br from-cyan-600/20 to-blue-600/20 backdrop-blur border-2 border-cyan-500/30 rounded-2xl p-6 md:p-8 hover:border-cyan-500/60 hover:shadow-2xl hover:shadow-cyan-500/20 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-cyan-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">→</span>
              </div>
              
              <div className="text-6xl md:text-7xl mb-6">💬</div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-cyan-400 transition">
                Chat Mode
              </h3>
              <p className="text-slate-300 mb-6 text-sm md:text-base">
                Practice conversations through text-based interactions. Progress through levels with increasing difficulty.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-cyan-400">✓</span>
                  <span>Multiple difficulty levels</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-cyan-400">✓</span>
                  <span>AI-powered responses</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-cyan-400">✓</span>
                  <span>Instant feedback & scoring</span>
                </div>
              </div>

              <div className="inline-block px-4 py-2 bg-cyan-500/20 border border-cyan-500/50 rounded-full text-cyan-400 font-semibold text-sm">
                Text-based Training
              </div>
            </Link>

            {/* Voice Mode Card */}
            <Link
              to="/lessons/8"
              className="group relative bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur border-2 border-purple-500/30 rounded-2xl p-6 md:p-8 hover:border-purple-500/60 hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">→</span>
              </div>
              
              <div className="text-6xl md:text-7xl mb-6">🎙️</div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-purple-400 transition">
                Voice Mode
              </h3>
              <p className="text-slate-300 mb-6 text-sm md:text-base">
                Realistic voice conversations with 25 AI personas. All personas available for immersive practice.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-purple-400">✓</span>
                  <span>25 unique AI personas</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-purple-400">✓</span>
                  <span>Voice recognition & TTS</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-purple-400">✓</span>
                  <span>Real-time conversation flow</span>
                </div>
              </div>

              <div className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-400 font-semibold text-sm">
                Voice-based Training
              </div>
            </Link>

            {/* Puzzles Mode Card */}
            <Link
              to="/lessons/1"
              className="group relative bg-gradient-to-br from-emerald-600/20 to-green-600/20 backdrop-blur border-2 border-emerald-500/30 rounded-2xl p-6 md:p-8 hover:border-emerald-500/60 hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-300 hover:scale-105"
            >
              <div className="absolute top-4 right-4 w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                <span className="text-2xl">→</span>
              </div>
              
              <div className="text-6xl md:text-7xl mb-6">🧩</div>
              
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-emerald-400 transition">
                Puzzles
              </h3>
              <p className="text-slate-300 mb-6 text-sm md:text-base">
                Challenge yourself with scenario-based puzzles. Progress through levels to sharpen your skills.
              </p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-emerald-400">✓</span>
                  <span>Progressive difficulty levels</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-emerald-400">✓</span>
                  <span>Scenario-based challenges</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-emerald-400">✓</span>
                  <span>Problem-solving focus</span>
                </div>
              </div>

              <div className="inline-block px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-full text-emerald-400 font-semibold text-sm">
                Logic & Strategy
              </div>
            </Link>
          </div>
        </div>

        {/* Reference Materials Section */}
        <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border border-blue-500/30 rounded-2xl p-6 md:p-8">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 text-center">
            📚 Reference Materials
          </h3>
          <p className="text-slate-400 text-center mb-6">
            Quick access to essential resources and guidelines
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link
              to="/appendix/a"
              className="group p-4 md:p-6 bg-slate-800/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105"
            >
              <div className="text-3xl md:text-4xl mb-3">📖</div>
              <div className="text-white font-semibold group-hover:text-blue-400 transition text-sm md:text-base">
                Glossary of Terms
              </div>
              <div className="text-slate-400 text-xs md:text-sm mt-1">Appendix A</div>
            </Link>
            
            <Link
              to="/appendix/b"
              className="group p-4 md:p-6 bg-slate-800/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105"
            >
              <div className="text-3xl md:text-4xl mb-3">📍</div>
              <div className="text-white font-semibold group-hover:text-blue-400 transition text-sm md:text-base">
                State-Specific Guide
              </div>
              <div className="text-slate-400 text-xs md:text-sm mt-1">Appendix B</div>
            </Link>
            
            <Link
              to="/appendix/c"
              className="group p-4 md:p-6 bg-slate-800/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105"
            >
              <div className="text-3xl md:text-4xl mb-3">📞</div>
              <div className="text-white font-semibold group-hover:text-blue-400 transition text-sm md:text-base">
                Emergency Contacts
              </div>
              <div className="text-slate-400 text-xs md:text-sm mt-1">Appendix C</div>
            </Link>
            
            <Link
              to="/appendix/d"
              className="group p-4 md:p-6 bg-slate-800/50 border border-white/10 rounded-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all hover:scale-105"
            >
              <div className="text-3xl md:text-4xl mb-3">✅</div>
              <div className="text-white font-semibold group-hover:text-blue-400 transition text-sm md:text-base">
                Compliance Checklist
              </div>
              <div className="text-slate-400 text-xs md:text-sm mt-1">Appendix D</div>
            </Link>
          </div>
        </div>

        {/* God Mode Toggle - Bottom Right Corner */}
        {godMode && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="relative group cursor-pointer" onClick={toggleGodMode}>
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 md:px-6 py-2 md:py-3 rounded-full shadow-2xl flex items-center gap-2 group-hover:scale-110 transition-transform duration-300">
                <span className="text-lg md:text-xl animate-pulse">⚡</span>
                <span className="font-bold text-xs md:text-sm hidden sm:inline">GOD MODE</span>
                <span className="text-lg md:text-xl animate-pulse">⚡</span>
              </div>
            </div>
          </div>
        )}

        {/* God Mode Toggle Button - Mobile Friendly */}
        <div className="fixed bottom-6 left-6 z-50">
          <button
            onClick={toggleGodMode}
            className={`group relative px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
              godMode
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-slate-800/90 border-2 border-slate-700 text-slate-400 hover:border-purple-500/50'
            }`}
            title={godMode ? 'Disable God Mode' : 'Enable God Mode'}
          >
            <span className="text-xl">{godMode ? '⚡' : '🔒'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
