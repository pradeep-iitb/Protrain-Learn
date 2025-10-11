// 25 Levels with increasing difficulty
export const LEVELS = [
  // Beginner Levels (1-5) - Easy personas, basic challenges
  {
    id: 1,
    name: "Level 1: Friendly First Contact",
    difficulty: "Beginner",
    persona: "Cooperative Borrower - Recently Missed Payment",
    description: "A generally cooperative person who missed their first payment due to a minor oversight. They're willing to make things right.",
    passingScore: 180, // 60% minimum to pass
    traits: "cooperative, apologetic, willing to pay"
  },
  {
    id: 2,
    name: "Level 2: Forgetful Frank",
    difficulty: "Beginner",
    persona: "Forgetful Borrower - Disorganized",
    description: "Someone who often forgets dates and details. Needs clear reminders and simple instructions.",
    passingScore: 180,
    traits: "forgetful, disorganized, needs guidance"
  },
  {
    id: 3,
    name: "Level 3: Confused Clara",
    difficulty: "Beginner",
    persona: "Confused Borrower - Financial Literacy Issues",
    description: "Struggles to understand financial terms and concepts. Requires patient explanations in simple language.",
    passingScore: 180,
    traits: "confused, needs simple explanations, appreciates patience"
  },
  {
    id: 4,
    name: "Level 4: Busy Professional",
    difficulty: "Beginner",
    persona: "Busy Borrower - Time-Constrained",
    description: "A working professional juggling multiple responsibilities. Needs efficient communication and flexible options.",
    passingScore: 180,
    traits: "busy, time-conscious, professional"
  },
  {
    id: 5,
    name: "Level 5: Recent Graduate",
    difficulty: "Beginner",
    persona: "Young Borrower - First Debt Experience",
    description: "A recent graduate facing their first debt collection call. Nervous but willing to cooperate.",
    passingScore: 180,
    traits: "nervous, inexperienced, eager to resolve"
  },

  // Intermediate Levels (6-15) - Moderate challenges
  {
    id: 6,
    name: "Level 6: Anxious Annie",
    difficulty: "Intermediate",
    persona: "Anxious Borrower - Financial Hardship",
    description: "Worried and stressed about financial situation. Needs reassurance and empathy about available options.",
    passingScore: 200,
    traits: "anxious, stressed, needs reassurance"
  },
  {
    id: 7,
    name: "Level 7: Skeptical Steve",
    difficulty: "Intermediate",
    persona: "Skeptical Borrower - Trust Issues",
    description: "Questions everything and doesn't trust easily. Requires transparent explanations and proof of legitimacy.",
    passingScore: 200,
    traits: "skeptical, distrustful, needs transparency"
  },
  {
    id: 8,
    name: "Level 8: Overwhelmed Oliver",
    difficulty: "Intermediate",
    persona: "Overwhelmed Borrower - Multiple Debts",
    description: "Has multiple debts and feels hopeless. Needs help prioritizing and creating manageable payment plans.",
    passingScore: 200,
    traits: "overwhelmed, multiple debts, needs guidance"
  },
  {
    id: 9,
    name: "Level 9: Unemployed Uma",
    difficulty: "Intermediate",
    persona: "Unemployed Borrower - No Stable Income",
    description: "Recently lost their job with no stable income. Requires flexible payment arrangements and understanding.",
    passingScore: 200,
    traits: "unemployed, no income, needs flexibility"
  },
  {
    id: 10,
    name: "Level 10: Medical Emergency Mike",
    difficulty: "Intermediate",
    persona: "Medical Hardship - Health Issues",
    description: "Dealing with serious health issues that caused financial hardship. Needs compassionate understanding.",
    passingScore: 200,
    traits: "medical issues, compassionate case, vulnerable"
  },
  {
    id: 11,
    name: "Level 11: Defensive Diana",
    difficulty: "Intermediate",
    persona: "Defensive Borrower - Evasive",
    description: "Avoids direct answers and deflects questions. Becomes cooperative when treated respectfully.",
    passingScore: 210,
    traits: "defensive, evasive, needs respect"
  },
  {
    id: 12,
    name: "Level 12: Divorced Dad",
    difficulty: "Intermediate",
    persona: "Recent Divorce - Split Finances",
    description: "Going through a divorce with complicated financial situation. Needs understanding and fair negotiation.",
    passingScore: 210,
    traits: "divorce situation, emotional, financial complexity"
  },
  {
    id: 13,
    name: "Level 13: Small Business Owner",
    difficulty: "Intermediate",
    persona: "Business Owner - Cash Flow Issues",
    description: "Small business facing cash flow problems. Wants to pay but needs realistic payment schedule.",
    passingScore: 210,
    traits: "business owner, cash flow issues, negotiable"
  },
  {
    id: 14,
    name: "Level 14: Single Parent",
    difficulty: "Intermediate",
    persona: "Single Parent - Limited Resources",
    description: "Raising children alone with limited financial resources. Balancing family needs with debt obligations.",
    passingScore: 210,
    traits: "single parent, limited income, family priorities"
  },
  {
    id: 15,
    name: "Level 15: Senior Citizen",
    difficulty: "Intermediate",
    persona: "Elderly Borrower - Fixed Income",
    description: "Retired on fixed income struggling with medical bills. Needs patient, respectful communication.",
    passingScore: 210,
    traits: "elderly, fixed income, respectful approach needed"
  },

  // Advanced Levels (16-25) - Difficult personas
  {
    id: 16,
    name: "Level 16: Angry Alex",
    difficulty: "Advanced",
    persona: "Angry Borrower - Frustrated & Resistant",
    description: "Frustrated and short-tempered, may raise voice initially. Can be calmed with empathy and professionalism.",
    passingScore: 220,
    traits: "angry, resistant, short-tempered, needs de-escalation"
  },
  {
    id: 17,
    name: "Level 17: Legal Threat Larry",
    difficulty: "Advanced",
    persona: "Litigious Borrower - Threatens Legal Action",
    description: "Quick to threaten lawsuits and legal action. Requires firm but compliant communication.",
    passingScore: 220,
    traits: "litigious, threatening, knows rights"
  },
  {
    id: 18,
    name: "Level 18: Identity Denier",
    difficulty: "Advanced",
    persona: "Identity Dispute - Claims Not Their Debt",
    description: "Insists the debt isn't theirs and may have identity theft concerns. Needs verification process.",
    passingScore: 220,
    traits: "denies debt, identity concerns, needs verification"
  },
  {
    id: 19,
    name: "Level 19: Chronic Avoider",
    difficulty: "Advanced",
    persona: "Avoidant Borrower - History of Broken Promises",
    description: "Pattern of making payment promises but not following through. Requires firm commitment strategies.",
    passingScore: 230,
    traits: "avoidant, unreliable, broken promises"
  },
  {
    id: 20,
    name: "Level 20: Hostile Hannah",
    difficulty: "Advanced",
    persona: "Hostile Borrower - Aggressive & Confrontational",
    description: "Extremely confrontational and uses aggressive language. Demands advanced de-escalation skills.",
    passingScore: 230,
    traits: "hostile, aggressive, confrontational"
  },
  {
    id: 21,
    name: "Level 21: Bankruptcy Bill",
    difficulty: "Advanced",
    persona: "Bankruptcy Filing - Legal Protection",
    description: "Filed for bankruptcy and knows collection attempts must cease. Requires compliance knowledge.",
    passingScore: 230,
    traits: "bankruptcy, legally protected, compliance critical"
  },
  {
    id: 22,
    name: "Level 22: Manipulation Master",
    difficulty: "Advanced",
    persona: "Manipulative Borrower - Emotional Tactics",
    description: "Uses guilt, sob stories, and manipulation to avoid payment. Needs firm boundaries with empathy.",
    passingScore: 240,
    traits: "manipulative, emotional tactics, boundary testing"
  },
  {
    id: 23,
    name: "Level 23: Know-It-All Ken",
    difficulty: "Advanced",
    persona: "FDCPA Expert - Knows All Rights",
    description: "Extremely knowledgeable about debt collection laws. Will catch any compliance violation.",
    passingScore: 240,
    traits: "knows FDCPA, compliance expert, testing knowledge"
  },
  {
    id: 24,
    name: "Level 24: Silent Sam",
    difficulty: "Advanced",
    persona: "Non-Responsive - Minimal Communication",
    description: "Gives one-word answers or stays silent. Requires exceptional engagement and rapport-building.",
    passingScore: 250,
    traits: "silent, non-responsive, difficult to engage"
  },
  {
    id: 25,
    name: "Level 25: The Ultimate Challenge",
    difficulty: "Expert",
    persona: "Master Negotiator - All Tactics Combined",
    description: "Combines multiple difficult traits: angry, skeptical, knowledgeable, and resistant. The final test.",
    passingScore: 260,
    traits: "master level, all difficulties, ultimate challenge"
  }
];

// Helper function to get level by ID
export function getLevelById(id) {
  return LEVELS.find(level => level.id === id);
}

// Helper function to calculate if level is passed
export function isLevelPassed(totalScore, levelId) {
  const level = getLevelById(levelId);
  return totalScore >= level.passingScore;
}

// Helper function to get next level
export function getNextLevel(currentLevelId) {
  return LEVELS.find(level => level.id === currentLevelId + 1);
}
