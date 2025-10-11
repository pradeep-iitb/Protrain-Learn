import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assests/logo.jpg';

export default function Navbar() {
  const link = 'px-3 py-1 rounded text-slate-300 hover:text-white hover:bg-white/10 transition';
  return (
    <header className="fixed top-0 inset-x-0 z-40 backdrop-blur supports-[backdrop-filter]:bg-black/40 bg-black/50 border-b border-white/10">
      <nav className="max-w-6xl mx-auto flex items-center gap-6 px-4 h-14">
        <Link to="/" className="flex items-center gap-2 font-bold text-white">
          <img src={logo} alt="ProTrain logo" className="h-14 rounded-lg w-35 object-cover" onError={(e)=>{e.currentTarget.style.display='none';}} />
        </Link>
        <div className="ml-auto flex items-center gap-1">
          <a href="#tech" className={link}>Tech Stack</a>
          <a href="#features" className={link}>Features</a>
          <a href="#contents" className={link}>Training Manual</a>
          <a href="#mission" className={link}>Mission</a>
          <a href="#role" className={link}>Your Role</a>
        </div>
      </nav>
    </header>
  );
}
