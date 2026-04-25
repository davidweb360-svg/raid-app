import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.json();

  const { champion_id, zone_id, rating, notes } = body;

  if (!champion_id || !zone_id) {
    return Response.json({ error: 'Faltan datos' }, { status: 400 });
  }

  const { error } = await supabase
    .from('zone_ratings')
    .upsert(
      {
        champion_id,
        zone_id,
        rating,
        notes,
      },
      {
        onConflict: 'champion_id,zone_id',
      }
    );

  if (error) {
    console.error(error);
    return Response.json({ error: 'Error guardando' }, { status: 500 });
  }

  return Response.json({ success: true });
}