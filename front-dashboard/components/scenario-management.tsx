"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Plus,
  Edit,
  Trash2,
  School,
  Home,
  Hospital,
  Store,
  Play,
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
} from "lucide-react"

interface Scenario {
  id: number
  name: string
  description: string
  environment: string
  difficulty: "Básico" | "Intermedio" | "Avanzado"
  objectives: string[]
  createdAt: string
  usageCount: number
}

const mockScenarios: Scenario[] = [
  {
    id: 1,
    name: "Aula de Clases",
    description: "Entorno escolar para practicar interacciones con compañeros y maestros",
    environment: "school",
    difficulty: "Básico",
    objectives: ["Saludar al maestro", "Pedir ayuda", "Participar en clase"],
    createdAt: "2024-01-15",
    usageCount: 45,
  },
  {
    id: 2,
    name: "Casa Familiar",
    description: "Ambiente hogareño para conversaciones familiares cotidianas",
    environment: "home",
    difficulty: "Básico",
    objectives: ["Conversar en la mesa", "Pedir permisos", "Expresar necesidades"],
    createdAt: "2024-01-10",
    usageCount: 32,
  },
  {
    id: 3,
    name: "Consulta Médica",
    description: "Práctica de comunicación en entornos médicos",
    environment: "hospital",
    difficulty: "Intermedio",
    objectives: ["Describir síntomas", "Hacer preguntas", "Seguir instrucciones"],
    createdAt: "2024-01-08",
    usageCount: 18,
  },
]

const environmentIcons = {
  school: School,
  home: Home,
  hospital: Hospital,
  store: Store,
}

const mockPatients = [
  { id: "1", name: "Ana García", age: 7, level: "Nivel 1", scenario: "Aula de Clases" },
  { id: "2", name: "Carlos Mendoza", age: 12, level: "Nivel 2", scenario: "Casa Familiar" },
  { id: "3", name: "Sofia López", age: 9, level: "Nivel 1", scenario: "Consulta Médica" },
  { id: "4", name: "Diego Ruiz", age: 15, level: "Nivel 3", scenario: "Aula de Clases" },
]

