import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Session from './models/Session.js';
import mongoose from 'mongoose';

const router = express.Router();

// Simple in-memory session store as a fallback when MongoDB is unavailable
const memorySessions = new Map();
let memIdCounter = 1;

function newMemId() {
  return String(memIdCounter++);
}

function buildSystemPrompt(persona) {
  const personaLower = (persona || '').toLowerCase();
  
  // Enhanced persona-specific behaviors
  let personalityTraits = '';
  if (personaLower.includes('angry') || personaLower.includes('resistant')) {
    personalityTraits = 'You are frustrated and short-tempered. You may raise your voice initially but can be calmed with empathy.';
  } else if (personaLower.includes('anxious') || personaLower.includes('hardship')) {
    personalityTraits = 'You are worried and stressed. You appreciate kindness and need reassurance about available options.';
  } else if (personaLower.includes('forgetful')) {
    personalityTraits = 'You often forget dates and details. You need clear reminders and simple instructions.';
  } else if (personaLower.includes('confused')) {
    personalityTraits = 'You struggle to understand financial terms. You need patient explanations in simple language.';
  } else if (personaLower.includes('defensive') || personaLower.includes('evasive')) {
    personalityTraits = 'You avoid direct answers and deflect questions. You become more cooperative when treated respectfully.';
  } else if (personaLower.includes('skeptical')) {
    personalityTraits = 'You question everything and don\'t trust easily. You need transparent explanations and proof.';
  } else if (personaLower.includes('overwhelmed')) {
    personalityTraits = 'You have multiple debts and feel hopeless. You need help prioritizing and creating manageable plans.';
  } else if (personaLower.includes('unemployed')) {
    personalityTraits = 'You recently lost your job and have no stable income. You need flexible payment arrangements.';
  } else if (personaLower.includes('medical')) {
    personalityTraits = 'You are dealing with health issues that caused financial hardship. You need compassionate understanding.';
  }

  return `You are a simulated borrower in a training exercise for debt collection agents.
- Role: ${persona}
- Personality: ${personalityTraits}
- Keep responses natural and conversational (1-3 sentences typically)
- React realistically to the agent's tone: respond positively to empathy, negatively to pressure
- Mention specific hardships relevant to your persona when appropriate
- Be willing to negotiate if the agent shows understanding and offers reasonable options
- Follow compliance: no sharing of sensitive PII, avoid threats
- If treated poorly, become less cooperative; if treated well, become more willing to work out a solution`;
}

function toHistory(messages) {
  return messages.map(m => `${m.role.toUpperCase()}: ${m.text}`).join('\n');
}

// Simple fallback replies to keep simulation running if the model call fails
function fallbackBorrowerReply(persona, agentText = '') {
  const p = (persona || '').toLowerCase();
  if (p.includes('angry')) {
    return "Look, I'm frustrated because things have been tough. What options do I realistically have right now?";
  }
  if (p.includes('hardship') || p.includes('anxious')) {
    return "I'm going through a hardship. I can try a smaller payment—can we discuss a plan that fits my budget?";
  }
  if (p.includes('forgetful')) {
    return "I honestly lost track of the due date. If I set up reminders, can we agree on a date this week to make a payment?";
  }
  if (p.includes('confused')) {
    return "I'm a bit confused about the terms and fees. Could you explain what I owe today and what my next steps are?";
  }
  return "I want to make this right. Can we go over the amount due and a reasonable payment plan?";
}

function fallbackFeedback(messages = []) {
  // naive signals: count empathy words and calculate scores out of 100
  const agentLines = messages.filter(m => m.role === 'agent').map(m => m.text.toLowerCase()).join(' ');
  const empathyHits = (agentLines.match(/sorry|understand|appreciate|hear you|thanks|thank you|i see|that must be|difficult/g) || []).length;
  const persuasion = Math.min(100, 50 + empathyHits * 5);
  const empathy = Math.min(100, 40 + empathyHits * 8);
  const negotiation = Math.min(100, 45 + empathyHits * 6);
  const totalScore = persuasion + empathy + negotiation;
  
  return {
    persuasion,
    empathy,
    negotiation,
    totalScore,
    overall_feedback: 'Fallback evaluation provided due to temporary AI unavailability. Basic analysis shows moderate performance.',
    suggestions: [
      'Acknowledge borrower hardship explicitly before proposing terms.',
      'Use active listening phrases like "I understand" and "That must be difficult".',
      'Offer 2-3 concrete payment options (date, amount, autopay).',
      'Avoid pressure tactics; focus on collaborative problem-solving.',
      'Confirm borrower understanding and document next steps clearly.'
    ]
  };
}

