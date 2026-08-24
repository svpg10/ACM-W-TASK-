import React, { useState, useEffect } from 'react';
import { User, Sparkles, Trophy, ArrowRight, X, Shield, Zap } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface PlayerNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (playerName: string) => void;
  targetMode?: 'all' | 'acm' | 'ai' | 'speedrun';
  initialName?: string;
}

const AVATAR_OPTIONS = [
  'Ada', 'Alan', 'Claude', 'Grace', 'Linus', 'VonNeumann', 'Hypatia', 'Turing'
];

export const PlayerNameModal: React.FC<PlayerNameModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  targetMode = 'all',
  initialName = ''
}) => {
  const [name, setName] = useState(initialName || '');
  const [selectedAvatar, setSelectedAvatar] = useState('Ada');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      const saved = localStorage.getItem('turing_player_name');
      if (saved && !name) {
        setName(saved);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const modeLabels: Record<string, { title: string; badge: string; color: string }> = {
    all: { title: 'Standard Benchmark', badge: '10 Questions · Mixed', color: '#F8C51C' },
    acm: { title: 'ACM Heritage Focus', badge: '10 Questions · History & Ethics', color: '#60A5FA' },
    ai: { title: 'AI & ML Essentials', badge: '10 Questions · Neural & Deep Learning', color: '#34D399' },
    speedrun: { title: 'Speedrun Blitz', badge: '60s Countdown Timer', color: '#FB923C' }
  };

  const currentModeInfo = modeLabels[targetMode] || modeLabels.all;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    if (!cleanName) {
      setError('Please enter a name or callsign to record your score.');
      return;
    }
    if (cleanName.length > 25) {
      setError('Name must be 25 characters or fewer.');
      return;
    }

    localStorage.setItem('turing_player_name', cleanName);
    soundFx.playClick();
    onConfirm(cleanName);
  };

  const handleQuickName = (suggested: string) => {
    setName(suggested);
    setSelectedAvatar(suggested);
    setError('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="relative w-full max-w-lg rounded-[2rem] bg-[#1a1712] border border-[#383121] p-6 sm:p-8 shadow-2xl text-neutral-100 overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Subtle Decorative Background Glow */}
        <div className="absolute -top-24 -right-24 w-60 h-60 rounded-full bg-[#F8C51C]/10 blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between gap-4 pb-4 border-b border-[#2d271c]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F8C51C] text-black flex items-center justify-center font-syne font-black text-lg">
              T
            </div>
            <div>
              <h3 className="font-syne font-bold text-lg sm:text-xl text-white tracking-tight">
                Player Registration
              </h3>
              <p className="text-xs text-neutral-400 font-sans">
                Set your name to record scores on the database leaderboard
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#282318] text-neutral-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Mode Summary */}
        <div className="my-5 p-3.5 rounded-xl bg-[#14120e] border border-[#2b2519] flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#F8C51C]" />
            <span className="text-xs font-syne font-bold uppercase tracking-wider text-white">
              {currentModeInfo.title}
            </span>
          </div>
          <span className="text-[11px] font-mono-code px-2 py-0.5 rounded bg-[#241f16] text-[#F8C51C] border border-[#3a311f]">
            {currentModeInfo.badge}
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-syne font-bold uppercase tracking-wider text-neutral-300 mb-2">
              Your Name / Callsign
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={name}
                onChange={e => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="e.g. Ada Lovelace, CyberPioneer..."
                maxLength={25}
                autoFocus
                className="w-full bg-[#110f0b] border border-[#3e3522] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#F8C51C] focus:ring-1 focus:ring-[#F8C51C] transition-all"
              />
            </div>
            {error && (
              <p className="text-xs text-rose-400 mt-1.5 font-sans">
                {error}
              </p>
            )}
          </div>

          {/* Quick Suggestions / Famous Pioneers */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-syne font-bold uppercase tracking-wider text-neutral-400">
                Quick Callsign Suggestions
              </span>
              <span className="text-[10px] font-mono-code text-neutral-500">Tap to autofill</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {AVATAR_OPTIONS.map(pioneer => (
                <button
                  key={pioneer}
                  type="button"
                  onClick={() => handleQuickName(pioneer)}
                  className={`text-[11px] font-mono-code px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    name === pioneer
                      ? 'bg-[#F8C51C] text-black border-[#F8C51C] font-bold'
                      : 'bg-[#211d16] text-neutral-300 border-[#322b1e] hover:border-[#F8C51C]/60 hover:text-white'
                  }`}
                >
                  {pioneer}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 rounded-xl border border-[#322b1e] bg-[#1a1712] text-xs font-syne font-bold uppercase tracking-wider text-neutral-300 hover:text-white hover:bg-[#231e17] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-4 rounded-xl bg-[#F8C51C] text-black text-xs font-syne font-extrabold uppercase tracking-wider hover:bg-[#ffcf33] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch Quiz</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
