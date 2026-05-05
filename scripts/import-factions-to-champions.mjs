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
    '?select=slug,name,faction,is_published' +
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

async function main() {
  console.log('Importando facciones desde La Fogata...');

  const champions = await fetchFogataChampions();

  let updated = 0;
  let skipped = 0;

  for (const champ of champions) {
    const factionSlug = normalizeFaction(champ.faction);

    if (!champ.slug || !factionSlug) {
      skipped++;
      continue;
    }

    const { error } = await ourSupabase
      .from('champions')
      .update({ faction_slug: factionSlug })
      .eq('slug', champ.slug);

    if (error) {
      console.log(`❌ ${champ.name}: ${error.message}`);
      skipped++;
    } else {
      updated++;
      console.log(`✅ ${champ.name} → ${factionSlug}`);
    }
  }

  console.log('---');
  console.log(`Actualizados: ${updated}`);
  console.log(`Saltados: ${skipped}`);
  console.log('🚀 Listo');
}

main().catch((error) => {
  console.error('❌ Error:', error.message || error);
});