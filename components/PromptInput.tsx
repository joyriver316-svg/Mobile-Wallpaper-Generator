import React, { useState } from 'react';
import { Send, Wand2 } from 'lucide-react';

interface PromptInputProps {
  onGenerate: (prompt: string) => void;
  isLoading: boolean;
}

const SUGGESTIONS = [
  "비오는 서정적인 도시 풍경",
  "파스텔 톤의 꿈같은 구름",
  "사이버펑크 네온 서울 야경",
  "수채화 스타일의 봄 꽃밭"
];

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && !isLoading) {
      onGenerate(text);
    }
  };

  const handleSuggestion = (suggestion: string) => {
    setText(suggestion);
  };

  return (
    <div className="w-full p-4 space-y-4">
      <form onSubmit={handleSubmit} className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="원하는 분위기를 설명해주세요..."
          className="w-full bg-slate-800/50 border border-slate-700 rounded-2xl p-4 pr-14 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none h-24 transition-all text-base shadow-inner"
          disabled={isLoading}
        />
        <button
          type="submit"
          disabled={!text.trim() || isLoading}
          className="absolute right-3 bottom-3 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/30"
        >
          {isLoading ? (
            <Wand2 className="w-5 h-5 animate-pulse" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </form>
      
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {SUGGESTIONS.map((s, i) => (
          <button
            key={i}
            onClick={() => handleSuggestion(s)}
            disabled={isLoading}
            className="whitespace-nowrap px-3 py-1.5 bg-slate-800/80 border border-slate-700 rounded-full text-xs text-slate-300 hover:bg-slate-700 hover:border-slate-600 transition-colors"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
};