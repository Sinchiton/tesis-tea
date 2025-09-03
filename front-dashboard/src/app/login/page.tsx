"use client";
import { useState } from "react";
import { api, setAccessToken } from "@/lib/api";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPw] = useState("");
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    try {
      const { data } = await api.post("/auth/login", { email, password });
      // Espera { access, refresh? }
      setAccessToken(data.access);
      const next = new URLSearchParams(window.location.search).get("next") || "/dashboard";
      window.location.href = next;
    } catch (e) {
      setError("Credenciales inválidas o servidor no disponible.");
    }
  }

  return (
    <div className="max-w-sm mx-auto mt-24">
      <h1 className="text-2xl font-semibold mb-6">Entrar</h1>
      <form onSubmit={onSubmit} className="space-y-3">
        <input className="w-full border rounded px-3 py-2" placeholder="Email"
               value={email} onChange={(e)=>setEmail(e.target.value)} />
        <input className="w-full border rounded px-3 py-2" placeholder="Contraseña" type="password"
               value={password} onChange={(e)=>setPw(e.target.value)} />
        {error && <p className="text-red-600 text-sm">{error}</p>}
        <button className="w-full px-3 py-2 bg-black text-white rounded hover:opacity-90">Ingresar</button>
      </form>
    </div>
  );
}
