"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  MessageSquare,
  Search,
  Calendar,
  Clock,
  User,
  Brain,
  Heart,
  Users,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Download,
  Eye,
  BarChart3,
  Mic,
  Volume2,
  Play,
  Pause,
  Headphones,
  AudioWaveform as Waveform,
} from "lucide-react"

interface ConversationMessage {
  id: number
  sender: "agent" | "patient"
  content: string
  timestamp: string
  emotion?: string
  confidence?: number
  audioUrl?: string
  audioTranscription?: string
  sttConfidence?: number
  ttsGenerated?: boolean
  processingTime?: {
    stt: number
    llm: number
    tts: number
    total: number
  }
}

interface ConversationDetail {
  id: number
  patient: string
  patientAge: number
  agent: string
  agentType: "communication" | "emotional" | "social"
  startTime: string
  endTime: string
  duration: string
  status: "completed" | "interrupted" | "error"
  progress: number
  objectives: string[]
  completedObjectives: string[]
  notes: string
  messages: ConversationMessage[]
  emotionalState: {
    start: string
    end: string
    changes: { time: string; state: string }[]
  }
  metrics: {
    responseTime: number
    engagement: number
    comprehension: number
    socialInteraction: number
  }
  pipelineMetrics: {
    averageSttTime: number
    averageLlmTime: number
    averageTtsTime: number
    totalAudioProcessed: number
    sttAccuracy: number
    audioQuality: number
  }
}

const mockConversations: ConversationDetail[] = [
  {
    id: 1,
    patient: "María S.",
    patientAge: 8,
    agent: "Agente Comunicación",
    agentType: "communication",
    startTime: "2024-01-15 10:30:00",
    endTime: "2024-01-15 10:45:00",
    duration: "15 min",
    status: "completed",
    progress: 85,
    objectives: ["Mejorar expresión verbal", "Practicar saludos", "Identificar emociones básicas"],
    completedObjectives: ["Mejorar expresión verbal", "Practicar saludos"],
    notes: "Excelente progreso en comunicación verbal. Mostró mayor confianza al expresar sus necesidades.",
    messages: [
      {
        id: 1,
        sender: "agent",
        content: "¡Hola María! ¿Cómo te sientes hoy?",
        timestamp: "10:30:15",
        audioUrl: "/audio/agent_1.mp3",
        ttsGenerated: true,
        processingTime: { stt: 0, llm: 1.2, tts: 0.8, total: 2.0 },
      },
      {
        id: 2,
        sender: "patient",
        content: "Hola... bien",
        timestamp: "10:30:45",
        emotion: "neutral",
        confidence: 0.7,
        audioUrl: "/audio/patient_1.mp3",
        audioTranscription: "Hola... bien",
        sttConfidence: 0.85,
        processingTime: { stt: 1.1, llm: 0, tts: 0, total: 1.1 },
      },
      {
        id: 3,
        sender: "agent",
        content: "Me alegra escuchar eso. ¿Puedes contarme qué hiciste ayer?",
        timestamp: "10:31:00",
        audioUrl: "/audio/agent_2.mp3",
        ttsGenerated: true,
        processingTime: { stt: 0, llm: 1.5, tts: 1.0, total: 2.5 },
      },
      {
        id: 4,
        sender: "patient",
        content: "Jugué con mis bloques y dibujé",
        timestamp: "10:31:30",
        emotion: "happy",
        confidence: 0.8,
        audioUrl: "/audio/patient_2.mp3",
        audioTranscription: "Jugué con mis bloques y dibujé",
        sttConfidence: 0.92,
        processingTime: { stt: 0.9, llm: 0, tts: 0, total: 0.9 },
      },
    ],
    emotionalState: {
      start: "neutral",
      end: "happy",
      changes: [
        { time: "10:31:30", state: "happy" },
        { time: "10:35:00", state: "excited" },
      ],
    },
    metrics: {
      responseTime: 1.2,
      engagement: 85,
      comprehension: 90,
      socialInteraction: 75,
    },
    pipelineMetrics: {
      averageSttTime: 1.0,
      averageLlmTime: 1.35,
      averageTtsTime: 0.9,
      totalAudioProcessed: 4.2,
      sttAccuracy: 88.5,
      audioQuality: 92,
    },
  },
  {
    id: 2,
    patient: "Carlos R.",
    patientAge: 12,
    agent: "Agente Emocional",
    agentType: "emotional",
    startTime: "2024-01-15 09:45:00",
    endTime: "2024-01-15 10:07:00",
    duration: "22 min",
    status: "completed",
    progress: 72,
    objectives: ["Reconocer emociones", "Técnicas de relajación", "Expresar sentimientos"],
    completedObjectives: ["Reconocer emociones", "Técnicas de relajación"],
    notes: "Dificultades iniciales para expresar sentimientos. Respondió bien a técnicas de respiración.",
    messages: [
      { id: 1, sender: "agent", content: "Hola Carlos, vamos a trabajar con emociones hoy", timestamp: "09:45:15" },
      { id: 2, sender: "patient", content: "Está bien", timestamp: "09:45:45", emotion: "neutral", confidence: 0.6 },
    ],
    emotionalState: {
      start: "anxious",
      end: "calm",
      changes: [
        { time: "09:50:00", state: "neutral" },
        { time: "09:58:00", state: "calm" },
      ],
    },
    metrics: {
      responseTime: 2.1,
      engagement: 72,
      comprehension: 85,
      socialInteraction: 65,
    },
    pipelineMetrics: {
      averageSttTime: 1.5,
      averageLlmTime: 1.8,
      averageTtsTime: 1.2,
      totalAudioProcessed: 3.5,
      sttAccuracy: 85,
      audioQuality: 88,
    },
  },
  {
    id: 3,
    patient: "Ana L.",
    patientAge: 10,
    agent: "Agente Social",
    agentType: "social",
    startTime: "2024-01-15 09:15:00",
    endTime: "2024-01-15 09:33:00",
    duration: "18 min",
    status: "completed",
    progress: 91,
    objectives: ["Interacción social", "Turnos de conversación", "Empatía"],
    completedObjectives: ["Interacción social", "Turnos de conversación", "Empatía"],
    notes: "Sesión muy exitosa. Ana mostró gran mejora en habilidades sociales y empatía.",
    messages: [
      { id: 1, sender: "agent", content: "¡Hola Ana! ¿Lista para nuestro juego de roles?", timestamp: "09:15:15" },
      {
        id: 2,
        sender: "patient",
        content: "¡Sí! Me gusta jugar",
        timestamp: "09:15:30",
        emotion: "excited",
        confidence: 0.9,
      },
    ],
    emotionalState: {
      start: "happy",
      end: "excited",
      changes: [{ time: "09:20:00", state: "excited" }],
    },
    metrics: {
      responseTime: 0.8,
      engagement: 95,
      comprehension: 88,
      socialInteraction: 92,
    },
    pipelineMetrics: {
      averageSttTime: 0.9,
      averageLlmTime: 1.4,
      averageTtsTime: 1.1,
      totalAudioProcessed: 3.0,
      sttAccuracy: 90,
      audioQuality: 95,
    },
  },
]

