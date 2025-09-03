"use client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, loadAccessToken } from "@/lib/api";
import { useEffect, useState } from "react";
import type { Agent } from "@/lib/types";

export default function AgentsPage(){
  const qc = useQueryClient();
  const { data, isLoading, error } = useQuery({
    queryKey: ["agents"],
    queryFn: async ()=> (await api.get("/agents")).data, // espera { data: Agent[] }
  });

  useEffect(()=>{ loadAccessToken(); }, []);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Agentes</h1>
      </header>

      <CreateAgent onCreated={()=> qc.invalidateQueries({queryKey:["agents"]})} />

      <div className="rounded-lg border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="border-b bg-zinc-50">
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Modelo</th>
              <th className="text-left p-2">Voz</th>
              <th className="text-left p-2">Activo</th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3">Cargando…</td></tr>}
            {error && <tr><td className="p-3 text-red-600">Error al cargar.</td></tr>}
            {data?.data?.map((a: Agent)=>(
              <tr key={a.id} className="border-t">
                <td className="p-2">{a.name}</td>
                <td className="p-2">{a.model}</td>
                <td className="p-2">{a.voice || "—"}</td>
                <td className="p-2">{a.active ? "Sí" : "No"}</td>
              </tr>
            ))}
            {!isLoading && !error && (!data?.data || data.data.length===0) &&
              <tr><td className="p-3 text-zinc-500">Sin agentes aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateAgent({ onCreated }: { onCreated: ()=>void }) {
  const [name,setName]=useState("");
  const [model,setModel]=useState("gpt-4o-mini");
  const [voice,setVoice]=useState("es-LA");
  const [temperature,setTemp]=useState(0.6);
  const [llm,setLLM]=useState<number|''>(''); // provider ids (opcionales)
  const [stt,setSTT]=useState<number|''>(''); 
  const [tts,setTTS]=useState<number|''>(''); 
  const [saving,setSaving]=useState(false);
  const [msg,setMsg]=useState("");

  async function submit(e: React.FormEvent){
    e.preventDefault(); setMsg(""); setSaving(true);
    try{
      await api.post("/agents", {
        name, model, voice, temperature,
        llm_provider_id: llm===''? null : Number(llm),
        stt_provider_id: stt===''? null : Number(stt),
        tts_provider_id: tts===''? null : Number(tts),
      });
      setMsg("Agente creado ✔"); setName(""); setModel("gpt-4o-mini"); setVoice("es-LA"); setTemp(0.6);
      setLLM(''); setSTT(''); setTTS('');
      onCreated();
    }catch(err:any){ setMsg("Error al crear agente"); }
    finally{ setSaving(false); }
  }

  return (
    <form onSubmit={submit} className="rounded-lg border bg-white p-4 space-y-3">
      <div className="grid sm:grid-cols-3 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="border rounded px-3 py-2" placeholder="Modelo (LLM)" value={model} onChange={e=>setModel(e.target.value)} />
        <input className="border rounded px-3 py-2" placeholder="Voz (TTS)" value={voice} onChange={e=>setVoice(e.target.value)} />
      </div>
      <div className="grid sm:grid-cols-4 gap-3">
        <input className="border rounded px-3 py-2" type="number" step="0.1" min="0" max="2"
               value={temperature} onChange={e=>setTemp(parseFloat(e.target.value))} placeholder="Temperature"/>
        <input className="border rounded px-3 py-2" placeholder="LLM Provider ID (opcional)" value={llm} onChange={e=>setLLM(e.target.value as any)} />
        <input className="border rounded px-3 py-2" placeholder="STT Provider ID (opcional)" value={stt} onChange={e=>setSTT(e.target.value as any)} />
        <input className="border rounded px-3 py-2" placeholder="TTS Provider ID (opcional)" value={tts} onChange={e=>setTTS(e.target.value as any)} />
      </div>
      <div className="flex items-center gap-3">
        <button disabled={saving} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
          {saving? "Guardando..." : "Crear agente"}
        </button>
        {msg && <span className="text-sm">{msg}</span>}
      </div>
    </form>
  );
}
