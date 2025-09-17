"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
  Settings,
  Mic,
  Brain,
  Volume2,
  Server,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RotateCcw,
  Plus,
  Edit,
  Monitor,
  Cpu,
  HardDrive,
  Wifi,
  Zap,
} from "lucide-react"

interface Agent {
  id: string
  name: string
  type: "stt" | "llm" | "tts"
  status: "active" | "inactive" | "error" | "maintenance"
  version: string
  model?: string
  language?: string
  performance: {
    accuracy: number
    speed: number
    uptime: number
    requests: number
  }
  config: {
    [key: string]: any
  }
  lastUpdate: string
  resources: {
    cpu: number
    memory: number
    storage: number
  }
}

const mockAgents: Agent[] = [
  {
    id: "stt-001",
    name: "Whisper STT Principal",
    type: "stt",
    status: "active",
    version: "v3.0",
    model: "whisper-large-v3",
    language: "es-ES",
    performance: {
      accuracy: 94.5,
      speed: 1.2,
      uptime: 99.8,
      requests: 1247,
    },
    config: {
      sampleRate: 16000,
      channels: 1,
      format: "wav",
      noiseReduction: true,
      adaptiveThreshold: 0.7,
    },
    lastUpdate: "2024-01-15 14:30:00",
    resources: {
      cpu: 45,
      memory: 68,
      storage: 23,
    },
  },
  {
    id: "llm-001",
    name: "GPT-4 Conversacional",
    type: "llm",
    status: "active",
    version: "v4.0",
    model: "gpt-4-turbo",
    performance: {
      accuracy: 96.2,
      speed: 1.8,
      uptime: 99.9,
      requests: 892,
    },
    config: {
      temperature: 0.7,
      maxTokens: 2048,
      topP: 0.9,
      frequencyPenalty: 0.1,
      presencePenalty: 0.1,
      systemPrompt: "Eres un asistente terapéutico especializado en TEA...",
    },
    lastUpdate: "2024-01-15 14:25:00",
    resources: {
      cpu: 72,
      memory: 84,
      storage: 15,
    },
  },
  {
    id: "tts-001",
    name: "Azure TTS Español",
    type: "tts",
    status: "active",
    version: "v2.1",
    model: "neural-voice-es",
    language: "es-ES",
    performance: {
      accuracy: 92.8,
      speed: 0.9,
      uptime: 99.5,
      requests: 1156,
    },
    config: {
      voice: "es-ES-AlvaroNeural",
      speed: 1.0,
      pitch: 0,
      volume: 0.8,
      ssmlEnabled: true,
      emotionTone: "friendly",
    },
    lastUpdate: "2024-01-15 14:20:00",
    resources: {
      cpu: 38,
      memory: 52,
      storage: 31,
    },
  },
  {
    id: "stt-002",
    name: "Whisper STT Backup",
    type: "stt",
    status: "inactive",
    version: "v2.8",
    model: "whisper-medium",
    language: "es-ES",
    performance: {
      accuracy: 91.2,
      speed: 1.5,
      uptime: 98.2,
      requests: 0,
    },
    config: {
      sampleRate: 16000,
      channels: 1,
      format: "wav",
      noiseReduction: false,
      adaptiveThreshold: 0.6,
    },
    lastUpdate: "2024-01-14 09:15:00",
    resources: {
      cpu: 0,
      memory: 12,
      storage: 18,
    },
  },
]

