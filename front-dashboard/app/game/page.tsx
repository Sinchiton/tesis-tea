"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, Users, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"

export default function GamePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="flex justify-center items-center space-x-2 mb-4">
            <div className="p-4 bg-primary/10 rounded-full">
              <Brain className="h-10 w-10 text-primary" />
            </div>
            <div className="p-4 bg-accent/10 rounded-full">
              <Heart className="h-10 w-10 text-accent" />
            </div>
            <div className="p-4 bg-secondary/10 rounded-full">
              <Users className="h-10 w-10 text-secondary" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground">Terapia Cognitiva TEA</h1>
          <p className="text-lg text-muted-foreground text-balance">
            Aplicación de juegos serios para el mejoramiento de habilidades socio-conductuales
          </p>
        </div>

        {/* Game Interface Placeholder */}
        <Card className="border-border/50 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Entorno de Juego</CardTitle>
            <CardDescription>Interfaz de juego en desarrollo - Simulación de interacciones sociales</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted/30 rounded-lg p-8 text-center">
              <Brain className="h-16 w-16 text-primary mx-auto mb-4" />
              <p className="text-muted-foreground">
                Aquí se mostrará el entorno inmersivo con agentes conversacionales y escenarios interactivos para el
                entrenamiento de habilidades sociales.
              </p>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={() => router.push("/login")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                size="lg"
              >
                Acceder al Dashboard de Cuidadores
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm text-muted-foreground space-y-1">
          <p>Universidad de las Fuerzas Armadas - ESPE</p>
          <p>Departamento de Ciencias de la Computación</p>
          <p>Proyecto de Integración Curricular - Desarrollo de aplicaciones para TEA</p>
        </div>
      </div>
    </div>
  )
}
