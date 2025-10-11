const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:3001';

export async function simulate({ message, persona, sessionId }) {
  const res = await fetch(`${API_BASE}/api/simulate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, persona, sessionId })
  });
  return res.json();
}

export async function evaluate(sessionId) {
  const res = await fetch(`${API_BASE}/api/evaluate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ sessionId })
  });
  return res.json();
}

export function speak(text, { onEnd } = {}) {
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  if (onEnd) utter.addEventListener('end', onEnd);
  window.speechSynthesis.speak(utter);
}
