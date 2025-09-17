"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, Activity, Brain, MessageSquare, Timer, CheckCircle, MessageCircle } from "lucide-react"

// Datos simulados para las métricas
const progressData = [
  { date: "2024-01-01", comunicacion: 65, social: 45, cognitivo: 70, emocional: 55 },
  { date: "2024-01-08", comunicacion: 68, social: 48, cognitivo: 72, emocional: 58 },
  { date: "2024-01-15", comunicacion: 72, social: 52, cognitivo: 75, emocional: 62 },
  { date: "2024-01-22", comunicacion: 75, social: 55, cognitivo: 78, emocional: 65 },
  { date: "2024-01-29", comunicacion: 78, social: 58, cognitivo: 80, emocional: 68 },
  { date: "2024-02-05", comunicacion: 82, social: 62, cognitivo: 83, emocional: 72 },
  { date: "2024-02-12", comunicacion: 85, social: 65, cognitivo: 85, emocional: 75 },
]

const sessionData = [
  { mes: "Ene", sesiones: 24, completadas: 22, exitosas: 20 },
  { mes: "Feb", sesiones: 28, completadas: 26, exitosas: 24 },
  { mes: "Mar", sesiones: 32, completadas: 30, exitosas: 28 },
  { mes: "Abr", sesiones: 30, completadas: 28, exitosas: 26 },
  { mes: "May", sesiones: 35, completadas: 33, exitosas: 31 },
  { mes: "Jun", sesiones: 38, completadas: 36, exitosas: 34 },
]

const teaLevelData = [
  { nivel: "Nivel 1 (Leve)", pacientes: 45, color: "#06b6d4" },
  { nivel: "Nivel 2 (Moderado)", pacientes: 32, color: "#3b82f6" },
  { nivel: "Nivel 3 (Severo)", pacientes: 18, color: "#1e40af" },
]

const ageGroupData = [
  { grupo: "3-6 años", pacientes: 28 },
  { grupo: "7-12 años", pacientes: 42 },
  { grupo: "13-17 años", pacientes: 25 },
]

const teaIndicatorsData = [
  {
    date: "2024-01-01",
    tasaIniciacion: 15.2,
    latenciaRespuesta: 2800,
    turnTaking: 68,
    respuestasAcertadas: 72,
    srs2Change: -8.5,
  },
  {
    date: "2024-01-08",
    tasaIniciacion: 18.7,
    latenciaRespuesta: 2650,
    turnTaking: 71,
    respuestasAcertadas: 75,
    srs2Change: -12.3,
  },
  {
    date: "2024-01-15",
    tasaIniciacion: 22.1,
    latenciaRespuesta: 2400,
    turnTaking: 74,
    respuestasAcertadas: 78,
    srs2Change: -15.8,
  },
  {
    date: "2024-01-22",
    tasaIniciacion: 25.8,
    latenciaRespuesta: 2200,
    turnTaking: 77,
    respuestasAcertadas: 81,
    srs2Change: -18.2,
  },
  {
    date: "2024-01-29",
    tasaIniciacion: 28.3,
    latenciaRespuesta: 2050,
    turnTaking: 80,
    respuestasAcertadas: 84,
    srs2Change: -21.7,
  },
  {
    date: "2024-02-05",
    tasaIniciacion: 31.5,
    latenciaRespuesta: 1900,
    turnTaking: 83,
    respuestasAcertadas: 87,
    srs2Change: -24.1,
  },
  {
    date: "2024-02-12",
    tasaIniciacion: 34.2,
    latenciaRespuesta: 1750,
    turnTaking: 85,
    respuestasAcertadas: 89,
    srs2Change: -26.8,
  },
]

