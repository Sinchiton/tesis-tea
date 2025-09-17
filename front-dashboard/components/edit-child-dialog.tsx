"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload, Save, X } from "lucide-react"

interface EditChildDialogProps {
  child: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (updatedChild: any) => void
}

export function EditChildDialog({ child, open, onOpenChange, onSave }: EditChildDialogProps) {
  const [formData, setFormData] = useState({
    name: child?.name || "",
    age: child?.age || "",
    teaLevel: child?.teaLevel || "",
    currentGoal: child?.currentGoal || "",
    targetSessions: child?.targetSessions || 3,
    sessionDuration: 15, // Default duration
    notes: child?.notes || "",
    avatar: child?.avatar || "",
  })

  const handleSave = () => {
    onSave({ ...child, ...formData })
    onOpenChange(false)
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (!child) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Save className="h-5 w-5 text-primary" />
            <span>Editar Información del Paciente</span>
          </DialogTitle>
          <DialogDescription>Actualiza la información personal y configuración terapéutica</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Avatar Section */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={formData.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-lg">
                {formData.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-2">
              <Label htmlFor="avatar">Foto del Paciente</Label>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Cambiar Foto
              </Button>
            </div>
          </div>

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre Completo</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Nombre del paciente"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Edad</Label>
              <Input
                id="age"
                type="number"
                value={formData.age}
                onChange={(e) => handleInputChange("age", Number.parseInt(e.target.value))}
                placeholder="Edad en años"
                min="3"
                max="25"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="teaLevel">Nivel de TEA</Label>
              <Select value={formData.teaLevel} onValueChange={(value) => handleInputChange("teaLevel", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar nivel" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Nivel 1">Nivel 1 - Requiere apoyo</SelectItem>
                  <SelectItem value="Nivel 2">Nivel 2 - Requiere apoyo sustancial</SelectItem>
                  <SelectItem value="Nivel 3">Nivel 3 - Requiere apoyo muy sustancial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetSessions">Sesiones por Semana</Label>
              <Select
                value={formData.targetSessions.toString()}
                onValueChange={(value) => handleInputChange("targetSessions", Number.parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 sesión</SelectItem>
                  <SelectItem value="2">2 sesiones</SelectItem>
                  <SelectItem value="3">3 sesiones</SelectItem>
                  <SelectItem value="4">4 sesiones</SelectItem>
                  <SelectItem value="5">5 sesiones</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sessionDuration">Duración por Sesión (minutos)</Label>
              <Select
                value={formData.sessionDuration.toString()}
                onValueChange={(value) => handleInputChange("sessionDuration", Number.parseInt(value))}
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
          </div>

          {/* Therapeutic Goals */}
          <div className="space-y-2">
            <Label htmlFor="currentGoal">Objetivo Terapéutico Actual</Label>
            <Input
              id="currentGoal"
              value={formData.currentGoal}
              onChange={(e) => handleInputChange("currentGoal", e.target.value)}
              placeholder="Ej: Mejorar iniciación de diálogo"
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notas Adicionales</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              placeholder="Observaciones, preferencias, consideraciones especiales..."
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full sm:w-auto">
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="h-4 w-4 mr-2" />
            Guardar Cambios
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
