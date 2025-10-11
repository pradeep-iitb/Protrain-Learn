/**
 * Lesson Progress Storage Utility
 * Manages localStorage for tracking user progress across all lessons
 * User: Pradeep Kumawat (hardcoded for now)
 */

const STORAGE_KEY = 'protrain_lesson_progress';
const USER_NAME = 'Pradeep Kumawat';

// Lesson configuration - 6 core lessons (renumbered 1-6)
export const LESSONS = [
  {
    id: 1,
    title: 'Understanding Debt and Why It Matters',
    description: 'Follow an interactive story of an unaware driver and learn about debt consequences',
    icon: '📚',
    totalLevels: 5,
    type: 'interactive-story'
  },
  {
    id: 2,
    title: 'Professional Debt Collection',
    description: 'Navigate complex scenarios in this choose-your-own-adventure module',
    icon: '🎯',
    totalLevels: 6,
    type: 'choose-adventure'
  },
  {
    id: 3,
    title: 'The Regulatory Landscape',
    description: 'Master compliance rules with AI-powered simulation and real-time feedback',
    icon: '⚖️',
    totalLevels: 8,
    type: 'compliance-sim'
  },
  {
    id: 4,
    title: 'The Art of the Collection Call',
    description: 'Practice with AI consumers showing various emotional states',
    icon: '💬',
    totalLevels: 10,
    type: 'role-play'
  },
  {
    id: 5,
    title: 'Compliance Checklist and Quick Reference',
    description: 'Test your knowledge with fast-paced interactive quiz challenges',
    icon: '✅',
    totalLevels: 6,
    type: 'quiz-game'
  },
  {
    id: 6,
    title: 'Practice Scenarios and Role-Playing',
    description: 'Master all 25 real-world scenarios with dynamic AI consumers',
    icon: '🎭',
    totalLevels: 25,
    type: 'practice-scenarios'
  }
];

// Appendix sections for reference materials
export const APPENDICES = [
  {
    id: 'A',
    title: 'Appendix A: Quick Reference Guide',
    description: 'Essential rules, time zones, and compliance checklists',
    icon: '📋',
    type: 'reference'
  },
  {
    id: 'B',
    title: 'Appendix B: State-Specific Regulations',
    description: 'Detailed requirements for each state you operate in',
    icon: '🗺️',
    type: 'reference'
  },
  {
    id: 'C',
    title: 'Appendix C: Sample Scripts and Templates',
    description: 'Proven scripts for various collection scenarios',
    icon: '📝',
    type: 'reference'
  },
  {
    id: 'D',
    title: 'Appendix D: Glossary and Resources',
    description: 'Terms, definitions, and additional learning resources',
    icon: '📖',
    type: 'reference'
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
    
    const progressData = JSON.parse(stored);
    
    // Migrate old lesson IDs to new ones if needed
    // Check if we have old lesson structure (2,3,4,5,7,8,9,10) instead of new (1,2,3,4,5,6,7,8)
    const hasOldStructure = progressData.lessons && (progressData.lessons[2] || progressData.lessons[10]);
    
    if (hasOldStructure && !progressData.lessons[1]) {
      // Migration needed - map old IDs to new IDs
      const oldToNewMap = {
        2: 1,
        3: 2,
        4: 3,
        5: 4,
        7: 5,
        8: 6,
        9: 7,
        10: 8
      };
      
      const newLessons = {};
      Object.keys(oldToNewMap).forEach(oldId => {
        const newId = oldToNewMap[oldId];
        if (progressData.lessons[oldId]) {
          newLessons[newId] = {
            ...progressData.lessons[oldId],
            lessonId: newId
          };
        }
      });
      
      // Ensure all lessons exist
      LESSONS.forEach(lesson => {
        if (!newLessons[lesson.id]) {
          newLessons[lesson.id] = {
            lessonId: lesson.id,
            currentLevel: 1,
            levelsCompleted: [],
            levelScores: {},
            totalAttempts: 0,
            averageScore: 0,
            completionPercentage: 0,
            isCompleted: false,
            startedAt: null,
            completedAt: null,
            timeSpentMinutes: 0
          };
        }
      });
      
      progressData.lessons = newLessons;
      saveAllProgress(progressData);
      console.log('✅ Migrated lesson progress from old structure to new (1-8)');
    }
    
    // Ensure all current lessons exist in progress data
    let needsSave = false;
    LESSONS.forEach(lesson => {
      if (!progressData.lessons[lesson.id]) {
        progressData.lessons[lesson.id] = {
          lessonId: lesson.id,
          currentLevel: 1,
          levelsCompleted: [],
          levelScores: {},
          totalAttempts: 0,
          averageScore: 0,
          completionPercentage: 0,
          isCompleted: false,
          startedAt: null,
          completedAt: null,
          timeSpentMinutes: 0
        };
        needsSave = true;
      }
    });
    
    if (needsSave) {
      saveAllProgress(progressData);
      console.log('✅ Initialized missing lessons in progress data');
    }
    
    return progressData;
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
  
  // Ensure lesson exists
  if (!allProgress.lessons[lessonId]) {
    console.error(`Lesson ${lessonId} not found in progress data`);
    return null;
  }
  
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
  // Check for God Mode first
  const godMode = localStorage.getItem('protrain_god_mode') === 'true';
  if (godMode) return true;
  
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
