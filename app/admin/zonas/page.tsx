export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { supabase } from '@/lib/supabase';
import AdminRatings from '@/app/components/AdminRatings';

async function getChampions() {
  const { data, error } = await supabase
    .from('champions')
    .select('id,name,slug')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error cargando campeones:', error);
    return [];
  }

  return data || [];
}

async function getZones() {
  const { data, error } = await supabase
    .from('zones')
    .select('id,name,slug')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error cargando zonas:', error);
    return [];
  }

  return data || [];
}

export default async function AdminZonesPage() {
  const champions = await getChampions();
  const zones = await getZones();

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

        <h1 className="mb-8 mt-2 text-5xl font-bold">Valorar zonas</h1>

        <AdminRatings champions={champions} zones={zones} />
      </div>
    </main>
  );
}