import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import LessonProgressSidebar from '../components/LessonProgressSidebar';
import {
  getLessonProgress,
  startLesson
} from '../utils/lessonProgressStorage';

export default function Lesson9() {
  const navigate = useNavigate();
  const [lessonProgress, setLessonProgress] = useState(null);

  useEffect(() => {
    const progress = startLesson(5);
    setLessonProgress(progress);
  }, []);

  if (!lessonProgress) {
    return <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-white">Loading...</div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-yellow-950 to-slate-950">
      <Navbar />
      <LessonProgressSidebar currentLessonId={5} />
      
      <div className="max-w-5xl mx-auto px-4 pt-24 pb-20 pr-[420px]">
        <div className="mb-8">
          <button
            onClick={() => navigate('/lessons')}
            className="mb-4 text-slate-400 hover:text-white transition flex items-center gap-2"
          >
            ← Back to Lessons
          </button>
          <h1 className="font-display text-4xl font-bold text-white mb-2">
            ✅ Compliance Checklist and Quick Reference
          </h1>
          <p className="text-slate-300">
            Test your knowledge with fast-paced interactive quiz challenges
          </p>
        </div>

        <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur border border-white/10 rounded-2xl p-8">
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-white mb-4">Interactive Quiz Game</h2>
            <p className="text-xl text-slate-300 mb-8">
              Fast-paced compliance quiz coming soon!
            </p>
            <p className="text-slate-400 mb-8">
              This lesson will feature interactive quiz challenges testing time zones,
              red flags, and compliance rules with speed and accuracy tracking.
            </p>
            <button
              onClick={() => navigate('/lessons')}
              className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-lg text-white font-semibold text-lg hover:from-yellow-600 hover:to-amber-600 transition"
            >
              Return to Lessons Hub
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
