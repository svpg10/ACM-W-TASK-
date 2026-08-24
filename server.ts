import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { INITIAL_QUESTIONS, getRankForScore } from './src/data/questions.ts';
import { LeaderboardEntry } from './src/types.ts';

const app = express();
const PORT = 3000;

app.use(express.json());

// In-memory + persistent fallback file for the Leaderboard
const DB_FILE = path.join(process.cwd(), 'leaderboard_db.json');

const DEFAULT_LEADERBOARD: LeaderboardEntry[] = [
  {
    id: 'lead-1',
    playerName: 'Ada_Lovelace.ai',
    avatarSeed: 'Ada',
    score: 10,
    totalQuestions: 10,
    accuracyPercent: 100,
    timeTakenSec: 42,
    categoryMode: 'all',
    rankTitle: 'Turing Laureate',
    timestamp: Date.now() - 3600000 * 2
  },
  {
    id: 'lead-2',
    playerName: 'TuringFellow',
    avatarSeed: 'Alan',
    score: 10,
    totalQuestions: 10,
    accuracyPercent: 100,
    timeTakenSec: 58,
    categoryMode: 'all',
    rankTitle: 'Turing Laureate',
    timestamp: Date.now() - 3600000 * 5
  },
  {
    id: 'lead-3',
    playerName: 'SIGAI_Scholar',
    avatarSeed: 'Alex',
    score: 9,
    totalQuestions: 10,
    accuracyPercent: 90,
    timeTakenSec: 64,
    categoryMode: 'ai',
    rankTitle: 'ACM Fellow & AI Architect',
    timestamp: Date.now() - 3600000 * 12
  },
  {
    id: 'lead-4',
    playerName: 'TransformerDev',
    avatarSeed: 'Elena',
    score: 9,
    totalQuestions: 10,
    accuracyPercent: 90,
    timeTakenSec: 72,
    categoryMode: 'all',
    rankTitle: 'ACM Fellow & AI Architect',
    timestamp: Date.now() - 3600000 * 24
  },
  {
    id: 'lead-5',
    playerName: 'NeuralExplorer',
    avatarSeed: 'Jordan',
    score: 8,
    totalQuestions: 10,
    accuracyPercent: 80,
    timeTakenSec: 85,
    categoryMode: 'acm',
    rankTitle: 'ACM Fellow & AI Architect',
    timestamp: Date.now() - 3600000 * 30
  }
];

function loadLeaderboard(): LeaderboardEntry[] {
  try {
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error loading leaderboard database file:', err);
  }
  return DEFAULT_LEADERBOARD;
}

function saveLeaderboard(data: LeaderboardEntry[]) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving leaderboard database file:', err);
  }
}

let leaderboardState = loadLeaderboard();
let totalQuizzesServed = 142 + leaderboardState.length;

// API Routes
app.get('/api/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: Date.now(), service: 'ACM-AI-Quiz-Backend' });
});

// GET /api/questions
app.get('/api/questions', (req, res) => {
  const category = req.query.category as string;
  let filtered = [...INITIAL_QUESTIONS];

  if (category && category !== 'all') {
    filtered = filtered.filter(q => q.category === category);
  }

  res.json({
    total: filtered.length,
    questions: filtered
  });
});

// POST /api/quiz/submit
app.post('/api/quiz/submit', (req, res) => {
  const { answers, timeSpentSec } = req.body as {
    answers: { questionId: string; selectedIndex: number }[];
    timeSpentSec?: number;
  };

  if (!Array.isArray(answers)) {
    return res.status(400).json({ error: 'Invalid answers payload format.' });
  }

  let correctCount = 0;
  const acmStats = { correct: 0, total: 0 };
  const aiStats = { correct: 0, total: 0 };

  const evaluated = answers.map(ans => {
    const question = INITIAL_QUESTIONS.find(q => q.id === ans.questionId);
    if (!question) {
      return {
        questionId: ans.questionId,
        selectedIndex: ans.selectedIndex,
        isCorrect: false,
        correctIndex: -1,
        explanation: 'Question not found'
      };
    }

    const isCorrect = question.correctIndex === ans.selectedIndex;
    if (isCorrect) correctCount++;

    if (question.category === 'acm') {
      acmStats.total++;
      if (isCorrect) acmStats.correct++;
    } else if (question.category === 'ai') {
      aiStats.total++;
      if (isCorrect) aiStats.correct++;
    }

    return {
      questionId: question.id,
      selectedIndex: ans.selectedIndex,
      correctIndex: question.correctIndex,
      isCorrect,
      explanation: question.explanation,
      funFact: question.funFact
    };
  });

  const total = answers.length || 1;
  const rank = getRankForScore(correctCount, total);
  totalQuizzesServed++;

  res.json({
    score: correctCount,
    total,
    percentage: Math.round((correctCount / total) * 100),
    timeSpentSec: timeSpentSec || 60,
    rankTitle: rank.title,
    rankBadge: rank.badge,
    categoryBreakdown: {
      acm: acmStats,
      ai: aiStats
    },
    results: evaluated
  });
});

// GET /api/leaderboard
app.get('/api/leaderboard', (req, res) => {
  const category = req.query.category as string;
  let list = [...leaderboardState];

  if (category && category !== 'all') {
    list = list.filter(item => item.categoryMode === category);
  }

  // Sort by score desc, then time taken asc
  list.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeTakenSec - b.timeTakenSec;
  });

  res.json({
    totalEntries: list.length,
    leaderboard: list.slice(0, 50)
  });
});

// POST /api/leaderboard
app.post('/api/leaderboard', (req, res) => {
  const { playerName, score, totalQuestions, timeTakenSec, categoryMode } = req.body;

  if (!playerName || typeof score !== 'number') {
    return res.status(400).json({ error: 'Player name and score are required' });
  }

  const accuracyPercent = Math.round((score / (totalQuestions || 10)) * 100);
  const rank = getRankForScore(score, totalQuestions || 10);

  const newEntry: LeaderboardEntry = {
    id: 'lead-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
    playerName: playerName.trim().slice(0, 24),
    avatarSeed: playerName.trim().split(' ')[0] || 'Player',
    score,
    totalQuestions: totalQuestions || 10,
    accuracyPercent,
    timeTakenSec: Math.max(1, timeTakenSec || 30),
    categoryMode: categoryMode || 'all',
    rankTitle: rank.title,
    timestamp: Date.now()
  };

  leaderboardState.unshift(newEntry);

  // Keep top 100 in storage
  leaderboardState.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.timeTakenSec - b.timeTakenSec;
  });

  if (leaderboardState.length > 100) {
    leaderboardState = leaderboardState.slice(0, 100);
  }

  saveLeaderboard(leaderboardState);

  const playerRankIndex = leaderboardState.findIndex(e => e.id === newEntry.id) + 1;

  res.json({
    success: true,
    entry: newEntry,
    rankPosition: playerRankIndex,
    totalLeaders: leaderboardState.length
  });
});

// GET /api/stats
app.get('/api/stats', (_req, res) => {
  const totalEntries = leaderboardState.length;
  const avgAccuracy = Math.round(
    leaderboardState.reduce((acc, curr) => acc + curr.accuracyPercent, 0) / (totalEntries || 1)
  );

  res.json({
    totalQuizzesTaken: totalQuizzesServed,
    averageAccuracy: avgAccuracy || 88,
    topScore: leaderboardState[0]?.score || 10,
    acmAccuracyRate: 86,
    aiAccuracyRate: 91
  });
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ACM & AI Quiz Server running on port ${PORT}`);
  });
}

startServer();
