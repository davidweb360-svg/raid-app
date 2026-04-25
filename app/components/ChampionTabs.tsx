'use client';

import { useState } from 'react';

function renderSkillContent(skills: any[]) {
  if (!skills || skills.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white/50">
        No hay habilidades disponibles
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {skills.map((skill: any, index: number) => (
        <div
          key={index}
          className="rounded-2xl border border-white/10 bg-white/5 p-6"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-xl font-semibold">
              {skill.name || `Habilidad ${index + 1}`}
            </h3>

            {skill.multiplier && (
              <span className="rounded-full border border-amber-400/20 bg-amber-500/10 px-3 py-1 text-sm text-amber-300">
                {skill.multiplier}
              </span>
            )}
          </div>

          {skill.description && (
            <p className="mt-4 text-white/80">{skill.description}</p>
          )}

          {Array.isArray(skill.levels) && skill.levels.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-sm uppercase tracking-wide text-white/45">
                Mejoras
              </p>
              <div className="space-y-2">
                {skill.levels.map((level: string, idx: number) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-white/80"
                  >
                    {level}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function ChampionTabs({
  guideText,
  lore,
  skills,
}: {
  guideText?: string;
  lore?: string;
  skills?: any[];
}) {
  const [tab, setTab] = useState<'guia' | 'habilidades'>('guia');

  return (
    <section className="mt-8">
      <div className="mb-5 flex flex-wrap gap-3">
        <button
          onClick={() => setTab('guia')}
          className={`rounded-2xl px-5 py-3 font-semibold transition ${
            tab === 'guia'
              ? 'bg-amber-500 text-black'
              : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
          }`}
        >
          Guía
        </button>

        <button
          onClick={() => setTab('habilidades')}
          className={`rounded-2xl px-5 py-3 font-semibold transition ${
            tab === 'habilidades'
              ? 'bg-amber-500 text-black'
              : 'border border-white/10 bg-white/5 text-white/80 hover:bg-white/10'
          }`}
        >
          Habilidades
        </button>
      </div>

      {tab === 'guia' ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-2xl font-bold">Guía del campeón</h2>

          {guideText || lore ? (
            <div className="space-y-4 text-white/80">
              {guideText ? (
                <p className="whitespace-pre-line">{guideText}</p>
              ) : null}

              {!guideText && lore ? (
                <p className="whitespace-pre-line">{lore}</p>
              ) : null}
            </div>
          ) : (
            <p className="text-white/50">Todavía no hay guía disponible.</p>
          )}
        </div>
      ) : (
        renderSkillContent(skills || [])
      )}
    </section>
  );
}