"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { loadAccessToken, setAccessToken } from "@/lib/api";
import { useMe } from "@/lib/auth";
import Can from "./Can";

type NavItem = {
  label: string;
  href: string;
  perm?: Parameters<typeof Can>[0]["perm"]; // permiso opcional
};

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard" },                 // visible si hay sesión
  { label: "Usuarios",   href: "/users",      perm: "users.read" },
  { label: "Agentes",    href: "/agents",     perm: "agents.read" },
  { label: "Proveedores",href: "/providers",  perm: "providers.read" },
  { label: "Conversaciones", href: "/users/1", perm: "conversations.read" }, // ejemplo
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthless = pathname === "/login" || pathname === "/register" || pathname === "/";
  const { data: me, isLoading, isError } = useMe();

  useEffect(() => { loadAccessToken(); }, []);

  // En páginas públicas, no dibujamos el shell
  if (isAuthless) {
    return <div className="max-w-6xl mx-auto p-4">{children}</div>;
  }

  // Si no hay sesión válida, deja el contenido (middleware redirige /login)
  if (isError) {
    return <div className="max-w-6xl mx-auto p-4">{children}</div>;
  }

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-[240px_1fr]">
      {/* Sidebar */}
      <aside className="border-r bg-white hidden lg:block">
        <div className="p-4 text-lg font-semibold">TEA Dashboard</div>
        <nav className="px-2 space-y-1">
          {NAV.map((item) => (
            item.perm ? (
              <Can key={item.href} perm={item.perm}>
                <NavLink href={item.href} active={pathname.startsWith(item.href)}>{item.label}</NavLink>
              </Can>
            ) : (
              <NavLink key={item.href} href={item.href} active={pathname.startsWith(item.href)}>{item.label}</NavLink>
            )
          ))}
        </nav>
        <div className="px-2 mt-6">
          <button
            onClick={() => { setAccessToken(null); window.location.href = "/"; }}
            className="w-full px-3 py-2 rounded border hover:bg-zinc-50 text-left"
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="border-b bg-white px-4 py-3 flex items-center justify-between lg:hidden">
          <div className="font-semibold">TEA Dashboard</div>
          <button
            onClick={() => { setAccessToken(null); window.location.href = "/"; }}
            className="px-3 py-1.5 rounded border text-sm"
          >
            Salir
          </button>
        </header>

        {/* Page */}
        <main className="p-4">
          {!isLoading && me && (
            <p className="text-sm text-zinc-500 mb-3">
              Sesión: <span className="font-medium">{me.user.name}</span> · Rol: <span className="font-medium">{me.user.role}</span>
            </p>
          )}
          {children}
        </main>
      </div>
    </div>
  );
}

function NavLink({ href, active, children }: { href: string; active?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={`block px-3 py-2 rounded ${active ? "bg-black text-white" : "hover:bg-zinc-100"}`}
    >
      {children}
    </Link>
  );
}
