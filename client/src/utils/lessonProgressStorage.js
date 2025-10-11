/**
 * Lesson Progress Storage Utility
 * Manages localStorage for tracking user progress across all lessons
 * User: Pradeep Kumawat (hardcoded for now)
 */

const STORAGE_KEY = 'protrain_lesson_progress';
const USER_NAME = 'Pradeep Kumawat';

// Lesson configuration
export const LESSONS = [
  {
    id: 2,
    title: 'Understanding Debt and Why It Matters',
    description: 'Follow an interactive story of an unaware driver and learn about debt consequences',
    icon: '📚',
    totalLevels: 5,
    type: 'interactive-story'
  },
  {
    id: 3,
    title: 'Professional Debt Collection',
    description: 'Navigate complex scenarios in this choose-your-own-adventure module',
    icon: '🎯',
    totalLevels: 6,
    type: 'choose-adventure'
  },
  {
    id: 4,
    title: 'The Regulatory Landscape',
    description: 'Master compliance rules with AI-powered simulation and real-time feedback',
    icon: '⚖️',
    totalLevels: 8,
    type: 'compliance-sim'
  },
  {
    id: 5,
    title: 'Third-Party Debt Collection',
    description: 'Map the debt lifecycle with interactive drag-and-drop exercises',
    icon: '🔄',
    totalLevels: 4,
    type: 'drag-drop'
  },
  {
    id: 7,
    title: 'The Art of the Collection Call',
    description: 'Practice with AI consumers showing various emotional states',
    icon: '💬',
    totalLevels: 10,
    type: 'role-play'
  },
  {
    id: 8,
    title: 'Essential Rules and Best Practices',
    description: 'Get real-time guidance from your compliance bot co-pilot',
    icon: '🤖',
    totalLevels: 7,
    type: 'compliance-bot'
  },
  {
    id: 9,
    title: 'Compliance Checklist and Quick Reference',
    description: 'Test your knowledge with fast-paced interactive quiz challenges',
    icon: '✅',
    totalLevels: 6,
    type: 'quiz-game'
  },
  {
    id: 10,
    title: 'Scenarios and Role-Playing Exercises',
    description: 'Face dynamic AI-generated scenarios and track your improvement',
    icon: '🎭',
    totalLevels: 12,
    type: 'dynamic-scenarios'
  }
];

/**
 * Initialize progress data structure
 */
function getDefaultProgress() {
  return {
    userName: USER_NAME,
    lastUpdated: new Date().toISOString(),
    totalXP: 0,
    achievements: [],
    lessons: LESSONS.reduce((acc, lesson) => {
      acc[lesson.id] = {
        lessonId: lesson.id,
        currentLevel: 1,
        levelsCompleted: [],
        levelScores: {}, // { levelNumber: { score, attempts, bestScore, timestamp } }
        totalAttempts: 0,
        averageScore: 0,
        completionPercentage: 0,
        isCompleted: false,
        startedAt: null,
        completedAt: null,
        timeSpentMinutes: 0
      };
      return acc;
    }, {})
  };
}

/**
 * Get all progress data
 */
export function getAllProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const defaultData = getDefaultProgress();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
      return defaultData;
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading lesson progress:', error);
    return getDefaultProgress();
  }
}

/**
 * Save all progress data
 */
function saveAllProgress(progressData) {
  try {
    progressData.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progressData));
    return true;
  } catch (error) {
    console.error('Error saving lesson progress:', error);
    return false;
  }
}

/**
 * Get progress for a specific lesson
 */
export function getLessonProgress(lessonId) {
  const allProgress = getAllProgress();
  return allProgress.lessons[lessonId] || null;
}

/**
 * Start a lesson (first time)
 */
export function startLesson(lessonId) {
  const allProgress = getAllProgress();
  if (!allProgress.lessons[lessonId].startedAt) {
    allProgress.lessons[lessonId].startedAt = new Date().toISOString();
    saveAllProgress(allProgress);
  }
  return allProgress.lessons[lessonId];
}

/**
 * Save level score and progress
 */
