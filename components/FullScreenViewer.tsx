import React from 'react';
import { X, Download, RefreshCw } from 'lucide-react';
import { GeneratedImage } from '../types';

interface FullScreenViewerProps {
  image: GeneratedImage | null;
  onClose: () => void;
  onRemix: (image: GeneratedImage) => void;
}

export const FullScreenViewer: React.FC<FullScreenViewerProps> = ({ image, onClose, onRemix }) => {
  if (!image) return null;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `wallpaper-${image.id}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-40 bg-black flex flex-col animate-in fade-in duration-200">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 p-4 flex justify-between items-start z-50 bg-gradient-to-b from-black/60 to-transparent h-24">
        <button
          onClick={onClose}
          className="p-2 bg-black/20 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Image Container */}
      <div className="flex-1 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-slate-900">
            <img 
                src={image.url} 
                className="w-full h-full object-cover opacity-50 blur-3xl"
                alt="background blur"
            />
        </div>
        <img
          src={image.url}
          alt={image.prompt}
          className="relative z-10 max-h-full w-auto object-contain shadow-2xl"
          style={{ maxHeight: '100svh', maxWidth: '100vw' }}
        />
      </div>

      {/* Bottom Action Bar */}
      <div className="absolute bottom-0 left-0 right-0 p-6 pb-8 bg-gradient-to-t from-black/90 via-black/50 to-transparent z-50 flex flex-col gap-4 items-center">
        <p className="text-white/80 text-sm text-center px-4 line-clamp-1 font-light italic">
          "{image.prompt}"
        </p>
        <div className="flex gap-4 w-full max-w-xs">
          <button
            onClick={() => onRemix(image)}
            className="flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl bg-slate-800/80 backdrop-blur-md border border-slate-700/50 text-white active:scale-95 transition-all"
          >
            <RefreshCw className="w-6 h-6 text-indigo-400" />
            <span className="text-xs font-medium">Remix</span>
          </button>
          
          <button
            onClick={handleDownload}
            className="flex-1 flex flex-col items-center gap-1 p-3 rounded-2xl bg-indigo-600/90 backdrop-blur-md text-white active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
          >
            <Download className="w-6 h-6" />
            <span className="text-xs font-medium">다운로드</span>
          </button>
        </div>
      </div>
    </div>
  );
};