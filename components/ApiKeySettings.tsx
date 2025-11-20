import React, { useState, useEffect } from 'react';
import { X, Key, CheckCircle2, AlertCircle, Lock, Save } from 'lucide-react';
import { validateApiKey } from '../services/geminiService';

interface ApiKeySettingsProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
  currentKey: string;
}

export const ApiKeySettings: React.FC<ApiKeySettingsProps> = ({ isOpen, onClose, onSave, currentKey }) => {
  const [inputValue, setInputValue] = useState('');
  const [status, setStatus] = useState<'idle' | 'testing' | 'valid' | 'invalid'>('idle');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setInputValue(currentKey);
      setStatus('idle');
    }
  }, [isOpen, currentKey]);

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    if (!inputValue.trim()) return;
    
    setStatus('testing');
    const isValid = await validateApiKey(inputValue.trim());
    setStatus(isValid ? 'valid' : 'invalid');
  };

  const handleSave = () => {
    if (status === 'valid') {
      onSave(inputValue.trim());
      onClose();
    } else if (inputValue.trim() === '') {
      // Allow clearing the key
      onSave('');
      onClose();
    } else {
      // Try validation if user clicks save without testing
      handleTestConnection().then(() => {
        // If validation passed inside handleTestConnection, we can't immediately check state here due to closure.
        // So we rely on the user to click save again or we logic check:
        validateApiKey(inputValue.trim()).then(isValid => {
            if (isValid) {
                onSave(inputValue.trim());
                onClose();
            }
        });
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-slate-900 w-full max-w-sm rounded-3xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <div className="flex items-center gap-2 text-white">
            <Key className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold">API 키 설정</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-medium text-slate-400 uppercase tracking-wider">
              Google Gemini API Key
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                  setStatus('idle');
                }}
                placeholder="AI Studio API Key를 입력하세요"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 pr-10 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm font-mono"
              />
              <button 
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-500 hover:text-slate-300"
              >
                {showPassword ? <span className="text-xs">Hide</span> : <span className="text-xs">Show</span>}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              키는 브라우저 로컬 저장소에 암호화되어 안전하게 저장됩니다.
            </p>
          </div>

          {/* Status Indicator */}
          {status !== 'idle' && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              status === 'testing' ? 'bg-blue-900/30 text-blue-200' :
              status === 'valid' ? 'bg-green-900/30 text-green-200' :
              'bg-red-900/30 text-red-200'
            }`}>
              {status === 'testing' && <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />}
              {status === 'valid' && <CheckCircle2 className="w-4 h-4 text-green-400" />}
              {status === 'invalid' && <AlertCircle className="w-4 h-4 text-red-400" />}
              
              <span>
                {status === 'testing' && "연결 테스트 중..."}
                {status === 'valid' && "연결 성공! 사용 가능한 키입니다."}
                {status === 'invalid' && "연결 실패. 키를 확인해주세요."}
              </span>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleTestConnection}
              className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors text-sm"
            >
              연결 테스트
            </button>
            <button
              onClick={handleSave}
              disabled={!inputValue}
              className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white rounded-xl font-medium transition-colors text-sm flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              저장하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};