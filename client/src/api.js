import { API_ENDPOINTS } from './config/api';

export async function simulate({ message, persona, sessionId }) {
  const res = await fetch(API_ENDPOINTS.SIMULATE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, persona, sessionId })
  });
  return res.json();
}

export async function evaluate(sessionId) {
  const res = await fetch(API_ENDPOINTS.EVALUATE, {
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

// Lesson Progress API calls
export async function getUserProgress(userName) {
  const res = await fetch(`${API_ENDPOINTS.PROGRESS}/${encodeURIComponent(userName)}`);
  return res.json();
}

export async function saveLevelScore(userName, lessonId, levelNumber, scoreData) {
  const res = await fetch(`${API_ENDPOINTS.PROGRESS}/${encodeURIComponent(userName)}/lesson/${lessonId}/level/${levelNumber}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData)
  });
  return res.json();
}

export async function getUserStats(userName) {
  const res = await fetch(`${API_ENDPOINTS.PROGRESS}/${encodeURIComponent(userName)}/stats`);
  return res.json();
}

// AI-powered feedback generation
export async function generateAIFeedback(context) {
  const res = await fetch(API_ENDPOINTS.GENERATE_FEEDBACK, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(context)
  });
  return res.json();
}
