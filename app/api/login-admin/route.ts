import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  const password = String(formData.get('password') || '').trim();
  const next = String(formData.get('next') || '/admin');

  const adminPassword = process.env.ADMIN_PASSWORD?.trim();

  if (!adminPassword) {
    return NextResponse.json(
      { error: 'ADMIN_PASSWORD no está configurada' },
      { status: 500 }
    );
  }

  if (password !== adminPassword) {
    return NextResponse.redirect(new URL('/login-admin?error=1', request.url));
  }

  const safeNext = next.startsWith('/admin') ? next : '/admin';
  const response = NextResponse.redirect(new URL(safeNext, request.url));

  response.cookies.set('raid_admin_auth', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}