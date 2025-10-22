import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';

// Lazy load lesson components for better performance
const LessonsHub = lazy(() => import('./pages/LessonsHub.jsx'));
const Lesson1 = lazy(() => import('./pages/Lesson1.jsx'));  // Puzzles
const Lesson2 = lazy(() => import('./pages/Lesson2.jsx'));  // Chat Mode
const Lesson8 = lazy(() => import('./pages/Lesson8.jsx'));  // Voice Mode

// Lazy load appendix pages
const AppendixA = lazy(() => import('./pages/AppendixA.jsx'));
const AppendixB = lazy(() => import('./pages/AppendixB.jsx'));
const AppendixC = lazy(() => import('./pages/AppendixC.jsx'));
const AppendixD = lazy(() => import('./pages/AppendixD.jsx'));

// Loading component
const PageLoader = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <div className="text-white text-xl">Loading...</div>
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/lessons" element={<LessonsHub />} />
          
          {/* Active Training Modes */}
          <Route path="/lessons/1" element={<Lesson1 />} />   {/* Puzzles */}
          <Route path="/lessons/2" element={<Lesson2 />} />   {/* Chat Mode */}
          <Route path="/lessons/8" element={<Lesson8 />} />   {/* Voice Mode */}
          
          {/* Reference Materials */}
          <Route path="/appendix/a" element={<AppendixA />} />
          <Route path="/appendix/b" element={<AppendixB />} />
          <Route path="/appendix/c" element={<AppendixC />} />
          <Route path="/appendix/d" element={<AppendixD />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
