export const dynamic = 'force-dynamic';
export const revalidate = 0;

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  const body = await request.json();

  const { name, slug } = body;

  if (!name || !slug) {
    return Response.json({ error: 'Faltan nombre o slug' }, { status: 400 });
  }

  const { data, error } = await supabase
    .from('champions')
    .insert({
      name,
      slug,
      rarity: body.rarity || null,
      affinity: body.affinity || null,
      role: body.role || null,
      faction_slug: body.faction_slug || null,
      image_url: body.image_url || null,
      video_preview: body.video_preview || null,
      background_image_url: body.background_image_url || null,
      uses: body.uses || null,
      lore: body.lore || null,
      guide_text: body.guide_text || null,
      stats: body.stats || null,
      skills: body.skills || null,
      gear: body.gear || null,
      relics: body.relics || null,
      ideal_equipment: body.ideal_equipment || null,
      owned: Boolean(body.owned),
      champion_star_slots: body.champion_star_slots || [],
      notes: body.notes || null,
    })
    .select()
    .single();

  if (error) {
    console.error(error);
    return Response.json({ error: 'Error creando campeón' }, { status: 500 });
  }

  return Response.json({ data });
}