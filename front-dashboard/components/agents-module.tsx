"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import {
  Brain,
  Mic,
  Volume2,
  Settings,
  Plus,
  Edit,
  Trash2,
  TestTube,
  Save,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface Agent {
  id: string
  name: string
  description: string
  isActive: boolean
  // STT Configuration
  sttProvider: string
  sttApiUrl: string
  sttApiKey: string
  // LLM Configuration
  llmProvider: string
  llmModel: string
  llmApiUrl: string
  llmApiKey: string
  temperature: number
  systemPrompt: string
  // TTS Configuration
  ttsProvider: string
  ttsApiUrl: string
  ttsApiKey: string
  ttsVoice: string
  createdAt: string
  lastUsed?: string
  totalSessions: number
}

const mockAgents: Agent[] = [
  {
    id: "agent-1",
    name: "Maestra Virtual Ana",
    description: "Agente especializado en escenarios de aula para niños con TEA nivel 1",
    isActive: true,
    sttProvider: "OpenAI Whisper",
    sttApiUrl: "https://api.openai.com/v1/audio/transcriptions",
    sttApiKey: "sk-proj-...",
    llmProvider: "OpenAI",
    llmModel: "gpt-4-turbo",
    llmApiUrl: "https://api.openai.com/v1/chat/completions",
    llmApiKey: "sk-proj-...",
    temperature: 0.7,
    systemPrompt: "Eres una maestra paciente y comprensiva especializada en trabajar con niños con TEA...",
    ttsProvider: "ElevenLabs",
    ttsApiUrl: "https://api.elevenlabs.io/v1/text-to-speech",
    ttsApiKey: "sk_...",
    ttsVoice: "sarah",
    createdAt: "2024-01-15",
    lastUsed: "2024-01-20",
    totalSessions: 156,
  },
  {
    id: "agent-2",
    name: "Compañero de Juegos",
    description: "Agente para actividades lúdicas y socialización",
    isActive: true,
    sttProvider: "Google Speech-to-Text",
    sttApiUrl: "https://speech.googleapis.com/v1/speech:recognize",
    sttApiKey: "AIza...",
    llmProvider: "Anthropic",
    llmModel: "claude-3-sonnet",
    llmApiUrl: "https://api.anthropic.com/v1/messages",
    llmApiKey: "sk-ant-...",
    temperature: 0.8,
    systemPrompt: "Eres un compañero de juegos amigable y entusiasta...",
    ttsProvider: "Azure Speech",
    ttsApiUrl: "https://eastus.tts.speech.microsoft.com/cognitiveservices/v1",
    ttsApiKey: "abc123...",
    ttsVoice: "es-ES-ElviraNeural",
    createdAt: "2024-01-10",
    lastUsed: "2024-01-19",
    totalSessions: 89,
  },
]

const mockScenarios = [
  { id: "classroom", name: "Aula Escolar", prompt: "Eres una maestra paciente..." },
  { id: "playground", name: "Patio de Juegos", prompt: "Eres un compañero de juegos..." },
  { id: "home", name: "Casa Familiar", prompt: "Eres un miembro de la familia..." },
  { id: "therapy", name: "Sesión Terapéutica", prompt: "Eres un terapeuta especializado..." },
]

