export interface SurgicalStep {
  id: number;
  title: string;
  description: string;
  visualPrompt: string; // The prompt optimized for image generation
  imageUrl?: string;
  videoUrl?: string;
  audioUrl?: string;
  isGeneratingImage: boolean;
  isGeneratingVideo: boolean;
  isGeneratingAudio: boolean;
  imageError?: string;
  videoError?: string;
  audioError?: string;
  videoQuality?: 'pro' | 'standard';
}

export enum GenerationType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
  AUDIO = 'AUDIO'
}

export interface AnalysisResponse {
  procedureName: string;
  steps: Array<{
    title: string;
    description: string;
    visualPrompt: string;
  }>;
}

export interface AIStudioClient {
  hasSelectedApiKey: () => Promise<boolean>;
  openSelectKey: () => Promise<void>;
}