"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { School, Home, Coffee, TreePine, Store, Brain, Save, RotateCcw } from "lucide-react"

interface ScenarioConfigProps {
  patientName: string
  patientAge: number
  teaLevel: string
  onSave: (config: ScenarioConfig) => void
}

interface ScenarioConfig {
  scenario: string
  conversationStyle: string
  difficultyLevel: number
  topics: string[]
  responseTime: number
  encouragementLevel: string
  customInstructions: string
}

const scenarios = [
  {
    id: "classroom",
    name: "Aula de Clases",
    icon: School,
    description: "Ambiente escolar con interacciones educativas",
    defaultPersonality:
      "Eres una maestra especializada en TEA, muy paciente y comprensiva. Hablas de forma clara y simple, usando frases cortas. Siempre refuerzas positivamente los logros del niño y adaptas tu velocidad de habla según sus necesidades.",
  },
  {
    id: "home",
    name: "Casa Familiar",
    icon: Home,
    description: "Entorno doméstico con situaciones cotidianas",
    defaultPersonality:
      "Eres un familiar cariñoso y comprensivo. Usas un lenguaje familiar y cercano, creando un ambiente seguro y acogedor. Te enfocas en actividades cotidianas del hogar y fomentas la independencia.",
  },
  {
    id: "playground",
    name: "Parque Infantil",
    icon: TreePine,
    description: "Espacio de juego y socialización",
    defaultPersonality:
      "Eres un compañero de juegos entusiasta y paciente. Fomentas la diversión y la socialización a través del juego. Usas un lenguaje dinámico pero claro, y celebras cada pequeño logro social.",
  },
  {
    id: "cafeteria",
    name: "Cafetería Escolar",
    icon: Coffee,
    description: "Comedor con interacciones sociales",
    defaultPersonality:
      "Eres un supervisor de cafetería amigable y organizado. Ayudas con las rutinas de comida y fomentas las interacciones sociales durante el almuerzo. Usas un tono cálido y estructurado.",
  },
  {
    id: "store",
    name: "Tienda",
    icon: Store,
    description: "Situaciones de compra y transacciones",
    defaultPersonality:
      "Eres un vendedor paciente y servicial. Ayudas con las transacciones de compra de manera clara y estructurada. Fomentas la independencia en las compras y usas un lenguaje comercial simple.",
  },
]

