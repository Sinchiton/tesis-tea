"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { UserPlus, Baby, Brain, Heart, Users, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    // Datos del cuidador
    caregiverName: "",
    caregiverEmail: "",
    caregiverPhone: "",
    caregiverRole: "",
    institution: "",

    // Datos del niño/paciente
    childName: "",
    childAge: "",
    childGender: "",
    teaLevel: "",
    diagnosisDate: "",
    currentTherapies: [],
    specialNeeds: "",

    // Información adicional
    emergencyContact: "",
    emergencyPhone: "",
    medicalNotes: "",
    goals: "",

    // Consentimientos
    dataConsent: false,
    treatmentConsent: false,
    researchConsent: false,
  })

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTherapyToggle = (therapy: string) => {
    setFormData((prev) => ({
      ...prev,
      currentTherapies: prev.currentTherapies.includes(therapy)
        ? prev.currentTherapies.filter((t) => t !== therapy)
        : [...prev.currentTherapies, therapy],
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Aquí iría la lógica de registro
    console.log("Datos de registro:", formData)
    router.push("/dashboard")
  }

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <UserPlus className="h-8 w-8 text-primary" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold text-foreground">Registro de Cuidador</CardTitle>
              <CardDescription className="text-base">
                Paso {step} de 4 - Información para el seguimiento terapéutico
              </CardDescription>
            </div>

            {/* Indicador de progreso */}
            <div className="flex justify-center space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${i <= step ? "bg-primary" : "bg-muted"}`} />
              ))}
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Paso 1: Datos del Cuidador */}
              {step === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Users className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Información del Cuidador</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="caregiverName">Nombre completo *</Label>
                      <Input
                        id="caregiverName"
                        value={formData.caregiverName}
                        onChange={(e) => handleInputChange("caregiverName", e.target.value)}
                        placeholder="Ej: Dr. María González"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="caregiverEmail">Correo electrónico *</Label>
                      <Input
                        id="caregiverEmail"
                        type="email"
                        value={formData.caregiverEmail}
                        onChange={(e) => handleInputChange("caregiverEmail", e.target.value)}
                        placeholder="maria@ejemplo.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="caregiverPhone">Teléfono</Label>
                      <Input
                        id="caregiverPhone"
                        value={formData.caregiverPhone}
                        onChange={(e) => handleInputChange("caregiverPhone", e.target.value)}
                        placeholder="+593 99 123 4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="caregiverRole">Rol/Especialidad *</Label>
                      <Select
                        value={formData.caregiverRole}
                        onValueChange={(value) => handleInputChange("caregiverRole", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="psicologo">Psicólogo/a</SelectItem>
                          <SelectItem value="terapeuta">Terapeuta del Lenguaje</SelectItem>
                          <SelectItem value="pedagogo">Pedagogo/a</SelectItem>
                          <SelectItem value="padre">Padre/Madre</SelectItem>
                          <SelectItem value="cuidador">Cuidador Profesional</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="institution">Institución/Centro</Label>
                    <Input
                      id="institution"
                      value={formData.institution}
                      onChange={(e) => handleInputChange("institution", e.target.value)}
                      placeholder="Ej: Centro de Terapia Integral"
                    />
                  </div>
                </div>
              )}

              {/* Paso 2: Datos del Niño */}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Baby className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Información del Paciente</h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="childName">Nombre del niño/a *</Label>
                      <Input
                        id="childName"
                        value={formData.childName}
                        onChange={(e) => handleInputChange("childName", e.target.value)}
                        placeholder="Ej: Ana Sofía"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="childAge">Edad *</Label>
                      <Select value={formData.childAge} onValueChange={(value) => handleInputChange("childAge", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar edad" />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 15 }, (_, i) => i + 3).map((age) => (
                            <SelectItem key={age} value={age.toString()}>
                              {age} años
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Género</Label>
                      <RadioGroup
                        value={formData.childGender}
                        onValueChange={(value) => handleInputChange("childGender", value)}
                        className="flex flex-row space-x-4 mt-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="masculino" id="masculino" />
                          <Label htmlFor="masculino">Masculino</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="femenino" id="femenino" />
                          <Label htmlFor="femenino">Femenino</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <div>
                      <Label htmlFor="diagnosisDate">Fecha de diagnóstico</Label>
                      <Input
                        id="diagnosisDate"
                        type="date"
                        value={formData.diagnosisDate}
                        onChange={(e) => handleInputChange("diagnosisDate", e.target.value)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="teaLevel">Nivel de TEA (DSM-5) *</Label>
                    <Select value={formData.teaLevel} onValueChange={(value) => handleInputChange("teaLevel", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar nivel de TEA" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nivel1">
                          <div className="flex flex-col">
                            <span>Nivel 1 - Requiere apoyo</span>
                            <span className="text-xs text-muted-foreground">
                              Dificultades leves en comunicación social
                            </span>
                          </div>
                        </SelectItem>
                        <SelectItem value="nivel2">
                          <div className="flex flex-col">
                            <span>Nivel 2 - Requiere apoyo sustancial</span>
                            <span className="text-xs text-muted-foreground">Dificultades moderadas</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="nivel3">
                          <div className="flex flex-col">
                            <span>Nivel 3 - Requiere apoyo muy sustancial</span>
                            <span className="text-xs text-muted-foreground">Dificultades severas</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Paso 3: Terapias y Necesidades */}
              {step === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Terapias y Necesidades Especiales</h3>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Terapias actuales</Label>
                    <p className="text-sm text-muted-foreground mb-3">Selecciona todas las que apliquen</p>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        "Terapia del Lenguaje",
                        "Terapia Ocupacional",
                        "Terapia Conductual (ABA)",
                        "Psicoterapia",
                        "Terapia Sensorial",
                        "Musicoterapia",
                        "Equinoterapia",
                        "Otras",
                      ].map((therapy) => (
                        <div key={therapy} className="flex items-center space-x-2">
                          <Checkbox
                            id={therapy}
                            checked={formData.currentTherapies.includes(therapy)}
                            onCheckedChange={() => handleTherapyToggle(therapy)}
                          />
                          <Label htmlFor={therapy} className="text-sm">
                            {therapy}
                          </Label>
                        </div>
                      ))}
                    </div>
                    {formData.currentTherapies.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {formData.currentTherapies.map((therapy) => (
                          <Badge key={therapy} variant="secondary">
                            {therapy}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="specialNeeds">Necesidades especiales o consideraciones</Label>
                    <Textarea
                      id="specialNeeds"
                      value={formData.specialNeeds}
                      onChange={(e) => handleInputChange("specialNeeds", e.target.value)}
                      placeholder="Ej: Sensibilidad auditiva, alergias alimentarias, medicamentos, etc."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="emergencyContact">Contacto de emergencia</Label>
                      <Input
                        id="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="emergencyPhone">Teléfono de emergencia</Label>
                      <Input
                        id="emergencyPhone"
                        value={formData.emergencyPhone}
                        onChange={(e) => handleInputChange("emergencyPhone", e.target.value)}
                        placeholder="+593 99 123 4567"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Paso 4: Objetivos y Consentimientos */}
              {step === 4 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Heart className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Objetivos y Consentimientos</h3>
                  </div>

                  <div>
                    <Label htmlFor="goals">Objetivos terapéuticos principales</Label>
                    <Textarea
                      id="goals"
                      value={formData.goals}
                      onChange={(e) => handleInputChange("goals", e.target.value)}
                      placeholder="Describe los principales objetivos que esperas alcanzar con la terapia..."
                      rows={4}
                    />
                  </div>

                  <div>
                    <Label htmlFor="medicalNotes">Notas médicas adicionales</Label>
                    <Textarea
                      id="medicalNotes"
                      value={formData.medicalNotes}
                      onChange={(e) => handleInputChange("medicalNotes", e.target.value)}
                      placeholder="Información médica relevante, medicamentos, etc."
                      rows={3}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h4 className="font-medium">Consentimientos requeridos</h4>

                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="dataConsent"
                          checked={formData.dataConsent}
                          onCheckedChange={(checked) => handleInputChange("dataConsent", checked)}
                          required
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="dataConsent" className="text-sm font-medium">
                            Consentimiento de datos *
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Autorizo el procesamiento de datos personales para fines terapéuticos y de seguimiento.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="treatmentConsent"
                          checked={formData.treatmentConsent}
                          onCheckedChange={(checked) => handleInputChange("treatmentConsent", checked)}
                          required
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="treatmentConsent" className="text-sm font-medium">
                            Consentimiento de tratamiento *
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Autorizo el uso de herramientas digitales como parte del proceso terapéutico.
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="researchConsent"
                          checked={formData.researchConsent}
                          onCheckedChange={(checked) => handleInputChange("researchConsent", checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor="researchConsent" className="text-sm font-medium">
                            Participación en investigación (opcional)
                          </Label>
                          <p className="text-xs text-muted-foreground">
                            Autorizo el uso anónimo de datos para investigación científica sobre TEA.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Botones de navegación */}
              <div className="flex justify-between pt-6">
                <div>
                  {step === 1 ? (
                    <Link href="/login">
                      <Button variant="outline" type="button">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Volver al login
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" type="button" onClick={prevStep}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Anterior
                    </Button>
                  )}
                </div>

                <div>
                  {step < 4 ? (
                    <Button type="button" onClick={nextStep}>
                      Siguiente
                    </Button>
                  ) : (
                    <Button type="submit" disabled={!formData.dataConsent || !formData.treatmentConsent}>
                      Crear cuenta
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
