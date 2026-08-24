import React, { useState } from 'react';
import { BookOpen, Search, Sparkles, Filter, Award, Cpu, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { QuizQuestion } from '../types';
import { soundFx } from '../utils/audio';

interface QuestionBankProps {
  questions: QuizQuestion[];
  onStartQuiz: (mode: 'all' | 'acm' | 'ai' | 'speedrun', count: number) => void;
}

export const QuestionBank: React.FC<QuestionBankProps> = ({ questions, onStartQuiz }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'acm' | 'ai'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = questions.filter(q => {
    const matchesFilter = selectedFilter === 'all' || q.category === selectedFilter;
    const matchesSearch = q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.badgeTag.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.options.some(opt => opt.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  const toggleExpand = (id: string) => {
    soundFx.playClick();
    setExpandedId(prev => prev === id ? null : id);
  };

  return (
    <div id="study-bank-view" className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono-code text-[#F8C51C] uppercase tracking-widest">
            <span>○ Knowledge Syllabus</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-syne font-extrabold text-white uppercase tracking-tight mt-1">
            Question Bank & Study Vault
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Explore all {questions.length} curated ACM history questions and Artificial Intelligence fundamentals.
          </p>
        </div>

        <button
          onClick={() => {
            soundFx.playClick();
            onStartQuiz('all', 10);
          }}
          className="bg-[#F8C51C] hover:bg-yellow-400 text-black font-syne font-bold text-xs uppercase px-6 py-3 rounded-full transition-all shadow-md cursor-pointer"
        >
          Test Knowledge in Quiz
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#181612] p-4 rounded-2xl border border-[#2d281e]">
        <div className="flex items-center gap-2">
          {(['all', 'acm', 'ai'] as const).map(filterKey => (
            <button
              key={filterKey}
              onClick={() => {
                soundFx.playClick();
                setSelectedFilter(filterKey);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedFilter === filterKey
                  ? 'bg-[#F8C51C] text-black'
                  : 'bg-[#221e17] text-neutral-400 hover:text-white'
              }`}
            >
              {filterKey === 'all' ? `All Questions (${questions.length})` : filterKey === 'acm' ? 'ACM Heritage' : 'AI & Deep Learning'}
            </button>
          ))}
        </div>

        <div className="relative min-w-[260px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search questions or terms..."
            className="w-full bg-[#12110e] border border-[#2d281e] text-white pl-10 pr-4 py-2 rounded-full text-xs focus:outline-none focus:border-[#F8C51C]"
          />
        </div>
      </div>

      {/* Question Cards Grid */}
      <div className="space-y-4">
        {filtered.map((q, idx) => {
          const isExpanded = expandedId === q.id;
          return (
            <div 
              key={q.id}
              className="p-5 sm:p-6 rounded-3xl bg-[#181612] border border-[#2d281e] hover:border-[#3d3425] transition-all"
            >
              <div 
                onClick={() => toggleExpand(q.id)}
                className="flex items-start justify-between gap-4 cursor-pointer"
              >
                <div className="space-y-2 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono-code font-bold text-neutral-400">
                      #{idx + 1}
                    </span>
                    <span className="text-[11px] font-mono-code bg-[#282318] text-[#F8C51C] px-2.5 py-0.5 rounded-full border border-[#443b27]">
                      {q.badgeTag}
                    </span>
                    <span className="text-xs text-neutral-500">
                      {q.category === 'acm' ? '🏛️ ACM Knowledge' : '🧠 AI Fundamental'}
                    </span>
                    <span className="text-[10px] uppercase font-mono-code text-neutral-400 px-2 py-0.5 rounded bg-black/40">
                      {q.difficulty}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                    {q.question}
                  </h3>
                </div>

                <div className="p-2 rounded-full bg-[#242018] text-neutral-400 flex-shrink-0">
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </div>

              {/* Options & Verified Answer */}
              {isExpanded && (
                <div className="mt-6 pt-5 border-t border-[#282319] space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => {
                      const isCorrect = optIdx === q.correctIndex;
                      return (
                        <div 
                          key={optIdx}
                          className={`p-3 rounded-xl text-xs flex items-center justify-between gap-2 border ${
                            isCorrect 
                              ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-200 font-semibold' 
                              : 'bg-black/20 border-neutral-800 text-neutral-400'
                          }`}
                        >
                          <span>{['A', 'B', 'C', 'D'][optIdx]}. {opt}</span>
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Theoretical Explanation */}
                  <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-2 text-xs text-neutral-300">
                    <div className="font-semibold text-[#F8C51C] flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" /> Conceptual Explanation
                    </div>
                    <p className="leading-relaxed">{q.explanation}</p>
                    {q.funFact && (
                      <p className="text-neutral-400 text-[11px] pt-1">
                        <strong>Historical Note:</strong> {q.funFact}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

    </div>
  );
};
