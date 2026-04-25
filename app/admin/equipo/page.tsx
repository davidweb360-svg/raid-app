import AdminEquipment from '@/app/components/AdminEquipment';

async function getChampions() {
  const res = await fetch('http://127.0.0.1:8055/items/champions?limit=1000&sort=name', {
    cache: 'no-store',
  });
  const json = await res.json();
  return json?.data || [];
}

export default async function AdminEquipmentPage() {
  const champions = await getChampions();

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <a
          href="/admin"
          className="mb-6 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          ← Volver al admin
        </a>

        <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
          Panel rápido
        </p>
        <h1 className="mb-8 mt-2 text-5xl font-bold">Equipo ideal por campeón</h1>

        <AdminEquipment champions={champions} />
      </div>
    </main>
  );
}