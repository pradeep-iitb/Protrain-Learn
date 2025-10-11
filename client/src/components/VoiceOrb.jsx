import React from 'react';

export default function VoiceOrb({ active = false }) {
  return (
    <div className="relative w-8 h-8">
      <div className={`absolute inset-0 rounded-full bg-gradient-to-br from-cyan-400 to-emerald-500 transition-transform ${active ? 'scale-110' : 'scale-100'}`} />
      <div className={`absolute inset-0 rounded-full blur-md bg-cyan-400/30 ${active ? 'opacity-100' : 'opacity-0'} transition-opacity`} />
    </div>
  );
}
