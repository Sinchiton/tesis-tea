"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AgentsModule } from "@/components/agents-module"
import { ConversationHistory } from "@/components/conversation-history"
import { AdminPanel } from "@/components/admin-panel"
import MetricsDashboard from "@/components/metrics-dashboard"
import { ScenarioManagement } from "@/components/scenario-management"
import {
  Brain,
  MessageSquare,
  TrendingUp,
  Users,
  Activity,
  Settings,
  Bell,
  ArrowLeft,
  Shield,
  Filter,
  Download,
  Gamepad2,
  AlertCircle,
  CheckCircle,
  School,
} from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AdminDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedChildren, setSelectedChildren] = useState<number[]>([])

  useEffect(() => {
    const childrenParam = searchParams.get("children")
    if (childrenParam) {
      setSelectedChildren(childrenParam.split(",").map((id) => Number.parseInt(id)))
    }
  }, [searchParams])

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
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-primary" />
              <h1 className="text-xl font-semibold text-foreground">Panel de Administración</h1>
              {selectedChildren.length > 0 && (
                <Badge variant="secondary">
                  {selectedChildren.length} paciente{selectedChildren.length > 1 ? "s" : ""} seleccionado
                  {selectedChildren.length > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exportar Todo
              </Button>
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtros Avanzados
              </Button>
            </div>
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <div className="absolute -top-1 -right-1 h-3 w-3 bg-destructive rounded-full flex items-center justify-center">
                <span className="text-xs text-destructive-foreground font-bold">3</span>
              </div>
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
              Vista Global
            </Button>
            <Button
              variant={activeTab === "agents" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("agents")}
            >
              <Brain className="h-4 w-4 mr-2" />
              Gestión de Agentes
            </Button>
            <Button
              variant={activeTab === "conversations" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("conversations")}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Todas las Conversaciones
            </Button>
            <Button
              variant={activeTab === "metrics" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("metrics")}
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Métricas Comparativas
            </Button>
            <Button
              variant={activeTab === "system" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("system")}
            >
              <Shield className="h-4 w-4 mr-2" />
              Sistema y Pipeline
            </Button>
            <Button
              variant={activeTab === "scenarios" ? "secondary" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("scenarios")}
            >
              <School className="h-4 w-4 mr-2" />
              Gestión de Escenarios
            </Button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {activeTab === "overview" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Vista Global del Sistema</h2>
                  <p className="text-muted-foreground">
                    {selectedChildren.length > 0
                      ? `Mostrando datos de ${selectedChildren.length} paciente${selectedChildren.length > 1 ? "s" : ""} seleccionado${selectedChildren.length > 1 ? "s" : ""}`
                      : "Resumen completo de todos los pacientes y agentes"}
                  </p>
                </div>
              </div>

              {/* Global Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Pacientes Activos</CardTitle>
                    <Users className="h-4 w-4 text-primary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-primary">
                      {selectedChildren.length > 0 ? selectedChildren.length : 4}
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {selectedChildren.length > 0 ? "Seleccionados" : "Total en sistema"}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Agentes Operativos</CardTitle>
                    <Brain className="h-4 w-4 text-accent" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-accent">8</div>
                    <p className="text-xs text-muted-foreground">STT: 3 • LLM: 3 • TTS: 2</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Sesiones Hoy</CardTitle>
                    <Activity className="h-4 w-4 text-secondary" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-secondary">23</div>
                    <p className="text-xs text-muted-foreground">+15% vs ayer</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Rendimiento Global</CardTitle>
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-green-500">94%</div>
                    <Progress value={94} className="mt-2" />
                  </CardContent>
                </Card>
              </div>

              {/* System Status */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Sistema</CardTitle>
                  <CardDescription>Pipeline Unity → STT → LLM → TTS en tiempo real</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-950/20 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                        <div>
                          <p className="font-medium">STT Pipeline</p>
                          <p className="text-sm text-muted-foreground">3 agentes activos</p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-green-500">
                        98%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-blue-500" />
                        <div>
                          <p className="font-medium">LLM Pipeline</p>
                          <p className="text-sm text-muted-foreground">3 agentes activos</p>
                        </div>
                      </div>
                      <Badge variant="default" className="bg-blue-500">
                        96%
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
                      <div className="flex items-center space-x-3">
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                        <div>
                          <p className="font-medium">TTS Pipeline</p>
                          <p className="text-sm text-muted-foreground">2 agentes, 1 alerta</p>
                        </div>
                      </div>
                      <Badge variant="secondary" className="bg-yellow-500 text-white">
                        87%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "agents" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Gestión de Agentes</h2>
                  <p className="text-muted-foreground">Control completo del pipeline STT → LLM → TTS</p>
                </div>
              </div>
              <AgentsModule />
            </div>
          )}

          {activeTab === "conversations" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Todas las Conversaciones</h2>
                  <p className="text-muted-foreground">
                    {selectedChildren.length > 0
                      ? `Conversaciones de pacientes seleccionados`
                      : "Registro completo de todas las sesiones del sistema"}
                  </p>
                </div>
              </div>
              <ConversationHistory
                adminView={true}
                selectedPatients={selectedChildren.length > 0 ? selectedChildren : undefined}
              />
            </div>
          )}

          {activeTab === "metrics" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Métricas Comparativas</h2>
                  <p className="text-muted-foreground">
                    {selectedChildren.length > 0
                      ? `Análisis comparativo de ${selectedChildren.length} paciente${selectedChildren.length > 1 ? "s" : ""}`
                      : "Análisis global de todos los pacientes"}
                  </p>
                </div>
              </div>
              <MetricsDashboard
                adminView={true}
                selectedPatients={selectedChildren.length > 0 ? selectedChildren : undefined}
              />
            </div>
          )}

          {activeTab === "system" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Sistema y Pipeline</h2>
                  <p className="text-muted-foreground">Configuración y monitoreo del pipeline completo</p>
                </div>
              </div>
              <AdminPanel />
            </div>
          )}

          {activeTab === "scenarios" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">Gestión de Escenarios</h2>
                  <p className="text-muted-foreground">Crear y administrar escenarios para las sesiones de terapia</p>
                </div>
              </div>
              <ScenarioManagement />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
