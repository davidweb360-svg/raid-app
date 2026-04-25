import { supabase } from '@/lib/supabase';

async function getZone(slug: string) {
  const { data, error } = await supabase
    .from('zones')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error cargando zona:', error);
    return null;
  }

  return data;
}

async function getZoneRatings(zoneId: number) {
  const { data, error } = await supabase
    .from('zone_ratings')
    .select(`
      id,
      rating,
      notes,
      champions (
        id,
        name,
        slug,
        image_url,
        rarity,
        affinity,
        role,
        owned
      )
    `)
    .eq('zone_id', zoneId)
    .order('rating', { ascending: false });

  if (error) {
    console.error('Error cargando valoraciones de zona:', error);
    return [];
  }

  return data || [];
}

function renderStars(rating: number | null | undefined) {
  const value = Number(rating || 0);
  const full = Math.floor(value);
  const half = value % 1 >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);

  return (
    <div className="flex items-center gap-1">
      {'★'.repeat(full)}
      {half ? '⯪' : ''}
      {'☆'.repeat(empty)}
    </div>
  );
}

export default async function ZoneDetailPage({
  params,
}: {
  params: Promise<{ slug: string }> | { slug: string };
}) {
  const resolvedParams = await params;
  const zone = await getZone(resolvedParams.slug);

  if (!zone) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 p-8 text-white">
        <div className="mx-auto max-w-5xl">
          <h1 className="text-3xl font-bold">Zona no encontrada</h1>
        </div>
      </main>
    );
  }

  const ratings = await getZoneRatings(zone.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <a
          href="/zones"
          className="mb-6 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          ← Volver a zonas
        </a>

        <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
          Zona del juego
        </p>

        <h1 className="mb-3 mt-2 text-5xl font-bold">{zone.name}</h1>

        <p className="mb-8 text-white/65">
          Mejores campeones valorados para esta zona.
        </p>

        {ratings.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/70">
            Todavía no hay valoraciones para esta zona.
          </div>
        ) : (
          <div className="space-y-4">
            {ratings.map((item: any, index: number) => {
              const champ = item.champions;

              return (
                <div
                  key={item.id}
                  className="grid items-center gap-4 rounded-3xl border border-white/10 bg-white/5 p-4 md:grid-cols-[64px,88px,1fr,140px,120px]"
                >
                  <div className="text-2xl font-bold text-amber-400">
                    #{index + 1}
                  </div>

                  <div className="h-20 w-20 overflow-hidden rounded-2xl bg-black/30">
                    {champ?.image_url ? (
                      <img
                        src={champ.image_url}
                        alt={champ.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-white/40">
                        Sin imagen
                      </div>
                    )}
                  </div>

                  <div>
                    <a
                      href={`/champion/${champ?.slug}`}
                      className="text-xl font-semibold hover:text-amber-300"
                    >
                      {champ?.name}
                    </a>

                    <div className="mt-1 flex flex-wrap gap-2 text-sm text-white/60">
                      {champ?.rarity && <span>{champ.rarity}</span>}
                      {champ?.affinity && <span>• {champ.affinity}</span>}
                      {champ?.role && <span>• {champ.role}</span>}
                    </div>

                    {item.notes && (
                      <p className="mt-2 text-sm text-white/75">{item.notes}</p>
                    )}
                  </div>

                  <div className="text-amber-300">
                    {renderStars(item.rating)}
                  </div>

                  <div className="text-right text-2xl font-bold">
                    {item.rating}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}