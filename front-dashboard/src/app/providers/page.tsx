"use client";
import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, loadAccessToken } from "@/lib/api";
import type { Provider, ProviderType } from "@/lib/types";
import Can from "../components/Can";

// helper de error (local)
function getErrorMessage(err: any): string {
  const data = err?.response?.data;
  const detail = data?.detail ?? data?.message ?? data?.error ?? err?.message ?? err;
  if (Array.isArray(detail)) return detail.map((d: any) => d?.msg || JSON.stringify(d)).join("; ");
  if (typeof detail === "object") return detail?.msg ? String(detail.msg) : (() => { try { return JSON.stringify(detail); } catch { return String(detail); } })();
  return String(detail);
}

// ✅ helper local en vez de JSON.parseSafe
function parseJSONSafe<T = any>(text: string): T | null {
  try {
    if (!text || !text.trim()) return null;
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

export default function ProvidersPage() {
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["providers"],
    queryFn: async () => (await api.get("/providers")).data, // espera { data: Provider[] }
  });
  useEffect(() => { loadAccessToken(); }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Proveedores</h1>

      <Can perm="providers.write">
        <CreateProvider onCreated={() => qc.invalidateQueries({ queryKey: ["providers"] })} />
      </Can>

      <div className="rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50">
              <th className="text-left p-2">ID</th>
              <th className="text-left p-2">Tipo</th>
              <th className="text-left p-2">Vendor</th>
              <th className="text-left p-2">Config</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3">Cargando…</td></tr>}
            {error && <tr><td className="p-3 text-red-600">Error al cargar.</td></tr>}
            {data?.data?.map((p: Provider) => (
              <tr key={p.id} className="border-t">
                <td className="p-2">{p.id}</td>
                <td className="p-2">{p.type}</td>
                <td className="p-2">{p.vendor}</td>
                <td className="p-2 text-zinc-500">{p.config ? JSON.stringify(p.config) : "—"}</td>
              </tr>
            ))}
            {!isLoading && !error && (!data?.data || data.data.length === 0) &&
              <tr><td className="p-3 text-zinc-500">Sin proveedores aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateProvider({ onCreated }: { onCreated: () => void }) {
  const [type, setType] = useState<ProviderType>("LLM");
  const [vendor, setVendor] = useState("openai");
  const [apiKey, setApiKey] = useState("");
  const [config, setConfig] = useState("{}");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(""); setSaving(true);
    try {
      const safeConfig = parseJSONSafe(config);
      await api.post("/providers", {
        type, vendor, config: safeConfig, api_key: apiKey,
      } as any);
      setMsg("Proveedor creado ✔"); setApiKey(""); setConfig("{}");
      onCreated();
    } catch (err:any) {
      setMsg(getErrorMessage(err));
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border bg-white p-4 space-y-3">
      <div className="grid sm:grid-cols-4 gap-3">
        <select className="border rounded px-3 py-2" value={type} onChange={e => setType(e.target.value as ProviderType)}>
          <option>LLM</option><option>STT</option><option>TTS</option>
        </select>
        <input className="border rounded px-3 py-2" placeholder="Vendor (openai, google, aws, deepgram, local)"
               value={vendor} onChange={e => setVendor(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="API Key (se cifrará en backend)"
               value={apiKey} onChange={e => setApiKey(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder='Config JSON (ej: {"region":"us-east-1"})'
               value={config} onChange={e => setConfig(e.target.value)} />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={saving} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          {saving ? "Guardando..." : "Crear proveedor"}
        </button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>
    </form>
  );
}