export function ScenarioManagement() {
  const [scenarios, setScenarios] = useState<Scenario[]>(mockScenarios)
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSimulating, setIsSimulating] = useState(false)
  const [selectedPatientForTest, setSelectedPatientForTest] = useState<string>("")
  const [simulationMessages, setSimulationMessages] = useState<
    Array<{
      role: "user" | "agent"
      content: string
      timestamp: string
    }>
  >([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  const handleCreateScenario = () => {
    setSelectedScenario({
      id: 0,
      name: "",
      description: "",
      environment: "school",
      difficulty: "Básico",
      objectives: [],
      createdAt: new Date().toISOString().split("T")[0],
      usageCount: 0,
    })
    setIsEditing(true)
  }

  const handleSaveScenario = (scenario: Scenario) => {
    if (scenario.id === 0) {
      const newScenario = { ...scenario, id: Date.now() }
      setScenarios([...scenarios, newScenario])
    } else {
      setScenarios(scenarios.map((s) => (s.id === scenario.id ? scenario : s)))
    }
    setIsEditing(false)
    setSelectedScenario(null)
  }

  const handleDeleteScenario = (id: number) => {
    setScenarios(scenarios.filter((s) => s.id !== id))
  }

  const startSimulation = (scenario: Scenario) => {
    setSelectedScenario(scenario)
    setIsSimulating(true)
    setSimulationMessages([
      {
        role: "agent",
        content: `¡Hola! Bienvenido al escenario "${scenario.name}". Estoy aquí para ayudarte a practicar. ¿Cómo te sientes hoy?`,
        timestamp: new Date().toLocaleTimeString(),
      },
    ])
  }

  const sendMessage = () => {
    if (!currentMessage.trim()) return

    const newMessages = [
      ...simulationMessages,
      {
        role: "user" as const,
        content: currentMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]

    // Simular respuesta del agente
    setTimeout(() => {
      const agentResponse = {
        role: "agent" as const,
        content: `Entiendo que dices "${currentMessage}". Esa es una muy buena respuesta. ¿Puedes contarme más sobre eso?`,
        timestamp: new Date().toLocaleTimeString(),
      }
      setSimulationMessages([...newMessages, agentResponse])
    }, 1000)

    setSimulationMessages(newMessages)
    setCurrentMessage("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Gestión de Escenarios</h3>
          <p className="text-sm text-muted-foreground">Crear y administrar escenarios para las sesiones de terapia</p>
        </div>
        <Button onClick={handleCreateScenario}>
          <Plus className="h-4 w-4 mr-2" />
          Nuevo Escenario
        </Button>
      </div>

      {/* Scenarios Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((scenario) => {
          const IconComponent = environmentIcons[scenario.environment as keyof typeof environmentIcons]
          return (
            <Card key={scenario.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">{scenario.name}</CardTitle>
                  </div>
                  <Badge
                    variant={
                      scenario.difficulty === "Básico"
                        ? "default"
                        : scenario.difficulty === "Intermedio"
                          ? "secondary"
                          : "destructive"
                    }
                  >
                    {scenario.difficulty}
                  </Badge>
                </div>
                <CardDescription className="text-sm">{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Objetivos:</p>
                  <div className="flex flex-wrap gap-1">
                    {scenario.objectives.slice(0, 2).map((objective, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {objective}
                      </Badge>
                    ))}
                    {scenario.objectives.length > 2 && (
                      <Badge variant="outline" className="text-xs">
                        +{scenario.objectives.length - 2} más
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Usado {scenario.usageCount} veces</span>
                  <span>{scenario.createdAt}</span>
                </div>

                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 bg-transparent"
                    onClick={() => startSimulation(scenario)}
                  >
                    <Play className="h-3 w-3 mr-1" />
                    Simular
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelectedScenario(scenario)
                      setIsEditing(true)
                    }}
                  >
                    <Edit className="h-3 w-3" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteScenario(scenario.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Edit/Create Dialog */}
      <Dialog open={isEditing} onOpenChange={setIsEditing}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedScenario?.id === 0 ? "Crear Nuevo Escenario" : "Editar Escenario"}</DialogTitle>
            <DialogDescription>Configura los detalles del escenario para las sesiones de terapia</DialogDescription>
          </DialogHeader>

          {selectedScenario && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre del Escenario</Label>
                  <Input
                    id="name"
                    value={selectedScenario.name}
                    onChange={(e) =>
                      setSelectedScenario({
                        ...selectedScenario,
                        name: e.target.value,
                      })
                    }
                    placeholder="Ej: Aula de Clases"
                  />
                </div>
                <div>
                  <Label htmlFor="environment">Entorno</Label>
                  <Select
                    value={selectedScenario.environment}
                    onValueChange={(value) =>
                      setSelectedScenario({
                        ...selectedScenario,
                        environment: value,
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="school">Escuela</SelectItem>
                      <SelectItem value="home">Casa</SelectItem>
                      <SelectItem value="hospital">Hospital</SelectItem>
                      <SelectItem value="store">Tienda</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={selectedScenario.description}
                  onChange={(e) =>
                    setSelectedScenario({
                      ...selectedScenario,
                      description: e.target.value,
                    })
                  }
                  placeholder="Describe el propósito y contexto del escenario..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="difficulty">Nivel de Dificultad</Label>
                <Select
                  value={selectedScenario.difficulty}
                  onValueChange={(value: "Básico" | "Intermedio" | "Avanzado") =>
                    setSelectedScenario({
                      ...selectedScenario,
                      difficulty: value,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Básico">Básico</SelectItem>
                    <SelectItem value="Intermedio">Intermedio</SelectItem>
                    <SelectItem value="Avanzado">Avanzado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="objectives">Objetivos (uno por línea)</Label>
                <Textarea
                  id="objectives"
                  value={selectedScenario.objectives.join("\n")}
                  onChange={(e) =>
                    setSelectedScenario({
                      ...selectedScenario,
                      objectives: e.target.value.split("\n").filter((obj) => obj.trim()),
                    })
                  }
                  placeholder="Saludar al maestro\nPedir ayuda\nParticipar en clase"
                  rows={4}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancelar
                </Button>
                <Button onClick={() => handleSaveScenario(selectedScenario)}>
                  {selectedScenario.id === 0 ? "Crear" : "Guardar"} Escenario
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Simulation Dialog */}
      <Dialog open={isSimulating} onOpenChange={setIsSimulating}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Play className="h-5 w-5" />
              <span>Simulador de Conversación - {selectedScenario?.name}</span>
            </DialogTitle>
            <DialogDescription>Prueba la interacción con el agente en este escenario</DialogDescription>
          </DialogHeader>

          <div className="flex h-[600px] gap-4">
            {/* Chat Area */}
            <div className="flex-1 flex flex-col min-w-0">
              {/* Patient Selector */}
              <div className="mb-4 p-3 bg-muted rounded-lg flex-shrink-0">
                <Label className="text-sm font-medium">Usar configuración de paciente:</Label>
                <Select value={selectedPatientForTest} onValueChange={setSelectedPatientForTest}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar paciente o usar configuración temporal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="temp">Configuración temporal</SelectItem>
                    {mockPatients.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} ({patient.age} años, {patient.level})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedPatientForTest && selectedPatientForTest !== "temp" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Usando prompts y configuración personalizada de{" "}
                    {mockPatients.find((p) => p.id === selectedPatientForTest)?.name}
                  </p>
                )}
              </div>

              <ScrollArea className="flex-1 p-4 border rounded-lg">
                <div className="space-y-4">
                  {simulationMessages.map((message, index) => (
                    <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Input Area */}
              <div className="flex items-center space-x-2 mt-4 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsRecording(!isRecording)}
                  className={isRecording ? "bg-red-100 border-red-300" : ""}
                >
                  {isRecording ? <MicOff className="h-4 w-4 text-red-500" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Input
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  className="flex-1"
                />
                <Button onClick={sendMessage} disabled={!currentMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setIsMuted(!isMuted)}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Configuration Panel */}
            <div className="w-80 flex-shrink-0">
              <Tabs defaultValue="config" className="h-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="config">Config</TabsTrigger>
                  <TabsTrigger value="prompts">Prompts</TabsTrigger>
                  <TabsTrigger value="objectives">Objetivos</TabsTrigger>
                </TabsList>

                <ScrollArea className="h-[500px] mt-2">
                  <TabsContent value="config" className="space-y-4 pr-2">
                    <div>
                      <Label>Género del Hablante TTS</Label>
                      <Select defaultValue="female">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="female">Mujer</SelectItem>
                          <SelectItem value="male">Hombre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Velocidad de Habla</Label>
                      <Select defaultValue="normal">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="slow">Lenta</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="fast">Rápida</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Nivel de Paciencia</Label>
                      <Select defaultValue="high">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Baja</SelectItem>
                          <SelectItem value="medium">Media</SelectItem>
                          <SelectItem value="high">Alta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>

                  <TabsContent value="prompts" className="space-y-4 pr-2">
                    <div>
                      <Label>Prompt del Sistema</Label>
                      <Textarea
                        defaultValue="Eres un asistente terapéutico especializado en TEA. Sé paciente, comprensivo y usa un lenguaje claro y simple."
                        rows={4}
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <Label>Contexto del Escenario</Label>
                      <Textarea defaultValue={selectedScenario?.description || ""} rows={3} className="text-xs" />
                    </div>

                    <div>
                      <Label>Objetivos de la Sesión</Label>
                      <Textarea
                        defaultValue={selectedScenario?.objectives.join("\n") || ""}
                        rows={3}
                        className="text-xs"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="objectives" className="space-y-4 pr-2">
                    <div>
                      <Label>Objetivos de la Sesión</Label>
                      <Textarea
                        placeholder="Definir objetivos específicos para esta sesión..."
                        rows={4}
                        className="text-xs"
                      />
                    </div>

                    <div>
                      <Label>Métricas a Evaluar</Label>
                      <div className="space-y-2 mt-2">
                        {["Iniciación de diálogo", "Latencia de respuesta", "Turn-taking", "Respuestas acertadas"].map(
                          (metric) => (
                            <div key={metric} className="flex items-center space-x-2">
                              <input type="checkbox" id={metric} className="rounded" defaultChecked />
                              <Label htmlFor={metric} className="text-xs">
                                {metric}
                              </Label>
                            </div>
                          ),
                        )}
                      </div>
                    </div>

                    <div>
                      <Label>Duración Objetivo</Label>
                      <Select defaultValue="15">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="10">10 minutos</SelectItem>
                          <SelectItem value="15">15 minutos</SelectItem>
                          <SelectItem value="20">20 minutos</SelectItem>
                          <SelectItem value="30">30 minutos</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </ScrollArea>
              </Tabs>
            </div>
          </div>

          <div className="flex justify-end space-x-2 flex-shrink-0">
            <Button variant="outline" onClick={() => setIsSimulating(false)}>
              Cerrar Simulador
            </Button>
            <Button
              onClick={() => {
                setSimulationMessages([])
                setCurrentMessage("")
              }}
            >
              Reiniciar Conversación
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