export function AgentsModule() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)
  const [selectedScenario, setSelectedScenario] = useState("")
  const [tempPrompt, setTempPrompt] = useState("")

  const handleCreateAgent = () => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}`,
      name: "Nuevo Agente",
      description: "Descripción del agente",
      isActive: false,
      sttProvider: "OpenAI Whisper",
      sttApiUrl: "https://api.openai.com/v1/audio/transcriptions",
      sttApiKey: "",
      llmProvider: "OpenAI",
      llmModel: "gpt-4-turbo",
      llmApiUrl: "https://api.openai.com/v1/chat/completions",
      llmApiKey: "",
      temperature: 0.7,
      systemPrompt: "",
      ttsProvider: "ElevenLabs",
      ttsApiUrl: "https://api.elevenlabs.io/v1/text-to-speech",
      ttsApiKey: "",
      ttsVoice: "sarah",
      createdAt: new Date().toISOString().split("T")[0],
      totalSessions: 0,
    }
    setAgents([...agents, newAgent])
    setSelectedAgent(newAgent)
    setIsEditing(true)
  }

  const handleSaveAgent = () => {
    if (selectedAgent) {
      setAgents(agents.map((a) => (a.id === selectedAgent.id ? selectedAgent : a)))
      setIsEditing(false)
    }
  }

  const handleDeleteAgent = (agentId: string) => {
    setAgents(agents.filter((a) => a.id !== agentId))
    if (selectedAgent?.id === agentId) {
      setSelectedAgent(null)
    }
  }

  const handleTestAgent = async () => {
    if (!selectedAgent) return

    // Simple validation test
    const hasValidSTT = selectedAgent.sttApiKey && selectedAgent.sttApiUrl
    const hasValidLLM = selectedAgent.llmApiKey && selectedAgent.llmApiUrl
    const hasValidTTS = selectedAgent.ttsApiKey && selectedAgent.ttsApiUrl

    if (hasValidSTT && hasValidLLM && hasValidTTS) {
      setTestResult({ success: true, message: "Configuración válida - Agente listo para usar" })
    } else {
      setTestResult({ success: false, message: "Faltan tokens o URLs de API" })
    }

    setTimeout(() => setTestResult(null), 3000)
  }

  const handleUseScenario = (scenarioId: string) => {
    const scenario = mockScenarios.find((s) => s.id === scenarioId)
    if (scenario && selectedAgent) {
      setSelectedAgent({
        ...selectedAgent,
        systemPrompt: scenario.prompt,
      })
      setSelectedScenario(scenarioId)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Módulo de Agentes</h3>
          <p className="text-sm text-muted-foreground">
            Gestiona agentes conversacionales con configuración de proveedores STT → LLM → TTS
          </p>
        </div>
        <Button onClick={handleCreateAgent}>
          <Plus className="h-4 w-4 mr-2" />
          Crear Agente
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lista de Agentes */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Agentes ({agents.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedAgent?.id === agent.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => setSelectedAgent(agent)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">{agent.name}</h4>
                    <div className="flex items-center space-x-1">
                      <Badge variant={agent.isActive ? "default" : "secondary"} className="text-xs">
                        {agent.isActive ? "Activo" : "Inactivo"}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteAgent(agent.id)
                        }}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">{agent.description}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{agent.llmModel}</span>
                    <span>{agent.totalSessions} sesiones</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-2">
                    <div className="flex items-center space-x-1">
                      <Mic className="h-3 w-3" />
                      <span className="text-xs">{agent.sttProvider}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Brain className="h-3 w-3" />
                      <span className="text-xs">{agent.llmProvider}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Volume2 className="h-3 w-3" />
                      <span className="text-xs">{agent.ttsProvider}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Configuración del Agente */}
        <div className="lg:col-span-2">
          {selectedAgent ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    {selectedAgent.name}
                  </CardTitle>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
                      <Edit className="h-4 w-4 mr-2" />
                      {isEditing ? "Cancelar" : "Editar"}
                    </Button>
                    {isEditing && (
                      <Button size="sm" onClick={handleSaveAgent}>
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="basic" className="w-full">
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="basic">Básico</TabsTrigger>
                    <TabsTrigger value="stt">STT</TabsTrigger>
                    <TabsTrigger value="llm">LLM</TabsTrigger>
                    <TabsTrigger value="tts">TTS</TabsTrigger>
                  </TabsList>

                  <TabsContent value="basic" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Nombre</Label>
                        <Input
                          id="name"
                          value={selectedAgent.name}
                          onChange={(e) => setSelectedAgent({ ...selectedAgent, name: e.target.value })}
                          disabled={!isEditing}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={selectedAgent.isActive}
                          onCheckedChange={(checked) => setSelectedAgent({ ...selectedAgent, isActive: checked })}
                          disabled={!isEditing}
                        />
                        <Label>Agente Activo</Label>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="description">Descripción</Label>
                      <Input
                        id="description"
                        value={selectedAgent.description}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, description: e.target.value })}
                        disabled={!isEditing}
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label htmlFor="prompt">System Prompt</Label>
                        <Select value={selectedScenario} onValueChange={handleUseScenario} disabled={!isEditing}>
                          <SelectTrigger className="w-48">
                            <SelectValue placeholder="Usar escenario..." />
                          </SelectTrigger>
                          <SelectContent>
                            {mockScenarios.map((scenario) => (
                              <SelectItem key={scenario.id} value={scenario.id}>
                                {scenario.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <Textarea
                        id="prompt"
                        value={selectedAgent.systemPrompt}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, systemPrompt: e.target.value })}
                        disabled={!isEditing}
                        rows={6}
                        placeholder="Define la personalidad y comportamiento del agente..."
                      />
                    </div>

                    <div className="pt-4 border-t">
                      <div className="flex items-center justify-between mb-3">
                        <Label>Prueba Rápida</Label>
                        <Button onClick={handleTestAgent} size="sm">
                          <TestTube className="h-4 w-4 mr-2" />
                          Validar Configuración
                        </Button>
                      </div>
                      {testResult && (
                        <div
                          className={`flex items-center space-x-2 p-3 rounded-lg ${
                            testResult.success
                              ? "bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800"
                              : "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800"
                          }`}
                        >
                          {testResult.success ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-red-500" />
                          )}
                          <span className="text-sm">{testResult.message}</span>
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="stt" className="space-y-4">
                    <div>
                      <Label htmlFor="stt-provider">Proveedor STT</Label>
                      <Select
                        value={selectedAgent.sttProvider}
                        onValueChange={(value) => setSelectedAgent({ ...selectedAgent, sttProvider: value })}
                        disabled={!isEditing}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="OpenAI Whisper">OpenAI Whisper</SelectItem>
                          <SelectItem value="Google Speech-to-Text">Google Speech-to-Text</SelectItem>
                          <SelectItem value="Azure Speech">Azure Speech Services</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="stt-url">URL de API</Label>
                      <Input
                        id="stt-url"
                        value={selectedAgent.sttApiUrl}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, sttApiUrl: e.target.value })}
                        disabled={!isEditing}
                        placeholder="https://api.openai.com/v1/audio/transcriptions"
                      />
                    </div>

                    <div>
                      <Label htmlFor="stt-key">Token/API Key</Label>
                      <Input
                        id="stt-key"
                        type="password"
                        value={selectedAgent.sttApiKey}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, sttApiKey: e.target.value })}
                        disabled={!isEditing}
                        placeholder="sk-proj-..."
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="llm" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="llm-provider">Proveedor LLM</Label>
                        <Select
                          value={selectedAgent.llmProvider}
                          onValueChange={(value) => setSelectedAgent({ ...selectedAgent, llmProvider: value })}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="OpenAI">OpenAI</SelectItem>
                            <SelectItem value="Anthropic">Anthropic</SelectItem>
                            <SelectItem value="Google">Google Gemini</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="llm-model">Modelo</Label>
                        <Input
                          id="llm-model"
                          value={selectedAgent.llmModel}
                          onChange={(e) => setSelectedAgent({ ...selectedAgent, llmModel: e.target.value })}
                          disabled={!isEditing}
                          placeholder="gpt-4-turbo"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="llm-url">URL de API</Label>
                      <Input
                        id="llm-url"
                        value={selectedAgent.llmApiUrl}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, llmApiUrl: e.target.value })}
                        disabled={!isEditing}
                        placeholder="https://api.openai.com/v1/chat/completions"
                      />
                    </div>

                    <div>
                      <Label htmlFor="llm-key">Token/API Key</Label>
                      <Input
                        id="llm-key"
                        type="password"
                        value={selectedAgent.llmApiKey}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, llmApiKey: e.target.value })}
                        disabled={!isEditing}
                        placeholder="sk-proj-..."
                      />
                    </div>

                    <div>
                      <Label htmlFor="temperature">Temperature: {selectedAgent.temperature}</Label>
                      <Slider
                        value={[selectedAgent.temperature]}
                        onValueChange={([value]) => setSelectedAgent({ ...selectedAgent, temperature: value })}
                        max={2}
                        min={0}
                        step={0.1}
                        disabled={!isEditing}
                        className="mt-2"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="tts" className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="tts-provider">Proveedor TTS</Label>
                        <Select
                          value={selectedAgent.ttsProvider}
                          onValueChange={(value) => setSelectedAgent({ ...selectedAgent, ttsProvider: value })}
                          disabled={!isEditing}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ElevenLabs">ElevenLabs</SelectItem>
                            <SelectItem value="Azure Speech">Azure Speech</SelectItem>
                            <SelectItem value="OpenAI TTS">OpenAI TTS</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="tts-voice">Voz</Label>
                        <Input
                          id="tts-voice"
                          value={selectedAgent.ttsVoice}
                          onChange={(e) => setSelectedAgent({ ...selectedAgent, ttsVoice: e.target.value })}
                          disabled={!isEditing}
                          placeholder="sarah"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tts-url">URL de API</Label>
                      <Input
                        id="tts-url"
                        value={selectedAgent.ttsApiUrl}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, ttsApiUrl: e.target.value })}
                        disabled={!isEditing}
                        placeholder="https://api.elevenlabs.io/v1/text-to-speech"
                      />
                    </div>

                    <div>
                      <Label htmlFor="tts-key">Token/API Key</Label>
                      <Input
                        id="tts-key"
                        type="password"
                        value={selectedAgent.ttsApiKey}
                        onChange={(e) => setSelectedAgent({ ...selectedAgent, ttsApiKey: e.target.value })}
                        disabled={!isEditing}
                        placeholder="sk_..."
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center text-muted-foreground">
                  <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">Selecciona un Agente</h3>
                  <p className="text-sm">Elige un agente de la lista para configurar sus proveedores de API</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
