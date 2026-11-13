export type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
  modelUsed?: string;
  modelCategory?: 'general' | 'coding' | 'math' | 'conversation' | 'multimodal';
  autoRouted?: boolean;
  imageUrl?: string;
  imageProvider?: string;
};

export type Chat = {
  id: string;
  userId: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

// Model IDs offered in the model picker. Keep in sync with models-config.json,
// which mirrors the backend's routing/models-config.json.
export type ModelId =
  // Google Gemini
  | 'gemini-3.6-flash'
  | 'gemini-3.5-flash-lite'
  | 'gemini-3.1-flash-lite'
  // OpenRouter free router
  | 'openrouter-free-router'
  // Groq (only answers when Groq is enabled on the backend)
  | 'groq-gpt-oss-120b'
  | 'groq-gpt-oss-20b'
  | 'groq-qwen3.8-27b';

// Alias for backward compatibility
export type Model = ModelId;

export type Voice = 'troy' | 'diana' | 'hannah' | 'autumn' | 'austin' | 'daniel';

// Model category type
export type ModelCategory = 'general' | 'coding' | 'math' | 'conversation' | 'multimodal';

export type Settings = {
  model: 'auto' | ModelId;
  preferredCategory?: ModelCategory;
  tone: 'helpful' | 'formal' | 'casual';
  technicalLevel: 'beginner' | 'intermediate' | 'expert';
  responseFontWeight?: 'regular' | 'medium' | 'bold';
  enableSpeech: boolean;
  voice: Voice;
};

// User profile for personality feature
export type UserProfile = {
  userId: string;
  communicationStyle?: 'direct' | 'detailed' | 'casual' | 'technical';
  preferences?: {
    responseLength?: 'concise' | 'balanced' | 'detailed';
    codeExamples?: boolean;
    explanationStyle?: 'simple' | 'moderate' | 'advanced';
  };
  memories?: UserMemory[];
  createdAt: string;
  updatedAt: string;
};

export type UserMemory = {
  id: string;
  content: string;
  category: 'preference' | 'fact' | 'context' | 'skill';
  timestamp: string;
  relevance: number; // 0-1 score for memory importance
};

// Types for Genkit flows
export interface ProcessUserMessageInput {
  message: string;
  // Use a simpler history type that only includes what the AI needs.
  // This prevents schema validation errors from extra fields like id or createdAt.
  history: Array<{
    role: 'user' | 'assistant';
    content: string;
  }>;
  settings: Settings;
  userId?: string; // Optional user ID for memory system integration
}

export interface TextToSpeechInput {
  text: string;
  voice: Voice;
}

export interface TextToSpeechOutput {
  audio: string;
}

export interface SolveImageEquationInput {
  photoDataUri: string;
}

export interface SolveImageEquationOutput {
  recognizedEquation: string;
  solutionSteps: string;
  isSolvable: boolean;
  modelUsed?: string;
}

export interface AnalyzePdfInput {
  pdfDataUri: string;
  question: string;
}

export interface AnalyzePdfOutput {
  answer: string;
}
