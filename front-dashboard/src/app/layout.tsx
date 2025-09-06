import "./globals.css";
import type { ReactNode } from "react";
import Providers from "./providers";
import AppShell from "./components/AppShell";

export const metadata = {
  title: "TEA Dashboard",
  description: "Panel de control",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
