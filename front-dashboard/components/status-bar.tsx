"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Brain, MapPin, Calendar, Wifi, WifiOff, Clock, Play } from "lucide-react"

interface StatusBarProps {
  selectedPatient?: {
    name: string
    age: number
    level: number
  }
  selectedAgent?: string
  selectedScenario?: string
  nextSession?: string
  connectionStatus: "connected" | "disconnected" | "connecting"
  onStartSession?: () => void
}

export function StatusBar({
  selectedPatient,
  selectedAgent,
  selectedScenario,
  nextSession,
  connectionStatus,
  onStartSession,
}: StatusBarProps) {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {/* Paciente Seleccionado */}
            {selectedPatient && (
              <>
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{selectedPatient.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {selectedPatient.age} años · Nivel {selectedPatient.level}
                  </Badge>
                </div>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}

            {/* Agente */}
            {selectedAgent && (
              <>
                <div className="flex items-center space-x-2">
                  <Brain className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedAgent}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}

            {/* Escenario */}
            {selectedScenario && (
              <>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{selectedScenario}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
              </>
            )}

            {/* Próxima Sesión */}
            {nextSession && (
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{nextSession}</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {/* Estado de Conexión */}
            <div className="flex items-center space-x-2">
              {connectionStatus === "connected" ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-green-600">Unity Conectado</span>
                </>
              ) : connectionStatus === "connecting" ? (
                <>
                  <Clock className="h-4 w-4 text-yellow-500 animate-spin" />
                  <span className="text-sm text-yellow-600">Conectando...</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-sm text-red-600">Desconectado</span>
                </>
              )}
            </div>

            {/* Botón Iniciar Sesión */}
            {selectedPatient && selectedAgent && selectedScenario && onStartSession && (
              <Button size="sm" onClick={onStartSession} disabled={connectionStatus !== "connected"}>
                <Play className="h-4 w-4 mr-2" />
                Iniciar Sesión
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
