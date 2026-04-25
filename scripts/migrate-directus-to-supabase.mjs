import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const DIRECTUS_URL = 'http://127.0.0.1:8055';
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error('Faltan variables de Supabase en .env.local');
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

async function getDirectusItems(collection) {
  const res = await fetch(`${DIRECTUS_URL}/items/${collection}?limit=1000`);
  const json = await res.json();

  if (!res.ok) {
    throw new Error(`Error leyendo ${collection}: ${JSON.stringify(json)}`);
  }

  return json.data || [];
}

async function migrateChampions() {
  const champions = await getDirectusItems('champions');

  const rows = champions.map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    rarity: c.rarity,
    affinity: c.affinity,
    role: c.role,
    image_url: c.image_url,
    video_preview: c.video_preview,
    uses: c.uses,
    lore: c.lore,
    guide_text: c.guide_text,
    background_image_url: c.background_image_url,
    stats: c.stats,
    skills: c.skills,
    gear: c.gear,
    relics: c.relics,
    ideal_equipment: c.ideal_equipment,
    owned: c.owned || false,
    priority: c.priority,
    notes: c.notes,
  }));

  const { error } = await supabase
    .from('champions')
    .upsert(rows, { onConflict: 'id' });

  if (error) throw error;

  console.log(`✅ Campeones migrados: ${rows.length}`);
}

async function migrateZones() {
  const zones = await getDirectusItems('zones');

  const rows = zones.map((z) => ({
    id: z.id,
    name: z.name,
    slug: z.slug,
  }));

  const { error } = await supabase
    .from('zones')
    .upsert(rows, { onConflict: 'id' });

  if (error) throw error;

  console.log(`✅ Zonas migradas: ${rows.length}`);
}

async function migrateZoneRatings() {
  const ratings = await getDirectusItems('zone_ratings');

  const rows = ratings.map((r) => ({
    id: r.id,
    champion_id: r.champion,
    zone_id: r.zone,
    rating: r.rating,
    notes: r.notes,
  }));

  if (rows.length === 0) {
    console.log('ℹ️ No hay valoraciones de zonas todavía');
    return;
  }

  const { error } = await supabase
    .from('zone_ratings')
    .upsert(rows, { onConflict: 'id' });

  if (error) throw error;

  console.log(`✅ Valoraciones migradas: ${rows.length}`);
}

async function main() {
  console.log('Migrando Directus → Supabase...');
  await migrateChampions();
  await migrateZones();
  await migrateZoneRatings();
  console.log('🚀 Migración completada');
}

main().catch((error) => {
  console.error('❌ Error:', error.message || error);
});