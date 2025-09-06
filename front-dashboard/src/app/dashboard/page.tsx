"use client";
import { useEffect } from "react";
import { loadAccessToken, api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import Can from "../components/Can";

type Stats = { sessions_today: number; cost_today: number; agents_active: number };

// helper opcional para stats mock
async function fetchStats(): Promise<Stats> {
  try {
    const { data } = await api.get("/stats/overview");
    return data as Stats;
  } catch {
    // si tu mock aún no tiene /stats/overview, devolvemos placeholders
    return { sessions_today: 0, cost_today: 0, agents_active: 0 };
  }
}

export default function Dashboard() {
  useEffect(() => { loadAccessToken(); }, []);
  const { data: stats } = useQuery({ queryKey: ["stats"], queryFn: fetchStats });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Resumen</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Can perm="stats.read">
          <Card title="Sesiones hoy" value={String(stats?.sessions_today ?? "—")} />
        </Can>
        <Can perm="stats.read">
          <Card title="Costo estimado" value={stats ? `$${stats.cost_today.toFixed(2)}` : "—"} />
        </Can>
        <Can perm="agents.read">
          <Card title="Agentes activos" value={String(stats?.agents_active ?? "—")} />
        </Can>
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
