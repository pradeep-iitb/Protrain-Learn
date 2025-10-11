import React from 'react';

export default function ChatPanel({ messages = [] }) {
  const items = Array.isArray(messages) ? messages : [];
  return (
    <div className="space-y-2 h-80 overflow-y-auto p-3 bg-black/40 rounded border border-white/10">
      {items.map((m, idx) => (
        <div key={idx} className={m.role === 'agent' ? 'text-cyan-300' : m.role === 'borrower' ? 'text-emerald-300' : 'text-slate-400'}>
          <span className="text-xs uppercase tracking-wide px-2 py-0.5 rounded bg-white/5 border border-white/10 mr-2">{m.role}</span>
          <span>{m.text}</span>
        </div>
      ))}
    </div>
  );
}
