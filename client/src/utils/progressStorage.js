// localStorage keys
const STORAGE_KEYS = {
  PROGRESS: 'protrain_progress',
  CURRENT_LEVEL: 'protrain_current_level',
  UNLOCKED_LEVELS: 'protrain_unlocked_levels'
};

// Initialize default progress
export function initializeProgress() {
  const existing = getProgress();
  if (!existing || Object.keys(existing).length === 0) {
    const defaultProgress = {
      currentLevel: 1,
      unlockedLevels: [1], // Level 1 is always unlocked
      levelScores: {}, // { levelId: { persuasion, empathy, negotiation, totalScore, passed } }
      completedLevels: []
    };
    saveProgress(defaultProgress);
    return defaultProgress;
  }
  return existing;
}

// Get full progress object
export function getProgress() {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROGRESS);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Error reading progress:', e);
    return null;
  }
}

// Save full progress object
export function saveProgress(progress) {
  try {
    localStorage.setItem(STORAGE_KEYS.PROGRESS, JSON.stringify(progress));
  } catch (e) {
    console.error('Error saving progress:', e);
  }
}

// Get current level
export function getCurrentLevel() {
  const progress = getProgress();
  return progress?.currentLevel || 1;
}

// Set current level
export function setCurrentLevel(levelId) {
  const progress = getProgress() || initializeProgress();
  progress.currentLevel = levelId;
  saveProgress(progress);
}

// Check if level is unlocked
export function isLevelUnlocked(levelId) {
  const progress = getProgress() || initializeProgress();
  return progress.unlockedLevels.includes(levelId);
}

// Unlock a level
export function unlockLevel(levelId) {
  const progress = getProgress() || initializeProgress();
  if (!progress.unlockedLevels.includes(levelId)) {
    progress.unlockedLevels.push(levelId);
    progress.unlockedLevels.sort((a, b) => a - b);
    saveProgress(progress);
  }
}

// Save level score
export function saveLevelScore(levelId, scores) {
  const progress = getProgress() || initializeProgress();
  progress.levelScores[levelId] = {
    ...scores,
    timestamp: new Date().toISOString()
  };
  
  // Mark as completed if passed
  if (scores.passed && !progress.completedLevels.includes(levelId)) {
    progress.completedLevels.push(levelId);
    progress.completedLevels.sort((a, b) => a - b);
  }
  
  saveProgress(progress);
}

// Get level score
export function getLevelScore(levelId) {
  const progress = getProgress();
  return progress?.levelScores?.[levelId] || null;
}

// Check if level is completed
export function isLevelCompleted(levelId) {
  const progress = getProgress();
  return progress?.completedLevels?.includes(levelId) || false;
}

// Get all completed levels
export function getCompletedLevels() {
  const progress = getProgress();
  return progress?.completedLevels || [];
}

// Calculate average scores from completed levels
export function calculateAverages() {
  const progress = getProgress();
  if (!progress || !progress.completedLevels || progress.completedLevels.length === 0) {
    return {
      persuasion: 0,
      empathy: 0,
      negotiation: 0,
      totalLevelsCompleted: 0
    };
  }

  let totalPersuasion = 0;
  let totalEmpathy = 0;
  let totalNegotiation = 0;
  let count = 0;

  progress.completedLevels.forEach(levelId => {
    const score = progress.levelScores[levelId];
    if (score && score.passed) {
      totalPersuasion += score.persuasion || 0;
      totalEmpathy += score.empathy || 0;
      totalNegotiation += score.negotiation || 0;
      count++;
    }
  });

  return {
    persuasion: count > 0 ? Math.round(totalPersuasion / count) : 0,
    empathy: count > 0 ? Math.round(totalEmpathy / count) : 0,
    negotiation: count > 0 ? Math.round(totalNegotiation / count) : 0,
    totalLevelsCompleted: count
  };
}

// Reset all progress (for testing or starting over)
export function resetProgress() {
  localStorage.removeItem(STORAGE_KEYS.PROGRESS);
  return initializeProgress();
}

// Get progress statistics
export function getProgressStats() {
  const progress = getProgress() || initializeProgress();
  const averages = calculateAverages();
  
  return {
    currentLevel: progress.currentLevel,
    totalUnlocked: progress.unlockedLevels.length,
    totalCompleted: progress.completedLevels.length,
    averages,
    completionPercentage: Math.round((progress.completedLevels.length / 25) * 100)
  };
}
