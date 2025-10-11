import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import Session from './models/Session.js';
import UserProgress from './models/UserProgress.js';
import mongoose from 'mongoose';
import { API_KEYS, GEMINI_CONFIG } from './config.js';

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
      const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI);
      const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL });
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
      const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI);
      const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL });
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

// ==================== LESSON PROGRESS ROUTES ====================

// Get user progress (creates if doesn't exist)
router.get('/progress/:userName', async (req, res) => {
  try {
    const { userName } = req.params;
    let userProgress = await UserProgress.findOne({ userName });
    
    if (!userProgress) {
      // Create new user progress with all 8 lessons initialized
      const lessons = new Map();
      for (let i = 1; i <= 8; i++) {
        lessons.set(i.toString(), {
          lessonId: i,
          currentLevel: 1,
          levelsCompleted: [],
          levelScores: new Map(),
          totalAttempts: 0,
          averageScore: 0,
          completionPercentage: 0,
          isCompleted: false,
          startedAt: null,
          completedAt: null,
          timeSpentMinutes: 0
        });
      }
      
      userProgress = await UserProgress.create({
        userName,
        totalXP: 0,
        level: 1,
        achievements: [],
        lessons
      });
    }
    
    res.json(userProgress);
  } catch (error) {
    console.error('Error getting user progress:', error);
    res.status(500).json({ error: 'Failed to get user progress' });
  }
});

// Save lesson level score
router.post('/progress/:userName/lesson/:lessonId/level/:levelNumber', async (req, res) => {
  try {
    const { userName, lessonId, levelNumber } = req.params;
    const { score, passed, xpEarned } = req.body;
    
    let userProgress = await UserProgress.findOne({ userName });
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }
    
    const lessonKey = lessonId.toString();
    const levelKey = levelNumber.toString();
    
    // Get or initialize lesson progress
    let lessonProgress = userProgress.lessons.get(lessonKey);
    if (!lessonProgress) {
      lessonProgress = {
        lessonId: parseInt(lessonId),
        currentLevel: 1,
        levelsCompleted: [],
        levelScores: new Map(),
        totalAttempts: 0,
        averageScore: 0,
        completionPercentage: 0,
        isCompleted: false,
        startedAt: new Date(),
        completedAt: null,
        timeSpentMinutes: 0
      };
    }
    
    // Start lesson if first time
    if (!lessonProgress.startedAt) {
      lessonProgress.startedAt = new Date();
    }
    
    // Update or create level score
    let levelScore = lessonProgress.levelScores.get(levelKey) || {
      score: 0,
      attempts: 0,
      bestScore: 0,
      firstAttemptAt: new Date(),
      lastAttemptAt: new Date()
    };
    
    levelScore.attempts += 1;
    levelScore.score = score;
    levelScore.lastAttemptAt = new Date();
    if (score > levelScore.bestScore) {
      levelScore.bestScore = score;
    }
    
    lessonProgress.levelScores.set(levelKey, levelScore);
    lessonProgress.totalAttempts += 1;
    
    // Mark level as completed if passed and not already completed
    if (passed && !lessonProgress.levelsCompleted.includes(parseInt(levelNumber))) {
      lessonProgress.levelsCompleted.push(parseInt(levelNumber));
      lessonProgress.currentLevel = parseInt(levelNumber) + 1;
      
      // Award XP
      if (xpEarned) {
        userProgress.totalXP += xpEarned;
        userProgress.level = Math.floor(userProgress.totalXP / 1000) + 1;
      }
    }
    
    // Calculate completion percentage
    const totalLevelsMap = { 1: 5, 2: 6, 3: 8, 4: 4, 5: 10, 6: 7, 7: 6, 8: 25 };
    const totalLevels = totalLevelsMap[parseInt(lessonId)] || 5;
    lessonProgress.completionPercentage = Math.round((lessonProgress.levelsCompleted.length / totalLevels) * 100);
    
    // Calculate average score
    const scores = Array.from(lessonProgress.levelScores.values()).map(ls => ls.bestScore);
    lessonProgress.averageScore = scores.length > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) 
      : 0;
    
    // Check if lesson completed
    if (lessonProgress.levelsCompleted.length >= totalLevels && !lessonProgress.isCompleted) {
      lessonProgress.isCompleted = true;
      lessonProgress.completedAt = new Date();
    }
    
    userProgress.lessons.set(lessonKey, lessonProgress);
    await userProgress.save();
    
    res.json({ 
      success: true, 
      lessonProgress,
      totalXP: userProgress.totalXP,
      level: userProgress.level
    });
  } catch (error) {
    console.error('Error saving level score:', error);
    res.status(500).json({ error: 'Failed to save level score' });
  }
});

