import React, { useState, useCallback, useEffect } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { WallpaperGrid } from './components/WallpaperGrid';
import { LoadingOverlay } from './components/LoadingOverlay';
import { FullScreenViewer } from './components/FullScreenViewer';
import { ApiKeySettings } from './components/ApiKeySettings';
import { generateWallpapers } from './services/geminiService';
import { GeneratedImage } from './types';

const STORAGE_KEY = 'gemini_wallpaper_key_enc';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load key from local storage on mount
  useEffect(() => {
    const storedEncryptedKey = localStorage.getItem(STORAGE_KEY);
    if (storedEncryptedKey) {
      try {
        // Simple obfuscation decoding (Base64)
        const decodedKey = atob(storedEncryptedKey);
        setApiKey(decodedKey);
      } catch (e) {
        console.error("Failed to decode stored key");
        localStorage.removeItem(STORAGE_KEY);
      }
    } else {
      // Open settings if no key is found
      const timer = setTimeout(() => setIsSettingsOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleSaveKey = (key: string) => {
    setApiKey(key);
    if (key) {
      // Simple obfuscation encoding (Base64)
      const encodedKey = btoa(key);
      localStorage.setItem(STORAGE_KEY, encodedKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const handleGenerate = useCallback(async (prompt: string) => {
    if (!apiKey) {
      setIsSettingsOpen(true);
      return;
    }

    setLoading(true);
    try {
      const newImages = await generateWallpapers(apiKey, prompt);
      setImages(newImages);
    } catch (error) {
      console.error("Failed to generate images", error);
      alert("이미지 생성에 실패했습니다. API 키를 확인하거나 잠시 후 다시 시도해주세요.");
      // If unauthorized, maybe open settings
      if (error instanceof Error && (error.message.includes('401') || error.message.includes('403'))) {
          setIsSettingsOpen(true);
      }
    } finally {
      setLoading(false);
    }
  }, [apiKey]);

  const handleRemix = useCallback((image: GeneratedImage) => {
    setSelectedImage(null);
    handleGenerate(image.prompt);
  }, [handleGenerate]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center max-w-md mx-auto relative border-x border-slate-800 shadow-2xl">
      
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="w-full flex-1 flex flex-col">
        <PromptInput onGenerate={handleGenerate} isLoading={loading} />
        
        <div className="flex-1 w-full">
            <div className="px-4 py-2 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-wider">
                    {images.length > 0 ? '생성된 결과' : ''}
                </h2>
                {images.length > 0 && (
                    <span className="text-xs text-slate-600 bg-slate-800 px-2 py-0.5 rounded-md">
                        9:16 Ratio
                    </span>
                )}
            </div>
            <WallpaperGrid images={images} onSelect={setSelectedImage} />
        </div>
      </main>

      <LoadingOverlay isVisible={loading} />

      <FullScreenViewer 
        image={selectedImage} 
        onClose={() => setSelectedImage(null)}
        onRemix={handleRemix}
      />

      <ApiKeySettings 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={handleSaveKey}
        currentKey={apiKey}
      />
      
      {/* Footer / Copyright */}
      <div className="py-4 text-center text-slate-600 text-xs">
        Powered by Gemini
      </div>
    </div>
  );
};

export default App;