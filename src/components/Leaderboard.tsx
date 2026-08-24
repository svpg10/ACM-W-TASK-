import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Medal, 
  Crown, 
  Search, 
  RefreshCw, 
  Clock, 
  Zap, 
  Play, 
  Sparkles,
  Users,
  Target,
  BarChart2
} from 'lucide-react';
import { LeaderboardEntry, CommunityStats } from '../types';
import { soundFx } from '../utils/audio';
import { subscribeLeaderboard, getFirestoreLeaderboard } from '../lib/firebase';

interface LeaderboardProps {
  onStartQuiz: () => void;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ onStartQuiz }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<CommunityStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchLeaderboard = async () => {
    setIsLoading(true);
    try {
      // Fetch directly from Firestore first
      const fsEntries = await getFirestoreLeaderboard();
      if (fsEntries && fsEntries.length > 0) {
        if (selectedCategory === 'all') {
          setEntries(fsEntries);
        } else {
          setEntries(fsEntries.filter(e => e.categoryMode === selectedCategory));
        }
      } else {
        const url = selectedCategory === 'all' 
          ? '/api/leaderboard' 
          : `/api/leaderboard?category=${selectedCategory}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setEntries(data.leaderboard || []);
        }
      }
    } catch {
      // Fallback local storage
      const localData = JSON.parse(localStorage.getItem('acm_ai_leaderboard') || '[]');
      setEntries(localData);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch {
      // Non-blocking
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    fetchStats();

    // Subscribe to Firestore Realtime Updates
    const unsubscribe = subscribeLeaderboard((updatedList) => {
      if (updatedList && updatedList.length > 0) {
        if (selectedCategory === 'all') {
          setEntries(updatedList);
        } else {
          setEntries(updatedList.filter(e => e.categoryMode === selectedCategory));
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, [selectedCategory]);

  const filteredEntries = entries.filter(item => 
    item.playerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.rankTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const topThree = filteredEntries.slice(0, 3);
  const restEntries = filteredEntries.slice(3);

  return (
    <div id="leaderboard-view" className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#F8C51C] uppercase tracking-widest">
            <span>○ Live Database Rankings</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-syne font-extrabold text-white uppercase tracking-tight mt-1">
            Global High Scores
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Real-time scoring verification for ACM & Artificial Intelligence benchmarkers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            id="refresh-leaderboard-btn"
            onClick={() => {
              soundFx.playClick();
              fetchLeaderboard();
              fetchStats();
            }}
            className="flex items-center gap-2 p-3 rounded-full bg-[#1e1a14] hover:bg-[#2a241a] text-neutral-300 hover:text-white border border-[#2f291e] transition-colors cursor-pointer"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#F8C51C]' : ''}`} />
          </button>

          <button
            id="leaderboard-play-btn"
            onClick={() => {
              soundFx.playClick();
              onStartQuiz();
            }}
            className="flex items-center gap-2 bg-[#F8C51C] hover:bg-yellow-400 text-black font-syne font-bold text-xs uppercase px-6 py-3 rounded-full transition-all shadow-[0_4px_16px_rgba(248,197,28,0.25)] cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-black" />
            <span>Take Challenge</span>
          </button>
        </div>
      </div>

      {/* Community Benchmark Stats Bar */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#181612] border border-[#2d281e]">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <Users className="w-3.5 h-3.5 text-[#F8C51C]" />
              <span>Quizzes Taken</span>
            </div>
            <div className="text-xl sm:text-2xl font-syne font-bold text-white">
              {stats.totalQuizzesTaken}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#181612] border border-[#2d281e]">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <Target className="w-3.5 h-3.5 text-emerald-400" />
              <span>Global Accuracy</span>
            </div>
            <div className="text-xl sm:text-2xl font-syne font-bold text-emerald-400">
              {stats.averageAccuracy}%
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#181612] border border-[#2d281e]">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <Trophy className="w-3.5 h-3.5 text-[#F8C51C]" />
              <span>High Score</span>
            </div>
            <div className="text-xl sm:text-2xl font-syne font-bold text-[#F8C51C]">
              {stats.topScore} / 10
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#181612] border border-[#2d281e]">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <BarChart2 className="w-3.5 h-3.5 text-blue-400" />
              <span>Domain Pass Rate</span>
            </div>
            <div className="text-xs font-mono-code font-bold text-neutral-200 mt-1">
              ACM {stats.acmAccuracyRate}% • AI {stats.aiAccuracyRate}%
            </div>
          </div>
        </div>
      )}

      {/* Podium for Top 3 (Poster Art styling) */}
      {topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          
          {/* Rank 2 (Silver) */}
          {topThree[1] && (
            <div className="order-2 md:order-1 p-6 rounded-3xl bg-[#181612] border border-[#2d281e] text-center space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-3 left-3 text-xs font-mono-code bg-[#242018] text-neutral-400 px-2.5 py-1 rounded-full">
                #2 RANK
              </div>
              <div className="pt-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-800 text-neutral-300 flex items-center justify-center font-syne font-bold text-xl border-2 border-neutral-600 shadow-md">
                  🥈
                </div>
                <h3 className="font-syne font-bold text-lg text-white mt-3 truncate">
                  {topThree[1].playerName}
                </h3>
                <p className="text-xs text-[#F8C51C] font-semibold">
                  {topThree[1].rankTitle}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#12110e] border border-[#282319] flex items-center justify-around text-xs font-mono-code">
                <div>
                  <div className="text-neutral-500 text-[10px]">SCORE</div>
                  <div className="font-bold text-white">{topThree[1].score}/{topThree[1].totalQuestions}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px]">TIME</div>
                  <div className="font-bold text-white">{topThree[1].timeTakenSec}s</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px]">ACCURACY</div>
                  <div className="font-bold text-emerald-400">{topThree[1].accuracyPercent}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 1 (Gold / Saffron Yellow Feature) */}
          {topThree[0] && (
            <div className="order-1 md:order-2 p-8 rounded-[2rem] bg-[#F8C51C] text-black text-center space-y-4 relative overflow-hidden shadow-2xl md:-translate-y-3">
              <div className="absolute top-3 left-3 text-xs font-mono-code bg-black/15 text-black font-bold px-3 py-1 rounded-full">
                👑 #1 CHAMPION
              </div>
              <div className="pt-2">
                <div className="w-20 h-20 mx-auto rounded-3xl bg-black text-[#F8C51C] flex items-center justify-center font-syne font-bold text-3xl shadow-xl border-2 border-black/20">
                  🥇
                </div>
                <h3 className="font-syne font-extrabold text-2xl text-black mt-3 truncate">
                  {topThree[0].playerName}
                </h3>
                <div className="inline-block bg-black text-[#F8C51C] font-syne text-xs font-bold px-3 py-1 rounded-full mt-1">
                  {topThree[0].rankTitle}
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/10 border border-black/15 flex items-center justify-around text-xs font-mono-code text-black">
                <div>
                  <div className="text-black/60 text-[10px] font-bold">SCORE</div>
                  <div className="font-extrabold text-black text-sm">{topThree[0].score}/{topThree[0].totalQuestions}</div>
                </div>
                <div>
                  <div className="text-black/60 text-[10px] font-bold">TIME</div>
                  <div className="font-extrabold text-black text-sm">{topThree[0].timeTakenSec}s</div>
                </div>
                <div>
                  <div className="text-black/60 text-[10px] font-bold">ACCURACY</div>
                  <div className="font-extrabold text-black text-sm">{topThree[0].accuracyPercent}%</div>
                </div>
              </div>
            </div>
          )}

          {/* Rank 3 (Bronze) */}
          {topThree[2] && (
            <div className="order-3 p-6 rounded-3xl bg-[#181612] border border-[#2d281e] text-center space-y-3 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-3 left-3 text-xs font-mono-code bg-[#242018] text-neutral-400 px-2.5 py-1 rounded-full">
                #3 RANK
              </div>
              <div className="pt-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-neutral-800 text-amber-600 flex items-center justify-center font-syne font-bold text-xl border-2 border-amber-800/40 shadow-md">
                  🥉
                </div>
                <h3 className="font-syne font-bold text-lg text-white mt-3 truncate">
                  {topThree[2].playerName}
                </h3>
                <p className="text-xs text-[#F8C51C] font-semibold">
                  {topThree[2].rankTitle}
                </p>
              </div>
              <div className="p-3 rounded-2xl bg-[#12110e] border border-[#282319] flex items-center justify-around text-xs font-mono-code">
                <div>
                  <div className="text-neutral-500 text-[10px]">SCORE</div>
                  <div className="font-bold text-white">{topThree[2].score}/{topThree[2].totalQuestions}</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px]">TIME</div>
                  <div className="font-bold text-white">{topThree[2].timeTakenSec}s</div>
                </div>
                <div>
                  <div className="text-neutral-500 text-[10px]">ACCURACY</div>
                  <div className="font-bold text-emerald-400">{topThree[2].accuracyPercent}%</div>
                </div>
              </div>
            </div>
          )}

        </div>
      )}

      {/* Filter and Search Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-4">
        
        {/* Category Pills */}
        <div className="flex items-center gap-2">
          {['all', 'acm', 'ai', 'speedrun'].map(cat => (
            <button
              key={cat}
              onClick={() => {
                soundFx.playClick();
                setSelectedCategory(cat);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat 
                  ? 'bg-[#F8C51C] text-black shadow-md' 
                  : 'bg-[#1c1913] text-neutral-400 hover:text-white border border-[#2d281e]'
              }`}
            >
              {cat === 'all' ? 'All Modes' : cat === 'acm' ? 'ACM Focus' : cat === 'ai' ? 'AI Focus' : 'Speedrun'}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search candidate..."
            className="w-full bg-[#161410] border border-[#2d281e] text-white pl-10 pr-4 py-2 rounded-full text-xs focus:outline-none focus:border-[#F8C51C]"
          />
        </div>

      </div>

      {/* Full Leaderboard Table */}
      <div className="bg-[#181612] border border-[#2d281e] rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2d281e] text-[11px] font-mono-code uppercase tracking-wider text-neutral-400 bg-[#14120e]">
                <th className="py-4 px-6">Rank</th>
                <th className="py-4 px-6">Candidate</th>
                <th className="py-4 px-6">Tier Title</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6 text-center">Score</th>
                <th className="py-4 px-6 text-center">Accuracy</th>
                <th className="py-4 px-6 text-right">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#242018] text-xs">
              {filteredEntries.map((item, idx) => {
                const rankNum = idx + 1;
                return (
                  <tr 
                    key={item.id}
                    className="hover:bg-[#201d17] transition-colors"
                  >
                    <td className="py-4 px-6 font-mono-code font-bold">
                      {rankNum === 1 ? '🥇 #1' : rankNum === 2 ? '🥈 #2' : rankNum === 3 ? '🥉 #3' : `#${rankNum}`}
                    </td>
                    <td className="py-4 px-6 font-semibold text-white">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#292419] text-[#F8C51C] flex items-center justify-center text-xs font-bold border border-[#443b27]">
                          {item.playerName.charAt(0).toUpperCase()}
                        </div>
                        <span>{item.playerName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-neutral-300">
                      {item.rankTitle}
                    </td>
                    <td className="py-4 px-6">
                      <span className="font-mono-code text-[11px] uppercase bg-[#231f18] text-neutral-400 px-2 py-0.5 rounded border border-[#3b3427]">
                        {item.categoryMode}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center font-mono-code font-bold text-white">
                      {item.score} / {item.totalQuestions}
                    </td>
                    <td className="py-4 px-6 text-center font-mono-code font-bold text-emerald-400">
                      {item.accuracyPercent}%
                    </td>
                    <td className="py-4 px-6 text-right font-mono-code text-neutral-400">
                      {item.timeTakenSec}s
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