// Get overall stats
router.get('/progress/:userName/stats', async (req, res) => {
  try {
    const { userName } = req.params;
    const userProgress = await UserProgress.findOne({ userName });
    
    if (!userProgress) {
      return res.status(404).json({ error: 'User progress not found' });
    }
    
    const lessons = Array.from(userProgress.lessons.values());
    const completedLessons = lessons.filter(l => l.isCompleted).length;
    const totalLevels = lessons.reduce((sum, l) => sum + (l.levelsCompleted?.length || 0), 0);
    const overallCompletion = Math.round((completedLessons / 8) * 100);
    
    res.json({
      totalXP: userProgress.totalXP,
      level: userProgress.level,
      completedLessons,
      totalLessons: 8,
      completedLevels: totalLevels,
      totalLevels: 71, // 5+6+8+4+10+7+6+25
      overallCompletion,
      achievements: userProgress.achievements
    });
  } catch (error) {
    console.error('Error getting stats:', error);
    res.status(500).json({ error: 'Failed to get stats' });
  }
});

// AI-powered personalized feedback generation
router.post('/generate-feedback', async (req, res) => {
  try {
    const { 
      lessonId, 
      levelNumber, 
      userChoice, 
      choiceText,
      scenario, 
      isCorrect,
      timeTaken, // in seconds
      previousAttempts,
      userHistory // optional: previous scores/patterns
    } = req.body;

    const genAI = new GoogleGenerativeAI(API_KEYS.GEMINI);
    const model = genAI.getGenerativeModel({ model: GEMINI_CONFIG.MODEL });

    // Build comprehensive prompt
    const prompt = `You are ProTrain.AI, an expert debt collection training coach. Analyze this trainee's performance and provide personalized, encouraging feedback.

CONTEXT:
- Lesson: ${lessonId}
- Level: ${levelNumber}
- Scenario: ${scenario}
- User's Choice: "${choiceText}"
- Correctness: ${isCorrect ? 'Correct' : 'Incorrect'}
- Time Taken: ${timeTaken} seconds
- Previous Attempts: ${previousAttempts || 0}
${userHistory ? `- Performance Pattern: ${JSON.stringify(userHistory)}` : ''}

ANALYSIS FACTORS:
1. Decision Quality: Was this the best choice? Why or why not?
2. Speed: Did they take appropriate time to think? (5-15s is ideal, <3s is rushed, >30s shows uncertainty)
3. Pattern Recognition: Based on history, are they improving?
4. Real-world Application: How does this apply to actual debt collection?

Provide a response in this EXACT JSON format (no markdown, no extra text):
{
  "mainFeedback": "<2-3 sentences of encouraging, specific feedback about their choice>",
  "timeAnalysis": "<1 sentence about their decision speed - was it thoughtful, rushed, or hesitant?>",
  "keyInsight": "<1 powerful insight about why this matters in real debt collection>",
  "nextSteps": "<1 sentence with specific actionable advice for improvement>",
  "encouragement": "<1 warm, motivating sentence to keep them going>",
  "score": <number 0-100 based on choice quality and timing>,
  "badges": ["<badge1>", "<badge2>"] // e.g., "Quick Thinker", "Empathy Expert", "Compliance Champion"
}

Make it personal, warm, and actionable. Use "you" and speak directly to the trainee. Be encouraging even for wrong answers - focus on learning.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();
    
    // Parse JSON response
    let feedback;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      feedback = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback feedback
      feedback = {
        mainFeedback: isCorrect 
          ? "Great choice! Your decision shows good understanding of the situation."
          : "This wasn't the optimal choice, but that's okay - every mistake is a learning opportunity.",
        timeAnalysis: timeTaken < 5 
          ? "You decided quickly - make sure you're considering all factors."
          : timeTaken > 30
          ? "Take your time, but remember in real situations you'll need to think on your feet."
          : "Your decision timing was appropriate - thoughtful but not hesitant.",
        keyInsight: "In debt collection, every interaction is an opportunity to help someone resolve their financial situation while maintaining professionalism.",
        nextSteps: "Focus on understanding the borrower's perspective and finding win-win solutions.",
        encouragement: "Keep practicing - you're building valuable skills!",
        score: isCorrect ? 85 : 60,
        badges: isCorrect ? ["Good Decision Maker"] : ["Learning & Growing"]
      };
    }

    res.json(feedback);
  } catch (error) {
    console.error('AI feedback generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate feedback',
      fallback: {
        mainFeedback: "Your response has been recorded. Keep practicing to improve your skills.",
        timeAnalysis: "Consider the scenario carefully before making decisions.",
        keyInsight: "Professional debt collection balances empathy with effectiveness.",
        nextSteps: "Review the scenario and think about what borrowers need to hear.",
        encouragement: "Every attempt makes you better!",
        score: 70,
        badges: ["Dedicated Learner"]
      }
    });
  }
});

export default router;
