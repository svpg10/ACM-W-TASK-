import React from 'react';
import { Volume2, VolumeX, Trophy, BookOpen, Flame, Play, Terminal, Activity } from 'lucide-react';
import { QuizView } from '../types';

interface HeaderProps {
  currentView: QuizView;
  onNavigate: (view: QuizView) => void;
  isMuted: boolean;
  onToggleMute: () => void;
  inQuiz: boolean;
  onStartQuiz: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  isMuted,
  onToggleMute,
  inQuiz,
  onStartQuiz
}) => {
  return (
    <header id="app-header" className="sticky top-0 z-50 bg-[#100f0c]/95 backdrop-blur-xl border-b border-[#292318] shadow-[0_4px_30px_rgba(0,0,0,0.6)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Typographic Title & System Info (No Logo) */}
        <div 
          id="brand-title-container"
          onClick={() => onNavigate('home')} 
          className="flex items-center gap-3.5 cursor-pointer group"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-syne font-black text-xl tracking-tight text-white uppercase group-hover:text-[#F8C51C] transition-colors">
                Turing<span className="text-[#F8C51C]">AI</span>
              </span>
            </div>
          </div>
        </div>

        {/* Center: Command-Bar Navigation */}
        <nav id="main-navigation" className="flex items-center gap-1.5 bg-[#171510] px-2 py-1.5 rounded-2xl border border-[#30291e] shadow-inner">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-syne font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'home' 
                ? 'bg-[#F8C51C] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white hover:bg-[#231f17]'
            }`}
          >
            Overview
          </button>
          <button
            id="nav-study-btn"
            onClick={() => onNavigate('study')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-syne font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'study' 
                ? 'bg-[#F8C51C] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white hover:bg-[#231f17]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Vault
          </button>
          <button
            id="nav-leaderboard-btn"
            onClick={() => onNavigate('leaderboard')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-syne font-bold uppercase tracking-wider transition-all cursor-pointer ${
              currentView === 'leaderboard' 
                ? 'bg-[#F8C51C] text-black shadow-md' 
                : 'text-neutral-400 hover:text-white hover:bg-[#231f17]'
            }`}
          >
            <Trophy className="w-3.5 h-3.5" />
            Rankings
          </button>
        </nav>

        {/* Right: Sound Control & Quiz Action */}
        <div id="header-actions-group" className="flex items-center gap-2.5">
          {/* Audio toggle button */}
          <button
            id="audio-mute-toggle"
            onClick={onToggleMute}
            className="p-2.5 rounded-xl bg-[#171510] hover:bg-[#252016] text-neutral-300 hover:text-[#F8C51C] border border-[#30291e] transition-colors cursor-pointer"
            title={isMuted ? "Unmute Audio" : "Mute Sound Effects"}
            aria-label="Sound Toggle"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-neutral-500" /> : <Volume2 className="w-4 h-4 text-[#F8C51C]" />}
          </button>

          {/* Quiz Action CTA */}
          {!inQuiz ? (
            <button
              id="header-start-quiz-cta"
              onClick={onStartQuiz}
              className="flex items-center gap-2 bg-[#F8C51C] hover:bg-[#fed649] text-black font-syne font-black text-xs uppercase px-5 py-2.5 rounded-xl transition-all active:scale-95 shadow-[0_0_20px_rgba(248,197,28,0.35)] cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>Launch Quiz</span>
            </button>
          ) : (
            <button
              id="header-in-quiz-pill"
              onClick={() => onNavigate('quiz')}
              className="flex items-center gap-2 bg-[#261f14] text-[#F8C51C] border border-[#52411e] text-xs font-mono-code font-bold px-4 py-2 rounded-xl animate-pulse cursor-pointer"
            >
              <Flame className="w-3.5 h-3.5" />
              <span>IN SESSION</span>
            </button>
          )}
        </div>

      </div>
    </header>
  );
};
