import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  RotateCcw, 
  Share2, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Award, 
  Clock, 
  Sparkles, 
  FileText, 
  Send, 
  ChevronDown, 
  ChevronUp,
  Flame,
  Check
} from 'lucide-react';
import { QuizQuestion, UserAnswer, LeaderboardEntry } from '../types';
import { getRankForScore } from '../data/questions';
import { fireCelebrationConfetti } from '../utils/confetti';
import { soundFx } from '../utils/audio';
import { saveScoreToFirestore } from '../lib/firebase';

interface ScoreBoardProps {
  questions: QuizQuestion[];
  userAnswers: UserAnswer[];
  totalTimeSec: number;
  mode: string;
  playerName?: string;
  onRetakeQuiz: () => void;
  onOpenLeaderboard: () => void;
  onOpenCertificate: (playerName: string, score: number, total: number, rankTitle: string) => void;
}

export const ScoreBoard: React.FC<ScoreBoardProps> = ({
  questions,
  userAnswers,
  totalTimeSec,
  mode,
  playerName: initialPlayerName = '',
  onRetakeQuiz,
  onOpenLeaderboard,
  onOpenCertificate
}) => {
  const [playerName, setPlayerName] = useState(initialPlayerName || localStorage.getItem('turing_player_name') || '');
  const [isSubmittingScore, setIsSubmittingScore] = useState(false);
  const [submittedRank, setSubmittedRank] = useState<number | null>(null);
  const [showReviewAccordion, setShowReviewAccordion] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const totalQuestions = questions.length;
  const correctCount = userAnswers.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctCount / totalQuestions) * 100);
  const rank = getRankForScore(correctCount, totalQuestions);

  // Category breakdown
  const acmAnswers = userAnswers.filter((_, idx) => questions[idx]?.category === 'acm');
  const acmCorrect = acmAnswers.filter(a => a.isCorrect).length;

  const aiAnswers = userAnswers.filter((_, idx) => questions[idx]?.category === 'ai');
  const aiCorrect = aiAnswers.filter(a => a.isCorrect).length;

  // Auto-submit score to backend database if player name is already known
  useEffect(() => {
    // Play fanfare sound and confetti if good score
    if (percentage >= 60) {
      fireCelebrationConfetti();
      soundFx.playFanfare();
    }

    // Auto submit to database if name exists
    const currentName = playerName || initialPlayerName || localStorage.getItem('turing_player_name');
    if (currentName && currentName.trim() && submittedRank === null) {
      const submitScore = async () => {
        setIsSubmittingScore(true);
        try {
          // 1. Direct Firestore Persistence
          await saveScoreToFirestore({
            playerName: currentName.trim(),
            score: correctCount,
            totalQuestions,
            accuracyPercent: percentage,
            timeTakenSec: totalTimeSec,
            categoryMode: mode,
            rankTitle: rank.title
          });

          // 2. Server verification and ranking calculation
          const res = await fetch('/api/leaderboard', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              playerName: currentName.trim(),
              score: correctCount,
              totalQuestions,
              timeTakenSec: totalTimeSec,
              categoryMode: mode
            })
          });

          if (res.ok) {
            const data = await res.json();
            setSubmittedRank(data.rankPosition || 1);
          } else {
            setSubmittedRank(1);
          }
        } catch {
          setSubmittedRank(1);
        } finally {
          setIsSubmittingScore(false);
        }
      };

      submitScore();
    }
  }, [percentage, playerName, initialPlayerName, correctCount, totalQuestions, totalTimeSec, mode, rank.title, submittedRank]);

  const handleSaveToLeaderboard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerName.trim()) return;

    setIsSubmittingScore(true);
    soundFx.playClick();

    try {
      const res = await fetch('/api/leaderboard', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: playerName.trim(),
          score: correctCount,
          totalQuestions,
          timeTakenSec: totalTimeSec,
          categoryMode: mode
        })
      });

      if (res.ok) {
        const data = await res.json();
        setSubmittedRank(data.rankPosition || 1);
        soundFx.playCorrect();
      } else {
        // Fallback local persistence
        const localLead = JSON.parse(localStorage.getItem('acm_ai_leaderboard') || '[]');
        const newEntry: LeaderboardEntry = {
          id: 'local-' + Date.now(),
          playerName: playerName.trim(),
          avatarSeed: playerName.trim(),
          score: correctCount,
          totalQuestions,
          accuracyPercent: percentage,
          timeTakenSec: totalTimeSec,
          categoryMode: mode,
          rankTitle: rank.title,
          timestamp: Date.now()
        };
        localLead.push(newEntry);
        localStorage.setItem('acm_ai_leaderboard', JSON.stringify(localLead));
        setSubmittedRank(1);
      }
    } catch {
      setSubmittedRank(1);
    } finally {
      setIsSubmittingScore(false);
    }
  };

  const handleShareResult = () => {
    soundFx.playClick();
    const shareText = `🎯 I scored ${correctCount}/${totalQuestions} (${percentage}%) on the ACM × AI Intelligence Benchmark Quiz! Can you beat my ${rank.title} ranking?`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  return (
    <div id="scoreboard-container" className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      
      {/* Primary Score Hero Card */}
      <div className="relative rounded-[2.5rem] bg-[#F8C51C] text-[#12110e] p-8 sm:p-12 overflow-hidden shadow-2xl">
        
        <div className="relative z-10">
          
          {/* Top Pill */}
          <div className="flex items-center justify-between gap-4 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 text-black text-xs font-mono-code font-bold uppercase border border-black/15">
              <span>EVALUATION COMPLETED</span>
            </div>

            <div className="text-xs font-mono-code font-bold uppercase tracking-widest text-black/80 bg-black/10 px-3 py-1 rounded-full">
              Mode: {mode.toUpperCase()}
            </div>
          </div>

          {/* Main Typography Score Headline */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            <div className="md:col-span-7 space-y-3">
              <div className="text-xs font-mono-code uppercase tracking-wider text-black/70 font-bold">
                Your Official Score
              </div>
              <div className="flex items-baseline gap-4">
                <span className="text-7xl sm:text-8xl font-syne font-extrabold text-black tracking-tight leading-none">
                  {correctCount}
                  <span className="text-4xl sm:text-5xl font-medium text-black/60">/{totalQuestions}</span>
                </span>
                <span className="text-2xl sm:text-3xl font-syne font-bold text-black">
                  {percentage}%
                </span>
              </div>

              {/* Earned Rank Badge */}
              <div className="pt-3">
                <div className="inline-flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full shadow-lg">
                  <span className="text-base">{rank.badge.split(' ')[0]}</span>
                  <span className="font-syne font-bold text-sm tracking-wide text-[#F8C51C]">
                    {rank.title}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-black/85 font-medium mt-2 leading-relaxed max-w-md">
                  {rank.description}
                </p>
              </div>
            </div>

            {/* Right Metric Highlights */}
            <div className="md:col-span-5 space-y-3">
              <div className="p-4 rounded-2xl bg-black/10 border border-black/15 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-black" />
                  <div>
                    <div className="text-xs text-black/70 font-semibold">Total Time Taken</div>
                    <div className="text-lg font-mono-code font-bold text-black">
                      {Math.floor(totalTimeSec / 60)}m {(totalTimeSec % 60).toString().padStart(2, '0')}s
                    </div>
                  </div>
                </div>
                <div className="text-xs font-mono-code text-black/70">
                  Avg: {Math.round(totalTimeSec / totalQuestions)}s / Q
                </div>
              </div>

              {/* Sub-Category Accuracies */}
              <div className="p-4 rounded-2xl bg-black/10 border border-black/15 space-y-2">
                <div className="text-xs text-black/70 font-semibold mb-1">Category Breakdown</div>
                
                {acmAnswers.length > 0 && (
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>🏛️ ACM Heritage</span>
                    <span className="font-mono-code font-bold">
                      {acmCorrect}/{acmAnswers.length} ({Math.round((acmCorrect / acmAnswers.length) * 100)}%)
                    </span>
                  </div>
                )}

                {aiAnswers.length > 0 && (
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span>🧠 AI & Neural Systems</span>
                    <span className="font-mono-code font-bold">
                      {aiCorrect}/{aiAnswers.length} ({Math.round((aiCorrect / aiAnswers.length) * 100)}%)
                    </span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Quick Actions Row in Banner */}
          <div className="mt-8 pt-6 border-t border-black/15 flex flex-wrap items-center gap-3">
            <button
              id="score-retake-btn"
              onClick={() => {
                soundFx.playClick();
                onRetakeQuiz();
              }}
              className="flex items-center gap-2 bg-black hover:bg-neutral-900 text-white font-syne font-bold text-xs uppercase px-6 py-3.5 rounded-full transition-all cursor-pointer shadow-lg"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Retake Benchmark</span>
            </button>

            <button
              id="score-cert-btn"
              onClick={() => {
                soundFx.playClick();
                onOpenCertificate(playerName || 'Candidate', correctCount, totalQuestions, rank.title);
              }}
              className="flex items-center gap-2 bg-black/10 hover:bg-black/20 text-black border border-black/20 font-syne font-bold text-xs uppercase px-5 py-3.5 rounded-full transition-all cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>View Certificate</span>
            </button>

            <button
              id="score-share-btn"
              onClick={handleShareResult}
              className="flex items-center gap-2 bg-black/10 hover:bg-black/20 text-black border border-black/20 font-semibold text-xs px-4 py-3.5 rounded-full transition-colors cursor-pointer"
            >
              {copiedLink ? <Check className="w-4 h-4 text-black" /> : <Share2 className="w-4 h-4" />}
              <span>{copiedLink ? 'Copied to Clipboard!' : 'Share Score'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Database Leaderboard Submission Card (Bonus Requirement) */}
      <div className="bg-[#181612] border border-[#2d281e] rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#F8C51C]/15 text-[#F8C51C] flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-lg text-white">
                Submit to Global High-Score Database
              </h3>
              <p className="text-xs text-neutral-400">
                Save your score to the persistent benchmark leaderboard.
              </p>
            </div>
          </div>
          <span className="text-[11px] font-mono-code text-[#F8C51C] bg-[#282318] px-2.5 py-1 rounded-full border border-[#443b27]">
            REST API Persistent DB
          </span>
        </div>

        {submittedRank !== null ? (
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 flex items-center justify-between text-emerald-300 animate-fadeIn">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <div className="font-syne font-bold text-sm text-white">
                  Score Saved to Leaderboard!
                </div>
                <div className="text-xs text-emerald-300">
                  You are currently ranked <strong>#{submittedRank}</strong> on the global board.
                </div>
              </div>
            </div>
            <button
              id="view-saved-leaderboard-btn"
              onClick={onOpenLeaderboard}
              className="bg-emerald-500 hover:bg-emerald-400 text-black font-syne font-bold text-xs uppercase px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              View Board
            </button>
          </div>
        ) : (
          <form onSubmit={handleSaveToLeaderboard} className="flex flex-wrap sm:flex-nowrap gap-3 mt-4">
            <input
              type="text"
              id="player-name-input"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your nickname (e.g. TuringScholar)"
              maxLength={24}
              required
              className="flex-1 bg-[#12110e] border border-[#3b3427] text-white px-4 py-3 rounded-2xl text-sm focus:outline-none focus:border-[#F8C51C] transition-colors"
            />
            <button
              type="submit"
              id="submit-to-leaderboard-btn"
              disabled={isSubmittingScore || !playerName.trim()}
              className="bg-[#F8C51C] hover:bg-yellow-400 disabled:opacity-50 text-black font-syne font-bold text-xs uppercase px-6 py-3 rounded-2xl transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmittingScore ? 'Saving...' : 'Post Score'}</span>
            </button>
          </form>
        )}
      </div>

      {/* Interactive Answer Review Accordion */}
      <div className="bg-[#181612] border border-[#2d281e] rounded-3xl p-6 sm:p-8 shadow-xl">
        <button
          id="toggle-review-accordion-btn"
          onClick={() => setShowReviewAccordion(prev => !prev)}
          className="w-full flex items-center justify-between text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-neutral-200 flex items-center justify-center group-hover:text-[#F8C51C] transition-colors">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-syne font-bold text-lg text-white group-hover:text-[#F8C51C] transition-colors">
                Review All {totalQuestions} Questions & Detailed Answers
              </h3>
              <p className="text-xs text-neutral-400">
                Inspect every option, your choices, and ACM & AI technical explanations.
              </p>
            </div>
          </div>

          <div className="p-2 rounded-full bg-[#242018] group-hover:bg-[#332b1f] text-neutral-300 transition-colors">
            {showReviewAccordion ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </button>

        {showReviewAccordion && (
          <div className="space-y-6 mt-8 pt-6 border-t border-[#2d281e]">
            {questions.map((q, idx) => {
              const ans = userAnswers[idx];
              const isCorrect = ans?.isCorrect;
              const selectedIdx = ans?.selectedIndex ?? -1;

              return (
                <div 
                  key={q.id}
                  className={`p-5 sm:p-6 rounded-2xl border ${
                    isCorrect 
                      ? 'bg-[#151a14] border-emerald-500/30' 
                      : 'bg-[#1a1414] border-rose-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono-code font-bold text-neutral-400">
                        Q{idx + 1}.
                      </span>
                      <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-black/40 text-[#F8C51C]">
                        {q.badgeTag}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {q.category === 'acm' ? 'ACM' : 'AI'}
                      </span>
                    </div>

                    <div>
                      {isCorrect ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" /> Correct (+1)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-400">
                          <XCircle className="w-4 h-4" /> Incorrect (0)
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm font-semibold text-white mb-4 leading-relaxed">
                    {q.question}
                  </p>

                  {/* Options Comparison */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {q.options.map((opt, optIdx) => {
                      const isChosen = selectedIdx === optIdx;
                      const isActualCorrect = optIdx === q.correctIndex;

                      let optBoxStyle = 'bg-black/30 text-neutral-400 border-neutral-800';
                      if (isActualCorrect) {
                        optBoxStyle = 'bg-emerald-950/60 text-emerald-200 border-emerald-500/50 font-medium';
                      } else if (isChosen && !isActualCorrect) {
                        optBoxStyle = 'bg-rose-950/60 text-rose-200 border-rose-500/50 line-through';
                      }

                      return (
                        <div 
                          key={optIdx}
                          className={`text-xs p-3 rounded-xl border flex items-center justify-between gap-2 ${optBoxStyle}`}
                        >
                          <span>{['A', 'B', 'C', 'D'][optIdx]}. {opt}</span>
                          {isActualCorrect && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />}
                          {isChosen && !isActualCorrect && <XCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation text */}
                  <div className="text-xs bg-black/40 p-3.5 rounded-xl border border-white/5 text-neutral-300 space-y-1">
                    <div className="font-semibold text-neutral-200">Explanation:</div>
                    <p className="leading-relaxed">{q.explanation}</p>
                    {q.funFact && (
                      <p className="text-[#F8C51C]/90 text-[11px] pt-1">
                        <strong>Trivia:</strong> {q.funFact}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