export function saveLevelScore(lessonId, levelNumber, scoreData) {
  const allProgress = getAllProgress();
  const lessonProgress = allProgress.lessons[lessonId];

  if (!lessonProgress) return false;

  // Initialize level scores if not exists
  if (!lessonProgress.levelScores[levelNumber]) {
    lessonProgress.levelScores[levelNumber] = {
      score: 0,
      attempts: 0,
      bestScore: 0,
      firstAttemptAt: new Date().toISOString(),
      lastAttemptAt: null
    };
  }

  const levelScore = lessonProgress.levelScores[levelNumber];
  levelScore.attempts += 1;
  levelScore.score = scoreData.score;
  levelScore.lastAttemptAt = new Date().toISOString();
  
  // Update best score
  if (scoreData.score > levelScore.bestScore) {
    levelScore.bestScore = scoreData.score;
  }

  // Mark level as completed if passed
  if (scoreData.passed && !lessonProgress.levelsCompleted.includes(levelNumber)) {
    lessonProgress.levelsCompleted.push(levelNumber);
    lessonProgress.currentLevel = Math.min(levelNumber + 1, LESSONS.find(l => l.id === lessonId).totalLevels);
    
    // Award XP
    const xpEarned = calculateXP(lessonId, levelNumber, scoreData.score);
    allProgress.totalXP += xpEarned;
  }

  lessonProgress.totalAttempts += 1;

  // Calculate average score across all completed levels
  const completedScores = Object.values(lessonProgress.levelScores)
    .filter(ls => ls.bestScore > 0)
    .map(ls => ls.bestScore);
  
  if (completedScores.length > 0) {
    lessonProgress.averageScore = Math.round(
      completedScores.reduce((sum, score) => sum + score, 0) / completedScores.length
    );
  }

  // Calculate completion percentage
  const totalLevels = LESSONS.find(l => l.id === lessonId).totalLevels;
  lessonProgress.completionPercentage = Math.round(
    (lessonProgress.levelsCompleted.length / totalLevels) * 100
  );

  // Check if lesson is fully completed
  if (lessonProgress.levelsCompleted.length === totalLevels && !lessonProgress.isCompleted) {
    lessonProgress.isCompleted = true;
    lessonProgress.completedAt = new Date().toISOString();
    
    // Award completion achievement
    addAchievement(allProgress, {
      id: `lesson_${lessonId}_complete`,
      title: `Lesson ${lessonId} Master`,
      description: `Completed all levels in ${LESSONS.find(l => l.id === lessonId).title}`,
      earnedAt: new Date().toISOString(),
      xp: 500
    });
    
    allProgress.totalXP += 500;
  }

  saveAllProgress(allProgress);
  return true;
}

/**
 * Calculate XP earned for a level completion
 */
function calculateXP(lessonId, levelNumber, score) {
  const baseXP = 50;
  const levelBonus = levelNumber * 10;
  const scoreBonus = Math.floor(score / 10) * 5;
  return baseXP + levelBonus + scoreBonus;
}

/**
 * Add achievement
 */
function addAchievement(allProgress, achievement) {
  if (!allProgress.achievements.find(a => a.id === achievement.id)) {
    allProgress.achievements.push(achievement);
  }
}

/**
 * Get overall statistics
 */
export function getOverallStats() {
  const allProgress = getAllProgress();
  const lessons = Object.values(allProgress.lessons);
  
  const totalLessons = LESSONS.length;
  const completedLessons = lessons.filter(l => l.isCompleted).length;
  const totalLevels = LESSONS.reduce((sum, l) => sum + l.totalLevels, 0);
  const completedLevels = lessons.reduce((sum, l) => sum + l.levelsCompleted.length, 0);
  const overallCompletion = Math.round((completedLevels / totalLevels) * 100);
  
  const averageScores = lessons
    .filter(l => l.averageScore > 0)
    .map(l => l.averageScore);
  const overallAverageScore = averageScores.length > 0
    ? Math.round(averageScores.reduce((sum, score) => sum + score, 0) / averageScores.length)
    : 0;

  return {
    userName: USER_NAME,
    totalXP: allProgress.totalXP,
    totalLessons,
    completedLessons,
    totalLevels,
    completedLevels,
    overallCompletion,
    overallAverageScore,
    achievements: allProgress.achievements,
    lastUpdated: allProgress.lastUpdated
  };
}

/**
 * Get lesson by ID
 */
export function getLessonById(lessonId) {
  return LESSONS.find(l => l.id === lessonId);
}

/**
 * Check if a level is unlocked
 */
export function isLevelUnlocked(lessonId, levelNumber) {
  const lessonProgress = getLessonProgress(lessonId);
  if (!lessonProgress) return false;
  
  // Level 1 is always unlocked
  if (levelNumber === 1) return true;
  
  // Level is unlocked if previous level is completed
  return lessonProgress.levelsCompleted.includes(levelNumber - 1);
}

/**
 * Update time spent on lesson
 */
export function updateLessonTime(lessonId, minutesSpent) {
  const allProgress = getAllProgress();
  if (allProgress.lessons[lessonId]) {
    allProgress.lessons[lessonId].timeSpentMinutes += minutesSpent;
    saveAllProgress(allProgress);
  }
}

/**
 * Reset all progress (for testing)
 */
export function resetAllProgress() {
  const defaultData = getDefaultProgress();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultData));
  return defaultData;
}

/**
 * Export progress data
 */
export function exportProgress() {
  const allProgress = getAllProgress();
  const dataStr = JSON.stringify(allProgress, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `protrain_progress_${USER_NAME.replace(/\s+/g, '_')}_${Date.now()}.json`;
  link.click();
  
  URL.revokeObjectURL(url);
}
