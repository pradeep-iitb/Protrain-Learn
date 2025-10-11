import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Session from './models/Session.js';

const router = express.Router();

function buildSystemPrompt(persona) {
  return `You are a simulated borrower in a training exercise for debt collection agents.
- Stay in the role and keep responses concise (1-3 sentences) unless clarification is needed.
- Persona: ${persona}.
- Follow compliance: no sharing of PII, avoid abusive language, avoid legal threats.
- Encourage constructive negotiation: discuss repayment options, hardships, and next steps.
- If the agent asks for disallowed actions, decline and suggest compliant alternatives.`;
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
  // naive signals: count empathy words
  const agentLines = messages.filter(m => m.role === 'agent').map(m => m.text.toLowerCase()).join(' ');
  const empathyHits = (agentLines.match(/sorry|understand|appreciate|hear you|thanks|thank you/g) || []).length;
  const empathy = Math.min(10, 4 + empathyHits);
  const tone = 6;
  const compliance = 7;
  return {
    empathy,
    tone,
    compliance,
    summary: 'Fallback evaluation provided due to temporary AI unavailability.',
    suggestions: [
      'Acknowledge borrower hardship explicitly before proposing terms.',
      'Offer 2-3 concrete options (date, amount, autopay).',
      'Avoid pressure; confirm understanding and next steps.'
    ]
  };
}

router.post('/simulate', async (req, res) => {
  try {
    const { message, persona = 'default', sessionId } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });

    let session = sessionId ? await Session.findById(sessionId) : null;
    if (!session) session = await Session.create({ persona, messages: [] });

    session.messages.push({ role: 'agent', text: message });

    let reply = '';
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `${buildSystemPrompt(session.persona)}\n\n${toHistory(session.messages)}\n\nRespond as BORROWER:`;
      const result = await model.generateContent(prompt);
      reply = (result && result.response && typeof result.response.text === 'function') ? result.response.text() : '';
    } catch (llmErr) {
      console.error('simulate: LLM failure, using fallback', llmErr?.message || llmErr);
      reply = fallbackBorrowerReply(session.persona, message);
    }

    session.messages.push({ role: 'borrower', text: reply });
    await session.save();

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

    const session = await Session.findById(sessionId);
    if (!session) return res.status(404).json({ error: 'session_not_found' });

    const rubric = `Evaluate the AGENT's performance in this debt collection training call.
Return JSON with keys: empathy (0-10), tone (0-10), compliance (0-10), summary (1-2 sentences), suggestions (array of 3-5 items).
If you cannot evaluate, set all scores to 0 and explain in summary.

TRANSCRIPT:\n${toHistory(session.messages)}`;
    let parsed;
    try {
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const result = await model.generateContent(rubric);
      const text = (result && result.response && typeof result.response.text === 'function') ? result.response.text() : '';
      try {
        const jsonMatch = text.match(/[\{\[].*[\}\]]/s);
        parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
      } catch (e) {
        parsed = { empathy: 0, tone: 0, compliance: 0, summary: 'Could not parse model output', suggestions: [] };
      }
    } catch (llmErr) {
      console.error('evaluate: LLM failure, using fallback', llmErr?.message || llmErr);
      parsed = fallbackFeedback(session.messages);
    }

    session.feedback = parsed;
    await session.save();

    res.json({ feedback: parsed });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'evaluation_failed' });
  }
});

export default router;
