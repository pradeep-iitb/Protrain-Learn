import React from 'react';
import { getLevelById } from '../config/levels.js';

export default function FeedbackPanel({ feedback, currentLevelId }) {
  if (!feedback) return null;
  const { persuasion, empathy, negotiation, totalScore, overall_feedback, suggestions = [] } = feedback;
  
  const currentLevel = getLevelById(currentLevelId);
  const passed = totalScore >= (currentLevel?.passingScore || 0);
  
  return (
    <div className="animated-border-box p-6 bg-black/40 backdrop-blur rounded-lg border border-white/10 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span className="text-2xl">📊</span>
          Performance Evaluation
        </h3>
        <div className={`px-4 py-2 rounded-lg font-bold text-lg ${passed ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500' : 'bg-red-500/20 text-red-400 border-2 border-red-500'}`}>
          {passed ? '✅ PASSED' : '❌ NOT PASSED'}
        </div>
      </div>
      
      {/* Total Score */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-slate-300 font-semibold">Total Score</div>
            <div className="text-xs text-slate-400">Passing: {currentLevel?.passingScore}/300</div>
          </div>
          <div className="text-4xl font-bold text-white">{totalScore}<span className="text-xl text-slate-400">/300</span></div>
        </div>
        {/* Progress bar */}
        <div className="mt-3 h-3 bg-white/10 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${passed ? 'from-emerald-500 to-cyan-500' : 'from-orange-500 to-red-500'} transition-all duration-500`}
            style={{ width: `${(totalScore / 300) * 100}%` }}
          />
        </div>
      </div>
      
      {/* Individual Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Metric label="Persuasion" value={persuasion} maxValue={100} color="cyan" />
        <Metric label="Empathy" value={empathy} maxValue={100} color="emerald" />
        <Metric label="Negotiation" value={negotiation} maxValue={100} color="violet" />
      </div>
      
      {/* Overall Feedback */}
      {overall_feedback && (
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">Overall Feedback</div>
          <p className="text-sm text-slate-200">{overall_feedback}</p>
        </div>
      )}
      
      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="space-y-2">
          <div className="text-sm font-semibold text-slate-300">💡 Suggestions for Improvement:</div>
          <ul className="space-y-2">
            {suggestions.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                <span className="text-emerald-400 mt-0.5">→</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function Metric({ label, value, maxValue = 100, color = 'slate' }) {
  const colorMap = {
    emerald: 'from-emerald-500 to-emerald-600',
    cyan: 'from-cyan-500 to-cyan-600',
    violet: 'from-violet-500 to-violet-600',
    amber: 'from-amber-500 to-amber-600',
    slate: 'from-slate-500 to-slate-600'
  };
  
  const percentage = ((value ?? 0) / maxValue) * 100;
  const gradient = colorMap[color] || colorMap.slate;
  
  return (
    <div className="p-4 rounded-lg bg-white/5 border border-white/10 space-y-2">
      <div className="flex items-center justify-between">
        <div className="text-xs font-medium text-slate-400 uppercase tracking-wide">{label}</div>
        <div className="text-2xl font-bold text-white">{value ?? '-'}<span className="text-sm text-slate-400">/{maxValue}</span></div>
      </div>
      {/* Progress bar */}
      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
