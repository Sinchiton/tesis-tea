"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, loadAccessToken } from "@/lib/api";
import type { User, Role } from "@/lib/types";

// helper de error (local)
function getErrorMessage(err: any): string {
  const data = err?.response?.data;
  const detail = data?.detail ?? data?.message ?? data?.error ?? err?.message ?? err;
  if (Array.isArray(detail)) return detail.map((d: any) => d?.msg || JSON.stringify(d)).join("; ");
  if (typeof detail === "object") return detail?.msg ? String(detail.msg) : (() => { try { return JSON.stringify(detail); } catch { return String(detail); } })();
  return String(detail);
}

export default function UsersPage() {
  const qc = useQueryClient();
  const router = useRouter();

  useEffect(() => { loadAccessToken(); }, []);

  const { data, isLoading, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => (await api.get("/users")).data as { data: User[] },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Usuarios</h1>

      <CreateUser
        onCreated={(newId) => {
          qc.invalidateQueries({ queryKey: ["users"] });
          router.push(`/users/${newId}`);
        }}
      />

      <div className="rounded border bg-white">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-zinc-50 border-b">
              <th className="text-left p-2">Nombre</th>
              <th className="text-left p-2">Email</th>
              <th className="text-left p-2">Rol</th>
              <th className="text-left p-2"></th>
            </tr>
          </thead>
          <tbody>
            {isLoading && <tr><td className="p-3">Cargando…</td></tr>}
            {error && <tr><td className="p-3 text-red-600">Error al cargar.</td></tr>}
            {data?.data?.map((u) => (
              <tr key={u.id} className="border-t">
                <td className="p-2">{u.name}</td>
                <td className="p-2">{u.email}</td>
                <td className="p-2">{u.role}</td>
                <td className="p-2">
                  <Link className="text-blue-600" href={`/users/${u.id}`}>Ver / Editar</Link>
                </td>
              </tr>
            ))}
            {!isLoading && !error && (!data?.data || data.data.length === 0) &&
              <tr><td className="p-3 text-zinc-500">Sin usuarios aún.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CreateUser({ onCreated }: { onCreated: (newId: number) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [role, setRole] = useState<Role>("caregiver");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setMsg(""); setSaving(true);
    try {
      const { data } = await api.post("/users", { name, email, password, role });
      setMsg("Usuario creado ✔");
      setName(""); setEmail(""); setPw(""); setRole("caregiver");
      onCreated(data.id);
    } catch (e:any) {
      setMsg(getErrorMessage(e));
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="rounded border bg-white p-4 space-y-3">
      <div className="grid sm:grid-cols-4 gap-3">
        <input className="border rounded px-3 py-2" placeholder="Nombre" value={name} onChange={e=>setName(e.target.value)} required/>
        <input className="border rounded px-3 py-2" placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} required/>
        <input className="border rounded px-3 py-2" placeholder="Contraseña" type="password" value={password} onChange={e=>setPw(e.target.value)} required/>
        <select className="border rounded px-3 py-2" value={role} onChange={e=>setRole(e.target.value as Role)}>
          <option value="admin">admin</option>
          <option value="therapist">therapist</option>
          <option value="caregiver">caregiver</option>
          <option value="child">child</option>
        </select>
      </div>
      <button disabled={saving} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
        {saving ? "Creando..." : "Crear usuario"}
      </button>
      {msg && <span className="ml-3 text-sm">{msg}</span>}
    </form>
  );
}
