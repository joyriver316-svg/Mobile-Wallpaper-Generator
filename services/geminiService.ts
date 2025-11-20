import { GoogleGenAI } from "@google/genai";
import { GeneratedImage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWallpapers = async (userPrompt: string): Promise<GeneratedImage[]> => {
  try {
    // Enhance prompt for better wallpaper results
    const enhancedPrompt = `${userPrompt}, high quality phone wallpaper, 8k resolution, aesthetic, highly detailed, vertical 9:16 aspect ratio`;

    // We request 4 images. 
    // Note: The model 'imagen-4.0-generate-001' supports generating multiple images.
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