export function ConversationHistory() {
  const [conversations] = useState<ConversationDetail[]>(mockConversations)
  const [filteredConversations, setFilteredConversations] = useState<ConversationDetail[]>(mockConversations)
  const [selectedConversation, setSelectedConversation] = useState<ConversationDetail | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [agentFilter, setAgentFilter] = useState("all")
  const [playingAudio, setPlayingAudio] = useState<string | null>(null)

  const handleSearch = (term: string) => {
    setSearchTerm(term)
    filterConversations(term, statusFilter, agentFilter)
  }

  const handleStatusFilter = (status: string) => {
    setStatusFilter(status)
    filterConversations(searchTerm, status, agentFilter)
  }

  const handleAgentFilter = (agent: string) => {
    setAgentFilter(agent)
    filterConversations(searchTerm, statusFilter, agent)
  }

  const filterConversations = (search: string, status: string, agent: string) => {
    let filtered = conversations

    if (search) {
      filtered = filtered.filter(
        (conv) =>
          conv.patient.toLowerCase().includes(search.toLowerCase()) ||
          conv.agent.toLowerCase().includes(search.toLowerCase()) ||
          conv.notes.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (status !== "all") {
      filtered = filtered.filter((conv) => conv.status === status)
    }

    if (agent !== "all") {
      filtered = filtered.filter((conv) => conv.agentType === agent)
    }

    setFilteredConversations(filtered)
  }

  const handlePlayAudio = (audioUrl: string) => {
    if (playingAudio === audioUrl) {
      setPlayingAudio(null)
    } else {
      setPlayingAudio(audioUrl)
      // Simulate audio playback
      setTimeout(() => setPlayingAudio(null), 3000)
    }
  }

  const getAgentIcon = (type: string) => {
    switch (type) {
      case "communication":
        return <MessageSquare className="h-4 w-4" />
      case "emotional":
        return <Heart className="h-4 w-4" />
      case "social":
        return <Users className="h-4 w-4" />
      default:
        return <Brain className="h-4 w-4" />
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "interrupted":
        return <XCircle className="h-4 w-4 text-red-500" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-400" />
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Headphones className="h-5 w-5" />
            <span>Historial de Conversaciones de Audio</span>
          </CardTitle>
          <CardDescription>Conversaciones procesadas por el pipeline Unity → STT → LLM → TTS</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por paciente, agente o notas..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={handleStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="completed">Completadas</SelectItem>
                <SelectItem value="interrupted">Interrumpidas</SelectItem>
                <SelectItem value="error">Con errores</SelectItem>
              </SelectContent>
            </Select>
            <Select value={agentFilter} onValueChange={handleAgentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo de agente" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los agentes</SelectItem>
                <SelectItem value="communication">Comunicación</SelectItem>
                <SelectItem value="emotional">Emocional</SelectItem>
                <SelectItem value="social">Social</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredConversations.map((conversation) => (
          <Card key={conversation.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback>
                      {conversation.patient
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-lg">{conversation.patient}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      {getAgentIcon(conversation.agentType)}
                      <span>{conversation.agent}</span>
                      <span>•</span>
                      <Calendar className="h-3 w-3" />
                      <span>{formatDate(conversation.startTime)}</span>
                      <span>•</span>
                      <Clock className="h-3 w-3" />
                      <span>{conversation.duration}</span>
                      <span>•</span>
                      <Waveform className="h-3 w-3" />
                      <span>{conversation.pipelineMetrics.totalAudioProcessed.toFixed(1)}min audio</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(conversation.status)}
                      <span className="text-sm font-medium">Progreso: {conversation.progress}%</span>
                    </div>
                    <Progress value={conversation.progress} className="w-24 mt-1" />
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setSelectedConversation(conversation)}>
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle>Detalles de Conversación - {conversation.patient}</DialogTitle>
                        <DialogDescription>
                          Sesión con {conversation.agent} el {formatDate(conversation.startTime)}
                        </DialogDescription>
                      </DialogHeader>
                      {selectedConversation && (
                        <div className="space-y-6">
                          {/* Session Overview */}
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Información del Paciente</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedConversation.patient}</span>
                                  </div>
                                  <div className="text-sm text-muted-foreground">
                                    Edad: {selectedConversation.patientAge} años
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Detalles de Sesión</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{selectedConversation.duration}</span>
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    {getStatusIcon(selectedConversation.status)}
                                    <Badge
                                      variant={
                                        selectedConversation.status === "completed"
                                          ? "default"
                                          : selectedConversation.status === "interrupted"
                                            ? "destructive"
                                            : "secondary"
                                      }
                                    >
                                      {selectedConversation.status === "completed"
                                        ? "Completada"
                                        : selectedConversation.status === "interrupted"
                                          ? "Interrumpida"
                                          : "Error"}
                                    </Badge>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardHeader className="pb-2">
                                <CardTitle className="text-sm">Progreso</CardTitle>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-2">
                                  <div className="text-2xl font-bold text-primary">
                                    {selectedConversation.progress}%
                                  </div>
                                  <Progress value={selectedConversation.progress} className="w-full" />
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* Objectives */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Objetivos de la Sesión</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-2">
                                {selectedConversation.objectives.map((objective, index) => (
                                  <div key={index} className="flex items-center space-x-2">
                                    {selectedConversation.completedObjectives.includes(objective) ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                    <span
                                      className={
                                        selectedConversation.completedObjectives.includes(objective)
                                          ? "text-green-700"
                                          : "text-muted-foreground"
                                      }
                                    >
                                      {objective}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Metrics */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Métricas de Rendimiento</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">
                                    {selectedConversation.metrics.engagement}%
                                  </div>
                                  <div className="text-sm text-muted-foreground">Participación</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-accent">
                                    {selectedConversation.metrics.comprehension}%
                                  </div>
                                  <div className="text-sm text-muted-foreground">Comprensión</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-secondary">
                                    {selectedConversation.metrics.socialInteraction}%
                                  </div>
                                  <div className="text-sm text-muted-foreground">Interacción Social</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold">{selectedConversation.metrics.responseTime}s</div>
                                  <div className="text-sm text-muted-foreground">Tiempo Respuesta</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Emotional Journey */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Estado Emocional</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Estado inicial:</span>
                                  <Badge variant="outline">{selectedConversation.emotionalState.start}</Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-sm text-muted-foreground">Estado final:</span>
                                  <Badge variant="outline">{selectedConversation.emotionalState.end}</Badge>
                                </div>
                                {selectedConversation.emotionalState.changes.length > 0 && (
                                  <div>
                                    <span className="text-sm text-muted-foreground">Cambios durante la sesión:</span>
                                    <div className="mt-2 space-y-1">
                                      {selectedConversation.emotionalState.changes.map((change, index) => (
                                        <div key={index} className="flex items-center space-x-2 text-sm">
                                          <Clock className="h-3 w-3 text-muted-foreground" />
                                          <span>{change.time}</span>
                                          <span>→</span>
                                          <Badge variant="secondary" className="text-xs">
                                            {change.state}
                                          </Badge>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Conversation Messages */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg flex items-center space-x-2">
                                <MessageSquare className="h-5 w-5" />
                                <span>Chat de Conversación</span>
                              </CardTitle>
                              <CardDescription>
                                Transcripción con controles de audio del pipeline Unity → STT → LLM → TTS
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4 max-h-96 overflow-y-auto bg-muted/20 p-4 rounded-lg">
                                {selectedConversation.messages.map((message) => (
                                  <div
                                    key={message.id}
                                    className={`flex ${message.sender === "agent" ? "justify-start" : "justify-end"}`}
                                  >
                                    <div
                                      className={`max-w-xs lg:max-w-md px-4 py-3 rounded-lg ${
                                        message.sender === "agent"
                                          ? "bg-background border border-border"
                                          : "bg-primary text-primary-foreground"
                                      }`}
                                    >
                                      {/* Message Content */}
                                      <div className="text-sm mb-2">{message.content}</div>

                                      {/* Audio Controls */}
                                      {message.audioUrl && (
                                        <div className="flex items-center space-x-2 mb-2">
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handlePlayAudio(message.audioUrl!)}
                                            className="h-6 w-6 p-0"
                                          >
                                            {playingAudio === message.audioUrl ? (
                                              <Pause className="h-3 w-3" />
                                            ) : (
                                              <Play className="h-3 w-3" />
                                            )}
                                          </Button>
                                          <Waveform className="h-3 w-3 opacity-60" />
                                          <span className="text-xs opacity-70">
                                            {message.sender === "agent" ? "TTS" : "Audio"}
                                          </span>
                                        </div>
                                      )}

                                      {/* Processing Info */}
                                      {message.processingTime && (
                                        <div className="text-xs opacity-70 space-y-1">
                                          {message.sender === "patient" && message.sttConfidence && (
                                            <div className="flex items-center space-x-1">
                                              <Mic className="h-3 w-3" />
                                              <span>STT: {(message.sttConfidence * 100).toFixed(0)}%</span>
                                            </div>
                                          )}
                                          {message.sender === "agent" && (
                                            <div className="flex items-center space-x-1">
                                              <Volume2 className="h-3 w-3" />
                                              <span>TTS: {message.processingTime.tts}s</span>
                                            </div>
                                          )}
                                          <div>Pipeline: {message.processingTime.total.toFixed(1)}s</div>
                                        </div>
                                      )}

                                      {/* Timestamp and Emotion */}
                                      <div className="flex items-center justify-between mt-2">
                                        <span className="text-xs opacity-70">{message.timestamp}</span>
                                        {message.emotion && (
                                          <Badge variant="outline" className="text-xs">
                                            {message.emotion}
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Pipeline Metrics */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Métricas del Pipeline de Audio</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-primary">
                                    {selectedConversation.pipelineMetrics.averageSttTime.toFixed(1)}s
                                  </div>
                                  <div className="text-sm text-muted-foreground">STT Promedio</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-accent">
                                    {selectedConversation.pipelineMetrics.averageLlmTime.toFixed(1)}s
                                  </div>
                                  <div className="text-sm text-muted-foreground">LLM Promedio</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold text-secondary">
                                    {selectedConversation.pipelineMetrics.averageTtsTime.toFixed(1)}s
                                  </div>
                                  <div className="text-sm text-muted-foreground">TTS Promedio</div>
                                </div>
                                <div className="text-center">
                                  <div className="text-2xl font-bold">
                                    {selectedConversation.pipelineMetrics.sttAccuracy}%
                                  </div>
                                  <div className="text-sm text-muted-foreground">Precisión STT</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Notes */}
                          <Card>
                            <CardHeader>
                              <CardTitle className="text-lg">Notas del Cuidador</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <Textarea
                                value={selectedConversation.notes}
                                readOnly
                                className="min-h-20 resize-none"
                                placeholder="Sin notas adicionales"
                              />
                            </CardContent>
                          </Card>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-sm text-muted-foreground">
                      Objetivos completados: {conversation.completedObjectives.length}/{conversation.objectives.length}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      STT Precisión: {conversation.pipelineMetrics.sttAccuracy}%
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Participación: {conversation.metrics.engagement}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredConversations.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron conversaciones</h3>
            <p className="text-muted-foreground">
              Intenta ajustar los filtros de búsqueda para encontrar las conversaciones que buscas.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
