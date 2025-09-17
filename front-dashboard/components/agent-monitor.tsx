"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Brain,
  Heart,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Pause,
  Play,
  RotateCcw,
  Settings,
  MessageSquare,
  Minus,
} from "lucide-react"

interface AgentData {
  id: number
  name: string
  type: "communication" | "emotional" | "social"
  status: "active" | "inactive" | "warning" | "error"
  performance: number
  activeSessions: number
  totalSessions: number
  avgSessionTime: number
  successRate: number
  lastActive: string
  currentPatients: string[]
  issues: string[]
  responseTime: number
  memoryUsage: number
  cpuUsage: number
}

const initialAgentData: AgentData[] = [
  {
    id: 1,
    name: "Agente Comunicación",
    type: "communication",
    status: "active",
    performance: 94,
    activeSessions: 3,
    totalSessions: 127,
    avgSessionTime: 18,
    successRate: 89,
    lastActive: "Activo ahora",
    currentPatients: ["María S.", "Carlos R.", "Diego M."],
    issues: [],
    responseTime: 1.2,
    memoryUsage: 45,
    cpuUsage: 23,
  },
  {
    id: 2,
    name: "Agente Emocional",
    type: "emotional",
    status: "active",
    performance: 87,
    activeSessions: 2,
    totalSessions: 89,
    avgSessionTime: 22,
    successRate: 82,
    lastActive: "hace 2 min",
    currentPatients: ["Ana L.", "Sofia P."],
    issues: ["Respuesta lenta en reconocimiento emocional"],
    responseTime: 2.1,
    memoryUsage: 52,
    cpuUsage: 31,
  },
  {
    id: 3,
    name: "Agente Social",
    type: "social",
    status: "warning",
    performance: 72,
    activeSessions: 1,
    totalSessions: 45,
    avgSessionTime: 15,
    successRate: 68,
    lastActive: "hace 15 min",
    currentPatients: ["Luis M."],
    issues: ["Rendimiento bajo en interacciones grupales", "Necesita actualización de protocolo"],
    responseTime: 3.5,
    memoryUsage: 68,
    cpuUsage: 45,
  },
]

