export type QuestionCategory = 'acm' | 'ai' | 'all';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  category: 'acm' | 'ai';
  difficulty: DifficultyLevel;
  explanation: string;
  funFact?: string;
  codeSnippet?: string;
  badgeTag: string;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
  timeSpentSec: number;
}

export interface QuizResultSummary {
  score: number;
  total: number;
  percentage: number;
  timeSpentSec: number;
  categoryBreakdown: {
    acm: { correct: number; total: number };
    ai: { correct: number; total: number };
  };
  rankTitle: string;
  rankBadge: string;
  userAnswers: UserAnswer[];
  date: string;
}

export interface LeaderboardEntry {
  id: string;
  playerName: string;
  avatarSeed: string;
  score: number;
  totalQuestions: number;
  accuracyPercent: number;
  timeTakenSec: number;
  categoryMode: string;
  rankTitle: string;
  timestamp: number;
}

export interface CommunityStats {
  totalQuizzesTaken: number;
  averageAccuracy: number;
  topScore: number;
  acmAccuracyRate: number;
  aiAccuracyRate: number;
}

export type QuizView = 'home' | 'quiz' | 'results' | 'leaderboard' | 'study' | 'certificate';
