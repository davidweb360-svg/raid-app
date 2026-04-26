export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { supabase } from '@/lib/supabase';
import ChampionGrid from './components/ChampionGrid';

async function getChampions() {
  const { data, error } = await supabase
    .from('champions')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error cargando campeones:', error);
    return [];
  }

  return data || [];
}

export default async function Home() {
  const champions = await getChampions();

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
            Raid Manager
          </p>

          <h1 className="mt-2 text-4xl font-bold md:text-6xl">
            Campeones
          </h1>

          <p className="mt-3 max-w-2xl text-white/70">
            Base visual para organizar campeones, valorarlos y construir una app.
          </p>

          <div className="mt-4 flex flex-wrap gap-3">
            <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80">
              Total cargados: {champions.length}
            </div>

            <a
              href="/zones"
              className="inline-flex rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-300 hover:bg-amber-500/20"
            >
              Ver zonas
            </a>

            <a
              href="/admin"
              className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
            >
              Admin
            </a>
          </div>
        </div>

        <ChampionGrid champions={champions} />
      </div>
    </main>
  );
}