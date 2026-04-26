export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const championId = searchParams.get('champion');

  if (!championId) {
    return Response.json({ data: [] });
  }

  const { data, error } = await supabase
    .from('zone_ratings')
    .select('id, champion_id, zone_id, rating, notes')
    .eq('champion_id', Number(championId));

  if (error) {
    console.error(error);
    return Response.json(
      { error: 'Error cargando valoraciones' },
      { status: 500 }
    );
  }

  return Response.json({ data: data || [] });
}

export async function POST(request: Request) {
  const body = await request.json();

  const { champion_id, zone_id, rating, notes } = body;

  if (!champion_id || !zone_id) {
    return Response.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('zone_ratings')
    .upsert(
      {
        champion_id: Number(champion_id),
        zone_id: Number(zone_id),
        rating: Number(rating),
        notes: notes || null,
      },
      {
        onConflict: 'champion_id,zone_id',
      }
    )
    .select();

  if (error) {
    console.error(error);
    return Response.json(
      { error: 'Error guardando valoración' },
      { status: 500 }
    );
  }

  return Response.json({ data });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  if (!id) {
    return Response.json({ error: 'Falta id' }, { status: 400 });
  }

  const { error } = await supabase
    .from('zone_ratings')
    .delete()
    .eq('id', Number(id));

  if (error) {
    console.error(error);
    return Response.json(
      { error: 'Error borrando valoración' },
      { status: 500 }
    );
  }

  return Response.json({ success: true });
}