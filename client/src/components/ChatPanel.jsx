import React, { useEffect, useRef } from 'react';

export default function ChatPanel({ messages = [] }) {
  const items = Array.isArray(messages) ? messages : [];
  const scrollRef = useRef(null);
  const bottomRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [messages.length]);

  return (
    <div 
      ref={scrollRef}
      className="space-y-3 h-80 overflow-y-auto p-4 bg-black/40 rounded border border-white/10 scroll-smooth"
      style={{ scrollBehavior: 'smooth' }}
    >
      {items.length === 0 ? (
        <div className="flex items-center justify-center h-full text-slate-500 text-sm italic">
          <div className="text-center">
            <div className="text-4xl mb-2">💬</div>
            <div>Your conversation will appear here...</div>
            <div className="text-xs mt-2">Start by clicking "🎙️ Start Voice" or typing a message</div>
          </div>
        </div>
      ) : (
        <>
          {items.map((m, idx) => (
            <div 
              key={idx} 
              className={`flex items-start gap-3 p-3 rounded-lg transition-all duration-300 ${
                m.role === 'agent' 
                  ? 'bg-cyan-500/10 border border-cyan-500/20' 
                  : 'bg-emerald-500/10 border border-emerald-500/20'
              }`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                m.role === 'agent' 
                  ? 'bg-cyan-500 text-black' 
                  : 'bg-emerald-500 text-black'
              }`}>
                {m.role === 'agent' ? '👤' : '🤖'}
              </div>
              <div className="flex-1">
                <div className={`text-xs uppercase tracking-wide font-semibold mb-1 ${
                  m.role === 'agent' ? 'text-cyan-400' : 'text-emerald-400'
                }`}>
                  {m.role === 'agent' ? 'You (Agent)' : 'AI Borrower'}
                </div>
                <div className={`text-sm leading-relaxed ${
                  m.role === 'agent' ? 'text-cyan-200' : 'text-emerald-200'
                }`}>
                  {m.text}
                </div>
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  );
}
