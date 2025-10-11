import React from 'react';
import { Link, NavLink } from 'react-router-dom';

export default function Navbar() {
  const link = 'px-3 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition';
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/50 border-b border-white/10">
      <nav className="max-w-6xl mx-auto flex items-center gap-6 px-4 h-14">
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <span className="inline-block w-7 h-7 rounded-md bg-gradient-to-br from-cyan-400 to-emerald-500" />
          <span>ProTrain</span>
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <a href="#solutions" className={link}>Our solutions</a>
          <a href="#company" className={link}>Company</a>
          <a href="#careers" className={link}>Careers</a>
          <NavLink to="/trainer" className="ml-2 px-3 py-1 rounded bg-emerald-500/20 text-emerald-200 hover:bg-emerald-500/30">Start Simulation</NavLink>
        </div>
      </nav>
    </header>
  );
}
