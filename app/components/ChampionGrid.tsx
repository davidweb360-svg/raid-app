'use client';

import ChampionStars from './ChampionStars';
import { useMemo, useState } from 'react';

export default function ChampionGrid({ champions }: { champions: any[] }) {
  const [search, setSearch] = useState('');
  const [ownedOnly, setOwnedOnly] = useState(false);
  const [rarity, setRarity] = useState('');
  const [affinity, setAffinity] = useState('');

  const rarities = useMemo(() => {
    return [...new Set(champions.map((c) => c.rarity).filter(Boolean))].sort();
  }, [champions]);

  const affinities = useMemo(() => {
    return [...new Set(champions.map((c) => c.affinity).filter(Boolean))].sort();
  }, [champions]);

  const filteredChampions = useMemo(() => {
    return champions.filter((champ) => {
      const text = search.toLowerCase();

      const matchesSearch =
        !text ||
        champ.name?.toLowerCase().includes(text) ||
        champ.role?.toLowerCase().includes(text) ||
        champ.affinity?.toLowerCase().includes(text) ||
        champ.rarity?.toLowerCase().includes(text);

      const matchesOwned = ownedOnly ? champ.owned === true : true;
      const matchesRarity = rarity ? champ.rarity === rarity : true;
      const matchesAffinity = affinity ? champ.affinity === affinity : true;

      return matchesSearch && matchesOwned && matchesRarity && matchesAffinity;
    });
  }, [champions, search, ownedOnly, rarity, affinity]);

  return (
    <>
      <div className="mb-8 grid gap-4 rounded-3xl border border-white/10 bg-white/[0.04] p-4 lg:grid-cols-4">
        <input
          type="text"
          placeholder="Buscar por nombre, rol, afinidad o rareza..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
        />

        <select
          value={rarity}
          onChange={(e) => setRarity(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        >
          <option value="">Todas las rarezas</option>
          {rarities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <select
          value={affinity}
          onChange={(e) => setAffinity(e.target.value)}
          className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
        >
          <option value="">Todas las afinidades</option>
          {affinities.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white/80">
          <input
            type="checkbox"
            checked={ownedOnly}
            onChange={(e) => setOwnedOnly(e.target.checked)}
            className="h-4 w-4"
          />
          Solo los que tiene
        </label>
      </div>

      <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-white/60">
        <span>
          Mostrando {filteredChampions.length} de {champions.length} campeones
        </span>

        {(search || ownedOnly || rarity || affinity) && (
          <button
            onClick={() => {
              setSearch('');
              setOwnedOnly(false);
              setRarity('');
              setAffinity('');
            }}
            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-white/80 hover:bg-white/10"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredChampions.map((champ: any) => (
          <article
            key={champ.id}
            className="group overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl backdrop-blur transition hover:-translate-y-1 hover:border-amber-400/40"
          >
            <div className="relative h-64 overflow-hidden bg-gradient-to-br from-amber-500/20 via-red-500/10 to-blue-500/10">
              {champ.image_url ? (
                <img
                  src={champ.image_url}
                  alt={champ.name}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-white/40">
                  Sin imagen
                </div>
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

              <div className="absolute bottom-4 left-4 right-4">
                <span className="inline-block rounded-full border border-amber-400/30 bg-black/50 px-3 py-1 text-xs font-medium uppercase tracking-wide text-amber-300">
                  {champ.rarity || 'Sin rareza'}
                </span>
              </div>
            </div>

            <div className="p-5">
              <h2 className="line-clamp-2 text-2xl font-bold">
                {champ.name}
              </h2>
              <div className="mt-2">
  <ChampionStars slots={champ.champion_star_slots} size="sm" />
</div>

              <div className="mt-4 space-y-2 text-sm text-white/75">
                <p>
                  <span className="text-white/45">Afinidad:</span>{' '}
                  {champ.affinity || '—'}
                </p>
                <p>
                  <span className="text-white/45">Rol:</span>{' '}
                  {champ.role || '—'}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    champ.owned
                      ? 'border border-emerald-400/20 bg-emerald-500/15 text-emerald-300'
                      : 'border border-white/10 bg-white/10 text-white/70'
                  }`}
                >
                  {champ.owned ? 'Lo tiene' : 'No lo tiene'}
                </span>

                <a
                  href={`/champion/${champ.slug}`}
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10"
                >
                  Ver ficha
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}