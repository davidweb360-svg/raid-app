
import ChampionStars from '@/app/components/ChampionStars';
import { supabase } from '@/lib/supabase';
import ChampionTabs from '@/app/components/ChampionTabs';
import IdealEquipment from '@/app/components/IdealEquipment';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

async function getChampion(slug: string) {
  const { data, error } = await supabase
    .from('champions')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error cargando campeón:', error);
    return null;
  }

  return data;
}

async function getChampionZoneRatings(championId: number) {
  const { data, error } = await supabase
    .from('zone_ratings')
    .select('id,rating,notes,zones(id,name,slug)')
    .eq('champion_id', championId)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error cargando valoraciones:', error);
    return [];
  }

  return data || [];
}

function normalizeStats(stats: any) {
  if (!stats || typeof stats !== 'object' || Array.isArray(stats)) return [];

  return Object.entries(stats).map(([key, value]) => ({
    key,
    label:
      {
        hp: 'HP',
        speed: 'VEL',
        attack: 'ATK',
        defense: 'DEF',
        accuracy: 'PUNT',
        critRate: 'P. CRÍTICO',
        critDamage: 'D. CRÍTICO',
        resistance: 'RES',
      }[key] || key,
    value: typeof value === 'object' ? JSON.stringify(value) : String(value),
  }));
}

function renderSimpleList(value: any) {
  if (!value) return <p className="text-white/50">—</p>;
  if (typeof value === 'object') return <pre className="text-white/80">{JSON.stringify(value, null, 2)}</pre>;
  return <p className="text-white/80">{String(value)}</p>;
}

function renderStars(rating: number | null | undefined) {
  const value = Number(rating || 0);
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-amber-300">
      <span>{'★'.repeat(full)}</span>
      {half ? <span>⯪</span> : null}
      <span className="text-white/25">{'☆'.repeat(empty)}</span>
    </div>
  );
}

export default async function ChampionPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const champion = await getChampion(resolvedParams.slug);

  if (!champion) {
    return (
      <main className="min-h-screen bg-black p-8 text-white">
        <h1 className="text-3xl font-bold">Campeón no encontrado</h1>
      </main>
    );
  }

  const zoneRatings = await getChampionZoneRatings(champion.id);
  const stats = normalizeStats(champion.stats);
  const skills = Array.isArray(champion.skills) ? champion.skills : [];

  return (
    <main
      className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 p-4 text-white md:p-8"
      style={
        champion.background_image_url
          ? {
              backgroundImage: `linear-gradient(rgba(8,8,12,0.86), rgba(0,0,0,0.94)), url(${champion.background_image_url})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center top',
              backgroundAttachment: 'fixed',
            }
          : undefined
      }
    >
      <div className="mx-auto max-w-7xl">
        <a href="/" className="mb-6 inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10">
          ← Volver
        </a>

        <section className="overflow-hidden rounded-[28px] border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur">
          <div className="p-5 md:p-7">
            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
              <div className="mx-auto flex-shrink-0 md:mx-0">
                <div className="overflow-hidden rounded-2xl bg-black/30 ring-2 ring-amber-400/40">
                  {champion.image_url ? (
                    <img src={champion.image_url} alt={champion.name} className="block h-[176px] w-[176px] object-cover" />
                  ) : (
                    <div className="flex h-[176px] w-[176px] items-center justify-center text-white/40">Sin imagen</div>
                  )}
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                <header className="flex flex-col gap-3">
                  <div className="flex flex-col items-center gap-3 md:flex-row md:items-center">
                    <h1 className="text-4xl font-black uppercase leading-none text-amber-300 md:text-6xl">
                      {champion.name}
                    </h1>
                    <div className="mt-2 flex justify-center md:justify-start">
  <ChampionStars slots={champion.champion_star_slots} size="lg" />
</div>
                    <ChampionStars slots={champion.champion_star_slots} size="lg" />
                    {champion.affinity ? (
                      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-sky-300">
                        {champion.affinity}
                      </span>
                    ) : null}
                  </div>

                  <p className="inline-flex w-fit self-center rounded-full border border-white/10 bg-black/25 px-5 py-2 text-base text-white/85 md:self-start">
                    {champion.role || '—'}
                  </p>
                </header>

                <div className="pt-2">
                  <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 md:gap-3">
                    {stats.map((stat, index) => {
                      const valueClass =
                        stat.label === 'HP' || stat.label === 'VEL'
                          ? 'text-[#65C39A]'
                          : stat.label === 'PUNT'
                          ? 'text-[#DE2F1B]'
                          : 'text-white';

                      return (
                        <div key={`${stat.key}-${index}`} className="flex items-baseline justify-between rounded-xl border border-white/10 bg-black/25 px-3 py-2">
                          <span className="text-xs uppercase tracking-wide text-white/45">{stat.label}</span>
                          <span className={`text-sm font-semibold tabular-nums ${valueClass}`}>{stat.value}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <aside className="flex w-full flex-col items-center gap-4 md:w-[280px]">
                <button className="min-w-[180px] rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-[0.95rem] font-medium text-white/85 hover:bg-white/10">
                  Ver Equipo
                </button>
                <button className="min-w-[180px] rounded-lg border border-white/10 bg-white/5 px-5 py-3 text-[0.95rem] font-medium text-white/85 hover:bg-white/10">
                  Ver Reliquias
                </button>
              </aside>
            </div>
          </div>

          <div className="border-t border-white/10 px-5 py-5 md:px-7">
            <div className="flex flex-col gap-6 md:flex-row md:gap-8">
              <div className="flex-1 space-y-4">
                <section>
                  <h6 className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/45">Función</h6>
                  <p className="text-base text-white/85">{champion.role || '—'}</p>
                </section>

                <section>
                  <h6 className="mb-1 text-sm font-semibold uppercase tracking-[0.18em] text-white/45">Usos</h6>
                  <p className="whitespace-pre-line text-base text-white/80">{champion.uses || '—'}</p>
                </section>
              </div>

              <div className="md:w-[340px]">
                <div className="overflow-hidden rounded-xl bg-black/30 ring-1 ring-white/10">
                  {champion.video_preview ? (
                    <video className="h-auto w-full" preload="none" autoPlay playsInline muted loop>
                      <source src={champion.video_preview} type="video/mp4" />
                    </video>
                  ) : (
                    <div className="flex h-[190px] items-center justify-center text-white/40">Sin preview</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <IdealEquipment equipment={champion.ideal_equipment} />

        <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur md:p-6">
          <h2 className="mb-4 text-2xl font-bold">Zonas donde destaca</h2>

          {zoneRatings.length === 0 ? (
            <p className="text-white/50">Sin valoraciones todavía</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-2">
              {zoneRatings.map((item: any) => (
                <div key={item.id} className="rounded-2xl border border-white/10 bg-black/25 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <a href={`/zones/${item.zones?.slug}`} className="font-medium text-white hover:text-amber-300">
                      {item.zones?.name || 'Zona'}
                    </a>

                    <div className="flex items-center gap-3">
                      {renderStars(item.rating)}
                      <span className="min-w-[36px] text-right font-semibold text-white/80">{item.rating}</span>
                    </div>
                  </div>

                  {item.notes ? <p className="mt-2 text-sm text-white/65">{item.notes}</p> : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <ChampionTabs guideText={champion.guide_text} lore={champion.lore} skills={skills} />

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-2xl font-bold">Gear</h2>
            {renderSimpleList(champion.gear)}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <h2 className="mb-4 text-2xl font-bold">Reliquias</h2>
            {renderSimpleList(champion.relics)}
          </div>
        </section>
      </div>
    </main>
  );
}