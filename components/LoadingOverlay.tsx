import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingOverlayProps {
  isVisible: boolean;
}

export const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ isVisible }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-slate-800/50 p-6 rounded-2xl flex flex-col items-center border border-slate-700 shadow-xl">
        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mb-4" />
        <h3 className="text-xl font-bold text-white mb-2">작품 생성 중...</h3>
        <p className="text-slate-300 text-center text-sm max-w-[200px]">
          AI가 당신의 분위기를 그리고 있습니다. 잠시만 기다려주세요.
        </p>
      </div>
    </div>
  );
};