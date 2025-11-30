import { GoogleGenAI, Type, Schema } from "@google/genai";
import { IdentifyResponse, Rarity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const identifySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    name: {
      type: Type.STRING,
      description: "The specific character name of the blind box toy.",
    },
    series: {
      type: Type.STRING,
      description: "The likely series name (e.g., Pop Mart Dimoo, Skullpanda, Labubu, Sonny Angel).",
    },
    rarity: {
      type: Type.STRING,
      enum: [Rarity.COMMON, Rarity.RARE, Rarity.SECRET, Rarity.SUPER_SECRET],
      description: "Estimated rarity based on visual cues or common knowledge of the character.",
    },
    description: {
      type: Type.STRING,
      description: "A fun, short, and creative description of the character's visual features and vibe (max 2 sentences).",
    },
    confidence: {
      type: Type.NUMBER,
      description: "Confidence level of the identification from 0 to 1.",
    }
  },
  required: ["name", "series", "rarity", "description", "confidence"],
};

export const identifyToy = async (base64Image: string): Promise<IdentifyResponse> => {
  try {
    // Remove header if present (data:image/jpeg;base64,)
    const cleanBase64 = base64Image.split(',')[1] || base64Image;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: cleanBase64,
            },
          },
          {
            text: "Identify this blind box toy / art toy figure. Provide its name, series, likely rarity, and a cute description. If you are unsure, provide the best guess based on visual style.",
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: identifySchema,
        temperature: 0.4, // Lower temperature for more factual identification
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from Gemini");
    }

    const data = JSON.parse(text) as IdentifyResponse;
    return data;

  } catch (error) {
    console.error("Error identifying toy:", error);
    // Fallback or re-throw
    throw error;
  }
};