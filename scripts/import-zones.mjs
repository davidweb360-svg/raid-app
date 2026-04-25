const DIRECTUS_URL = 'http://127.0.0.1:8055';

const zones = [
  'Gemelos',
  'Necrópolis de Arena',
  'Arboleda del Shogun',
  'Dragón de Magma',
  'Araña de Hielo',
  'Araña Abisal',
  'Rey Escarabajo',
  'Grifo Celestial',
  'Dragón Eterno',
  'Cuerno del Terror',
  'Hada Oscura',
  'Facciones',
  'Ciudad Maldita',
  'Bosque Lúgubre',
  'Torre del Destino',
];

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .replace(/^-|-$/g, '');
}

async function getZoneBySlug(slug) {
  const res = await fetch(
    `${DIRECTUS_URL}/items/zones?filter[slug][_eq]=${encodeURIComponent(slug)}`
  );

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Error consultando zones: ${res.status} ${text}`);
  }

  const json = JSON.parse(text);
  return json?.data?.[0] || null;
}

async function createZone(name) {
  const slug = slugify(name);

  const existing = await getZoneBySlug(slug);
  if (existing) {
    return { status: 'exists', item: existing };
  }

  const res = await fetch(`${DIRECTUS_URL}/items/zones`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
      slug,
    }),
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`Error creando ${name}: ${res.status} ${text}`);
  }

  const json = JSON.parse(text);
  return { status: 'created', item: json?.data || json };
}

async function main() {
  console.log('Creando zonas...');

  let created = 0;
  let existing = 0;
  let failed = 0;

  for (const zone of zones) {
    try {
      const result = await createZone(zone);

      if (result.status === 'created') {
        created++;
        console.log(`✅ Creada: ${zone}`);
      } else {
        existing++;
        console.log(`ℹ️ Ya existía: ${zone}`);
      }
    } catch (err) {
      failed++;
      console.log(`❌ Error con ${zone}: ${err.message}`);
    }
  }

  console.log('---');
  console.log(`Creadas: ${created}`);
  console.log(`Ya existentes: ${existing}`);
  console.log(`Fallidas: ${failed}`);
}

main();