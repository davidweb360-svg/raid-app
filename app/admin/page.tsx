export default async function AdminPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-neutral-950 via-black to-neutral-900 p-8 text-white">
      <div className="mx-auto max-w-6xl">
        <a
          href="/"
          className="mb-6 inline-block rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/80 hover:bg-white/10"
        >
          ← Volver
        </a>

        <p className="text-sm uppercase tracking-[0.3em] text-amber-400/80">
          Panel rápido
        </p>
        <h1 className="mb-8 mt-2 text-5xl font-bold">Administración</h1>

        <div className="grid gap-4 md:grid-cols-2">
          <a
            href="/admin/equipo"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-400/30 hover:bg-white/10"
          >
            <h2 className="text-2xl font-bold">Editar equipo ideal</h2>
            <p className="mt-2 text-white/65">
              Selecciona un campeón y define arma, casco, guantes, pecho, botas,
              anillo, amuleto y estandarte.
            </p>
          </a>

          <a
            href="/admin/zonas"
            className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-400/30 hover:bg-white/10"
          >
            <h2 className="text-2xl font-bold">Valorar zonas</h2>
            <p className="mt-2 text-white/65">
              Puntúa cada campeón por zonas del juego con estrellas de 0 a 5.
            </p>
          </a>
          <a
  href="/admin/campeon"
  className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-amber-400/30 hover:bg-white/10"
>
  <h2 className="text-2xl font-bold">Estado del campeón</h2>
  <p className="mt-2 text-white/65">
    Marca si lo tiene y configura sus estrellas: amarillas, moradas o rojas.
  </p>
</a>
        </div>
      </div>
    </main>
  );
}