const sessionConversationData = [
  { mes: "Ene", iniciosEspontaneos: 45, turnosExitosos: 312, respuestasAcertadas: 278 },
  { mes: "Feb", iniciosEspontaneos: 52, turnosExitosos: 348, respuestasAcertadas: 301 },
  { mes: "Mar", iniciosEspontaneos: 61, turnosExitosos: 389, respuestasAcertadas: 334 },
  { mes: "Abr", iniciosEspontaneos: 58, turnosExitosos: 367, respuestasAcertadas: 318 },
  { mes: "May", iniciosEspontaneos: 67, turnosExitosos: 412, respuestasAcertadas: 356 },
  { mes: "Jun", iniciosEspontaneos: 73, turnosExitosos: 445, respuestasAcertadas: 389 },
]

export default function MetricsDashboard() {
  const [selectedPatient, setSelectedPatient] = useState("all")
  const [timeRange, setTimeRange] = useState("6m")
  const [metrics, setMetrics] = useState({
    totalSessions: 0,
    avgProgress: 0,
    activePatients: 0,
    completionRate: 0,
    tasaIniciacion: 0,
    latenciaPromedio: 0,
    turnTakingExito: 0,
    respuestasAcertadas: 0,
    cambioSRS2: 0,
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      const latestData = teaIndicatorsData[teaIndicatorsData.length - 1]
      setMetrics({
        totalSessions: 234,
        avgProgress: 73,
        activePatients: 95,
        completionRate: 89,
        tasaIniciacion: latestData.tasaIniciacion,
        latenciaPromedio: latestData.latenciaRespuesta,
        turnTakingExito: latestData.turnTaking,
        respuestasAcertadas: latestData.respuestasAcertadas,
        cambioSRS2: Math.abs(latestData.srs2Change),
      })
    }, 1000)

    return () => clearTimeout(timer)
  }, [selectedPatient, timeRange])

  return (
    <div className="space-y-6">
      {/* Controles de filtrado */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground">Métricas de Competencia Socio-Comunicativa</h2>
          <p className="text-muted-foreground">Indicadores específicos para evaluación de progreso en TEA</p>
        </div>
        <div className="flex gap-3">
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Seleccionar paciente" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los pacientes</SelectItem>
              <SelectItem value="patient1">Ana García (7 años)</SelectItem>
              <SelectItem value="patient2">Carlos López (12 años)</SelectItem>
              <SelectItem value="patient3">María Rodríguez (9 años)</SelectItem>
            </SelectContent>
          </Select>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">1 mes</SelectItem>
              <SelectItem value="3m">3 meses</SelectItem>
              <SelectItem value="6m">6 meses</SelectItem>
              <SelectItem value="1y">1 año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tasa de Iniciación</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.tasaIniciacion.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Inicios espontáneos / sesiones</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +3.2% vs semana anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Latencia Respuesta</CardTitle>
            <Timer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(metrics.latenciaPromedio / 1000).toFixed(1)}s</div>
            <div className="text-xs text-muted-foreground">Tiempo promedio de respuesta</div>
            <div className="flex items-center text-xs text-emerald-600 mt-1">
              <TrendingUp className="h-3 w-3 mr-1 rotate-180" />
              -150ms vs semana anterior
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turn-Taking Exitoso</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.turnTakingExito}%</div>
            <Progress value={metrics.turnTakingExito} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">Sin solapamientos ni silencios &gt;3s</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Respuestas Acertadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.respuestasAcertadas}%</div>
            <Progress value={metrics.respuestasAcertadas} className="mt-2" />
            <div className="text-xs text-muted-foreground mt-1">Cumplen meta social establecida</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Mejora SRS-2</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.cambioSRS2.toFixed(1)}%</div>
            <div className="text-xs text-muted-foreground">Cambio en Responsividad Social</div>
            <Badge variant="secondary" className="mt-1 text-xs">
              Mejora significativa
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Gráficas principales */}
      <Tabs defaultValue="tea-indicators" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="tea-indicators">Indicadores TEA</TabsTrigger>
          <TabsTrigger value="conversation">Conversación</TabsTrigger>
          <TabsTrigger value="progress">Progreso</TabsTrigger>
          <TabsTrigger value="sessions">Sesiones</TabsTrigger>
          <TabsTrigger value="demographics">Demografía</TabsTrigger>
        </TabsList>

        <TabsContent value="tea-indicators" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-primary" />
                  Evolución de Iniciación de Diálogo
                </CardTitle>
                <CardDescription>Tasa de inicios espontáneos por sesión a lo largo del tiempo</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={teaIndicatorsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Tasa de Iniciación"]} />
                    <Line
                      type="monotone"
                      dataKey="tasaIniciacion"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="h-5 w-5 text-primary" />
                  Reducción de Latencia de Respuesta
                </CardTitle>
                <CardDescription>
                  Tiempo promedio entre estímulo del avatar y primera palabra del usuario
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={teaIndicatorsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}ms`, "Latencia"]} />
                    <Area type="monotone" dataKey="latenciaRespuesta" stroke="#f59e0b" fill="#fef3c7" strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Índice Turn-Taking
                </CardTitle>
                <CardDescription>Porcentaje de turnos exitosos sin solapamientos</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={teaIndicatorsData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Turn-Taking Exitoso"]} />
                    <Line type="monotone" dataKey="turnTaking" stroke="#10b981" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Respuestas Acertadas
                </CardTitle>
                <CardDescription>Porcentaje que cumple meta social</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={teaIndicatorsData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value}%`, "Respuestas Acertadas"]} />
                    <Line type="monotone" dataKey="respuestasAcertadas" stroke="#8b5cf6" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  Cambio SRS-2
                </CardTitle>
                <CardDescription>Mejora en Responsividad Social</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={teaIndicatorsData}>
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${Math.abs(value)}%`, "Mejora SRS-2"]} />
                    <Bar dataKey="srs2Change" fill="#ef4444" transform="scale(1,-1)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Análisis Conversacional Mensual
              </CardTitle>
              <CardDescription>Métricas de interacción y comunicación por mes</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sessionConversationData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="iniciosEspontaneos" fill="#06b6d4" name="Inicios Espontáneos" />
                  <Bar dataKey="turnosExitosos" fill="#10b981" name="Turnos Exitosos" />
                  <Bar dataKey="respuestasAcertadas" fill="#8b5cf6" name="Respuestas Acertadas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Progreso por Área Terapéutica
              </CardTitle>
              <CardDescription>Evolución del progreso en diferentes áreas cognitivas y sociales</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={progressData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="comunicacion" stroke="#06b6d4" strokeWidth={2} name="Comunicación" />
                  <Line type="monotone" dataKey="social" stroke="#3b82f6" strokeWidth={2} name="Habilidades Sociales" />
                  <Line
                    type="monotone"
                    dataKey="cognitivo"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    name="Desarrollo Cognitivo"
                  />
                  <Line
                    type="monotone"
                    dataKey="emocional"
                    stroke="#f59e0b"
                    strokeWidth={2}
                    name="Regulación Emocional"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Análisis de Sesiones
              </CardTitle>
              <CardDescription>Comparación de sesiones programadas, completadas y exitosas</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={sessionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="sesiones" fill="#e2e8f0" name="Programadas" />
                  <Bar dataKey="completadas" fill="#06b6d4" name="Completadas" />
                  <Bar dataKey="exitosas" fill="#10b981" name="Exitosas" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="demographics" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Distribución por Nivel de TEA</CardTitle>
                <CardDescription>Clasificación según DSM-5</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={teaLevelData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="pacientes"
                      label={({ nivel, pacientes }) => `${pacientes}`}
                    >
                      {teaLevelData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-4 space-y-2">
                  {teaLevelData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.nivel}</span>
                      </div>
                      <Badge variant="secondary">{item.pacientes} pacientes</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Distribución por Edad</CardTitle>
                <CardDescription>Grupos etarios de pacientes</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={ageGroupData} layout="horizontal">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="grupo" type="category" width={80} />
                    <Tooltip />
                    <Bar dataKey="pacientes" fill="#06b6d4" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
