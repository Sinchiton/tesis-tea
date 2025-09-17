"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EditChildDialog } from "@/components/edit-child-dialog"
import { EditUserDialog } from "@/components/edit-user-dialog"
import {
  TrendingUp,
  Users,
  Settings,
  Bell,
  Plus,
  Gamepad2,
  Shield,
  Calendar,
  Target,
  Heart,
  Play,
  Edit3,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function ChildrenSelectionPage() {
  const router = useRouter()
  const [selectedChildren, setSelectedChildren] = useState<number[]>([])
  const [gamePreview, setGamePreview] = useState<{ show: boolean; child: any }>({ show: false, child: null })
  const [editChild, setEditChild] = useState<{ show: boolean; child: any }>({ show: false, child: null })
  const [editUser, setEditUser] = useState<{ show: boolean; user: any }>({ show: false, user: null })

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
      personality:
        "Maestra Paciente - Educativa, comprensiva y estructurada. Utiliza un lenguaje simple y claro, con refuerzo positivo constante.",
      lastConfig: "Configurado hace 3 días",
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
      personality:
        "Compañero Amigable - Casual, empático y motivador. Usa ejemplos de la vida cotidiana y humor apropiado.",
      lastConfig: "Configurado hace 1 semana",
    },
    {
      id: 3,
      name: "María Fernández",
      age: 9,
      teaLevel: "Nivel 1",
      avatar: "/ni-a-9-a-os.jpg",
      scenario: "Parque",
      lastSession: "Hace 3 horas",
      weeklyProgress: 91,
      sessionsThisWeek: 4,
      targetSessions: 3,
      totalSessions: 32,
      favoriteActivity: "Expresión Emocional",
      currentGoal: "Mantener turn-taking",
      nextSession: "Mañana 2:00 PM",
      status: "completed",
      personality:
        "Guía Aventurera - Entusiasta, paciente y alentadora. Fomenta la exploración y la expresión creativa.",
      lastConfig: "Configurado hace 2 días",
    },
    {
      id: 4,
      name: "Diego Morales",
      age: 15,
      teaLevel: "Nivel 2",
      avatar: "/adolescente-15-a-os.jpg",
      scenario: "Biblioteca",
      lastSession: "Hace 5 días",
      weeklyProgress: 45,
      sessionsThisWeek: 1,
      targetSessions: 3,
      totalSessions: 8,
      favoriteActivity: "Debate Estructurado",
      currentGoal: "Aumentar participación",
      nextSession: "Pendiente",
      status: "attention",
      personality: "Mentor Académico - Formal pero accesible, intelectualmente estimulante y respetuoso.",
      lastConfig: "Configurado hace 2 semanas",
    },
  ]

  const handleChildSelect = (childId: number) => {
    router.push(`/child-dashboard/${childId}`)
  }

  const handleMultiSelect = (childId: number) => {
    setSelectedChildren((prev) => (prev.includes(childId) ? prev.filter((id) => id !== childId) : [...prev, childId]))
  }

  const handleAdminPanel = () => {
    if (selectedChildren.length > 0) {
      router.push(`/admin-dashboard?children=${selectedChildren.join(",")}`)
    } else {
      router.push("/admin-dashboard")
    }
  }

  const handlePlayClick = (e: React.MouseEvent, child: any) => {
    e.stopPropagation()
    setGamePreview({ show: true, child })
  }

  const handleStartGame = () => {
    // This would integrate with Unity to start the game
    console.log("[v0] Starting game for child:", gamePreview.child?.name)
    setGamePreview({ show: false, child: null })
    // Here you would call Unity integration to start the game
  }

  const handleEditBeforePlay = () => {
    setGamePreview({ show: false, child: null })
    router.push(`/child-dashboard/${gamePreview.child?.id}?tab=scenario`)
  }

  const handleEditChild = (e: React.MouseEvent, child: any) => {
    e.stopPropagation()
    setEditChild({ show: true, child })
  }

  const handleEditUser = () => {
    const currentUser = {
      name: "Dr. Carmen López",
      email: "carmen.lopez@hospital.com",
      phone: "+593 99 123 4567",
      role: "therapist",
      specialization: "Terapia TEA",
      institution: "Hospital Metropolitano",
      experience: "8 años",
      avatar: "/professional-caregiver.jpg",
    }
    setEditUser({ show: true, user: currentUser })
  }

  const handleSaveChild = (updatedChild: any) => {
    console.log("[v0] Saving child data:", updatedChild)
    // Here you would update the child data in your backend/state
  }

  const handleSaveUser = (updatedUser: any) => {
    console.log("[v0] Saving user data:", updatedUser)
    // Here you would update the user data in your backend/state
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "completed":
        return "bg-blue-500"
      case "pending":
        return "bg-yellow-500"
      case "attention":
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Sesión Activa"
      case "completed":
        return "Objetivos Cumplidos"
      case "pending":
        return "Sesión Pendiente"
      case "attention":
        return "Requiere Atención"
      default:
        return "Estado Desconocido"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-4">
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
            <h1 className="text-xl font-semibold text-foreground">Selección de Pacientes</h1>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleAdminPanel}
              className="bg-primary/10 border-primary/20 hover:bg-primary/20"
            >
              <Shield className="h-4 w-4 mr-2" />
              Panel de Admin
              {selectedChildren.length > 0 && (
                <Badge variant="secondary" className="ml-2">
                  {selectedChildren.length}
                </Badge>
              )}
            </Button>
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
            <div
              className="flex items-center space-x-2 cursor-pointer hover:bg-muted/50 rounded-lg p-2 transition-colors"
              onClick={handleEditUser}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src="/professional-caregiver.jpg" />
                <AvatarFallback>DC</AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-sm">
                <p className="font-medium">Dr. Carmen López</p>
                <p className="text-muted-foreground">Cuidador Principal</p>
              </div>
              <Edit3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </div>
      </header>

      <main className="p-6">
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pacientes</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{children.length}</div>
                <p className="text-xs text-muted-foreground">Bajo tu cuidado</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Sesiones Hoy</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {children.filter((child) => child.nextSession.includes("Hoy")).length}
                </div>
                <p className="text-xs text-muted-foreground">Programadas</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Progreso Promedio</CardTitle>
                <TrendingUp className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">
                  {Math.round(children.reduce((acc, child) => acc + child.weeklyProgress, 0) / children.length)}%
                </div>
                <p className="text-xs text-muted-foreground">Esta semana</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Requieren Atención</CardTitle>
                <Heart className="h-4 w-4 text-destructive" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {
                    children.filter(
                      (child) => child.status === "attention" || child.sessionsThisWeek < child.targetSessions,
                    ).length
                  }
                </div>
                <p className="text-xs text-muted-foreground">Pacientes</p>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Target className="h-5 w-5 text-primary mt-0.5" />
                <div>
                  <p className="font-medium text-primary">Instrucciones</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    <strong>Clic simple:</strong> Acceder al dashboard individual del paciente.
                    <strong className="ml-4">Ctrl + Clic:</strong> Seleccionar múltiples pacientes para el panel de
                    administración.
                    <strong className="ml-4">Botón Jugar:</strong> Iniciar sesión de juego con preview de configuración.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Children Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {children.map((child) => (
              <Card
                key={child.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] ${
                  selectedChildren.includes(child.id) ? "ring-2 ring-primary bg-primary/5" : ""
                }`}
                onClick={(e) => {
                  if (e.ctrlKey || e.metaKey) {
                    handleMultiSelect(child.id)
                  } else {
                    handleChildSelect(child.id)
                  }
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={child.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {child.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-lg">{child.name}</CardTitle>
                        <CardDescription>
                          {child.age} años • {child.teaLevel}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className={`w-3 h-3 rounded-full ${getStatusColor(child.status)}`} />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleEditChild(e, child)}
                        className="h-8 w-8 p-0 hover:bg-muted"
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Status Badge */}
                  <Badge
                    variant={child.status === "attention" ? "destructive" : "secondary"}
                    className="w-full justify-center"
                  >
                    {getStatusText(child.status)}
                  </Badge>

                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progreso Semanal</span>
                      <span className="font-medium">{child.weeklyProgress}%</span>
                    </div>
                    <Progress value={child.weeklyProgress} className="h-2" />
                  </div>

                  {/* Sessions */}
                  <div className="flex justify-between items-center text-sm">
                    <span>Sesiones</span>
                    <span
                      className={`font-medium ${
                        child.sessionsThisWeek >= child.targetSessions ? "text-green-600" : "text-yellow-600"
                      }`}
                    >
                      {child.sessionsThisWeek}/{child.targetSessions} esta semana
                    </span>
                  </div>

                  {/* Current Info */}
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Escenario:</span>
                      <span className="font-medium">{child.scenario}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Objetivo:</span>
                      <span className="font-medium text-right max-w-[120px] truncate">{child.currentGoal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Próxima sesión:</span>
                      <span className="font-medium">{child.nextSession}</span>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="flex justify-between pt-2 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg font-bold text-primary">{child.totalSessions}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-accent">
                        {child.lastSession.includes("horas") ? child.lastSession.split(" ")[1] : "1+"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {child.lastSession.includes("horas") ? "horas" : "días"}
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={(e) => handlePlayClick(e, child)}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                    size="sm"
                  >
                    <Play className="h-4 w-4 mr-2" />
                    Jugar
                  </Button>
                </CardContent>
              </Card>
            ))}

            {/* Add New Child Card */}
            <Card className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-dashed border-2 border-muted-foreground/25 bg-muted/10">
              <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium text-foreground">Añadir Nuevo Paciente</p>
                  <p className="text-sm text-muted-foreground mt-1">Registra un nuevo niño en el sistema</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Dialog open={gamePreview.show} onOpenChange={(open) => setGamePreview({ show: open, child: null })}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5 text-green-600" />
              <span>Iniciar Sesión de Juego</span>
            </DialogTitle>
            <DialogDescription>Configuración actual para {gamePreview.child?.name}</DialogDescription>
          </DialogHeader>

          {gamePreview.child && (
            <div className="space-y-4">
              {/* Child Info */}
              <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={gamePreview.child.avatar || "/placeholder.svg"} />
                  <AvatarFallback>
                    {gamePreview.child.name
                      .split(" ")
                      .map((n: string) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{gamePreview.child.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {gamePreview.child.age} años • {gamePreview.child.teaLevel}
                  </p>
                </div>
              </div>

              {/* Current Configuration */}
              <div className="space-y-3">
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Escenario Actual</h4>
                    <Badge variant="outline">{gamePreview.child.scenario}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Entorno inmersivo configurado para práctica de habilidades socio-comunicativas
                  </p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Personalidad del Agente</h4>
                    <Badge variant="secondary" className="text-xs">
                      {gamePreview.child.lastConfig}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{gamePreview.child.personality}</p>
                </div>

                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-sm">Objetivo de la Sesión</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{gamePreview.child.currentGoal}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" onClick={handleEditBeforePlay} className="w-full sm:w-auto bg-transparent">
              <Edit3 className="h-4 w-4 mr-2" />
              Editar Antes de Iniciar
            </Button>
            <Button onClick={handleStartGame} className="w-full sm:w-auto bg-green-600 hover:bg-green-700">
              <Play className="h-4 w-4 mr-2" />
              Iniciar Juego
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EditChildDialog
        child={editChild.child}
        open={editChild.show}
        onOpenChange={(open) => setEditChild({ show: open, child: null })}
        onSave={handleSaveChild}
      />

      <EditUserDialog
        user={editUser.user}
        open={editUser.show}
        onOpenChange={(open) => setEditUser({ show: open, user: null })}
        onSave={handleSaveUser}
      />
    </div>
  )
}
