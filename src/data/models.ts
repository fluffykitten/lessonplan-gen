export interface AiModelOption {
  id: string;
  label: string;
  isBuiltIn?: boolean;
}

export const DEFAULT_GEMINI_MODELS: AiModelOption[] = [
  { id: 'gemini-3.5-flash-lite', label: 'Gemini 3.5 Flash-Lite (Recommended - Ultra Fast & Resilient)', isBuiltIn: true },
  { id: 'gemini-3.6-flash', label: 'Gemini 3.6 Flash (High Quality & Fast)', isBuiltIn: true },
  { id: 'gemini-3.5-flash', label: 'Gemini 3.5 Flash (Stable & Reliable)', isBuiltIn: true },
  { id: 'gemini-3.8-flash', label: 'Gemini 3.8 Flash (Latest Flagship Flash)', isBuiltIn: true },
  { id: 'gemini-3.1-flash-lite', label: 'Gemini 3.1 Flash-Lite (Lightweight)', isBuiltIn: true },
];
