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

router.post('/simulate', async (req, res) => {
  try {
    const { message, persona = 'default', sessionId } = req.body || {};
    if (!message) return res.status(400).json({ error: 'message is required' });

    let session = sessionId ? await Session.findById(sessionId) : null;
    if (!session) session = await Session.create({ persona, messages: [] });

    session.messages.push({ role: 'agent', text: message });

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `${buildSystemPrompt(session.persona)}\n\n${toHistory(session.messages)}\n\nRespond as BORROWER:`;
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

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

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const rubric = `Evaluate the AGENT's performance in this debt collection training call.
Return JSON with keys: empathy (0-10), tone (0-10), compliance (0-10), summary (1-2 sentences), suggestions (array of 3-5 items).
If you cannot evaluate, set all scores to 0 and explain in summary.

TRANSCRIPT:\n${toHistory(session.messages)}`;

    const result = await model.generateContent(rubric);
    const text = result.response.text();

    let parsed;
    try {
      const jsonMatch = text.match(/[\{\[].*[\}\]]/s);
      parsed = JSON.parse(jsonMatch ? jsonMatch[0] : text);
    } catch (e) {
      parsed = { empathy: 0, tone: 0, compliance: 0, summary: 'Could not parse model output', suggestions: [] };
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
