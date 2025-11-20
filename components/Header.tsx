import React from 'react';
import { Sparkles, Settings } from 'lucide-react';

interface HeaderProps {
  onOpenSettings: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  return (
    <header className="p-6 pb-2 flex items-center justify-between w-full">
      <div className="flex items-center gap-2">
        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
          무드 배경화면
        </h1>
      </div>
      <button 
        onClick={onOpenSettings}
        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors"
        aria-label="API Settings"
      >
        <Settings className="w-6 h-6" />
      </button>
    </header>
  );
};