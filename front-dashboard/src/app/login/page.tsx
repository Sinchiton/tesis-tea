"use client";
import { useState } from "react";
import Link from "next/link";
import { api, setAccessToken } from "@/lib/api";

// helper de error (local)
function getErrorMessage(err: any): string {
  const data = err?.response?.data;
  const detail = data?.detail ?? data?.message ?? data?.error ?? err?.message ?? err;
  if (Array.isArray(detail)) return detail.map((d: any) => d?.msg || JSON.stringify(d)).join("; ");
  if (typeof detail === "object") return detail?.msg ? String(detail.msg) : (() => { try { return JSON.stringify(detail); } catch { return String(detail); } })();
  return String(detail);
}

export default function LoginPage() {
  const [email, setEmail] = useState(""); const [password, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setErr(""); setLoading(true);
    try {
      const { data } = await api.post("/auth/login", { email, password });
      setAccessToken(data.access);
      const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
      window.location.href = next;
    } catch (e: any) {
      setErr(getErrorMessage(e));
    } finally { setLoading(false); }
  }

  return (
    <div className="max-w-sm mx-auto mt-24">
      <h1 className="text-2xl font-semibold mb-6">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email" type="email"
               value={email} onChange={e=>setEmail(e.target.value)} required />
        <input className="w-full border rounded px-3 py-2" placeholder="Contraseña" type="password"
               value={password} onChange={e=>setPw(e.target.value)} required />
        {err && <p className="text-red-600 text-sm">{err}</p>}
        <button disabled={loading} className="w-full px-3 py-2 bg-black text-white rounded hover:opacity-90 disabled:opacity-50">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
      <p className="text-sm mt-4">
        ¿No tienes cuenta? <Link href="/register" className="text-blue-600">Crear cuenta</Link>
      </p>
    </div>
  );
}
