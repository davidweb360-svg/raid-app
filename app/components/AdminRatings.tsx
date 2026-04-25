'use client';

import { useEffect, useMemo, useState } from 'react';

type Champion = {
  id: number;
  name: string;
  slug: string;
};

type Zone = {
  id: number;
  name: string;
  slug: string;
};

export default function AdminRatings({
  champions,
  zones,
}: {
  champions: Champion[];
  zones: Zone[];
}) {
  const [selectedChampion, setSelectedChampion] = useState<string>('');
  const [search, setSearch] = useState('');
  const [ratings, setRatings] = useState<
    Record<number, { id?: number; rating: number; notes: string }>
  >({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const filteredChampions = useMemo(() => {
    const text = search.trim().toLowerCase();
    if (!text) return champions.slice(0, 30);

    return champions
      .filter((champ) => champ.name.toLowerCase().includes(text))
      .slice(0, 30);
  }, [champions, search]);

  const selectedChampionData = useMemo(
    () => champions.find((c) => String(c.id) === selectedChampion),
    [champions, selectedChampion]
  );

  useEffect(() => {
    async function loadRatings() {
      if (!selectedChampion) {
        setRatings({});
        return;
      }

      setLoading(true);
      setMessage('');

      try {
        const res = await fetch(`/api/admin-ratings?champion=${selectedChampion}`);
        const json = await res.json();
        const items = Array.isArray(json?.data) ? json.data : [];

        const mapped: Record<number, { id?: number; rating: number; notes: string }> =
          {};

        for (const item of items) {
          mapped[item.zone_id] = {
            id: item.id,
            rating: Number(item.rating || 0),
            notes: item.notes || '',
          };
        }

        setRatings(mapped);
      } catch (error) {
        setMessage('Error cargando valoraciones');
      } finally {
        setLoading(false);
      }
    }

    loadRatings();
  }, [selectedChampion]);

  function updateZoneRating(zoneId: number, value: number) {
    setRatings((prev) => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        rating: value,
        notes: prev[zoneId]?.notes || '',
      },
    }));
  }

  function updateZoneNotes(zoneId: number, value: string) {
    setRatings((prev) => ({
      ...prev,
      [zoneId]: {
        ...prev[zoneId],
        rating: prev[zoneId]?.rating || 0,
        notes: value,
      },
    }));
  }

  async function saveAll() {
    if (!selectedChampion) {
      setMessage('Selecciona un campeón primero');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      for (const zone of zones) {
        const item = ratings[zone.id];

        if (!item || item.rating === 0) continue;

        const res = await fetch(`/api/admin-ratings`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            champion_id: Number(selectedChampion),
            zone_id: zone.id,
            rating: item.rating,
            notes: item.notes,
          }),
        });

        if (!res.ok) {
          throw new Error('Error guardando una valoración');
        }
      }

      setMessage('Valoraciones guardadas correctamente');
    } catch (error) {
      setMessage('Error guardando valoraciones');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
        <label className="mb-2 block text-sm text-white/70">
          Buscar campeón
        </label>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Escribe el nombre del campeón..."
          className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
        />

        <div className="max-h-72 overflow-auto rounded-2xl border border-white/10 bg-black/20">
          {filteredChampions.map((champ) => (
            <button
              key={champ.id}
              onClick={() => setSelectedChampion(String(champ.id))}
              className={`flex w-full items-center justify-between px-4 py-3 text-left transition hover:bg-white/10 ${
                String(champ.id) === selectedChampion
                  ? 'bg-amber-500/15 text-amber-300'
                  : 'text-white'
              }`}
            >
              <span>{champ.name}</span>
              {String(champ.id) === selectedChampion ? (
                <span className="text-sm">Seleccionado</span>
              ) : null}
            </button>
          ))}

          {filteredChampions.length === 0 ? (
            <div className="px-4 py-3 text-white/50">
              No se encontraron campeones
            </div>
          ) : null}
        </div>

        {selectedChampionData ? (
          <p className="mt-3 text-sm text-white/55">
            Editando valoraciones de: {selectedChampionData.name}
          </p>
        ) : null}
      </div>

      {loading && (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
          Cargando valoraciones...
        </div>
      )}

      {!!selectedChampion && !loading && (
        <div className="space-y-4">
          {zones.map((zone) => {
            const current = ratings[zone.id] || { rating: 0, notes: '' };

            return (
              <div
                key={zone.id}
                className="rounded-3xl border border-white/10 bg-white/5 p-5"
              >
                <div className="mb-3 flex items-center justify-between gap-4">
                  <h3 className="text-xl font-semibold">{zone.name}</h3>

                  <select
                    value={current.rating}
                    onChange={(e) =>
                      updateZoneRating(zone.id, Number(e.target.value))
                    }
                    className="rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-white"
                  >
                    <option value={0}>0</option>
                    <option value={0.5}>0.5</option>
                    <option value={1}>1</option>
                    <option value={1.5}>1.5</option>
                    <option value={2}>2</option>
                    <option value={2.5}>2.5</option>
                    <option value={3}>3</option>
                    <option value={3.5}>3.5</option>
                    <option value={4}>4</option>
                    <option value={4.5}>4.5</option>
                    <option value={5}>5</option>
                  </select>
                </div>

                <textarea
                  value={current.notes}
                  onChange={(e) => updateZoneNotes(zone.id, e.target.value)}
                  placeholder="Notas opcionales..."
                  className="min-h-[80px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
                />
              </div>
            );
          })}

          <div className="flex items-center gap-4">
            <button
              onClick={saveAll}
              disabled={saving}
              className="rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
            >
              {saving ? 'Guardando...' : 'Guardar valoraciones'}
            </button>

            {message && <p className="text-sm text-white/75">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
}