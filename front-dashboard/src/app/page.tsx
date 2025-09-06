"use client";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [hasToken, setHasToken] = useState(false);
  useEffect(() => {
    const ck = document.cookie.split("; ").find(c => c.startsWith("access_token="));
    setHasToken(Boolean(ck));
  }, []);

  return (
    <main className="min-h-[80vh] flex items-center justify-center">
      <div className="max-w-md w-full p-6 text-center space-y-6 bg-white rounded-lg border">
        <h1 className="text-2xl font-semibold">TEA Dashboard</h1>
        {hasToken ? (
          <>
            <p className="text-sm text-zinc-600">Ya iniciaste sesión.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/dashboard" className="px-4 py-2 rounded bg-black text-white">Ir al dashboard</Link>
              <Link href="/users" className="px-4 py-2 rounded border">Usuarios</Link>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-zinc-600">Bienvenido. Elige una opción para continuar.</p>
            <div className="flex gap-3 justify-center">
              <Link href="/login" className="px-4 py-2 rounded bg-black text-white">Iniciar sesión</Link>
              <Link href="/register" className="px-4 py-2 rounded border">Registrarse</Link>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
