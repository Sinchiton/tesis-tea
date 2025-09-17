"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Calendar, Clock, Target, Plus, Edit, Trash2, CheckCircle } from "lucide-react"

interface SessionCalendarProps {
  patientId: string
  patientName: string
}

interface ScheduledSession {
  id: string
  day: string
  time: string
  duration: number
  objective: string
  scenario: string
  status: "scheduled" | "completed" | "missed"
  date: string
}

export function SessionCalendar({ patientId, patientName }: SessionCalendarProps) {
  const [sessions, setSessions] = useState<ScheduledSession[]>([
    {
      id: "1",
      day: "Lunes",
      time: "15:00",
      duration: 15,
      objective: "Mejorar iniciación de diálogo",
      scenario: "Aula Escolar",
      status: "completed",
      date: "2024-01-15",
    },
    {
      id: "2",
      day: "Miércoles",
      time: "16:30",
      duration: 20,
      objective: "Practicar conversación social",
      scenario: "Cafetería",
      status: "scheduled",
      date: "2024-01-17",
    },
    {
      id: "3",
      day: "Viernes",
      time: "14:00",
      duration: 15,
      objective: "Reducir latencia de respuesta",
      scenario: "Parque",
      status: "scheduled",
      date: "2024-01-19",
    },
  ])

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSession, setEditingSession] = useState<ScheduledSession | null>(null)
  const [formData, setFormData] = useState({
    day: "",
    time: "",
    duration: 15,
    objective: "",
    scenario: "Aula Escolar",
  })

  const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"]
  const scenarios = ["Aula Escolar", "Cafetería", "Parque", "Casa", "Biblioteca", "Tienda"]

  const handleSaveSession = () => {
    if (editingSession) {
      setSessions(
        sessions.map((s) =>
          s.id === editingSession.id ? { ...s, ...formData, date: new Date().toISOString().split("T")[0] } : s,
        ),
      )
    } else {
      const newSession: ScheduledSession = {
        id: Date.now().toString(),
        ...formData,
        status: "scheduled",
        date: new Date().toISOString().split("T")[0],
      }
      setSessions([...sessions, newSession])
    }

    setIsDialogOpen(false)
    setEditingSession(null)
    setFormData({ day: "", time: "", duration: 15, objective: "", scenario: "Aula Escolar" })
  }

  const handleEditSession = (session: ScheduledSession) => {
    setEditingSession(session)
    setFormData({
      day: session.day,
      time: session.time,
      duration: session.duration,
      objective: session.objective,
      scenario: session.scenario,
    })
    setIsDialogOpen(true)
  }

  const handleDeleteSession = (sessionId: string) => {
    setSessions(sessions.filter((s) => s.id !== sessionId))
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "scheduled":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "missed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      case "scheduled":
        return <Clock className="h-4 w-4" />
      case "missed":
        return <Target className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header with Add Button */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Calendario de Sesiones</h3>
          <p className="text-sm text-muted-foreground">
            Programa días, horarios y objetivos específicos para {patientName}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditingSession(null)
                setFormData({ day: "", time: "", duration: 15, objective: "", scenario: "Aula Escolar" })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Nueva Sesión
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{editingSession ? "Editar Sesión" : "Programar Nueva Sesión"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="day">Día de la Semana</Label>
                  <Select value={formData.day} onValueChange={(value) => setFormData({ ...formData, day: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar día" />
                    </SelectTrigger>
                    <SelectContent>
                      {days.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="time">Hora</Label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="duration">Duración (minutos)</Label>
                  <Select
                    value={formData.duration.toString()}
                    onValueChange={(value) => setFormData({ ...formData, duration: Number.parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 minutos</SelectItem>
                      <SelectItem value="15">15 minutos</SelectItem>
                      <SelectItem value="20">20 minutos</SelectItem>
                      <SelectItem value="30">30 minutos</SelectItem>
                      <SelectItem value="45">45 minutos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="scenario">Escenario</Label>
                  <Select
                    value={formData.scenario}
                    onValueChange={(value) => setFormData({ ...formData, scenario: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {scenarios.map((scenario) => (
                        <SelectItem key={scenario} value={scenario}>
                          {scenario}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="objective">Objetivo de la Sesión</Label>
                <Textarea
                  placeholder="Describe el objetivo específico para esta sesión..."
                  value={formData.objective}
                  onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleSaveSession}>{editingSession ? "Actualizar" : "Programar"}</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Weekly Schedule */}
      <div className="grid gap-4">
        {days.map((day) => {
          const daySessions = sessions.filter((s) => s.day === day)
          return (
            <Card key={day} className="border-l-4 border-l-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-medium flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span>{day}</span>
                  {daySessions.length > 0 && (
                    <Badge variant="secondary" className="ml-auto">
                      {daySessions.length} sesión{daySessions.length > 1 ? "es" : ""}
                    </Badge>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {daySessions.length === 0 ? (
                  <p className="text-sm text-muted-foreground italic">No hay sesiones programadas</p>
                ) : (
                  <div className="space-y-3">
                    {daySessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(session.status)}`}
                          >
                            {getStatusIcon(session.status)}
                            <span className="ml-1">
                              {session.status === "completed"
                                ? "Completada"
                                : session.status === "scheduled"
                                  ? "Programada"
                                  : "Perdida"}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2 text-sm font-medium">
                              <Clock className="h-3 w-3" />
                              <span>{session.time}</span>
                              <span className="text-muted-foreground">({session.duration} min)</span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              <span className="font-medium">{session.scenario}</span> • {session.objective}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEditSession(session)}>
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDeleteSession(session.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-primary" />
              <div>
                <p className="text-sm font-medium">Sesiones Semanales</p>
                <p className="text-2xl font-bold text-primary">{sessions.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <div>
                <p className="text-sm font-medium">Completadas</p>
                <p className="text-2xl font-bold text-green-600">
                  {sessions.filter((s) => s.status === "completed").length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <div>
                <p className="text-sm font-medium">Tiempo Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  {sessions.reduce((total, s) => total + s.duration, 0)} min
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