router.post('/simulate', async (req, res) => {
  try {
    const { message, persona = 'default', sessionId } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });

    let usingMemory = mongoose.connection.readyState !== 1; // 1 = connected
    let session = null;
    if (!usingMemory) {
      try {
        session = sessionId ? await Session.findById(sessionId) : null;
        if (!session) session = await Session.create({ persona, messages: [] });
      } catch (dbErr) {
        usingMemory = true;
      }
    }
    if (usingMemory) {
      const id = sessionId && memorySessions.has(sessionId) ? sessionId : newMemId();
      session = memorySessions.get(id) || { _id: id, persona, messages: [] };
      memorySessions.set(id, session);
    }

    session.messages.push({ role: 'agent', text: message });

    let reply = '';
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const prompt = `${buildSystemPrompt(session.persona)}\n\n${toHistory(session.messages)}\n\nRespond as BORROWER:`;
      const result = await model.generateContent(prompt);
      reply = (result && result.response && typeof result.response.text === 'function') ? result.response.text() : '';
    } catch (llmErr) {
      console.error('simulate: LLM failure, using fallback', llmErr?.message || llmErr);
      reply = fallbackBorrowerReply(session.persona, message);
    }

    session.messages.push({ role: 'borrower', text: reply });
    if (!usingMemory) {
      try { await session.save(); } catch (_) { /* ignore */ }
    } else {
      memorySessions.set(session._id, session);
    }

    res.json({ reply, sessionId: session._id, messages: session.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'simulation_failed' });
  }
});

router.post('/evaluate', async (req, res) => {
  try {
    const { sessionId } = req.body || {};
    if (!sessionId) return res.status(400).json({ error: 'sessionId is required' });
    let usingMemory = mongoose.connection.readyState !== 1;
    let session = null;
    if (!usingMemory) {
      try {
        session = await Session.findById(sessionId);
      } catch (dbErr) {
        usingMemory = true;
      }
    }
    if (usingMemory) {
      session = memorySessions.get(sessionId);
    }
    if (!session) return res.status(404).json({ error: 'session_not_found' });

    const rubric = `You are an expert trainer evaluating a debt collection agent's performance.
Analyze the following conversation transcript and provide detailed feedback.

Return ONLY valid JSON (no markdown, no extra text) with these exact keys:
{
  "persuasion": <number 0-100>,
  "empathy": <number 0-100>,
  "negotiation": <number 0-100>,
  "overall_feedback": "<1-2 sentence summary>",
  "suggestions": ["<specific actionable tip 1>", "<tip 2>", "<tip 3>", "<tip 4>", "<tip 5>"]
}

Scoring criteria (each out of 100):
- persuasion (0-100): How effectively did the agent communicate, build rapport, and influence the borrower toward a positive outcome? Consider communication clarity, tone professionalism, and ability to maintain engagement.
- empathy (0-100): Did the agent acknowledge the borrower's situation with understanding and compassion? Consider active listening, validation of concerns, and genuine care shown.
- negotiation (0-100): Did the agent offer solutions, listen to concerns, work toward mutually acceptable resolution, and follow compliance regulations? Consider problem-solving, flexibility, and adherence to ethical practices.

CONVERSATION TRANSCRIPT:
${toHistory(session.messages)}

Respond with ONLY the JSON object, no other text.`;
    let parsed;
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(rubric);
      const text = (result && result.response && typeof result.response.text === 'function') ? result.response.text() : '';
      try {
        // Try to extract JSON from response (handles markdown code blocks)
        let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
        const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : cleanText);
        
        // Ensure all required fields exist with scores out of 100
        if (!parsed.persuasion) parsed.persuasion = 0;
        if (!parsed.empathy) parsed.empathy = 0;
        if (!parsed.negotiation) parsed.negotiation = 0;
        // Calculate total score out of 300
        parsed.totalScore = (parsed.persuasion || 0) + (parsed.empathy || 0) + (parsed.negotiation || 0);
        if (!parsed.overall_feedback) parsed.overall_feedback = 'Evaluation completed';
        if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) parsed.suggestions = [];
      } catch (e) {
        console.error('JSON parse error:', e);
        parsed = { 
          persuasion: 0, 
          empathy: 0, 
          negotiation: 0,
          totalScore: 0,
          overall_feedback: 'Could not parse evaluation output', 
          suggestions: ['Try again with more conversation context'] 
        };
      }
    } catch (llmErr) {
      console.error('evaluate: LLM failure, using fallback', llmErr?.message || llmErr);
      parsed = fallbackFeedback(session.messages);
    }

    session.feedback = parsed;
    if (!usingMemory) {
      try { await session.save(); } catch (_) { /* ignore */ }
    } else {
      memorySessions.set(session._id, session);
    }

    res.json({ feedback: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'evaluation_failed' });
  }
});

export default router;
