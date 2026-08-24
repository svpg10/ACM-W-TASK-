/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { QuizView, QuizQuestion, UserAnswer } from './types';
import { INITIAL_QUESTIONS } from './data/questions';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { QuizCard } from './components/QuizCard';
import { ScoreBoard } from './components/ScoreBoard';
import { Leaderboard } from './components/Leaderboard';
import { QuestionBank } from './components/QuestionBankModal';
import { CertificateModal } from './components/CertificateModal';
import { PlayerNameModal } from './components/PlayerNameModal';
import { soundFx } from './utils/audio';

export default function App() {
  const [currentView, setCurrentView] = useState<QuizView>('home');
  const [allQuestions, setAllQuestions] = useState<QuizQuestion[]>(INITIAL_QUESTIONS);
  const [activeQuizQuestions, setActiveQuizQuestions] = useState<QuizQuestion[]>([]);
  const [activeMode, setActiveMode] = useState<'all' | 'acm' | 'ai' | 'speedrun'>('all');
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizTotalTime, setQuizTotalTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  // Player Name Registration Modal
  const [currentPlayerName, setCurrentPlayerName] = useState<string>(() => {
    return localStorage.getItem('turing_player_name') || '';
  });
  const [isNameModalOpen, setIsNameModalOpen] = useState(false);
  const [pendingQuizConfig, setPendingQuizConfig] = useState<{
    mode: 'all' | 'acm' | 'ai' | 'speedrun';
    count: number;
  }>({ mode: 'all', count: 10 });

  // Certificate Modal State
  const [certificateData, setCertificateData] = useState<{
    isOpen: boolean;
    playerName: string;
    score: number;
    total: number;
    rankTitle: string;
  }>({
    isOpen: false,
    playerName: '',
    score: 0,
    total: 10,
    rankTitle: ''
  });

  // Fetch updated questions from backend API if available
  useEffect(() => {
    async function loadQuestions() {
      try {
        const res = await fetch('/api/questions');
        if (res.ok) {
          const data = await res.json();
          if (data.questions && data.questions.length > 0) {
            setAllQuestions(data.questions);
          }
        }
      } catch {
        // Use pre-bundled dataset fallback
      }
    }
    loadQuestions();
  }, []);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundFx.isMuted = nextMuted;
    if (!nextMuted) {
      soundFx.playClick();
    }
  };

  // Prompt the user for their name before beginning the quiz
  const handleRequestStartQuiz = (mode: 'all' | 'acm' | 'ai' | 'speedrun' = 'all', count: number = 10) => {
    soundFx.playClick();
    setPendingQuizConfig({ mode, count });
    setIsNameModalOpen(true);
  };

  // Called when player confirms their name in the modal
  const handleConfirmStartQuiz = (name: string) => {
    setCurrentPlayerName(name);
    setIsNameModalOpen(false);

    const { mode, count } = pendingQuizConfig;
    setActiveMode(mode);

    let eligible = [...allQuestions];
    if (mode === 'acm') {
      eligible = eligible.filter(q => q.category === 'acm');
    } else if (mode === 'ai') {
      eligible = eligible.filter(q => q.category === 'ai');
    } else {
      // Balanced mix: take roughly equal parts if possible
      const acmPool = eligible.filter(q => q.category === 'acm').sort(() => 0.5 - Math.random());
      const aiPool = eligible.filter(q => q.category === 'ai').sort(() => 0.5 - Math.random());
      const half = Math.floor(count / 2);
      eligible = [...acmPool.slice(0, half), ...aiPool.slice(0, count - half)];
    }

    // Shuffle
    const shuffled = eligible.sort(() => 0.5 - Math.random()).slice(0, count);
    setActiveQuizQuestions(shuffled);
    setUserAnswers([]);
    setQuizTotalTime(0);
    setCurrentView('quiz');
  };

  const handleCompleteQuiz = async (answers: UserAnswer[], timeSpentSec: number) => {
    setUserAnswers(answers);
    setQuizTotalTime(timeSpentSec);

    // Call server submit endpoint to validate and verify with player name
    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          playerName: currentPlayerName,
          answers: answers.map(a => ({ questionId: a.questionId, selectedIndex: a.selectedIndex })),
          timeSpentSec
        })
      });
    } catch {
      // Local fallback handled smoothly
    }

    setCurrentView('results');
  };

  const handleRetakeQuiz = () => {
    handleRequestStartQuiz(activeMode, 10);
  };

  const handleOpenCertificate = (playerName: string, score: number, total: number, rankTitle: string) => {
    setCertificateData({
      isOpen: true,
      playerName: playerName || currentPlayerName || 'Turing Pioneer',
      score,
      total,
      rankTitle
    });
  };

  return (
    <div className="min-h-screen bg-[#12110e] text-[#f4f2eb] flex flex-col font-sans selection:bg-[#F8C51C] selection:text-black">
      
      {/* Sticky Top Nav */}
      <Header
        currentView={currentView}
        onNavigate={view => {
          soundFx.playClick();
          setCurrentView(view);
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        inQuiz={currentView === 'quiz'}
        onStartQuiz={() => handleRequestStartQuiz('all', 10)}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {currentView === 'home' && (
          <HeroSection
            onStartQuiz={handleRequestStartQuiz}
            onOpenLeaderboard={() => {
              soundFx.playClick();
              setCurrentView('leaderboard');
            }}
            onOpenStudy={() => {
              soundFx.playClick();
              setCurrentView('study');
            }}
            totalQuestionsCount={allQuestions.length}
          />
        )}

        {currentView === 'quiz' && (
          <QuizCard
            questions={activeQuizQuestions.length > 0 ? activeQuizQuestions : allQuestions.slice(0, 10)}
            mode={activeMode}
            playerName={currentPlayerName}
            onCompleteQuiz={handleCompleteQuiz}
            onExitQuiz={() => {
              soundFx.playClick();
              setCurrentView('home');
            }}
          />
        )}

        {currentView === 'results' && (
          <ScoreBoard
            questions={activeQuizQuestions.length > 0 ? activeQuizQuestions : allQuestions.slice(0, 10)}
            userAnswers={userAnswers}
            totalTimeSec={quizTotalTime}
            mode={activeMode}
            playerName={currentPlayerName}
            onRetakeQuiz={handleRetakeQuiz}
            onOpenLeaderboard={() => {
              soundFx.playClick();
              setCurrentView('leaderboard');
            }}
            onOpenCertificate={handleOpenCertificate}
          />
        )}

        {currentView === 'leaderboard' && (
          <Leaderboard
            onStartQuiz={() => handleRequestStartQuiz('all', 10)}
          />
        )}

        {currentView === 'study' && (
          <QuestionBank
            questions={allQuestions}
            onStartQuiz={handleRequestStartQuiz}
          />
        )}
      </main>

      {/* Player Name Registration Pop-up Modal */}
      <PlayerNameModal
        isOpen={isNameModalOpen}
        targetMode={pendingQuizConfig.mode}
        initialName={currentPlayerName}
        onClose={() => setIsNameModalOpen(false)}
        onConfirm={handleConfirmStartQuiz}
      />

      {/* Certificate Modal */}
      {certificateData.isOpen && (
        <CertificateModal
          playerName={certificateData.playerName}
          score={certificateData.score}
          total={certificateData.total}
          rankTitle={certificateData.rankTitle}
          onClose={() => setCertificateData(prev => ({ ...prev, isOpen: false }))}
        />
      )}

      {/* Footer (Warm Minimalist Branding) */}
      <footer className="border-t border-[#231f18] bg-[#0c0b09] py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="flex items-center gap-3">
            <span className="font-syne font-black text-white text-sm uppercase tracking-wider">
              Turing<span className="text-[#F8C51C]">AI</span>
            </span>
          </div>
        </div>
      </footer>

    </div>
  );
}
