import Link from "next/link";
export default function Home() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-semibold">TEA Dashboard</h1>
      <div className="flex gap-3">
        <Link className="px-3 py-2 bg-black text-white rounded" href="/dashboard">Dashboard</Link>
        <Link className="px-3 py-2 border rounded" href="/agents">Agentes</Link>
        <Link className="px-3 py-2 border rounded" href="/providers">Proveedores</Link>
      </div>
    </div>
  );
}
