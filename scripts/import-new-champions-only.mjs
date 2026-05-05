import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';

const OUR_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const OUR_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const FOGATA_API_KEY = process.env.FOGATA_API_KEY;

if (!OUR_SUPABASE_URL || !OUR_SERVICE_KEY || !FOGATA_API_KEY) {
  throw new Error('Faltan variables en .env');
}

const ourSupabase = createClient(OUR_SUPABASE_URL, OUR_SERVICE_KEY);

const FOGATA_URL = 'https://eurpwtwjvybdlfytbjmk.supabase.co/rest/v1';

const fogataHeaders = {
  apikey: FOGATA_API_KEY,
  Authorization: `Bearer ${FOGATA_API_KEY}`,
  Accept: 'application/json',
};

function normalizeFaction(value) {
  if (!value) return null;

  const text = String(value)
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');

  const map = {
    hidalgos: 'hidalgos',
    'altos elfos': 'altos-elfos',
    'orden sagrada': 'orden-sagrada',
    barbaros: 'barbaros',
    ogretes: 'ogretes',
    'hombres lagarto': 'hombres-lagarto',
    cambiapieles: 'cambiapieles',
    orcos: 'orcos',
    engendros: 'engendros',
    'no muertos': 'no-muertos',
    'elfos oscuros': 'elfos-oscuros',
    aparecidos: 'aparecidos',
    enanos: 'enanos',
    sombrios: 'sombrios',
    'vigias silvanos': 'vigias-silvanos',
    argonitas: 'argonitas',
  };

  return map[text] || text.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

async function fetchFogataChampions() {
  const url =
    `${FOGATA_URL}/champions` +
    '?select=slug,name,faction,rarity,type,affinity,blessings,image_url,role,lore,uses,video_preview,youtube_link,relics,gear,stats,skills,aura,forms,is_published' +
    '&is_published=eq.true' +
    '&limit=1000';

  const res = await fetch(url, { headers: fogataHeaders });
  const data = await res.json();

  if (!res.ok) {
    console.error(data);
    throw new Error('No se pudo leer La Fogata');
  }

  return data;
}

function mapNewChampion(champ) {
  return {
    name: champ.name || null,
    slug: champ.slug || null,
    rarity: champ.rarity || null,
    affinity: champ.affinity || null,
    role: champ.role || null,
    faction_slug: normalizeFaction(champ.faction),
    image_url: champ.image_url || null,
    video_preview: champ.video_preview || null,
    lore: champ.lore || null,
    uses: champ.uses || null,
    stats: champ.stats || null,
    skills: champ.skills || null,
    gear: champ.gear || null,
    relics: champ.relics || null,
    owned: false,
    champion_star_slots: [],
    notes: null,
  };
}

async function main() {
  console.log('Leyendo campeones desde La Fogata...');
  const fogataChampions = await fetchFogataChampions();

  console.log(`Encontrados en La Fogata: ${fogataChampions.length}`);

  const { data: existingChampions, error } = await ourSupabase
    .from('champions')
    .select('slug');

  if (error) throw error;

  const existingSlugs = new Set((existingChampions || []).map((c) => c.slug));

  const newChampions = fogataChampions
    .filter((champ) => champ.slug && !existingSlugs.has(champ.slug))
    .map(mapNewChampion);

  if (newChampions.length === 0) {
    console.log('✅ No hay campeones nuevos');
    return;
  }

  const { data, error: insertError } = await ourSupabase
    .from('champions')
    .insert(newChampions)
    .select('name,slug');

  if (insertError) throw insertError;

  console.log(`✅ Campeones nuevos creados: ${data.length}`);
  for (const champ of data) {
    console.log(`- ${champ.name} (${champ.slug})`);
  }

  console.log('🚀 Listo');
}

main().catch((error) => {
  console.error('❌ Error:', error.message || error);
});