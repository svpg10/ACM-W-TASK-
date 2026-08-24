import React, { useRef } from 'react';
import { X, Award, Printer, Download, Sparkles, CheckCircle2 } from 'lucide-react';
import { soundFx } from '../utils/audio';

interface CertificateModalProps {
  playerName: string;
  score: number;
  total: number;
  rankTitle: string;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  playerName,
  score,
  total,
  rankTitle,
  onClose
}) => {
  const percentage = Math.round((score / total) * 100);
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const handlePrint = () => {
    soundFx.playClick();
    window.print();
  };

  return (
    <div id="certificate-modal-overlay" className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#181612] border border-[#3d3425] rounded-[2.5rem] p-6 sm:p-10 max-w-3xl w-full shadow-2xl relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 p-2.5 rounded-full bg-[#242018] hover:bg-[#332b1f] text-neutral-300 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* The Printable Certificate Container */}
        <div 
          id="printable-certificate"
          className="rounded-3xl bg-[#0e0d0a] border-4 border-[#F8C51C] p-8 sm:p-12 text-center text-white relative overflow-hidden shadow-inner my-2"
        >
          {/* Header */}
          <div className="space-y-2 relative z-10">
            <div className="text-xs font-mono-code font-bold uppercase tracking-widest text-[#F8C51C]">
              OFFICIAL CERTIFICATE OF COMPUTATIONAL BENCHMARK
            </div>
            <h2 className="text-3xl sm:text-4xl font-syne font-black text-white tracking-tight uppercase">
              ACM × Artificial Intelligence
            </h2>
            <div className="text-xs text-neutral-400 font-mono-code">
              Standard Intelligence & Computer Science Assessment
            </div>
          </div>

          {/* Certificate Body */}
          <div className="my-8 space-y-4 relative z-10">
            <p className="text-xs text-neutral-400 font-medium uppercase tracking-wider">
              This credential is proud to certify that
            </p>
            <div className="text-3xl sm:text-4xl font-syne font-extrabold text-[#F8C51C] border-b border-[#3b3323] pb-3 inline-block min-w-[280px]">
              {playerName || 'Distinguished Scholar'}
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 max-w-lg mx-auto leading-relaxed pt-2">
              has completed the rigorous evaluation testing knowledge of ACM Turing Laureate heritage, 
              Special Interest Groups, machine learning theory, backpropagation, and transformer architectures.
            </p>
          </div>

          {/* Score & Rank Highlights */}
          <div className="grid grid-cols-3 gap-3 max-w-md mx-auto my-6 p-4 rounded-2xl bg-[#1a1712] border border-[#2d281e] relative z-10 text-xs font-mono-code">
            <div>
              <div className="text-[10px] text-neutral-500">FINAL SCORE</div>
              <div className="font-bold text-white text-base">{score} / {total}</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-500">ACCURACY</div>
              <div className="font-bold text-emerald-400 text-base">{percentage}%</div>
            </div>
            <div>
              <div className="text-[10px] text-neutral-500">HONOR TIER</div>
              <div className="font-bold text-[#F8C51C] text-sm truncate">{rankTitle}</div>
            </div>
          </div>

          {/* Certificate Footer with Signatures & Stamp */}
          <div className="mt-8 pt-6 border-t border-[#292419] flex items-center justify-between text-left text-xs text-neutral-400 relative z-10">
            <div>
              <div className="font-mono-code font-bold text-white text-[11px]">DATE OF ISSUANCE</div>
              <div className="text-[11px] text-neutral-400">{currentDate}</div>
            </div>

            <div className="text-center">
              <div className="w-10 h-10 mx-auto rounded-full border border-[#F8C51C] flex items-center justify-center text-[#F8C51C] font-bold text-sm">
                ✓
              </div>
              <div className="text-[9px] font-mono-code text-[#F8C51C] mt-1">VERIFIED ACCURACY</div>
            </div>

            <div className="text-right">
              <div className="font-mono-code font-bold text-white text-[11px]">BENCHMARK COMMITTEE</div>
              <div className="text-[11px] text-neutral-400">ACM & AI Society</div>
            </div>
          </div>

        </div>

        {/* Modal Action Controls */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-[#F8C51C] hover:bg-yellow-400 text-black font-syne font-bold text-xs uppercase px-6 py-3 rounded-full transition-all shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Print / Save as PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-full bg-[#242018] hover:bg-[#2f2a20] text-neutral-300 text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
