import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

export const validateApiKey = async (apiKey: string): Promise<boolean> => {
  try {
    const ai = new GoogleGenAI({ apiKey });
    // Use a lightweight model to test connectivity
    await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'ping',
    });
    return true;
  } catch (error) {
    console.error("API Key validation failed:", error);
    return false;
  }
};

export const generateWallpapers = async (apiKey: string, userPrompt: string): Promise<GeneratedImage[]> => {
  if (!apiKey) {
    throw new Error("API Key is required");
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    // Enhance prompt for better wallpaper results
    const enhancedPrompt = `${userPrompt}, high quality phone wallpaper, 8k resolution, aesthetic, highly detailed, vertical 9:16 aspect ratio`;

    // We request 4 images. 
    const response = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: enhancedPrompt,
      config: {
        numberOfImages: 4,
        aspectRatio: '9:16',
        outputMimeType: 'image/jpeg',
      },
    });

    if (!response.generatedImages) {
      throw new Error("No images generated");
    }

    return response.generatedImages.map((img, index) => ({
      id: `gen-${Date.now()}-${index}`,
      url: `data:image/jpeg;base64,${img.image.imageBytes}`,
      prompt: userPrompt,
      createdAt: Date.now(),
    }));

  } catch (error) {
    console.error("Error generating wallpapers:", error);
    throw error;
  }
};