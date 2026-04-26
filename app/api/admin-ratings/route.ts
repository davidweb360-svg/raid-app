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
    .select('*')
    .eq('champion_id', championId);

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json({ data });
}

export async function POST(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('zone_ratings')
    .insert([
      {
        champion_id: body.champion,
        zone_id: body.zone,
        rating: body.rating,
        notes: body.notes,
      },
    ]);

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json({ data });
}

export async function PATCH(request: Request) {
  const body = await request.json();

  const { data, error } = await supabase
    .from('zone_ratings')
    .update({
      rating: body.rating,
      notes: body.notes,
    })
    .eq('id', body.id);

  if (error) {
    return Response.json({ error }, { status: 500 });
  }

  return Response.json({ data });
}