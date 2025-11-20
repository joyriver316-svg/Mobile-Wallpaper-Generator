import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { PromptInput } from './components/PromptInput';
import { WallpaperGrid } from './components/WallpaperGrid';
import { LoadingOverlay } from './components/LoadingOverlay';
import { FullScreenViewer } from './components/FullScreenViewer';
import { generateWallpapers } from './services/geminiService';
import { GeneratedImage } from './types';

const App: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GeneratedImage | null>(null);

  const handleGenerate = useCallback(async (prompt: string) => {
    setLoading(true);
    try {
      const newImages = await generateWallpapers(prompt);
      setImages(newImages);
    } catch (error) {
      console.error("Failed to generate images", error);
      alert("이미지 생성에 실패했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRemix = useCallback((image: GeneratedImage) => {
    setSelectedImage(null); // Close viewer
    // Trigger generation again with the same prompt. 
    // The service already adds randomization/variations implicitly via the model generation process.
    handleGenerate(image.prompt);
  }, [handleGenerate]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center max-w-md mx-auto relative border-x border-slate-800 shadow-2xl">
      
      <Header />
      
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
      
      {/* Footer / Copyright */}
      <div className="py-4 text-center text-slate-600 text-xs">
        Powered by Gemini
      </div>
    </div>
  );
};

export default App;