export function AdminPanel() {
  const [agents, setAgents] = useState<Agent[]>(mockAgents)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [systemMetrics, setSystemMetrics] = useState({
    totalRequests: 3295,
    averageLatency: 1.3,
    errorRate: 0.2,
    activeConnections: 24,
    pipelineHealth: 98.7,
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "inactive":
        return <XCircle className="h-4 w-4 text-gray-400" />
      case "error":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "maintenance":
        return <Settings className="h-4 w-4 text-yellow-500" />
      default:
        return <XCircle className="h-4 w-4 text-gray-400" />
    }
  }

  const getAgentIcon = (type: string) => {
    switch (type) {
      case "stt":
        return <Mic className="h-5 w-5" />
      case "llm":
        return <Brain className="h-5 w-5" />
      case "tts":
        return <Volume2 className="h-5 w-5" />
      default:
        return <Server className="h-5 w-5" />
    }
  }

  const toggleAgentStatus = (agentId: string) => {
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: agent.status === "active" ? "inactive" : "active" } : agent,
      ),
    )
  }

  const restartAgent = (agentId: string) => {
    setAgents(
      agents.map((agent) =>
        agent.id === agentId ? { ...agent, status: "maintenance", lastUpdate: new Date().toISOString() } : agent,
      ),
    )

    // Simulate restart process
    setTimeout(() => {
      setAgents(agents.map((agent) => (agent.id === agentId ? { ...agent, status: "active" } : agent)))
    }, 3000)
  }

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Monitor className="h-5 w-5" />
            <span>Panel de Administración del Pipeline</span>
          </CardTitle>
          <CardDescription>Gestión y monitoreo de agentes STT, LLM y TTS del orquestador Unity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{systemMetrics.totalRequests}</div>
              <div className="text-sm text-muted-foreground">Requests Totales</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-accent">{systemMetrics.averageLatency}s</div>
              <div className="text-sm text-muted-foreground">Latencia Promedio</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-secondary">{systemMetrics.errorRate}%</div>
              <div className="text-sm text-muted-foreground">Tasa de Error</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{systemMetrics.activeConnections}</div>
              <div className="text-sm text-muted-foreground">Conexiones Activas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{systemMetrics.pipelineHealth}%</div>
              <div className="text-sm text-muted-foreground">Salud del Pipeline</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Agents Management */}
      <Tabs defaultValue="agents" className="space-y-4">
        <TabsList>
          <TabsTrigger value="agents">Gestión de Agentes</TabsTrigger>
          <TabsTrigger value="pipeline">Pipeline Monitor</TabsTrigger>
          <TabsTrigger value="config">Configuración</TabsTrigger>
        </TabsList>

        <TabsContent value="agents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Agentes del Sistema</h3>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Agente
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {agents.map((agent) => (
              <Card key={agent.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="p-2 rounded-lg bg-muted">{getAgentIcon(agent.type)}</div>
                      <div>
                        <h4 className="font-semibold text-lg">{agent.name}</h4>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {agent.type.toUpperCase()}
                          </Badge>
                          <span>•</span>
                          <span>{agent.version}</span>
                          {agent.model && (
                            <>
                              <span>•</span>
                              <span>{agent.model}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(agent.status)}
                          <span className="text-sm font-medium capitalize">{agent.status}</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Uptime: {agent.performance.uptime}%</div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={agent.status === "active"}
                          onCheckedChange={() => toggleAgentStatus(agent.id)}
                        />
                        <Button variant="outline" size="sm" onClick={() => restartAgent(agent.id)}>
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedAgent(agent)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Configuración de {agent.name}</DialogTitle>
                              <DialogDescription>Ajusta los parámetros y configuración del agente</DialogDescription>
                            </DialogHeader>
                            {selectedAgent && (
                              <div className="space-y-6">
                                {/* Performance Metrics */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Métricas de Rendimiento</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="text-sm text-muted-foreground">Precisión</div>
                                        <div className="text-lg font-semibold">
                                          {selectedAgent.performance.accuracy}%
                                        </div>
                                        <Progress value={selectedAgent.performance.accuracy} className="mt-1" />
                                      </div>
                                      <div>
                                        <div className="text-sm text-muted-foreground">Velocidad</div>
                                        <div className="text-lg font-semibold">{selectedAgent.performance.speed}s</div>
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <div className="text-sm text-muted-foreground">Requests</div>
                                        <div className="text-lg font-semibold">
                                          {selectedAgent.performance.requests}
                                        </div>
                                      </div>
                                      <div>
                                        <div className="text-sm text-muted-foreground">Uptime</div>
                                        <div className="text-lg font-semibold">{selectedAgent.performance.uptime}%</div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Resource Usage */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Uso de Recursos</CardTitle>
                                  </CardHeader>
                                  <CardContent className="space-y-4">
                                    <div className="space-y-3">
                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <Cpu className="h-4 w-4" />
                                          <span className="text-sm">CPU</span>
                                        </div>
                                        <span className="text-sm font-medium">{selectedAgent.resources.cpu}%</span>
                                      </div>
                                      <Progress value={selectedAgent.resources.cpu} />

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <Zap className="h-4 w-4" />
                                          <span className="text-sm">Memoria</span>
                                        </div>
                                        <span className="text-sm font-medium">{selectedAgent.resources.memory}%</span>
                                      </div>
                                      <Progress value={selectedAgent.resources.memory} />

                                      <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-2">
                                          <HardDrive className="h-4 w-4" />
                                          <span className="text-sm">Almacenamiento</span>
                                        </div>
                                        <span className="text-sm font-medium">{selectedAgent.resources.storage}%</span>
                                      </div>
                                      <Progress value={selectedAgent.resources.storage} />
                                    </div>
                                  </CardContent>
                                </Card>

                                {/* Configuration */}
                                <Card>
                                  <CardHeader>
                                    <CardTitle className="text-sm">Configuración</CardTitle>
                                  </CardHeader>
                                  <CardContent>
                                    <div className="space-y-3">
                                      {Object.entries(selectedAgent.config).map(([key, value]) => (
                                        <div key={key} className="flex items-center justify-between">
                                          <span className="text-sm text-muted-foreground capitalize">
                                            {key.replace(/([A-Z])/g, " $1").trim()}
                                          </span>
                                          <Input
                                            value={typeof value === "object" ? JSON.stringify(value) : String(value)}
                                            className="w-48 text-sm"
                                            readOnly
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </CardContent>
                                </Card>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Precisión: </span>
                        <span className="font-medium">{agent.performance.accuracy}%</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Velocidad: </span>
                        <span className="font-medium">{agent.performance.speed}s</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Requests: </span>
                        <span className="font-medium">{agent.performance.requests}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="pipeline" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monitor del Pipeline Unity → STT → LLM → TTS</CardTitle>
              <CardDescription>Flujo de procesamiento en tiempo real de las conversaciones</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Pipeline Flow Visualization */}
                <div className="flex items-center justify-between p-4 bg-muted/20 rounded-lg">
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-2 mx-auto w-fit">
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-sm font-medium">Unity Game</div>
                    <div className="text-xs text-muted-foreground">Audio Input</div>
                  </div>
                  <div className="flex-1 h-px bg-border mx-4"></div>
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-accent/10 mb-2 mx-auto w-fit">
                      <Mic className="h-6 w-6 text-accent" />
                    </div>
                    <div className="text-sm font-medium">STT</div>
                    <div className="text-xs text-muted-foreground">Speech to Text</div>
                  </div>
                  <div className="flex-1 h-px bg-border mx-4"></div>
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-secondary/10 mb-2 mx-auto w-fit">
                      <Brain className="h-6 w-6 text-secondary" />
                    </div>
                    <div className="text-sm font-medium">LLM</div>
                    <div className="text-xs text-muted-foreground">Language Model</div>
                  </div>
                  <div className="flex-1 h-px bg-border mx-4"></div>
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-green-500/10 mb-2 mx-auto w-fit">
                      <Volume2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="text-sm font-medium">TTS</div>
                    <div className="text-xs text-muted-foreground">Text to Speech</div>
                  </div>
                  <div className="flex-1 h-px bg-border mx-4"></div>
                  <div className="text-center">
                    <div className="p-3 rounded-full bg-primary/10 mb-2 mx-auto w-fit">
                      <Server className="h-6 w-6 text-primary" />
                    </div>
                    <div className="text-sm font-medium">Unity Game</div>
                    <div className="text-xs text-muted-foreground">Audio Output</div>
                  </div>
                </div>

                {/* Real-time Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Activity className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Pipeline Activo</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">24</div>
                      <div className="text-xs text-muted-foreground">Sesiones concurrentes</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <Wifi className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">Latencia Total</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">2.1s</div>
                      <div className="text-xs text-muted-foreground">Promedio end-to-end</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">Tasa de Éxito</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">98.7%</div>
                      <div className="text-xs text-muted-foreground">Últimas 24h</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-2">
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm font-medium">Errores</span>
                      </div>
                      <div className="text-2xl font-bold mt-2">3</div>
                      <div className="text-xs text-muted-foreground">Última hora</div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="config" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Configuración Global del Sistema</CardTitle>
              <CardDescription>Ajustes generales del orquestador y pipeline de procesamiento</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Configuración del Orquestador</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Timeout de Pipeline (segundos)</label>
                        <Input type="number" defaultValue="30" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Máximo de Sesiones Concurrentes</label>
                        <Input type="number" defaultValue="50" className="mt-1" />
                      </div>
                      <div>
                        <label className="text-sm font-medium">Reintentos en Caso de Error</label>
                        <Input type="number" defaultValue="3" className="mt-1" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Configuración de Audio</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm font-medium">Calidad de Audio</label>
                        <Select defaultValue="high">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="low">Baja (8kHz)</SelectItem>
                            <SelectItem value="medium">Media (16kHz)</SelectItem>
                            <SelectItem value="high">Alta (44kHz)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="text-sm font-medium">Formato de Audio</label>
                        <Select defaultValue="wav">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="wav">WAV</SelectItem>
                            <SelectItem value="mp3">MP3</SelectItem>
                            <SelectItem value="ogg">OGG</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch id="noise-reduction" />
                        <label htmlFor="noise-reduction" className="text-sm font-medium">
                          Reducción de Ruido
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline">Cancelar</Button>
                  <Button>Guardar Configuración</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
