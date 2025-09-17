"use client"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { User, Calendar, Brain, Activity, Settings, AlertCircle } from "lucide-react"
import type { Patient } from "@/types/database"
import { getPatients } from "@/lib/api"

interface PatientCardsProps {
  onSelectPatient: (patient: Patient) => void
  selectedPatientId?: string
  caregiverId: string
}

export default function PatientCards({ onSelectPatient, selectedPatientId, caregiverId }: PatientCardsProps) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPatients = async () => {
      try {
        setLoading(true)
        const data = await getPatients(caregiverId)
        setPatients(data)
        setError(null)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error al cargar pacientes")
      } finally {
        setLoading(false)
      }
    }

    if (caregiverId) {
      loadPatients()
    }
  }, [caregiverId])

  const getTeaLevelColor = (level: string) => {
    switch (level) {
      case "Nivel 1":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Nivel 2":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Nivel 3":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "text-emerald-600"
    if (progress >= 60) return "text-amber-600"
    return "text-red-600"
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Pacientes Activos</h3>
          <Skeleton className="h-6 w-20" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-4 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Pacientes Activos</h3>
          <Badge variant="destructive">Error</Badge>
        </div>
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center text-muted-foreground">
              <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
              <h3 className="text-lg font-medium mb-2">Error al cargar pacientes</h3>
              <p className="text-sm">{error}</p>
              <Button variant="outline" className="mt-4 bg-transparent" onClick={() => window.location.reload()}>
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Pacientes Activos</h3>
        <Badge variant="secondary">{patients.length} pacientes</Badge>
      </div>

      {patients.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-48">
            <div className="text-center text-muted-foreground">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No hay pacientes registrados</h3>
              <p className="text-sm">Agrega tu primer paciente para comenzar</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {patients.map((patient) => (
            <Card
              key={patient.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedPatientId === patient.id ? "ring-2 ring-primary border-primary" : "hover:border-primary/50"
              }`}
              onClick={() => onSelectPatient(patient)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={patient.avatar || "/placeholder.svg"} alt={patient.name} />
                    <AvatarFallback>
                      <User className="h-6 w-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base truncate">{patient.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2 text-sm">
                      <Calendar className="h-3 w-3" />
                      {patient.age} años
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className={getTeaLevelColor(patient.teaLevel)}>{patient.teaLevel}</Badge>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Settings className="h-3 w-3" />
                  </Button>
                </div>

                <div className="space-y-2 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Brain className="h-3 w-3" />
                    <span className="truncate">{patient.scenario}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Activity className="h-3 w-3" />
                    <span className="truncate">{patient.agentPersonality}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progreso</span>
                    <span className={`font-medium ${getProgressColor(patient.progress)}`}>{patient.progress}%</span>
                  </div>
                  <Progress value={patient.progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Esta semana</span>
                  <div className="flex items-center gap-1">
                    <span className="font-medium">{patient.completedSessions}</span>
                    <span className="text-muted-foreground">/ {patient.weeklyGoal}</span>
                  </div>
                </div>

                {patient.lastSession && (
                  <div className="text-xs text-muted-foreground">
                    Última sesión: {new Date(patient.lastSession).toLocaleDateString()}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
