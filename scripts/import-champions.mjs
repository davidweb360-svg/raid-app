const SUPABASE_URL = 'https://eurpwtwjvybdlfytbjmk.supabase.co/rest/v1';
const SUPABASE_APIKEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV1cnB3dHdqdnliZGxmeXRiam1rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI3NzUxODgsImV4cCI6MjA3ODM1MTE4OH0.s7fj7Y-0JjRphoucHeCJ5cn5mt6qEclq-GZHvfNbsPM';

const DIRECTUS_URL = 'http://127.0.0.1:8055';

const supabaseHeaders = {
  apikey: SUPABASE_APIKEY,
  Authorization: `Bearer ${SUPABASE_APIKEY}`,
  Accept: 'application/json',
};

async function fetchAllChampions() {
  const url =
    `${SUPABASE_URL}/champions` +
    '?select=slug,name,faction,rarity,type,affinity,blessings,image_url,role,lore,uses,video_preview,youtube_link,relics,gear,stats,skills,aura,forms,is_published' +
    '&is_published=eq.true' +
    '&limit=1000';

  const res = await fetch(url, {
    headers: supabaseHeaders,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error sacando campeones de Supabase: ${res.status} ${text}`);
  }

  return res.json();
}

async function getDirectusChampionBySlug(slug) {
  const url = `${DIRECTUS_URL}/items/champions?filter[slug][_eq]=${encodeURIComponent(slug)}`;
  const res = await fetch(url);

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error consultando Directus: ${res.status} ${text}`);
  }

  const json = await res.json();
  return json?.data?.[0] || null;
}

async function createChampion(payload) {
  const res = await fetch(`${DIRECTUS_URL}/items/champions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error creando campeón: ${res.status} ${text}`);
  }

  return res.json();
}

async function updateChampion(id, payload) {
  const res = await fetch(`${DIRECTUS_URL}/items/champions/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error actualizando campeón ${id}: ${res.status} ${text}`);
  }

  return res.json();
}

function mapChampion(champ) {
  return {
    name: champ.name || null,
    slug: champ.slug || null,
    rarity: champ.rarity || null,
    affinity: champ.affinity || null,
    role: champ.role || null,
    image: null,
    image_url: champ.image_url || null,
    stats: champ.stats || null,
    skills: champ.skills || null,
    gear: champ.gear || null,
    relics: champ.relics || null,
    notes: null,
  };
}

async function main() {
  console.log('Sacando campeones desde La Fogata...');
  const champions = await fetchAllChampions();

  console.log(`Encontrados: ${champions.length}`);
  let created = 0;
  let updated = 0;
  let failed = 0;

  for (const champ of champions) {
    try {
      const payload = mapChampion(champ);
      const existing = await getDirectusChampionBySlug(champ.slug);

      if (existing) {
        await updateChampion(existing.id, payload);
        updated++;
        console.log(`Actualizado: ${champ.name}`);
      } else {
        await createChampion(payload);
        created++;
        console.log(`Creado: ${champ.name}`);
      }
    } catch (error) {
      failed++;
      console.error(`Error con ${champ?.name || champ?.slug}:`, error.message);
    }
  }

  console.log('---');
  console.log(`Creados: ${created}`);
  console.log(`Actualizados: ${updated}`);
  console.log(`Fallidos: ${failed}`);
}

main().catch((error) => {
  console.error('Error general:', error);
});