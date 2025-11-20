import React from 'react';
import { GeneratedImage } from '../types';

interface WallpaperGridProps {
  images: GeneratedImage[];
  onSelect: (image: GeneratedImage) => void;
}

export const WallpaperGrid: React.FC<WallpaperGridProps> = ({ images, onSelect }) => {
  if (images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-slate-500">
        <div className="w-16 h-24 border-2 border-dashed border-slate-700 rounded-lg mb-4 flex items-center justify-center">
           <span className="text-2xl opacity-20">?</span>
        </div>
        <p className="text-sm text-center">
          상단에 분위기를 입력하여<br />나만의 배경화면을 만들어보세요.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-3 p-4 pb-32">
      {images.map((img) => (
        <div
          key={img.id}
          onClick={() => onSelect(img)}
          className="group relative aspect-[9/16] rounded-xl overflow-hidden bg-slate-800 cursor-pointer shadow-md border border-slate-700/50 hover:border-indigo-500 transition-all"
        >
          <img
            src={img.url}
            alt={img.prompt}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
            <span className="text-white text-xs font-medium px-2 py-1 bg-black/40 backdrop-blur-sm rounded-full">
              터치해서 보기
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};