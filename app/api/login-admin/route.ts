import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData();

  const password = String(formData.get('password') || '');
  const next = String(formData.get('next') || '/admin');

  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL('/login-admin?error=1', request.url));
  }

  const response = NextResponse.redirect(new URL(next, request.url));

  response.cookies.set('raid_admin_auth', 'true', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}