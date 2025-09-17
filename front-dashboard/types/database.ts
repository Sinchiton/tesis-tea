export interface Patient {
  id: string
  name: string
  age: number
  teaLevel: "Nivel 1" | "Nivel 2" | "Nivel 3"
  avatar?: string
  lastSession?: string
  progress: number
  weeklyGoal: number
  completedSessions: number
  scenario: string
  agentPersonality: string
  caregiverId: string
  createdAt: string
  updatedAt: string
}

export interface Agent {
  id: string
  name: string
  description: string
  isActive: boolean
  sttProvider: string
  sttApiUrl: string
  sttApiKey: string
  llmProvider: string
  llmModel: string
  llmApiUrl: string
  llmApiKey: string
  temperature: number
  systemPrompt: string
  ttsProvider: string
  ttsApiUrl: string
  ttsApiKey: string
  ttsVoice: string
  ttsGender: "male" | "female"
  createdAt: string
  lastUsed?: string
  totalSessions: number
}

export interface Scenario {
  id: string
  name: string
  description: string
  environment: string
  objectives: string[]
  defaultPrompt: string
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Conversation {
  id: string
  patientId: string
  agentId: string
  scenarioId: string
  sessionId: string
  messages: ConversationMessage[]
  startTime: string
  endTime?: string
  duration?: number
  metrics: SessionMetrics
}

export interface ConversationMessage {
  id: string
  role: "user" | "agent"
  content: string
  timestamp: string
  audioUrl?: string
  transcriptionConfidence?: number
}

export interface SessionMetrics {
  tasaIniciacion: number
  latenciaRespuesta: number
  turnTaking: number
  respuestasAcertadas: number
  iniciosEspontaneos: number
  turnosExitosos: number
}

export interface SessionSchedule {
  id: string
  patientId: string
  scenarioId: string
  agentId: string
  scheduledDate: string
  scheduledTime: string
  duration: number
  objectives: string[]
  status: "scheduled" | "completed" | "cancelled"
  createdAt: string
}
