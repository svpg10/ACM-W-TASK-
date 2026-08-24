import React from 'react';
import { Sparkles, Trophy, ArrowUpRight, Cpu, Award, Zap, Clock, BookOpen, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface HeroSectionProps {
  onStartQuiz: (mode: 'all' | 'acm' | 'ai' | 'speedrun', count: number) => void;
  onOpenLeaderboard: () => void;
  onOpenStudy: () => void;
  totalQuestionsCount: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onStartQuiz,
  onOpenLeaderboard,
  onOpenStudy,
  totalQuestionsCount
}) => {
  return (
    <div id="hero-section" className="relative overflow-hidden pt-4 pb-16">
      {/* Background radial glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#F8C51C]/10 blur-[130px] pointer-events-none rounded-full" />

      {/* Main Agency Banner Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Yellow Featured Stage (Visual Mirror to User Design) */}
        <div className="relative rounded-[2.5rem] bg-[#F8C51C] text-[#12110e] p-8 sm:p-12 lg:p-16 overflow-hidden shadow-2xl">
          
          {/* Top meta tags */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/10 text-black text-xs font-mono-code font-bold tracking-wider uppercase border border-black/15">
              <span>COMPUTATIONAL INTELLIGENCE ASSESSMENT</span>
            </div>
            
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code font-bold uppercase tracking-widest text-black/80">
                10-QUESTION CORE EVALUATION
              </span>
            </div>
          </div>

          {/* Grid Layout: Big Headline + 3D Orb visual representation */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Bold Agency Typography */}
            <div className="lg:col-span-8 space-y-6">
              <div className="space-y-1">
                <h1 className="text-6xl sm:text-7xl lg:text-8xl font-syne font-black uppercase tracking-tighter leading-[0.9] text-black">
                  WE TEST.<br />
                  WE BENCHMARK.<br />
                  <span className="text-black/90">
                    TURING<span className="text-black">.AI</span>
                  </span>
                </h1>
              </div>

              <p className="text-base sm:text-lg text-black/85 font-medium max-w-2xl leading-relaxed font-sans">
                We don't just present multiple choice questions, we evaluate computational mastery. 
                Test your knowledge spanning the <strong>ACM Turing Awards, computer science heritage</strong>, 
                and core <strong>Artificial Intelligence, Transformers & Machine Learning</strong> principles.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  id="hero-start-standard-btn"
                  onClick={() => {
                    soundFx.playClick();
                    onStartQuiz('all', 10);
                  }}
                  className="flex items-center gap-3 bg-black hover:bg-neutral-900 text-white font-syne font-bold text-sm uppercase px-8 py-4 rounded-full transition-all hover:scale-105 active:scale-95 shadow-xl group cursor-pointer"
                >
                  <span>Start 10-Question Quiz</span>
                  <div className="w-6 h-6 rounded-full bg-[#F8C51C] text-black flex items-center justify-center transition-transform group-hover:rotate-45">
                    <ArrowUpRight className="w-4 h-4" />
                  </div>
                </button>

                <button
                  id="hero-view-leaderboard-btn"
                  onClick={() => {
                    soundFx.playClick();
                    onOpenLeaderboard();
                  }}
                  className="flex items-center gap-2 bg-black/10 hover:bg-black/20 text-black border border-black/20 font-syne font-bold text-sm uppercase px-6 py-4 rounded-full transition-all cursor-pointer"
                >
                  <Trophy className="w-4 h-4" />
                  <span>High Scores</span>
                </button>

                <button
                  id="hero-view-bank-btn"
                  onClick={() => {
                    soundFx.playClick();
                    onOpenStudy();
                  }}
                  className="flex items-center gap-2 bg-transparent hover:bg-black/10 text-black font-mono-code font-bold text-xs uppercase tracking-wider px-4 py-2 rounded-full transition-colors cursor-pointer"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Study Vault</span>
                </button>
              </div>
            </div>

            {/* Right Column: Stylized Visual Art matching screenshot */}
            <div className="lg:col-span-4 relative flex justify-center items-center py-6">
              
              {/* 3D Metallic Orb Simulator */}
              <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full bg-gradient-to-tr from-neutral-900 via-[#1e1c15] to-neutral-800 p-2 shadow-2xl border-4 border-black/20 animate-float-slow flex items-center justify-center overflow-hidden">
                {/* Holographic light reflections */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-black/60 rounded-full mix-blend-overlay" />
                <div className="absolute -top-12 -left-12 w-36 h-36 bg-[#F8C51C]/40 rounded-full blur-xl" />
                <div className="absolute -bottom-10 -right-10 w-36 h-36 bg-cyan-400/30 rounded-full blur-xl" />
                
                {/* Center Badge in sphere */}
                <div className="z-10 text-center text-white px-6">
                  <div className="font-syne font-black text-3xl tracking-tight leading-none text-[#F8C51C]">
                    10 Qs
                  </div>
                  <div className="text-[11px] font-mono-code uppercase tracking-widest text-neutral-300 mt-2">
                    ACM & AI Curated
                  </div>
                  <div className="mt-3 inline-flex items-center gap-1 text-[10px] font-mono-code bg-black/60 px-3 py-1 rounded-full border border-white/10 text-neutral-200">
                    <CheckCircle2 className="w-3 h-3 text-[#F8C51C]" /> Real-time Analytics
                  </div>
                </div>
              </div>

              {/* Floating Mini Polaroid Sticker (like in design screenshot) */}
              <div className="absolute -top-3 right-0 sm:right-4 bg-white text-black p-2.5 rounded-lg shadow-xl rotate-6 border border-black/10 w-28 text-center animate-float-delayed">
                <div className="w-full h-16 bg-neutral-900 rounded flex items-center justify-center text-2xl">
                  🏛️
                </div>
                <div className="text-[10px] font-bold mt-1 tracking-tight font-syne uppercase">Turing Award</div>
                <div className="text-[8px] font-mono-code text-neutral-500">CS Heritage</div>
              </div>

              {/* Floating Mini Polaroid Sticker 2 */}
              <div className="absolute -bottom-4 left-0 sm:left-4 bg-white text-black p-2.5 rounded-lg shadow-xl -rotate-6 border border-black/10 w-28 text-center">
                <div className="w-full h-16 bg-neutral-900 rounded flex items-center justify-center text-2xl">
                  🧠
                </div>
                <div className="text-[10px] font-bold mt-1 tracking-tight font-syne uppercase">Transformer</div>
                <div className="text-[8px] font-mono-code text-neutral-500">Attention</div>
              </div>
            </div>

          </div>

          {/* Bottom Metric Stats Row (Matches 2-4x, $2B, 80% in screenshot) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-12 mt-10 border-t border-black/15">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 border border-black/10">
              <div>
                <div className="text-3xl sm:text-4xl font-syne font-extrabold text-black">
                  {totalQuestionsCount}+
                </div>
                <p className="text-xs font-semibold text-black/70 mt-0.5">
                  Curated Knowledge Questions
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center text-black font-bold">
                ↗
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 border border-black/10">
              <div>
                <div className="text-3xl sm:text-4xl font-syne font-extrabold text-black">
                  100%
                </div>
                <p className="text-xs font-semibold text-black/70 mt-0.5">
                  Automated Evaluation & Feedback
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center text-black font-bold">
                ↗
              </div>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-black/5 border border-black/10">
              <div>
                <div className="text-3xl sm:text-4xl font-syne font-extrabold text-black">
                  LIVE DB
                </div>
                <p className="text-xs font-semibold text-black/70 mt-0.5">
                  Leaderboard & Persistence
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-black/10 flex items-center justify-center text-black font-bold">
                ↗
              </div>
            </div>
          </div>

        </div>

        {/* Section 2: Choose Your Challenge Mode */}
        <div className="mt-12">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#F8C51C] uppercase tracking-widest">
                <span>○ Modes</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-syne font-bold text-white uppercase tracking-tight mt-1">
                Select Benchmark Mode
              </h2>
            </div>
            <span className="text-xs text-neutral-400 font-mono-code">
              Instant Feedback • Comprehensive Review
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Mode 1: Standard Balanced */}
            <div 
              id="mode-card-standard"
              onClick={() => {
                soundFx.playClick();
                onStartQuiz('all', 10);
              }}
              className="p-6 rounded-2xl bg-[#181612] hover:bg-[#201d17] border border-[#2d281e] hover:border-[#F8C51C] transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#F8C51C]/15 text-[#F8C51C] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Sparkles className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-syne font-bold text-lg text-white group-hover:text-[#F8C51C] transition-colors">
                  Standard Benchmark
                </h3>
                <span className="text-xs font-syne font-bold uppercase bg-[#282318] text-[#F8C51C] px-2 py-0.5 rounded tracking-wider">
                  10 Qs
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                Balanced mix of 5 ACM History questions & 5 AI Machine Learning fundamentals.
              </p>
              <div className="mt-4 pt-4 border-t border-[#2d281e] flex items-center justify-between text-xs text-neutral-300 group-hover:text-white font-syne uppercase tracking-wider font-bold">
                <span>Play Standard</span>
                <ArrowUpRight className="w-4 h-4 text-[#F8C51C]" />
              </div>
            </div>

            {/* Mode 2: ACM Special */}
            <div 
              id="mode-card-acm"
              onClick={() => {
                soundFx.playClick();
                onStartQuiz('acm', 10);
              }}
              className="p-6 rounded-2xl bg-[#181612] hover:bg-[#201d17] border border-[#2d281e] hover:border-[#F8C51C] transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-500/15 text-blue-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Award className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-syne font-bold text-lg text-white group-hover:text-[#F8C51C] transition-colors">
                  ACM Heritage Focus
                </h3>
                <span className="text-xs font-syne font-bold uppercase bg-[#282318] text-blue-400 px-2 py-0.5 rounded tracking-wider">
                  10 Qs
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                Turing Awards, SIGGRAPH, SIGAI, Digital Library, and ACM Code of Ethics.
              </p>
              <div className="mt-4 pt-4 border-t border-[#2d281e] flex items-center justify-between text-xs text-neutral-300 group-hover:text-white font-syne uppercase tracking-wider font-bold">
                <span>Play ACM Focus</span>
                <ArrowUpRight className="w-4 h-4 text-[#F8C51C]" />
              </div>
            </div>

            {/* Mode 3: AI & Neural Special */}
            <div 
              id="mode-card-ai"
              onClick={() => {
                soundFx.playClick();
                onStartQuiz('ai', 10);
              }}
              className="p-6 rounded-2xl bg-[#181612] hover:bg-[#201d17] border border-[#2d281e] hover:border-[#F8C51C] transition-all cursor-pointer group hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-syne font-bold text-lg text-white group-hover:text-[#F8C51C] transition-colors">
                  AI & ML Essentials
                </h3>
                <span className="text-xs font-syne font-bold uppercase bg-[#282318] text-emerald-400 px-2 py-0.5 rounded tracking-wider">
                  10 Qs
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                Supervised vs Unsupervised, Backprop, Transformers, Overfitting, RL & Vision.
              </p>
              <div className="mt-4 pt-4 border-t border-[#2d281e] flex items-center justify-between text-xs text-neutral-300 group-hover:text-white font-syne uppercase tracking-wider font-bold">
                <span>Play AI Focus</span>
                <ArrowUpRight className="w-4 h-4 text-[#F8C51C]" />
              </div>
            </div>

            {/* Mode 4: Speedrun Blitz */}
            <div 
              id="mode-card-speedrun"
              onClick={() => {
                soundFx.playClick();
                onStartQuiz('speedrun', 10);
              }}
              className="p-6 rounded-2xl bg-[#181612] hover:bg-[#201d17] border border-[#2d281e] hover:border-[#F8C51C] transition-all cursor-pointer group hover:-translate-y-1 relative overflow-hidden"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-500/15 text-orange-400 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="w-6 h-6" />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-syne font-bold text-lg text-white group-hover:text-[#F8C51C] transition-colors">
                  Speedrun Blitz
                </h3>
                <span className="text-xs font-syne font-bold uppercase bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded tracking-wider">
                  60s Timer
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-2 leading-relaxed font-sans">
                High-intensity countdown challenge! Answer as fast as possible for bonus leaderboard glory.
              </p>
              <div className="mt-4 pt-4 border-t border-[#2d281e] flex items-center justify-between text-xs text-neutral-300 group-hover:text-white font-syne uppercase tracking-wider font-bold">
                <span>Play Blitz</span>
                <ArrowUpRight className="w-4 h-4 text-[#F8C51C]" />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
