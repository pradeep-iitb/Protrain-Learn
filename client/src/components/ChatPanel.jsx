import React from 'react';

export default function ChatPanel({ messages }) {
  return (
    <div className="space-y-2 h-80 overflow-y-auto p-3 bg-white rounded border">
      {messages.map((m, idx) => (
        <div key={idx} className={m.role === 'agent' ? 'text-blue-700' : m.role === 'borrower' ? 'text-emerald-700' : 'text-gray-500'}>
          <span className="font-semibold mr-2">{m.role}:</span>
          <span>{m.text}</span>
        </div>
      ))}
    </div>
  );
}
