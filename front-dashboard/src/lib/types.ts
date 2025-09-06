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

// 👇 agrega superadmin
export type Role = "superadmin" | "admin" | "therapist" | "caregiver" | "child";

export type User = {
  id: number;
  org_id: number;
  name: string;
  email: string;
  role: Role;
  caregiver_id?: number | null; // si es niño, quién es su responsable
  avatar_url?: string | null;   // opcional: imagen (S3/Supabase o similar)
  created_at?: string;
};

export type SensoryProfile = {
  id: number;
  user_id: number;
  luz: number;         // 0..5
  ruido: number;       // 0..5
  crowd: number;       // 0..5
  duracion: number;    // seg
  complejidad: number; // 0..5
  created_at?: string;
};

export type Conversation = {
  id: number;
  user_id: number;
  agent_id: number;
  started_at: string;
  ended_at?: string | null;
  turns: Array<{ role: "user" | "assistant"; text: string; at: string }>;
};

// permisos modulares
export type Permission =
  | "users.read" | "users.write"
  | "providers.read" | "providers.write"
  | "agents.read" | "agents.write"
  | "profiles.read" | "profiles.write"
  | "conversations.read" | "conversations.write"
  | "stats.read" | "stats.write";

export type Me = { user: User; permissions: Permission[] };
