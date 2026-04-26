'use client';

import { useEffect, useMemo, useState } from 'react';

type Champion = {
  id: number;
  name: string;
};

const STAR_OPTIONS = [
  { value: 'empty', label: 'Vacía', symbol: '☆', className: 'text-white/30' },
  { value: 'yellow', label: 'Amarilla', symbol: '★', className: 'text-amber-300' },
  { value: 'purple', label: 'Morada / rosa', symbol: '★', className: 'text-fuchsia-400' },
  { value: 'red', label: 'Roja', symbol: '★', className: 'text-red-500' },
];

function normalizeSlots(value: any): string[] {
  if (!Array.isArray(value)) return ['empty', 'empty', 'empty', 'empty', 'empty', 'empty'];

  const cleaned = value.slice(0, 6).map((item) => {
    if (['yellow', 'purple', 'red', 'empty'].includes(item)) return item;
    return 'empty';
  });

  while (cleaned.length < 6) cleaned.push('empty');

  return cleaned;
}

export default function AdminChampionStatus({
  champions,
}: {
  champions: Champion[];
}) {
  const [selectedChampion, setSelectedChampion] = useState('');
  const [search, setSearch] = useState('');
  const [owned, setOwned] = useState(false);
  const [starSlots, setStarSlots] = useState<string[]>(normalizeSlots([]));
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
    async function loadChampion() {
      if (!selectedChampion) return;

      setLoading(true);
      setMessage('');

      try {
        const res = await fetch(`/api/admin-champion?champion=${selectedChampion}`);
        const json = await res.json();
        const champ = json?.data;

        setOwned(Boolean(champ?.owned));
        setStarSlots(normalizeSlots(champ?.champion_star_slots));
      } catch {
        setMessage('Error cargando campeón');
      } finally {
        setLoading(false);
      }
    }

    loadChampion();
  }, [selectedChampion]);

  function updateSlot(index: number, value: string) {
    setStarSlots((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  }

  async function saveChampion() {
    if (!selectedChampion) {
      setMessage('Selecciona un campeón');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/admin-champion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(selectedChampion),
          owned,
          champion_star_slots: starSlots,
        }),
      });

      if (!res.ok) throw new Error('Error guardando');

      setMessage('Campeón guardado correctamente');
    } catch {
      setMessage('Error guardando campeón');
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
        </div>

        {selectedChampionData ? (
          <p className="mt-3 text-sm text-white/55">
            Editando estado de: {selectedChampionData.name}
          </p>
        ) : null}
      </div>

      {!!selectedChampion && !loading ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <label className="mb-6 flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 p-4 text-white/80">
            <input
              type="checkbox"
              checked={owned}
              onChange={(e) => setOwned(e.target.checked)}
              className="h-5 w-5"
            />
            Lo tiene
          </label>

          <h2 className="mb-4 text-2xl font-bold">Estrellas del campeón</h2>

          <div className="mb-6 flex flex-wrap gap-2 text-4xl">
            {starSlots.map((slot, index) => {
              const option = STAR_OPTIONS.find((item) => item.value === slot) || STAR_OPTIONS[0];

              return (
                <span key={index} className={option.className}>
                  {option.symbol}
                </span>
              );
            })}
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {starSlots.map((slot, index) => (
              <div
                key={index}
                className="rounded-2xl border border-white/10 bg-black/30 p-4"
              >
                <label className="mb-2 block text-sm text-white/55">
                  Estrella {index + 1}
                </label>

                <select
                  value={slot}
                  onChange={(e) => updateSlot(index, e.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
                >
                  {STAR_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <button
            onClick={saveChampion}
            disabled={saving}
            className="mt-6 rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar estado del campeón'}
          </button>

          {message ? <p className="mt-3 text-sm text-white/75">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}