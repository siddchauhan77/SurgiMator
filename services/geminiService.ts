import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AnalysisResponse } from "../types";

// Helper to get client with current key
const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key not found. Please select a key.");
  }
  return new GoogleGenAI({ apiKey });
};

// Robust JSON Cleaner/Repairer
const repairJson = (jsonString: string): string => {
  let cleaned = jsonString.trim();

  // Remove markdown code blocks
  if (cleaned.startsWith('```json')) {
    cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '');
  } else if (cleaned.startsWith('```')) {
    cleaned = cleaned.replace(/^```/, '').replace(/```$/, '');
  }
  
  cleaned = cleaned.trim();

  // 1. Attempt to fix common trailing comma errors
  cleaned = cleaned.replace(/,\s*}/g, '}').replace(/,\s*]/g, ']');

  // 2. Check if truncated (Unterminated string/object)
  if (!cleaned.endsWith('}')) {
      if (cleaned.startsWith('{')) {
          if (cleaned.endsWith('"')) {
             cleaned += ']}'; 
          } else {
             cleaned += ']}';
          }
      }
  }

  return cleaned;
};

export const researchProcedure = async (query: string): Promise<{ text: string; sources: Array<{title: string, uri: string}> }> => {
  const ai = getAiClient();
  const prompt = `
    Find a detailed, step-by-step surgical manual for: "${query}".
    Format it as a standard surgical technique guide with a clear Title and numbered Steps (1, 2, 3...).
    Include specific anatomical landmarks and actions.
    Do not include conversational filler.
    Limit to the most standard, widely accepted technique.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "";
    // Extract sources from grounding metadata
    const sources: Array<{title: string, uri: string}> = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    chunks.forEach(chunk => {
        if (chunk.web?.uri) {
            sources.push({
                title: chunk.web.title || "Source",
                uri: chunk.web.uri
            });
        }
    });

    // Deduplicate sources based on URI
    const uniqueSources = sources.filter((v,i,a)=>a.findIndex(v2=>(v2.uri===v.uri))===i);

    return { text, sources: uniqueSources };
  } catch (e: any) {
    console.error("Research failed:", e);
    throw new Error(`Research failed: ${e.message}`);
  }
};

export const estimateStepCount = async (text: string): Promise<number> => {
  const ai = getAiClient();
  const prompt = `
    Analyze this surgical procedure text.
    Return ONLY a single integer: the optimal number of storyboard steps (4-12).
    Text: "${text.substring(0, 5000)}" 
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Corrected model name
      contents: prompt,
    });
    
    const num = parseInt(response.text?.trim() || "0");
    if (isNaN(num) || num < 1) return 6;
    return num;
  } catch (error) {
    console.error("Failed to estimate steps:", error);
    return 6;
  }
};

