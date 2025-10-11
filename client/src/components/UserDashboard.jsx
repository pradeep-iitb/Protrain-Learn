import React, { useState, useEffect } from 'react';
import { calculateAverages, getProgressStats } from '../utils/progressStorage.js';

export default function UserDashboard() {
  const [stats, setStats] = useState({
    persuasion: 0,
    empathy: 0,
    negotiation: 0,
    totalLevelsCompleted: 0,
    currentLevel: 1,
    completionPercentage: 0
  });

  // Load real-time stats from localStorage
  useEffect(() => {
    const updateStats = () => {
      const averages = calculateAverages();
      const progressStats = getProgressStats();
      setStats({
        persuasion: averages.persuasion,
        empathy: averages.empathy,
        negotiation: averages.negotiation,
        totalLevelsCompleted: averages.totalLevelsCompleted,
        currentLevel: progressStats.currentLevel,
        completionPercentage: progressStats.completionPercentage
      });
    };
    
    updateStats();
    
    // Listen for storage changes to update in real-time
    window.addEventListener('storage', updateStats);
    
    // Also poll every second to catch same-tab updates
    const interval = setInterval(updateStats, 1000);
    
    return () => {
      window.removeEventListener('storage', updateStats);
      clearInterval(interval);
    };
  }, []);

  const user = {
    name: 'Pradeep Kumawat',
    role: 'Collections Agent',
    employeeId: 'EMP-1027',
    location: 'Mumbai, IN',
    tags: [
      'Active Listening',
      'De-escalation',
      'Payment Plans',
      'Objection Handling',
      'Regulatory',
      'Tone Control',
      'Rapport'
    ]
  };

  return (
    <section className="rounded-xl border border-white/10 bg-white/5 backdrop-blur p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-emerald-400/80 to-cyan-400/80 flex items-center justify-center text-black font-bold">
            {user.name.split(' ').map(n => n[0]).slice(0,2).join('')}
          </div>
          <div>
            <div className="text-white font-semibold">{user.name}</div>
            <div className="text-xs text-slate-300">{user.role} • {user.location}</div>
            <div className="text-xs text-slate-400">ID: {user.employeeId}</div>
          </div>
        </div>

        {/* Level tag and progress */}
        <div className="md:ml-auto flex items-center gap-3">
          <span className="px-3 py-1 text-sm rounded-full bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 font-semibold">
            Level {stats.currentLevel}/25
          </span>
          <span className="text-sm text-slate-300">
            {stats.totalLevelsCompleted} Completed • {stats.completionPercentage}%
          </span>
        </div>
      </div>

      {/* Real-time Average Performance Metrics (from completed levels) */}
      <div className="grid md:grid-cols-3 gap-4 mt-4">
        <div className="bg-black/30 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Persuasion (Avg)</span>
            <span className="text-slate-200 font-medium">{stats.persuasion}/100</span>
          </div>
          <div className="mt-2 h-2 w-full bg-white/10 rounded">
            <div className="h-2 rounded bg-cyan-500" style={{ width: `${stats.persuasion}%` }} />
          </div>
        </div>
        
        <div className="bg-black/30 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Empathy (Avg)</span>
            <span className="text-slate-200 font-medium">{stats.empathy}/100</span>
          </div>
          <div className="mt-2 h-2 w-full bg-white/10 rounded">
            <div className="h-2 rounded bg-emerald-500" style={{ width: `${stats.empathy}%` }} />
          </div>
        </div>
        
        <div className="bg-black/30 rounded-lg p-3 border border-white/10">
          <div className="flex items-center justify-between text-sm text-slate-300">
            <span>Negotiation (Avg)</span>
            <span className="text-slate-200 font-medium">{stats.negotiation}/100</span>
          </div>
          <div className="mt-2 h-2 w-full bg-white/10 rounded">
            <div className="h-2 rounded bg-violet-500" style={{ width: `${stats.negotiation}%` }} />
          </div>
        </div>
      </div>

      {/* Skill tags */}
      <div className="mt-4 flex flex-wrap gap-2">
        {user.tags.map(t => (
          <span key={t} className="px-2 py-1 text-xs rounded-full border border-white/10 bg-white/5 text-slate-200">{t}</span>
        ))}
      </div>
    </section>
  );
}
