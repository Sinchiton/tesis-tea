"use client";
import { useEffect } from "react";
import { loadAccessToken } from "@/lib/api";

export default function Dashboard() {
  useEffect(()=>{ loadAccessToken(); }, []);
  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Resumen</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Sesiones hoy" value="—" />
        <Card title="Costo estimado" value="—" />
        <Card title="Agentes activos" value="—" />
      </div>
      <p className="text-sm text-zinc-600">
        Desde aquí administra <strong>Agentes</strong> y <strong>Proveedores</strong>.  
        Primero crea tus proveedores (STT/LLM/TTS) y luego vincúlalos en un Agente.
      </p>
    </div>
  );
}

function Card({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-lg border bg-white p-4">
      <div className="text-sm text-zinc-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