export function AgentMonitor() {
  const [agents, setAgents] = useState<AgentData[]>(initialAgentData)
  const [selectedAgent, setSelectedAgent] = useState<AgentData | null>(null)

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((prevAgents) =>
        prevAgents.map((agent) => ({
          ...agent,
          performance: Math.max(60, Math.min(100, agent.performance + (Math.random() - 0.5) * 2)),
          responseTime: Math.max(0.5, agent.responseTime + (Math.random() - 0.5) * 0.3),
          memoryUsage: Math.max(20, Math.min(80, agent.memoryUsage + (Math.random() - 0.5) * 5)),
          cpuUsage: Math.max(10, Math.min(60, agent.cpuUsage + (Math.random() - 0.5) * 8)),
        })),
      )
    }, 3000)

    return () => clearInterval(interval)
  }, [])

  const getAgentIcon = (type: string) => {
    switch (type) {
      case "communication":
        return <MessageSquare className="h-5 w-5" />
      case "emotional":
        return <Heart className="h-5 w-5" />
      case "social":
        return <Users className="h-5 w-5" />
      default:
        return <Brain className="h-5 w-5" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "warning":
        return "bg-yellow-500"
      case "error":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case "error":
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <Minus className="h-4 w-4 text-gray-400" />
    }
  }

  const handleAgentAction = (agentId: number, action: string) => {
    setAgents((prevAgents) =>
      prevAgents.map((agent) => {
        if (agent.id === agentId) {
          switch (action) {
            case "pause":
              return { ...agent, status: "inactive" as const }
            case "resume":
              return { ...agent, status: "active" as const }
            case "restart":
              return { ...agent, status: "active" as const, performance: 95, issues: [] }
            default:
              return agent
          }
        }
        return agent
      }),
    )
  }

  return (
    <div className="space-y-6">
      {/* Agent Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <Card
            key={agent.id}
            className={`cursor-pointer transition-all hover:shadow-lg ${
              selectedAgent?.id === agent.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => setSelectedAgent(agent)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-full bg-primary/10`}>{getAgentIcon(agent.type)}</div>
                  <div>
                    <CardTitle className="text-lg">{agent.name}</CardTitle>
                    <CardDescription className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${getStatusColor(agent.status)}`} />
                      <span>{agent.lastActive}</span>
                    </CardDescription>
                  </div>
                </div>
                {getStatusIcon(agent.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Performance Metrics */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Rendimiento</span>
                  <span className="font-medium">{agent.performance.toFixed(1)}%</span>
                </div>
                <Progress value={agent.performance} className="h-2" />
              </div>

              {/* Key Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Sesiones activas</p>
                  <p className="font-semibold text-lg">{agent.activeSessions}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tasa de éxito</p>
                  <p className="font-semibold text-lg">{agent.successRate}%</p>
                </div>
              </div>

              {/* Issues */}
              {agent.issues.length > 0 && (
                <div className="space-y-1">
                  <p className="text-sm font-medium text-destructive">Alertas:</p>
                  {agent.issues.slice(0, 2).map((issue, index) => (
                    <p key={index} className="text-xs text-muted-foreground">
                      • {issue}
                    </p>
                  ))}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-2 pt-2">
                {agent.status === "active" ? (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAgentAction(agent.id, "pause")
                    }}
                  >
                    <Pause className="h-3 w-3 mr-1" />
                    Pausar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAgentAction(agent.id, "resume")
                    }}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Reanudar
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleAgentAction(agent.id, "restart")
                  }}
                >
                  <RotateCcw className="h-3 w-3 mr-1" />
                  Reiniciar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Agent View */}
      {selectedAgent && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-full bg-primary/10">{getAgentIcon(selectedAgent.type)}</div>
                <div>
                  <CardTitle className="text-xl">{selectedAgent.name}</CardTitle>
                  <CardDescription>Monitoreo detallado en tiempo real</CardDescription>
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Performance Metrics */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Métricas de Rendimiento</h3>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Rendimiento General</span>
                      <span className="font-medium">{selectedAgent.performance.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedAgent.performance} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uso de Memoria</span>
                      <span className="font-medium">{selectedAgent.memoryUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedAgent.memoryUsage} className="h-2" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Uso de CPU</span>
                      <span className="font-medium">{selectedAgent.cpuUsage.toFixed(1)}%</span>
                    </div>
                    <Progress value={selectedAgent.cpuUsage} className="h-2" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-primary">{selectedAgent.responseTime.toFixed(1)}s</p>
                    <p className="text-sm text-muted-foreground">Tiempo de respuesta</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-accent">{selectedAgent.avgSessionTime}min</p>
                    <p className="text-sm text-muted-foreground">Duración promedio</p>
                  </div>
                </div>
              </div>

              {/* Session Information */}
              <div className="space-y-4">
                <h3 className="font-semibold text-lg">Información de Sesiones</h3>

                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold text-secondary">{selectedAgent.activeSessions}</p>
                    <p className="text-sm text-muted-foreground">Sesiones activas</p>
                  </div>
                  <div className="text-center p-3 bg-muted/30 rounded-lg">
                    <p className="text-2xl font-bold">{selectedAgent.totalSessions}</p>
                    <p className="text-sm text-muted-foreground">Total sesiones</p>
                  </div>
                </div>

                {/* Current Patients */}
                <div>
                  <h4 className="font-medium mb-2">Pacientes Actuales</h4>
                  <div className="space-y-2">
                    {selectedAgent.currentPatients.map((patient, index) => (
                      <div key={index} className="flex items-center space-x-3 p-2 bg-muted/20 rounded">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs">
                            {patient
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{patient}</p>
                          <p className="text-xs text-muted-foreground">Sesión en progreso</p>
                        </div>
                        <div className="ml-auto">
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Issues */}
                {selectedAgent.issues.length > 0 && (
                  <div>
                    <h4 className="font-medium mb-2 text-destructive">Alertas Activas</h4>
                    <div className="space-y-2">
                      {selectedAgent.issues.map((issue, index) => (
                        <div key={index} className="flex items-start space-x-2 p-2 bg-destructive/10 rounded">
                          <AlertTriangle className="h-4 w-4 text-destructive mt-0.5" />
                          <p className="text-sm">{issue}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
