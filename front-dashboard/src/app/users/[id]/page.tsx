"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, loadAccessToken } from "@/lib/api";
import type { User, SensoryProfile, Conversation } from "@/lib/types";
import Can from "@/app/components/Can";

export default function UserDetail(){
  const params = useParams(); 
  const id = Number(Array.isArray(params.id) ? params.id[0] : params.id);
  const qc = useQueryClient();
  useEffect(()=>{ loadAccessToken(); }, []);

  const { data: userResp } = useQuery({
    queryKey:["user",id],
    queryFn: async()=> (await api.get(`/users/${id}`)).data as { data: User }
  });
  const user = userResp?.data;

  const { data: caregivers } = useQuery({
    queryKey:["caregivers"],
    queryFn: async()=> (await api.get(`/users?role=caregiver`)).data as { data: User[] }
  });

  const { data: profResp } = useQuery({
    queryKey:["profile",id],
    queryFn: async()=> (await api.get(`/profiles/${id}`)).data as { data: SensoryProfile | null }
  });
  const profile = profResp?.data ?? undefined;

  const { data: convResp } = useQuery({
    queryKey:["conversations",id],
    queryFn: async()=> (await api.get(`/conversations?userId=${id}`)).data as { data: Conversation[] }
  });

  if (!user) return <div className="p-6">Cargando…</div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        {user.avatar_url && <img src={user.avatar_url} className="w-12 h-12 rounded-full border" alt="avatar" />}
        <div>
          <h1 className="text-xl font-semibold">{user.name} <span className="text-zinc-500 text-sm">({user.role})</span></h1>
          <p className="text-sm text-zinc-600">{user.email}</p>
        </div>
      </header>

      {user.role==="child" && (
        <Can perm="users.write">
          <AssignCaregiver user={user} caregivers={caregivers?.data||[]} 
            onSaved={()=> qc.invalidateQueries({queryKey:["user",id]})}/>
        </Can>
      )}

      <Can perm="profiles.read">
        <SensoryForm userId={id} initial={profile}
                     onSaved={()=> qc.invalidateQueries({queryKey:["profile",id]})} />
      </Can>

      <Can perm="conversations.read">
        <History conversations={convResp?.data || []} />
      </Can>
    </div>
  );
}

function AssignCaregiver({ user, caregivers, onSaved }:{
  user: User; caregivers: User[]; onSaved: ()=>void;
}){
  const [caregiverId,setId] = useState<number|''>(user.caregiver_id ?? '');
  const [saving,setSaving] = useState(false);
  async function save(){
    setSaving(true);
    await api.put(`/users/${user.id}`, { caregiver_id: caregiverId===''? null : Number(caregiverId) });
    setSaving(false); onSaved();
  }
  return (
    <div className="rounded border bg-white p-4 space-y-3">
      <h2 className="font-semibold">Responsable a cargo</h2>
      <select className="border rounded px-3 py-2" value={caregiverId as any} onChange={e=>setId(e.target.value? Number(e.target.value):'')}>
        <option value="">— Sin asignar —</option>
        {caregivers.map(c=> <option key={c.id} value={c.id}>{c.name} ({c.email})</option>)}
      </select>
      <div>
        <button onClick={save} disabled={saving} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50">
          {saving? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}

function SensoryForm({ userId, initial, onSaved }:{
  userId: number; initial?: SensoryProfile; onSaved: ()=>void;
}){
  const [luz,setLuz]=useState(initial?.luz ?? 2);
  const [ruido,setRuido]=useState(initial?.ruido ?? 1);
  const [crowd,setCrowd]=useState(initial?.crowd ?? 0);
  const [dur,setDur]=useState(initial?.duracion ?? 60);
  const [comp,setComp]=useState(initial?.complejidad ?? 1);
  const [saving,setSaving]=useState(false);

  async function save(){
    setSaving(true);
    await api.post(`/profiles/${userId}`, { luz:Number(luz), ruido:Number(ruido), crowd:Number(crowd), duracion:Number(dur), complejidad:Number(comp) });
    setSaving(false); onSaved();
  }

  return (
    <div className="rounded border bg-white p-4 space-y-3">
      <h2 className="font-semibold">Perfil sensorial</h2>
      <div className="grid sm:grid-cols-5 gap-3">
        <Slider label="Luz" val={luz} set={setLuz} />
        <Slider label="Ruido" val={ruido} set={setRuido} />
        <Slider label="Gente" val={crowd} set={setCrowd} />
        <div>
          <label className="text-sm">Duración (s)</label>
          <input className="border rounded px-3 py-2 w-full" type="number" value={dur} onChange={e=>setDur(Number(e.target.value))}/>
        </div>
        <Slider label="Complejidad" val={comp} set={setComp} />
      </div>
      <button onClick={save} disabled={saving} className="px-3 py-2 rounded bg-black text-white disabled:opacity-50">
        {saving? "Guardando..." : "Guardar perfil"}
      </button>
    </div>
  );
}

function Slider({label,val,set}:{label:string; val:number; set:(n:number)=>void}){
  return (
    <div>
      <label className="text-sm">{label} ({val})</label>
      <input type="range" min={0} max={5} step={1} value={val}
             onChange={e=>set(Number(e.target.value))}
             className="w-full"/>
    </div>
  );
}

function History({ conversations }: { conversations: Conversation[] }) {
  return (
    <div className="rounded border bg-white p-4">
      <h2 className="font-semibold mb-3">Historial de conversación</h2>
      {!conversations.length && <p className="text-sm text-zinc-500">No hay conversaciones aún.</p>}
      <div className="space-y-4">
        {conversations.map((c) => (
          <div key={c.id} className="rounded border p-3">
            <div className="text-xs text-zinc-500 mb-2">
              Sesión #{c.id} · {new Date(c.started_at).toLocaleString()}
            </div>
            <div className="space-y-1 max-h-64 overflow-auto">
              {c.turns.map((t,i)=>(
                <div key={i} className={`text-sm ${t.role==="assistant"?"text-blue-700":"text-zinc-800"}`}>
                  <strong>{t.role==="assistant"?"Agente":"Usuario"}:</strong> {t.text}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
