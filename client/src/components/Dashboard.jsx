import React, { useState, useEffect } from 'react';
import { getOverallStats } from '../utils/lessonProgressStorage';

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [recentFeedback, setRecentFeedback] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = () => {
    // Load overall stats
    const overallStats = getOverallStats();
    setStats(overallStats);

    // Load recent feedback from localStorage
    const feedback = JSON.parse(localStorage.getItem('protrain_recent_feedback') || '[]');
    setRecentFeedback(feedback.slice(0, 5)); // Last 5 sessions
  };

  if (!stats) {
    return (
      <div className="animate-pulse bg-slate-800/50 rounded-xl p-6 border border-slate-700">
        <div className="h-8 bg-slate-700 rounded w-1/4 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-slate-700 rounded w-full"></div>
          <div className="h-4 bg-slate-700 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  const averagePersuasion = recentFeedback.length > 0
    ? Math.round(recentFeedback.reduce((sum, f) => sum + (f.persuasion || 0), 0) / recentFeedback.length)
    : 0;
  
  const averageEmpathy = recentFeedback.length > 0
    ? Math.round(recentFeedback.reduce((sum, f) => sum + (f.empathy || 0), 0) / recentFeedback.length)
    : 0;
  
  const averageNegotiation = recentFeedback.length > 0
    ? Math.round(recentFeedback.reduce((sum, f) => sum + (f.negotiation || 0), 0) / recentFeedback.length)
    : 0;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBg = (score) => {
    if (score >= 80) return 'bg-green-500/20 border-green-500/30';
    if (score >= 60) return 'bg-yellow-500/20 border-yellow-500/30';
    return 'bg-red-500/20 border-red-500/30';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-red-600/20 border border-purple-500/30 rounded-2xl p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Welcome back! 👋
            </h2>
            <p className="text-slate-300">
              Ready to master your debt collection skills?
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-4xl font-bold text-white">{stats.totalXP} XP</div>
            <div className="text-sm text-slate-400">Total Experience</div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Persuasion Score */}
        <div className={`p-6 rounded-xl border ${getScoreBg(averagePersuasion)} backdrop-blur`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">🎯</div>
            <div className={`text-3xl font-bold ${getScoreColor(averagePersuasion)}`}>
              {averagePersuasion}%
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Persuasion</h3>
          <p className="text-sm text-slate-400">Average score across sessions</p>
          {/* Progress Bar */}
          <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                averagePersuasion >= 80 ? 'bg-green-500' : 
                averagePersuasion >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${averagePersuasion}%` }}
            />
          </div>
        </div>

        {/* Empathy Score */}
        <div className={`p-6 rounded-xl border ${getScoreBg(averageEmpathy)} backdrop-blur`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">❤️</div>
            <div className={`text-3xl font-bold ${getScoreColor(averageEmpathy)}`}>
              {averageEmpathy}%
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Empathy</h3>
          <p className="text-sm text-slate-400">Average score across sessions</p>
          {/* Progress Bar */}
          <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                averageEmpathy >= 80 ? 'bg-green-500' : 
                averageEmpathy >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${averageEmpathy}%` }}
            />
          </div>
        </div>

        {/* Negotiation Score */}
        <div className={`p-6 rounded-xl border ${getScoreBg(averageNegotiation)} backdrop-blur`}>
          <div className="flex items-center justify-between mb-4">
            <div className="text-4xl">🤝</div>
            <div className={`text-3xl font-bold ${getScoreColor(averageNegotiation)}`}>
              {averageNegotiation}%
            </div>
          </div>
          <h3 className="text-lg font-semibold text-white mb-1">Negotiation</h3>
          <p className="text-sm text-slate-400">Average score across sessions</p>
          {/* Progress Bar */}
          <div className="mt-3 bg-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                averageNegotiation >= 80 ? 'bg-green-500' : 
                averageNegotiation >= 60 ? 'bg-yellow-500' : 'bg-red-500'
              }`}
              style={{ width: `${averageNegotiation}%` }}
            />
          </div>
        </div>
      </div>

      {/* AI Recommendations */}
      <div className="bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl p-6">
        <div className="flex items-start gap-3">
          <div className="text-3xl">💡</div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">AI Recommendations</h3>
            <div className="space-y-2">
              {averagePersuasion < 70 && (
                <div className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-cyan-400">•</span>
                  <span>Practice building rapport before discussing payment terms to improve persuasion</span>
                </div>
              )}
              {averageEmpathy < 70 && (
                <div className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-cyan-400">•</span>
                  <span>Use more empathetic language like "I understand" and acknowledge borrower concerns</span>
                </div>
              )}
              {averageNegotiation < 70 && (
                <div className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-cyan-400">•</span>
                  <span>Offer multiple payment options and be flexible to improve negotiation outcomes</span>
                </div>
              )}
              {averagePersuasion >= 70 && averageEmpathy >= 70 && averageNegotiation >= 70 && (
                <>
                  <div className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-green-400">✓</span>
                    <span>Excellent performance! Keep practicing to maintain your skills</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-300 text-sm">
                    <span className="text-cyan-400">•</span>
                    <span>Try more challenging personas in Voice Mode to level up your abilities</span>
                  </div>
                </>
              )}
              {recentFeedback.length === 0 && (
                <div className="flex items-start gap-2 text-slate-300 text-sm">
                  <span className="text-amber-400">!</span>
                  <span>Start practicing with Chat Mode or Voice Mode to get personalized feedback</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {recentFeedback.length > 0 && (
        <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
            <span>📊</span>
            <span>Recent Sessions</span>
          </h3>
          <div className="space-y-3">
            {recentFeedback.map((feedback, idx) => (
              <div
                key={idx}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50"
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{feedback.mode === 'voice' ? '🎙️' : '💬'}</div>
                  <div>
                    <div className="text-white font-semibold">
                      {feedback.persona || 'Practice Session'}
                    </div>
                    <div className="text-xs text-slate-400">
                      {new Date(feedback.timestamp).toLocaleDateString()} at{' '}
                      {new Date(feedback.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className={`font-bold ${getScoreColor(feedback.persuasion || 0)}`}>
                      {feedback.persuasion || 0}
                    </div>
                    <div className="text-xs text-slate-500">Persuasion</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold ${getScoreColor(feedback.empathy || 0)}`}>
                      {feedback.empathy || 0}
                    </div>
                    <div className="text-xs text-slate-500">Empathy</div>
                  </div>
                  <div className="text-center">
                    <div className={`font-bold ${getScoreColor(feedback.negotiation || 0)}`}>
                      {feedback.negotiation || 0}
                    </div>
                    <div className="text-xs text-slate-500">Negotiation</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
