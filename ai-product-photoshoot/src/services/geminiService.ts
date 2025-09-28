
import { GoogleGenAI, Modality } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const generateProductScene = async (
  base64ImageData: string,
  mimeType: string,
  prompt: string
): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64ImageData,
              mimeType: mimeType,
            },
          },
          {
            // FIX: Simplified the prompt to be more direct.
            text: prompt,
          },
        ],
      },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    // FIX: Added safe navigation and improved response parsing logic.
    const candidate = response.candidates?.[0];
    if (!candidate?.content?.parts) {
      throw new Error("Invalid response from Gemini API.");
    }

    // Find the image part in the response
    for (const part of candidate.content.parts) {
      if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
        return part.inlineData.data;
      }
    }

    // If no image is found, check for text which might contain an error from the model
    const textPart = candidate.content.parts.find(p => p.text)?.text;
    if (textPart) {
        throw new Error(`Model returned text instead of an image: ${textPart}`);
    }

    throw new Error("No image data found in the response.");
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to generate product scene.");
  }
};
