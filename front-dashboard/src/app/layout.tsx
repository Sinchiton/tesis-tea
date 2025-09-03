import "./globals.css";
import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const qc = new QueryClient();

export const metadata = { title: "TEA Dashboard", description: "Panel de control" };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="min-h-screen bg-zinc-50 text-zinc-900">
        <QueryClientProvider client={qc}>
          <div className="max-w-6xl mx-auto p-4">{children}</div>
        </QueryClientProvider>
      </body>
    </html>
  );
}
