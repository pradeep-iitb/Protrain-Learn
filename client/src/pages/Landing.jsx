import React from 'react';
import { Link } from 'react-router-dom';
import Galaxy from '../components/Galaxy.jsx';
import Navbar from '../components/Navbar.jsx';

export default function Landing() {
  return (
    <div className="min-h-screen bg-black text-slate-200">
      <Navbar />
      <div className="absolute inset-0 -z-10">
        <Galaxy mouseRepulsion density={1.4} glowIntensity={0.5} saturation={0.6} hueShift={210} />
      </div>
      <main className="max-w-6xl mx-auto pt-28 pb-20 px-4 grid md:grid-cols-2 items-center gap-10">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">Train smarter. Speak better. Collect faster.</h1>
          <p className="mt-4 text-slate-300 text-lg">A voice-based AI simulator that helps loan collection agents master empathy, compliance, and negotiation—on one platform.</p>
          <div className="mt-8 flex items-center gap-3">
            <Link to="/trainer" className="px-5 py-3 rounded bg-emerald-500 text-black font-semibold hover:bg-emerald-400">Start Simulation</Link>
            <a href="#" className="px-5 py-3 rounded border border-white/20 hover:bg-white/10">Learn more</a>
          </div>
        </div>
        <div className="hidden md:block" />
      </main>
    </div>
  );
}
