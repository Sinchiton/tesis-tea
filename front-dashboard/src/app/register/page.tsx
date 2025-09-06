"use client";
import { useState } from "react";
import Link from "next/link";
import { api, setAccessToken } from "@/lib/api";
import type { Role } from "@/lib/types";

// helper de error (local)
function getErrorMessage(err: any): string {
  const data = err?.response?.data;
  const detail = data?.detail ?? data?.message ?? data?.error ?? err?.message ?? err;
  if (Array.isArray(detail)) return detail.map((d: any) => d?.msg || JSON.stringify(d)).join("; ");
  if (typeof detail === "object") return detail?.msg ? String(detail.msg) : (() => { try { return JSON.stringify(detail); } catch { return String(detail); } })();
  return String(detail);
}

export default function RegisterPage() {
  const [name, setName] = useState(""); const [email, setEmail] = useState("");
  const [password, setPw] = useState(""); const [role, setRole] = useState<Role>("caregiver");
  const [err, setErr] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setSaving(true);
    try {
      const { data } = await api.post("/auth/register", { name, email, password, role });
      setAccessToken(data.access);
      window.location.href = "/dashboard";
    } catch (e: any) {
      setErr(getErrorMessage(e));
    } finally { setSaving(false); }
  }

  return (
    <div className="max-w-sm mx-auto mt-16">
      <h1 className="text-2xl font-semibold mb-6">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Nombre"
          value={name} onChange={e => setName(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email"
          value={email} onChange={e => setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Contraseña" type="password"
          value={password} onChange={e => setPw(e.target.value)} required />
        <select className="w-full border rounded px-3 py-2" value={role} onChange={e => setRole(e.target.value as Role)}>
          <option value="caregiver">caregiver</option>
          <option value="therapist">therapist</option>
          <option value="admin">admin</option>
          <option value="superadmin">superadmin</option>
          <option value="child">child</option>
        </select>
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={saving} className="w-full px-3 py-2 bg-black text-white rounded hover:opacity-90 disabled:opacity-50">
          {saving ? "Creando..." : "Registrarme"}
        </button>
      </form>
      <p className="text-sm mt-4">
        ¿Ya tienes cuenta? <Link href="/login" className="text-blue-600">Entrar</Link>
      </p>
    </div>
  );
}
