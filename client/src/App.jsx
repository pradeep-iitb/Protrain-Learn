import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing.jsx';
import Trainer from './pages/Trainer.jsx';

// Lazy load lesson components for better performance
const LessonsHub = lazy(() => import('./pages/LessonsHub.jsx'));
const Lesson2 = lazy(() => import('./pages/Lesson2.jsx'));
const Lesson3 = lazy(() => import('./pages/Lesson3.jsx'));
const Lesson4 = lazy(() => import('./pages/Lesson4.jsx'));
const Lesson5 = lazy(() => import('./pages/Lesson5.jsx'));
const Lesson7 = lazy(() => import('./pages/Lesson7.jsx'));
const Lesson8 = lazy(() => import('./pages/Lesson8.jsx'));
const Lesson9 = lazy(() => import('./pages/Lesson9.jsx'));
const Lesson10 = lazy(() => import('./pages/Lesson10.jsx'));

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
          <Route path="/trainer" element={<Trainer />} />
          <Route path="/lessons" element={<LessonsHub />} />
          <Route path="/lessons/2" element={<Lesson2 />} />
          <Route path="/lessons/3" element={<Lesson3 />} />
          <Route path="/lessons/4" element={<Lesson4 />} />
          <Route path="/lessons/5" element={<Lesson5 />} />
          <Route path="/lessons/7" element={<Lesson7 />} />
          <Route path="/lessons/8" element={<Lesson8 />} />
          <Route path="/lessons/9" element={<Lesson9 />} />
          <Route path="/lessons/10" element={<Lesson10 />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
