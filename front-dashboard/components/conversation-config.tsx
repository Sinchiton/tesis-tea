"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Settings,
  Save,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react"

interface PatientConfig {
  id: string
  name: string
  age: number
  teaLevel: string
  weeklyFrequency: number
  sessionDuration: number
  currentWeekSessions: number
  totalMinutesThisWeek: number
  adherenceRate: number
}

export function ConversationConfig() {
  const [selectedPatient, setSelectedPatient] = useState<string>("1")
  const [weeklyFrequency, setWeeklyFrequency] = useState(3)
  const [sessionDuration, setSessionDuration] = useState(15)

  // Datos simulados de pacientes
  const patients: PatientConfig[] = [
    {
      id: "1",
      name: "María S.",
      age: 8,
      teaLevel: "Moderado",
      weeklyFrequency: 3,
      sessionDuration: 15,
      currentWeekSessions: 2,
      totalMinutesThisWeek: 32,
      adherenceRate: 85,
    },
    {
      id: "2",
      name: "Carlos R.",
      age: 12,
      teaLevel: "Leve",
      weeklyFrequency: 4,
      sessionDuration: 20,
      currentWeekSessions: 3,
      totalMinutesThisWeek: 58,
      adherenceRate: 92,
    },
    {
      id: "3",
      name: "Ana L.",
      age: 6,
      teaLevel: "Severo",
      weeklyFrequency: 2,
      sessionDuration: 10,
      currentWeekSessions: 1,
      totalMinutesThisWeek: 12,
      adherenceRate: 67,
    },
  ]

  const currentPatient = patients.find((p) => p.id === selectedPatient) || patients[0]

  const handleSaveConfig = () => {
    console.log("[v0] Guardando configuración:", {
      patientId: selectedPatient,
      weeklyFrequency,
      sessionDuration,
    })
    // Aquí se enviaría la configuración al backend
  }

  const resetToDefaults = () => {
    setWeeklyFrequency(3)
    setSessionDuration(15)
  }

  const getAdherenceColor = (rate: number) => {
    if (rate >= 80) return "text-green-600"
    if (rate >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getAdherenceIcon = (rate: number) => {
    if (rate >= 80) return <CheckCircle className="h-4 w-4 text-green-600" />
    if (rate >= 60) return <AlertTriangle className="h-4 w-4 text-yellow-600" />
    return <AlertTriangle className="h-4 w-4 text-red-600" />
  }

  return (
    <div className="space-y-6">
      {/* Selector de Paciente */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Configuración de Conversaciones
          </CardTitle>
          <CardDescription>
            Personaliza la frecuencia y duración de las sesiones terapéuticas para cada paciente
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="patient-select">Seleccionar Paciente</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{patient.name}</span>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant="outline" className="text-xs">
                          {patient.age} años
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          TEA {patient.teaLevel}
                        </Badge>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuración */}
        <Card>
          <CardHeader>
            <CardTitle>Parámetros de Sesión</CardTitle>
            <CardDescription>Ajusta la frecuencia y duración para {currentPatient.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="frequency">Frecuencia Semanal</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="frequency"
                  type="number"
                  min="1"
                  max="7"
                  value={weeklyFrequency}
                  onChange={(e) => setWeeklyFrequency(Number.parseInt(e.target.value) || 3)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">sesiones por semana</span>
              </div>
              <p className="text-xs text-muted-foreground">Recomendado: 2-4 sesiones según el nivel de TEA</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duración por Sesión</Label>
              <div className="flex items-center space-x-4">
                <Input
                  id="duration"
                  type="number"
                  min="5"
                  max="60"
                  value={sessionDuration}
                  onChange={(e) => setSessionDuration(Number.parseInt(e.target.value) || 15)}
                  className="w-20"
                />
                <span className="text-sm text-muted-foreground">minutos</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Recomendado: 10-25 minutos según edad y capacidad de atención
              </p>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Tiempo total semanal</p>
                <p className="text-lg font-bold text-primary">{weeklyFrequency * sessionDuration} minutos</p>
              </div>
              <div className="text-right space-y-1">
                <p className="text-sm text-muted-foreground">Configuración actual</p>
                <Badge variant="outline">
                  {currentPatient.weeklyFrequency}x {currentPatient.sessionDuration}min
                </Badge>
              </div>
            </div>

            <div className="flex space-x-2">
              <Button onClick={handleSaveConfig} className="flex-1">
                <Save className="h-4 w-4 mr-2" />
                Guardar Configuración
              </Button>
              <Button variant="outline" onClick={resetToDefaults}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Restablecer
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progreso Actual */}
        <Card>
          <CardHeader>
            <CardTitle>Progreso de la Semana</CardTitle>
            <CardDescription>Estado actual de {currentPatient.name} esta semana</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Sesiones Completadas</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">
                    {currentPatient.currentWeekSessions}/{currentPatient.weeklyFrequency}
                  </span>
                </div>
              </div>
              <Progress
                value={(currentPatient.currentWeekSessions / currentPatient.weeklyFrequency) * 100}
                className="h-2"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tiempo Acumulado</span>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold">{currentPatient.totalMinutesThisWeek} min</span>
                </div>
              </div>
              <Progress
                value={
                  (currentPatient.totalMinutesThisWeek /
                    (currentPatient.weeklyFrequency * currentPatient.sessionDuration)) *
                  100
                }
                className="h-2"
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Adherencia al Tratamiento</span>
                </div>
                <div className="flex items-center gap-2">
                  {getAdherenceIcon(currentPatient.adherenceRate)}
                  <span className={`text-lg font-bold ${getAdherenceColor(currentPatient.adherenceRate)}`}>
                    {currentPatient.adherenceRate}%
                  </span>
                </div>
              </div>
              <Progress value={currentPatient.adherenceRate} className="h-2" />
            </div>

            <Separator />

            <div className="bg-muted/30 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium">Recomendaciones</span>
              </div>
              <div className="text-sm text-muted-foreground space-y-1">
                {currentPatient.adherenceRate >= 80 ? (
                  <p>✅ Excelente adherencia. Mantener rutina actual.</p>
                ) : currentPatient.adherenceRate >= 60 ? (
                  <p>⚠️ Adherencia moderada. Considerar ajustar horarios.</p>
                ) : (
                  <p>🔴 Baja adherencia. Revisar barreras y motivación.</p>
                )}
                {currentPatient.currentWeekSessions < currentPatient.weeklyFrequency && (
                  <p>
                    📅 Faltan {currentPatient.weeklyFrequency - currentPatient.currentWeekSessions} sesiones esta
                    semana.
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
