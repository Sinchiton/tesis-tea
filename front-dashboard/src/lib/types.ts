export type ProviderType = "STT" | "LLM" | "TTS";
export type Provider = {
  id: number; org_id: number; type: ProviderType; vendor: string;
  config?: any; created_at?: string;
};
export type Agent = {
  id: number; org_id: number; name: string; description?: string;
  model: string; temperature?: number; voice?: string; active?: boolean;
  llm_provider_id?: number; stt_provider_id?: number; tts_provider_id?: number;
  created_at?: string;
};
