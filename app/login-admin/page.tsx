export default function LoginAdminPage({
  searchParams,
}: {
  searchParams?: { next?: string; error?: string };
}) {
  const next = searchParams?.next || '/admin';
  const hasError = searchParams?.error === '1';

  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 p-8 text-white">
      <div className="mx-auto mt-20 max-w-md rounded-3xl border border-white/10 bg-white/5 p-8">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
          Raid Manager
        </p>

        <h1 className="mt-2 text-4xl font-bold">Acceso admin</h1>

        {hasError ? (
          <p className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-300">
            Contraseña incorrecta.
          </p>
        ) : null}

        <form action="/api/login-admin" method="POST" className="mt-8 space-y-4">
          <input type="hidden" name="next" value={next} />

          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none placeholder:text-white/35"
          />

          <button
            type="submit"
            className="w-full rounded-2xl bg-amber-500 px-6 py-3 font-semibold text-black transition hover:bg-amber-400"
          >
            Entrar
          </button>
        </form>
      </div>
    </main>
  );
}