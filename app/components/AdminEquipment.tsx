'use client';

import { useEffect, useMemo, useState } from 'react';

type Champion = {
  id: number;
  name: string;
};

type EquipmentState = Record<
  string,
  {
    principal: string;
    substats: string;
  }
>;

const SLOT_ORDER = [
  'arma',
  'casco',
  'escudo',
  'guantes',
  'pecho',
  'botas',
  'anillo',
  'amuleto',
  'estandarte',
] as const;

const SLOT_LABELS: Record<string, string> = {
  arma: 'Arma',
  casco: 'Casco',
  escudo: 'Escudo',
  guantes: 'Guantes',
  pecho: 'Pecho',
  botas: 'Botas',
  anillo: 'Anillo',
  amuleto: 'Amuleto',
  estandarte: 'Estandarte',
};

const PRINCIPAL_OPTIONS: Record<string, string[]> = {
  arma: ['ATK'],
  casco: ['HP'],
  escudo: ['DEF'],
  guantes: ['Prob. Crítico', 'Daño Crítico', 'HP%', 'ATK%', 'DEF%', 'HP', 'ATK', 'DEF'],
  pecho: ['Precisión', 'Resistencia', 'HP%', 'ATK%', 'DEF%', 'HP', 'ATK', 'DEF'],
  botas: ['Velocidad', 'HP%', 'ATK%', 'DEF%', 'HP', 'ATK', 'DEF'],
  anillo: ['HP', 'ATK', 'DEF'],
  amuleto: ['Daño Crítico', 'HP', 'ATK', 'DEF'],
  estandarte: ['Precisión', 'Resistencia', 'HP', 'ATK', 'DEF'],
};

function getEmptyState(): EquipmentState {
  return {
    arma: { principal: 'ATK', substats: '' },
    casco: { principal: 'HP', substats: '' },
    escudo: { principal: 'DEF', substats: '' },
    guantes: { principal: '', substats: '' },
    pecho: { principal: '', substats: '' },
    botas: { principal: '', substats: '' },
    anillo: { principal: '', substats: '' },
    amuleto: { principal: '', substats: '' },
    estandarte: { principal: '', substats: '' },
  };
}

function normalizeEquipment(input: any): EquipmentState {
  const base = getEmptyState();

  if (!input) return base;

  let parsed = input;

  if (typeof input === 'string') {
    try {
      parsed = JSON.parse(input);
    } catch {
      return base;
    }
  }

  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return base;
  }

  for (const slot of SLOT_ORDER) {
    const item = parsed[slot];
    if (!item || typeof item !== 'object') continue;

    base[slot] = {
      principal: typeof item.principal === 'string' ? item.principal : base[slot].principal,
      substats: Array.isArray(item.substats)
        ? item.substats.join(' / ')
        : typeof item.substats === 'string'
        ? item.substats
        : '',
    };
  }

  return base;
}

export default function AdminEquipment({
  champions,
}: {
  champions: Champion[];
}) {
  const [selectedChampion, setSelectedChampion] = useState('');
  const [search, setSearch] = useState('');
  const [equipment, setEquipment] = useState<EquipmentState>(getEmptyState());
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
      if (!selectedChampion) {
        setEquipment(getEmptyState());
        return;
      }

      setLoading(true);
      setMessage('');

      try {
        const res = await fetch(`/api/admin-equipment?champion=${selectedChampion}`);
        const json = await res.json();
        const champ = json?.data || null;

        setEquipment(normalizeEquipment(champ?.ideal_equipment));
      } catch (error) {
        setMessage('Error cargando el equipo ideal');
      } finally {
        setLoading(false);
      }
    }

    loadChampion();
  }, [selectedChampion]);

  function updatePrincipal(slot: string, value: string) {
    setEquipment((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        principal: value,
      },
    }));
  }

  function updateSubstats(slot: string, value: string) {
    setEquipment((prev) => ({
      ...prev,
      [slot]: {
        ...prev[slot],
        substats: value,
      },
    }));
  }

  async function saveEquipment() {
    if (!selectedChampion) {
      setMessage('Selecciona un campeón');
      return;
    }

    setSaving(true);
    setMessage('');

    try {
      const payload: Record<string, { principal: string; substats: string[] | string }> = {};

      for (const slot of SLOT_ORDER) {
        payload[slot] = {
          principal: equipment[slot].principal,
          substats: equipment[slot].substats
            ? equipment[slot].substats
                .split('/')
                .map((s) => s.trim())
                .filter(Boolean)
            : [],
        };
      }

      const res = await fetch('/api/admin-equipment', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: Number(selectedChampion),
          ideal_equipment: payload,
        }),
      });

      if (!res.ok) {
        throw new Error('No se pudo guardar');
      }

      setMessage('Equipo ideal guardado correctamente');
    } catch (error) {
      setMessage('Error guardando el equipo ideal');
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
                String(champ.id) === selectedChampion ? 'bg-amber-500/15 text-amber-300' : 'text-white'
              }`}
            >
              <span>{champ.name}</span>
              {String(champ.id) === selectedChampion ? (
                <span className="text-sm">Seleccionado</span>
              ) : null}
            </button>
          ))}

          {filteredChampions.length === 0 ? (
            <div className="px-4 py-3 text-white/50">No se encontraron campeones</div>
          ) : null}
        </div>

        {selectedChampionData ? (
          <p className="mt-3 text-sm text-white/55">
            Editando equipo ideal de: {selectedChampionData.name}
          </p>
        ) : null}
      </div>

      {loading ? (
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-white/70">
          Cargando equipo ideal...
        </div>
      ) : null}

      {!!selectedChampion && !loading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {SLOT_ORDER.map((slot) => (
            <div
              key={slot}
              className="rounded-3xl border border-white/10 bg-white/5 p-5"
            >
              <h3 className="mb-4 text-xl font-semibold">{SLOT_LABELS[slot]}</h3>

              <label className="mb-2 block text-sm text-white/55">Atributo principal</label>
              <select
                value={equipment[slot].principal}
                onChange={(e) => updatePrincipal(slot, e.target.value)}
                className="mb-4 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none"
              >
                <option value="">-- Selecciona --</option>
                {PRINCIPAL_OPTIONS[slot].map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>

              <label className="mb-2 block text-sm text-white/55">
                Substats recomendados
              </label>
              <textarea
                value={equipment[slot].substats}
                onChange={(e) => updateSubstats(slot, e.target.value)}
                placeholder="Ej: HP% / DEF% / VEL"
                className="min-h-[88px] w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
              />
            </div>
          ))}
        </div>
      ) : null}

      {!!selectedChampion ? (
        <div className="flex items-center gap-4">
          <button
            onClick={saveEquipment}
            disabled={saving}
            className="rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400 disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar equipo ideal'}
          </button>

          {message ? <p className="text-sm text-white/75">{message}</p> : null}
        </div>
      ) : null}
    </div>
  );
}