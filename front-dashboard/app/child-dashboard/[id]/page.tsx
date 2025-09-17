"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { ConversationHistory } from "@/components/conversation-history"
import MetricsDashboard from "@/components/metrics-dashboard"
import ScenarioConfig from "@/components/scenario-config"
import { SessionCalendar } from "@/components/session-calendar"
import {
  Brain,
  MessageSquare,
  TrendingUp,
  Activity,
  Clock,
  Settings,
  Bell,
  ArrowLeft,
  Gamepad2,
  Target,
  Calendar,
  Heart,
} from "lucide-react"
import { useRouter, useParams } from "next/navigation"

export default function ChildDashboardPage() {
  const router = useRouter()
  const params = useParams()
  const childId = params.id as string
  const [activeTab, setActiveTab] = useState("overview")
  const [childData, setChildData] = useState<any>(null)

  // Mock data - in real app, fetch based on childId
  useEffect(() => {
    const children = [
      {
        id: 1,
        name: "Ana García",
        age: 7,
        teaLevel: "Nivel 1",
        avatar: "/ni-a-7-a-os.jpg",
        scenario: "Aula Escolar",
        lastSession: "Hace 2 horas",
        weeklyProgress: 85,
        sessionsThisWeek: 3,
        targetSessions: 3,
        totalSessions: 24,
        favoriteActivity: "Conversación Social",
        currentGoal: "Mejorar iniciación de diálogo",
        nextSession: "Hoy 3:00 PM",
        status: "active",
      },
      {
        id: 2,
        name: "Carlos Rodríguez",
        age: 12,
        teaLevel: "Nivel 2",
        avatar: "/ni-o-12-a-os.jpg",
        scenario: "Cafetería",
        lastSession: "Hace 1 día",
        weeklyProgress: 72,
        sessionsThisWeek: 2,
        targetSessions: 4,
        totalSessions: 18,
        favoriteActivity: "Juego de Roles",
        currentGoal: "Reducir latencia de respuesta",
        nextSession: "Mañana 10:00 AM",
        status: "pending",
      },
      // Add more children data...
    ]

    const child = children.find((c) => c.id === Number.parseInt(childId))
    setChildData(child)
  }, [childId])

  if (!childData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-muted-foreground">Cargando datos del paciente...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => router.push("/children")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver a Pacientes
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push("/game")}
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium"
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              Volver al Juego
            </Button>
            <div className="h-6 w-px bg-border" />
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={childData.avatar || "/placeholder.svg"} />
                <AvatarFallback>
                  {childData.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-xl font-semibold text-foreground">{childData.name}</h1>
                <p className="text-sm text-muted-foreground">
                  {childData.age} años • {childData.teaLevel}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Badge variant={childData.status === "active" ? "default" : "secondary"}>
              {childData.status === "active" ? "Sesión Activa" : "Inactivo"}
            </Badge>
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-sidebar border-r border-sidebar-border min-h-[calc(100vh-73px)]">
          <nav className="p-4 space-y-2">
            <Button
              variant={activeTab === "overview" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("overview")}
            >
              <Activity className="h-4 w-4 mr-2" />
              Resumen Personal
            </Button>
            <Button
              variant={activeTab === "metrics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("metrics")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Métricas TEA
            </Button>
            <Button
              variant={activeTab === "conversations" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("conversations")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Historial Conversaciones
            </Button>
            <Button
              variant={activeTab === "scenario" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("scenario")}
            >
              <Brain className="h-4 w-4 mr-2" />
              Configurar Escenario
            </Button>
            <Button
              variant={activeTab === "sessions" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("sessions")}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Configurar Sesiones
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Resumen Personal - {childData.name}</h2>
                  <p className="text-muted-foreground">Estado actual y progreso individual</p>
                </div>
              </div>

              {/* Personal Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Progreso Semanal</CardTitle>
                    <TrendingUp className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">{childData.weeklyProgress}%</div>
                    <Progress value={childData.weeklyProgress} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sesiones Completadas</CardTitle>
                    <Calendar className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">
                      {childData.sessionsThisWeek}/{childData.targetSessions}
                    </div>
                    <p className="text-xs text-muted-foreground">Esta semana</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Sesiones</CardTitle>
                    <Activity className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-secondary">{childData.totalSessions}</div>
                    <p className="text-xs text-muted-foreground">Desde el inicio</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Próxima Sesión</CardTitle>
                    <Clock className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-lg font-bold">{childData.nextSession}</div>
                    <p className="text-xs text-muted-foreground">{childData.scenario}</p>
                  </CardContent>
                </Card>
              </div>

              {/* Current Status */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Target className="h-5 w-5 text-primary" />
                      <span>Objetivo Actual</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-lg font-medium mb-4">{childData.currentGoal}</p>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>Escenario de Práctica:</span>
                        <Badge variant="outline">{childData.scenario}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Actividad Favorita:</span>
                        <span className="font-medium">{childData.favoriteActivity}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Última Sesión:</span>
                        <span className="font-medium">{childData.lastSession}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Heart className="h-5 w-5 text-red-500" />
                      <span>Estado de Bienestar</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Nivel de Estrés</span>
                        <Badge variant="secondary">Bajo</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Participación</span>
                        <Badge variant="default">Alta</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Motivación</span>
                        <Badge variant="default">Excelente</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Adaptación</span>
                        <Badge variant="secondary">En Progreso</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === "metrics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Métricas TEA - {childData.name}</h2>
                  <p className="text-muted-foreground">Indicadores específicos de progreso socio-comunicativo</p>
                </div>
              </div>
              <MetricsDashboard patientId={childId} patientName={childData.name} />
            </div>
          )}

          {activeTab === "conversations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Historial - {childData.name}</h2>
                  <p className="text-muted-foreground">Registro completo de sesiones terapéuticas</p>
                </div>
              </div>
              <ConversationHistory patientId={childId} patientName={childData.name} />
            </div>
          )}

          {activeTab === "scenario" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Configuración de Escenario - {childData.name}</h2>
                  <p className="text-muted-foreground">Personaliza el entorno y agente conversacional</p>
                </div>
              </div>
              <ScenarioConfig
                patientName={childData.name}
                patientAge={childData.age}
                teaLevel={childData.teaLevel}
                onSave={(config) => console.log("[v0] Saving config for", childData.name, config)}
              />
            </div>
          )}

          {activeTab === "sessions" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Programación de Sesiones - {childData.name}</h2>
                  <p className="text-muted-foreground">Programa días, horarios y objetivos específicos</p>
                </div>
              </div>
              <SessionCalendar patientId={childId} patientName={childData.name} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
