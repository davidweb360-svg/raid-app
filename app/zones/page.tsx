export const dynamic = 'force-dynamic';
import { supabase } from '@/lib/supabase';

async function getZones() {
  const { data, error } = await supabase
    .from('zones')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error cargando zonas:', error);
    return [];
  }

  return data || [];
}

export default async function ZonesPage() {
  const zones = await getZones();

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <a
          href="/"
          className="mb-6 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          ← Volver
        </a>

        <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
          Raid Manager
        </p>

        <h1 className="mb-8 mt-2 text-5xl font-bold">Zonas</h1>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {zones.map((zone: any) => (
            <a
              key={zone.id}
              href={`/zones/${zone.slug}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:-translate-y-1 hover:border-amber-400/40 hover:bg-white/10"
            >
              <p className="text-2xl font-bold">{zone.name}</p>
              <p className="mt-3 text-sm text-white/60">
                Ver mejores campeones
              </p>
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}