export const analyzeManual = async (text: string, targetStepCount?: number): Promise<AnalysisResponse> => {
  const ai = getAiClient();
  
  // Strict System Instruction
  const systemInstruction = `
    You are a strict API endpoint that converts text into JSON.
    You DO NOT output conversational text.
    You DO NOT generate infinite loops.
    Output MUST be valid JSON matching the requested schema.
  `;

  const prompt = `
    Task: Convert this surgical manual into a ${targetStepCount || 'logical (4-12)'}-step visual storyboard.
    
    Constraints:
    1. Steps: Exactly ${targetStepCount || 'logical count'}.
    2. Description: MAX 30 words per step. Concise active voice.
    3. Visual Prompt: MAX 30 words. Focus on camera angle, anatomy, and tools.
    4. NO REPETITION.
    
    Manual:
    "${text.substring(0, 15000)}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
        responseMimeType: "application/json",
        maxOutputTokens: 2000, // Reduced limit to prevent runaways
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            procedureName: { type: Type.STRING },
            steps: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  visualPrompt: { type: Type.STRING },
                }
              }
            }
          }
        }
      }
    });

    if (!response.text) {
      throw new Error("No response from AI. The model may have refused the content.");
    }

    const cleanedJson = repairJson(response.text);
    return JSON.parse(cleanedJson) as AnalysisResponse;

  } catch (e: any) {
    console.error("Analysis Failed:", e);
    
    if (e.message.includes("JSON")) {
         throw new Error("Failed to parse AI response. The model output was malformed. Please try again.");
    } else if (e.message.includes("SAFETY") || e.message.includes("blocked")) {
         throw new Error("The request was blocked by safety filters. Please remove any explicit gore from the input.");
    }
    
    throw new Error(`Analysis Error: ${e.message || "Unknown error"}`);
  }
};

export const generateStepImage = async (visualPrompt: string, useProModel: boolean = true): Promise<string> => {
  const ai = getAiClient();
  
  const safePrompt = `Medical illustration, educational diagram style, clean lines, schematic anatomy, neutral colors: ${visualPrompt}`;

  if (useProModel) {
    try {
        const response = await ai.models.generateContent({
        model: 'gemini-3-pro-image-preview',
        contents: {
            parts: [{ text: safePrompt }]
        },
        config: {
            imageConfig: {
            aspectRatio: "16:9",
            imageSize: "1K"
            }
        }
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
        }
        }
        
        const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
        if (textPart?.text && !textPart.text.includes("data:image")) {
            throw new Error(`AI Refusal: ${textPart.text}`);
        }

    } catch (error) {
        console.warn("Gemini 3 Pro Image failed, trying fallback...", error);
    }
  }

  // Fallback
  try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: safePrompt }] }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
  } catch (e: any) {
      console.error("Flash image generation failed:", e);
      throw new Error("Image generation failed. The prompt might be unsafe.");
  }

  throw new Error("No image generated by either model");
};

export const generateStepVideo = async (visualPrompt: string, referenceImageUrl?: string, useProMode: boolean = false): Promise<string> => {
  const ai = getAiClient();
  
  const basePrompt = useProMode
    ? `Cinematic medical animation, 16:9, high definition, educational anatomy, smooth motion: ${visualPrompt}`
    : `Medical schematic animation, 16:9, educational diagram motion, minimalist, wireframe style: ${visualPrompt}`;

  const baseConfig = {
    numberOfVideos: 1,
    resolution: useProMode ? '1080p' : '720p', 
    aspectRatio: '16:9'
  };

  const attemptGeneration = async (includeImage: boolean) => {
    const requestParams: any = {
      model: 'veo-3.1-fast-generate-preview',
      prompt: basePrompt,
      config: baseConfig
    };

    if (includeImage && referenceImageUrl) {
      const match = referenceImageUrl.match(/^data:(.+);base64,(.+)$/);
      if (match && match.length === 3) {
          requestParams.image = {
              mimeType: match[1],
              imageBytes: match[2]
          };
      }
    }

    let operation = await ai.models.generateVideos(requestParams);

    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({ operation: operation });
    }

    if ((operation as any).error) {
        throw new Error((operation as any).error.message || "Video generation returned error status");
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (!videoUri) {
       throw new Error("Video generation completed but returned no URI");
    }
    
    return videoUri;
  };
  
  let attempts = [];
  
  if (referenceImageUrl) {
    try {
      const uri = await attemptGeneration(true);
      const videoResponse = await fetch(`${uri}&key=${process.env.API_KEY}`);
      const blob = await videoResponse.blob();
      return URL.createObjectURL(blob);
    } catch (error: any) {
      console.warn("Image-to-Video failed, falling back to Text-to-Video. Reason:", error.message);
      attempts.push(`Img2Vid: ${error.message}`);
    }
  }

  try {
    const uri = await attemptGeneration(false);
    const videoResponse = await fetch(`${uri}&key=${process.env.API_KEY}`);
    const blob = await videoResponse.blob();
    return URL.createObjectURL(blob);
  } catch (error: any) {
    console.error("Video generation completely failed", error);
    const combinedErrors = attempts.length > 0 ? `${attempts.join(', ')} | Txt2Vid: ${error.message}` : error.message;
    throw new Error(`Video Generation Failed: ${combinedErrors}`);
  }
};

export const generateStepAudio = async (text: string): Promise<string> => {
  const ai = getAiClient();

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: text }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: {
          prebuiltVoiceConfig: { voiceName: 'Fenrir' }, 
        },
      },
    },
  });

  const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  if (!base64Audio) throw new Error("No audio generated");

  return `data:audio/mp3;base64,${base64Audio}`;
};