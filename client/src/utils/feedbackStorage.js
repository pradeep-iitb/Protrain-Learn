/**
 * Recent Feedback Storage Utility
 * Manages localStorage for tracking recent session feedback for Dashboard
 */

const FEEDBACK_STORAGE_KEY = 'protrain_recent_feedback';
const MAX_RECENT_SESSIONS = 5;

/**
 * Save feedback from a session to recent history
 * @param {Object} feedbackData - Feedback data with scores
 * @param {string} mode - 'voice' or 'chat'
 * @param {string} persona - Persona or scenario name
 */
export function saveRecentFeedback(feedbackData, mode, persona) {
  try {
    // Get existing feedback
    const existing = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
    
    // Create new feedback entry
    const newFeedback = {
      mode,
      persona,
      timestamp: new Date().toISOString(),
      persuasion: feedbackData.persuasion || 0,
      empathy: feedbackData.empathy || 0,
      negotiation: feedbackData.negotiation || 0,
      totalScore: feedbackData.totalScore || 0
    };
    
    // Add to beginning of array
    const updated = [newFeedback, ...existing];
    
    // Keep only last N sessions
    const trimmed = updated.slice(0, MAX_RECENT_SESSIONS);
    
    // Save back to localStorage
    localStorage.setItem(FEEDBACK_STORAGE_KEY, JSON.stringify(trimmed));
    
    console.log('✅ Saved recent feedback:', newFeedback);
    return trimmed;
  } catch (error) {
    console.error('Failed to save recent feedback:', error);
    return [];
  }
}

/**
 * Get all recent feedback
 */
export function getRecentFeedback() {
  try {
    const feedback = JSON.parse(localStorage.getItem(FEEDBACK_STORAGE_KEY) || '[]');
    return feedback;
  } catch (error) {
    console.error('Failed to get recent feedback:', error);
    return [];
  }
}

/**
 * Clear all recent feedback
 */
export function clearRecentFeedback() {
  try {
    localStorage.removeItem(FEEDBACK_STORAGE_KEY);
    console.log('✅ Cleared recent feedback');
  } catch (error) {
    console.error('Failed to clear recent feedback:', error);
  }
}

/**
 * Get average scores from recent feedback
 */
export function getAverageScores() {
  const feedback = getRecentFeedback();
  
  if (feedback.length === 0) {
    return {
      persuasion: 0,
      empathy: 0,
      negotiation: 0
    };
  }
  
  const totals = feedback.reduce(
    (acc, item) => ({
      persuasion: acc.persuasion + (item.persuasion || 0),
      empathy: acc.empathy + (item.empathy || 0),
      negotiation: acc.negotiation + (item.negotiation || 0)
    }),
    { persuasion: 0, empathy: 0, negotiation: 0 }
  );
  
  return {
    persuasion: Math.round(totals.persuasion / feedback.length),
    empathy: Math.round(totals.empathy / feedback.length),
    negotiation: Math.round(totals.negotiation / feedback.length)
  };
}