export default function ScenarioConfig({ patientName, patientAge, teaLevel, onSave }: ScenarioConfigProps) {
  const [config, setConfig] = useState<ScenarioConfig>({
    scenario: "classroom",
    conversationStyle: "structured",
    difficultyLevel: 3,
    topics: ["saludos", "emociones", "actividades"],
    responseTime: 3000,
    encouragementLevel: "medium",
    customInstructions: scenarios[0].defaultPersonality,
  })

  const handleScenarioChange = (scenarioId: string) => {
    const selectedScenario = scenarios.find((s) => s.id === scenarioId)
    setConfig({
      ...config,
      scenario: scenarioId,
      customInstructions: selectedScenario?.defaultPersonality || "",
    })
  }

  const handleSave = () => {
    onSave(config)
  }

  const handleReset = () => {
    const defaultScenario = scenarios[0]
    setConfig({
      scenario: "classroom",
      conversationStyle: "structured",
      difficultyLevel: 3,
      topics: ["saludos", "emociones", "actividades"],
      responseTime: 3000,
      encouragementLevel: "medium",
      customInstructions: defaultScenario.defaultPersonality,
    })
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Configuración de Escenario y Agente
        </CardTitle>
        <CardDescription>
          Personaliza el entorno y la personalidad del agente conversacional para {patientName} ({patientAge} años,{" "}
          {teaLevel})
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="scenario" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scenario">Escenario</TabsTrigger>
            <TabsTrigger value="conversation">Conversación</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          <TabsContent value="scenario" className="space-y-4">
            <div className="space-y-4">
              <Label className="text-base font-medium">Seleccionar Escenario</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {scenarios.map((scenario) => {
                  const Icon = scenario.icon
                  return (
                    <Card
                      key={scenario.id}
                      className={`cursor-pointer transition-all ${
                        config.scenario === scenario.id
                          ? "ring-2 ring-primary border-primary"
                          : "hover:border-primary/50"
                      }`}
                      onClick={() => handleScenarioChange(scenario.id)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <Icon className="h-8 w-8 text-primary" />
                          <div>
                            <h4 className="font-medium">{scenario.name}</h4>
                            <p className="text-xs text-muted-foreground">{scenario.description}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Personalidad por Defecto del Escenario</h4>
                <p className="text-sm text-muted-foreground">
                  {scenarios.find((s) => s.id === config.scenario)?.defaultPersonality}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Puedes personalizar esta configuración en la pestaña "Avanzado"
                </p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="conversation" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="style">Estilo de Conversación</Label>
                  <Select
                    value={config.conversationStyle}
                    onValueChange={(value) => setConfig({ ...config, conversationStyle: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="structured">Estructurada</SelectItem>
                      <SelectItem value="flexible">Flexible</SelectItem>
                      <SelectItem value="guided">Guiada</SelectItem>
                      <SelectItem value="free">Libre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="difficulty">Nivel de Dificultad: {config.difficultyLevel}</Label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={config.difficultyLevel}
                    onChange={(e) => setConfig({ ...config, difficultyLevel: Number.parseInt(e.target.value) })}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>Básico</span>
                    <span>Intermedio</span>
                    <span>Avanzado</span>
                  </div>
                </div>

                <div>
                  <Label htmlFor="encouragement">Nivel de Refuerzo</Label>
                  <Select
                    value={config.encouragementLevel}
                    onValueChange={(value) => setConfig({ ...config, encouragementLevel: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Bajo</SelectItem>
                      <SelectItem value="medium">Medio</SelectItem>
                      <SelectItem value="high">Alto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Temas de Conversación</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["saludos", "emociones", "actividades", "familia", "comida", "juegos", "escuela", "animales"].map(
                      (topic) => (
                        <Badge
                          key={topic}
                          variant={config.topics.includes(topic) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => {
                            const newTopics = config.topics.includes(topic)
                              ? config.topics.filter((t) => t !== topic)
                              : [...config.topics, topic]
                            setConfig({ ...config, topics: newTopics })
                          }}
                        >
                          {topic}
                        </Badge>
                      ),
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="responseTime">Tiempo de Respuesta (ms)</Label>
                  <Input
                    type="number"
                    value={config.responseTime}
                    onChange={(e) => setConfig({ ...config, responseTime: Number.parseInt(e.target.value) })}
                    min="1000"
                    max="10000"
                    step="500"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Tiempo que espera el agente antes de responder</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="advanced" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="instructions" className="text-base font-medium">
                  Personalidad Personalizada del Agente
                </Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Define la personalidad específica del agente a través de instrucciones detalladas del prompt. La
                  personalidad se guarda automáticamente por escenario.
                </p>
                <Textarea
                  id="instructions"
                  placeholder="Personaliza las instrucciones del agente para este escenario específico..."
                  value={config.customInstructions}
                  onChange={(e) => setConfig({ ...config, customInstructions: e.target.value })}
                  rows={8}
                  className="min-h-[200px]"
                />
                <div className="mt-2 space-y-2">
                  <p className="text-xs text-muted-foreground">
                    <strong>Sugerencias para el prompt:</strong>
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 ml-4">
                    <li>• Define el rol específico del agente según el escenario</li>
                    <li>• Especifica el tono de voz y estilo de comunicación</li>
                    <li>• Incluye estrategias específicas para TEA</li>
                    <li>• Menciona cómo manejar situaciones difíciles</li>
                    <li>• Define el nivel de refuerzo positivo</li>
                    <li>• Adapta el lenguaje según la edad del paciente</li>
                  </ul>
                </div>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="font-medium text-sm mb-2">Vista Previa de Configuración</h4>
                <div className="space-y-2 text-xs">
                  <p>
                    <strong>Escenario:</strong> {scenarios.find((s) => s.id === config.scenario)?.name}
                  </p>
                  <p>
                    <strong>Estilo:</strong> {config.conversationStyle}
                  </p>
                  <p>
                    <strong>Nivel:</strong> {config.difficultyLevel}/5
                  </p>
                  <p>
                    <strong>Temas:</strong> {config.topics.join(", ")}
                  </p>
                  <p>
                    <strong>Personalización:</strong> {config.customInstructions.length} caracteres configurados
                  </p>
                  <p className="text-muted-foreground">
                    <strong>Nota:</strong> Esta configuración se guardará específicamente para el escenario "
                    {scenarios.find((s) => s.id === config.scenario)?.name}"
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={handleReset} className="flex items-center gap-2 bg-transparent">
            <RotateCcw className="h-4 w-4" />
            Restablecer
          </Button>
          <Button onClick={handleSave} className="flex items-center gap-2">
            <Save className="h-4 w-4" />
            Guardar Configuración
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
