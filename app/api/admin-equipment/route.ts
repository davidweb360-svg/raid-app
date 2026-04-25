const DIRECTUS_URL = 'http://127.0.0.1:8055';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const championId = searchParams.get('champion');

  if (!championId) {
    return Response.json({ data: null });
  }

  try {
    const res = await fetch(
      `${DIRECTUS_URL}/items/champions/${championId}?fields=id,name,ideal_equipment`,
      { cache: 'no-store' }
    );

    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return Response.json({ error: 'Error cargando equipo ideal' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ideal_equipment } = body;

    if (!id) {
      return Response.json({ error: 'Falta id' }, { status: 400 });
    }

    const res = await fetch(`${DIRECTUS_URL}/items/champions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ideal_equipment }),
    });

    const text = await res.text();

    return new Response(text, {
      status: res.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return Response.json({ error: 'Error guardando equipo ideal' }, { status: 500 });
  }
}