import React, { useState, useEffect, useCallback } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  ArrowLeft, 
  Clock, 
  Sparkles, 
  HelpCircle, 
  Award, 
  Cpu, 
  Info, 
  Flame,
  AlertCircle
} from 'lucide-react';
import { QuizQuestion, UserAnswer } from '../types';
import { soundFx } from '../utils/audio';

interface QuizCardProps {
  questions: QuizQuestion[];
  mode: 'all' | 'acm' | 'ai' | 'speedrun';
  playerName?: string;
  onCompleteQuiz: (answers: UserAnswer[], timeSpentSec: number) => void;
  onExitQuiz: () => void;
}

export const QuizCard: React.FC<QuizCardProps> = ({
  questions,
  mode,
  playerName = '',
  onCompleteQuiz,
  onExitQuiz
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [questionStartTimes, setQuestionStartTimes] = useState<number[]>([]);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [speedrunSecondsLeft, setSpeedrunSecondsLeft] = useState(60);
  const [showExplanation, setShowExplanation] = useState(false);
  const [instantFeedbackMode, setInstantFeedbackMode] = useState(true);

  const currentQ = questions[currentIndex];
  const total = questions.length;
  const isSpeedrun = mode === 'speedrun';

  // Track overall timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTotalSeconds(prev => prev + 1);
      if (isSpeedrun) {
        setSpeedrunSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isSpeedrun]);

  // Handle option selection
  const handleSelectOption = (optionIndex: number) => {
    soundFx.playClick();
    setSelectedAnswers(prev => ({
      ...prev,
      [currentIndex]: optionIndex
    }));

    if (instantFeedbackMode) {
      if (optionIndex === currentQ.correctIndex) {
        soundFx.playCorrect();
      } else {
        soundFx.playWrong();
      }
      setShowExplanation(true);
    }
  };

  const handleNext = useCallback(() => {
    soundFx.playClick();
    setShowExplanation(false);
    if (currentIndex < total - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmitQuiz();
    }
  }, [currentIndex, total]);

  const handlePrev = () => {
    soundFx.playClick();
    setShowExplanation(false);
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const answers: UserAnswer[] = questions.map((q, idx) => {
      const selected = selectedAnswers[idx] !== undefined ? selectedAnswers[idx] : -1;
      return {
        questionId: q.id,
        selectedIndex: selected,
        isCorrect: selected === q.correctIndex,
        timeSpentSec: Math.round(totalSeconds / total)
      };
    });

    onCompleteQuiz(answers, totalSeconds);
  };

  // Keyboard shortcut listener (1/2/3/4 or A/B/C/D or Enter for Next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toUpperCase();
      if (['A', '1'].includes(key) && currentQ.options[0]) handleSelectOption(0);
      else if (['B', '2'].includes(key) && currentQ.options[1]) handleSelectOption(1);
      else if (['C', '3'].includes(key) && currentQ.options[2]) handleSelectOption(2);
      else if (['D', '4'].includes(key) && currentQ.options[3]) handleSelectOption(3);
      else if (e.key === 'Enter' && selectedAnswers[currentIndex] !== undefined) {
        handleNext();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, currentQ, selectedAnswers, handleNext]);

  const currentSelected = selectedAnswers[currentIndex];
  const hasAnsweredCurrent = currentSelected !== undefined;
  const isCurrentCorrect = hasAnsweredCurrent && currentSelected === currentQ.correctIndex;

  // Stats calculation
  const answeredCount = Object.keys(selectedAnswers).length;
  const currentCorrectCount = Object.entries(selectedAnswers).filter(
    ([qIdx, ansIdx]) => questions[Number(qIdx)]?.correctIndex === ansIdx
  ).length;

  const progressPercent = Math.round(((currentIndex + 1) / total) * 100);

  return (
    <div id="quiz-flow-container" className="max-w-4xl mx-auto px-4 py-8">
      
      {/* Quiz Top Utility Bar */}
      <div className="bg-[#181612] border border-[#2d281e] rounded-3xl p-4 sm:p-6 mb-6 shadow-xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          
          {/* Left: Question counter and mode */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-[#F8C51C] text-black flex items-center justify-center font-syne font-bold text-lg">
              {currentIndex + 1 < 10 ? `0${currentIndex + 1}` : currentIndex + 1}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code text-neutral-400">
                  Question {currentIndex + 1} of {total}
                </span>
                <span className="text-neutral-600">•</span>
                <span className="text-xs font-semibold uppercase text-[#F8C51C] bg-[#292419] px-2.5 py-0.5 rounded-full border border-[#443b27]">
                  {currentQ.badgeTag}
                </span>
                {playerName && (
                  <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-syne font-bold uppercase text-neutral-300 bg-[#221e17] px-2.5 py-0.5 rounded-full border border-[#383020]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F8C51C]" />
                    {playerName}
                  </span>
                )}
              </div>
              <div className="text-xs text-neutral-400 mt-0.5">
                {currentQ.category === 'acm' ? '🏛️ ACM Knowledge' : '🧠 AI Core Concept'}
              </div>
            </div>
          </div>

          {/* Right: Live Timer & Instant Feedback toggle */}
          <div className="flex items-center gap-3">
            {isSpeedrun ? (
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono-code text-xs font-bold border ${
                speedrunSecondsLeft <= 10 
                  ? 'bg-red-500/20 text-red-400 border-red-500/40 animate-pulse' 
                  : 'bg-orange-500/15 text-orange-400 border-orange-500/30'
              }`}>
                <Flame className="w-3.5 h-3.5" />
                <span>{speedrunSecondsLeft}s left</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#231f18] text-neutral-300 border border-[#3b3427] font-mono-code text-xs">
                <Clock className="w-3.5 h-3.5 text-[#F8C51C]" />
                <span>
                  {Math.floor(totalSeconds / 60)}:{(totalSeconds % 60).toString().padStart(2, '0')}
                </span>
              </div>
            )}

            {/* Instant feedback toggle */}
            <button
              id="instant-feedback-toggle"
              onClick={() => setInstantFeedbackMode(prev => !prev)}
              className={`hidden sm:flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                instantFeedbackMode 
                  ? 'bg-[#292419] text-[#F8C51C] border-[#443b27]' 
                  : 'bg-[#181612] text-neutral-400 border-[#2d281e]'
              }`}
              title="Toggle instant explanation after selecting an option"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Instant Explanations: {instantFeedbackMode ? 'ON' : 'OFF'}</span>
            </button>

            {/* Exit button */}
            <button
              id="quiz-exit-btn"
              onClick={onExitQuiz}
              className="text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded-lg hover:bg-neutral-800 transition-colors"
            >
              Exit
            </button>
          </div>

        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-5">
          <div className="h-2 w-full bg-[#242018] rounded-full overflow-hidden flex">
            <div 
              className="h-full bg-gradient-to-r from-[#F8C51C] to-yellow-300 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] font-mono-code text-neutral-500 mt-2">
            <span>{answeredCount} of {total} Answered</span>
            <span>Accuracy: {answeredCount > 0 ? Math.round((currentCorrectCount / answeredCount) * 100) : 100}%</span>
          </div>
        </div>

      </div>

      {/* Main Question Card (High Contrast Dark / Warm styling) */}
      <div className="bg-[#181612] border border-[#2d281e] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
        
        {/* Category Watermark Accent */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#F8C51C]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-mono-code uppercase tracking-wider text-[#F8C51C] bg-[#272218] px-2.5 py-1 rounded-md border border-[#3d3425]">
              {currentQ.difficulty.toUpperCase()} DIFFICULTY
            </span>
            <span className="text-[11px] text-neutral-500 font-mono-code">
              Keyboard: Press [A, B, C, D] or [1, 2, 3, 4]
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-white leading-snug tracking-tight">
            {currentQ.question}
          </h2>

          {currentQ.codeSnippet && (
            <pre className="mt-4 p-4 rounded-xl bg-[#11100d] border border-[#2d281e] font-mono-code text-xs text-[#F8C51C] overflow-x-auto">
              <code>{currentQ.codeSnippet}</code>
            </pre>
          )}
        </div>

        {/* Options List */}
        <div className="space-y-3 mt-8">
          {currentQ.options.map((option, optIdx) => {
            const isSelected = currentSelected === optIdx;
            const isCorrectOption = optIdx === currentQ.correctIndex;
            const letters = ['A', 'B', 'C', 'D'];

            // Styling determination
            let cardStyle = 'bg-[#1e1a14] hover:bg-[#262219] border-[#2f291e] text-neutral-200';
            let badgeStyle = 'bg-[#292419] text-neutral-300 border-[#3d3527]';

            if (isSelected) {
              if (instantFeedbackMode) {
                if (isCorrectOption) {
                  cardStyle = 'bg-emerald-950/40 border-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.15)]';
                  badgeStyle = 'bg-emerald-500 text-black border-emerald-400 font-bold';
                } else {
                  cardStyle = 'bg-rose-950/40 border-rose-500 text-white shadow-[0_0_20px_rgba(244,63,94,0.15)]';
                  badgeStyle = 'bg-rose-500 text-white border-rose-400 font-bold';
                }
              } else {
                cardStyle = 'bg-[#2a2419] border-[#F8C51C] text-white shadow-[0_0_20px_rgba(248,197,28,0.15)]';
                badgeStyle = 'bg-[#F8C51C] text-black border-[#F8C51C] font-bold';
              }
            } else if (hasAnsweredCurrent && instantFeedbackMode && isCorrectOption) {
              // Highlight correct answer if user got it wrong
              cardStyle = 'bg-emerald-950/20 border-emerald-500/50 text-neutral-300';
              badgeStyle = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
            }

            return (
              <div
                key={optIdx}
                id={`quiz-option-${optIdx}`}
                onClick={() => handleSelectOption(optIdx)}
                className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-4 select-none ${cardStyle}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono-code text-xs font-bold border transition-colors ${badgeStyle}`}>
                    {letters[optIdx]}
                  </div>
                  <span className="text-sm sm:text-base font-medium leading-relaxed">
                    {option}
                  </span>
                </div>

                {/* State Icons */}
                <div className="flex-shrink-0">
                  {instantFeedbackMode && hasAnsweredCurrent ? (
                    isSelected ? (
                      isCorrectOption ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-rose-400" />
                      )
                    ) : isCorrectOption ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400/60" />
                    ) : null
                  ) : (
                    isSelected && (
                      <div className="w-3 h-3 rounded-full bg-[#F8C51C] shadow-[0_0_8px_#F8C51C]" />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Collapsible / Auto-revealed Explanation Panel */}
        {(showExplanation || hasAnsweredCurrent) && (
          <div className="mt-8 p-5 sm:p-6 rounded-2xl bg-[#14120e] border border-[#2d281e] space-y-3 transition-all animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {isCurrentCorrect ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Correct Answer!
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-400 bg-rose-950/60 px-3 py-1 rounded-full border border-rose-500/30">
                    <AlertCircle className="w-3.5 h-3.5" /> Correct: Option {['A', 'B', 'C', 'D'][currentQ.correctIndex]}
                  </span>
                )}
              </div>
              <span className="text-[11px] font-mono-code text-neutral-500">
                Verified ACM & AI Syllabus
              </span>
            </div>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
              {currentQ.explanation}
            </p>

            {currentQ.funFact && (
              <div className="flex items-start gap-2.5 pt-2 border-t border-[#242018] text-xs text-[#F8C51C]/90">
                <Sparkles className="w-4 h-4 text-[#F8C51C] flex-shrink-0 mt-0.5" />
                <span><strong>Fun Fact:</strong> {currentQ.funFact}</span>
              </div>
            )}
          </div>
        )}

        {/* Action Controls Bottom Bar */}
        <div className="mt-10 pt-6 border-t border-[#2d281e] flex flex-wrap items-center justify-between gap-4">
          
          <button
            id="quiz-prev-btn"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-2 px-5 py-3 rounded-full text-xs font-syne font-bold uppercase transition-all ${
              currentIndex === 0
                ? 'opacity-30 cursor-not-allowed text-neutral-500'
                : 'bg-[#221e17] hover:bg-[#2e2920] text-neutral-200 cursor-pointer'
            }`}
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Right Action: Next or Submit */}
          <div className="flex items-center gap-3">
            {currentIndex < total - 1 ? (
              <button
                id="quiz-next-btn"
                onClick={handleNext}
                className="flex items-center gap-2 bg-[#F8C51C] hover:bg-yellow-400 text-black font-syne font-bold text-xs uppercase px-7 py-3.5 rounded-full transition-all shadow-[0_4px_16px_rgba(248,197,28,0.2)] active:scale-95 cursor-pointer"
              >
                <span>Next Question</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                id="quiz-submit-btn"
                onClick={handleSubmitQuiz}
                className="flex items-center gap-2 bg-gradient-to-r from-[#F8C51C] to-yellow-400 hover:from-yellow-400 hover:to-[#F8C51C] text-black font-syne font-extrabold text-xs uppercase px-8 py-3.5 rounded-full transition-all shadow-[0_4px_20px_rgba(248,197,28,0.3)] active:scale-95 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Submit & View Score</span>
              </button>
            )}
          </div>

        </div>

      </div>

      {/* Mini Question Navigator Pills at bottom */}
      <div className="mt-6 flex flex-wrap justify-center items-center gap-2 bg-[#181612] p-3 rounded-2xl border border-[#2d281e]">
        {questions.map((_, idx) => {
          const isAnswered = selectedAnswers[idx] !== undefined;
          const isCurrent = idx === currentIndex;
          return (
            <button
              key={idx}
              onClick={() => {
                soundFx.playClick();
                setCurrentIndex(idx);
              }}
              className={`w-8 h-8 rounded-xl font-mono-code text-xs font-bold transition-all ${
                isCurrent 
                  ? 'bg-[#F8C51C] text-black scale-110 shadow-md ring-2 ring-[#F8C51C]/50'
                  : isAnswered
                  ? 'bg-[#292419] text-[#F8C51C] border border-[#443b27]'
                  : 'bg-[#1c1913] text-neutral-500 hover:text-neutral-300'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

    </div>
  );
};
