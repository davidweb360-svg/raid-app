export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { supabase } from '@/lib/supabase';
import AdminHeroCreate from '@/app/components/AdminHeroCreate';

async function getFactions() {
  const { data, error } = await supabase
    .from('factions')
    .select('id,name,slug')
    .order('name', { ascending: true });

  if (error) {
    console.error(error);
    return [];
  }

  return data || [];
}

export default async function AdminHeroesPage() {
  const factions = await getFactions();

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 p-8 text-white">
      <div className="mx-auto max-w-7xl">
        <a href="/admin" className="mb-6 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
          ← Volver al admin
        </a>

        <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
          Panel rápido
        </p>

        <h1 className="mb-8 mt-2 text-5xl font-bold">Crear héroe</h1>

        <AdminHeroCreate factions={factions} />
      </div>
    </main>
  );
}