import { GoogleGenAI } from "@google/genai";
import { AspectRatio } from "../types";

const apiKey = process.env.API_KEY || '';
// Note: In a real environment, ensure API_KEY is set.
// We initialize lazily inside functions to handle key rotation if needed,
// though the prompt says strictly use process.env.API_KEY.

const ai = new GoogleGenAI({ apiKey });

/**
 * Helper to convert File to Base64 string (without metadata prefix)
 */
export const fileToGenerativePart = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove data url prefix (e.g. "data:image/jpeg;base64,")
      const base64Data = base64String.split(',')[1];
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateImageWithAI = async (
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash-preview-image-generation',
      contents: prompt,
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        },
      },
    });

    // Extract image from response
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw error;
  }
};

export const editImageWithAI = async (
  base64Image: string,
  prompt: string,
  aspectRatio: AspectRatio
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: 'image/png', // Assuming PNG or standard image
            },
          },
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No edited image returned.");
  } catch (error) {
    console.error("Error editing image:", error);
    throw error;
  }
};

export const generatePromptFromImage = async (
  base64Image: string,
  mimeType: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: 'Analyze this image and generate a detailed, creative prompt that could be used to recreate it with an AI image generation model. Include details about style, lighting, composition, colors, and subject matter. Format it as a single descriptive paragraph.',
          },
        ],
      },
    });
    const text = response.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('No prompt generated.');
    return text;
  } catch (error) {
    console.error('Error generating prompt from image:', error);
    throw error;
  }
};