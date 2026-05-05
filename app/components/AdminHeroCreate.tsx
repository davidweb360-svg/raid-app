'use client';

import { useState } from 'react';

type Faction = {
  id: number;
  name: string;
  slug: string;
};

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function safeJson(text: string) {
  if (!text.trim()) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error('JSON inválido');
  }
}

export default function AdminHeroCreate({ factions }: { factions: Faction[] }) {
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [factionSlug, setFactionSlug] = useState('');
  const [rarity, setRarity] = useState('');
  const [affinity, setAffinity] = useState('');
  const [role, setRole] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoPreview, setVideoPreview] = useState('');
  const [backgroundImageUrl, setBackgroundImageUrl] = useState('');
  const [uses, setUses] = useState('');
  const [lore, setLore] = useState('');
  const [guideText, setGuideText] = useState('');
  const [stats, setStats] = useState('');
  const [skills, setSkills] = useState('');
  const [gear, setGear] = useState('');
  const [relics, setRelics] = useState('');
  const [idealEquipment, setIdealEquipment] = useState('');
  const [owned, setOwned] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  function handleNameChange(value: string) {
    setName(value);
    setSlug(slugify(value));
  }

  async function saveHero() {
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        name,
        slug,
        faction_slug: factionSlug,
        rarity,
        affinity,
        role,
        image_url: imageUrl,
        video_preview: videoPreview,
        background_image_url: backgroundImageUrl,
        uses,
        lore,
        guide_text: guideText,
        stats: safeJson(stats),
        skills: safeJson(skills),
        gear: safeJson(gear),
        relics: safeJson(relics),
        ideal_equipment: safeJson(idealEquipment),
        owned,
        champion_star_slots: [],
      };

      const res = await fetch('/api/admin-heroes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('Error creando campeón');

      setMessage('Campeón creado correctamente');
    } catch (error: any) {
      setMessage(error?.message || 'Error creando campeón');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="rounded-2xl bg-black/30 p-3" placeholder="Nombre" value={name} onChange={(e) => handleNameChange(e.target.value)} />
        <input className="rounded-2xl bg-black/30 p-3" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />

        <select className="rounded-2xl bg-black/30 p-3" value={factionSlug} onChange={(e) => setFactionSlug(e.target.value)}>
          <option value="">Facción</option>
          {factions.map((faction) => (
            <option key={faction.id} value={faction.slug}>
              {faction.name}
            </option>
          ))}
        </select>

        <input className="rounded-2xl bg-black/30 p-3" placeholder="Rareza" value={rarity} onChange={(e) => setRarity(e.target.value)} />
        <input className="rounded-2xl bg-black/30 p-3" placeholder="Afinidad" value={affinity} onChange={(e) => setAffinity(e.target.value)} />
        <input className="rounded-2xl bg-black/30 p-3" placeholder="Rol" value={role} onChange={(e) => setRole(e.target.value)} />

        <input className="rounded-2xl bg-black/30 p-3 md:col-span-2" placeholder="URL imagen" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
        <input className="rounded-2xl bg-black/30 p-3 md:col-span-2" placeholder="URL vídeo preview" value={videoPreview} onChange={(e) => setVideoPreview(e.target.value)} />
        <input className="rounded-2xl bg-black/30 p-3 md:col-span-2" placeholder="URL fondo" value={backgroundImageUrl} onChange={(e) => setBackgroundImageUrl(e.target.value)} />
      </div>

      <label className="flex items-center gap-3">
        <input type="checkbox" checked={owned} onChange={(e) => setOwned(e.target.checked)} />
        Lo tiene
      </label>

      <textarea className="min-h-24 w-full rounded-2xl bg-black/30 p-3" placeholder="Usos" value={uses} onChange={(e) => setUses(e.target.value)} />
      <textarea className="min-h-24 w-full rounded-2xl bg-black/30 p-3" placeholder="Lore" value={lore} onChange={(e) => setLore(e.target.value)} />
      <textarea className="min-h-24 w-full rounded-2xl bg-black/30 p-3" placeholder="Guía" value={guideText} onChange={(e) => setGuideText(e.target.value)} />

      <textarea className="min-h-32 w-full rounded-2xl bg-black/30 p-3 font-mono text-sm" placeholder='Stats JSON: {"hp":12345,"speed":100}' value={stats} onChange={(e) => setStats(e.target.value)} />
      <textarea className="min-h-32 w-full rounded-2xl bg-black/30 p-3 font-mono text-sm" placeholder="Skills JSON" value={skills} onChange={(e) => setSkills(e.target.value)} />
      <textarea className="min-h-32 w-full rounded-2xl bg-black/30 p-3 font-mono text-sm" placeholder="Gear JSON" value={gear} onChange={(e) => setGear(e.target.value)} />
      <textarea className="min-h-32 w-full rounded-2xl bg-black/30 p-3 font-mono text-sm" placeholder="Reliquias JSON" value={relics} onChange={(e) => setRelics(e.target.value)} />
      <textarea className="min-h-32 w-full rounded-2xl bg-black/30 p-3 font-mono text-sm" placeholder="Equipo ideal JSON" value={idealEquipment} onChange={(e) => setIdealEquipment(e.target.value)} />

      <button
        onClick={saveHero}
        disabled={saving}
        className="rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-black hover:bg-amber-400 disabled:opacity-50"
      >
        {saving ? 'Guardando...' : 'Crear campeón'}
      </button>

      {message ? <p className="text-sm text-white/75">{message}</p> : null}
    </div>
  );
}