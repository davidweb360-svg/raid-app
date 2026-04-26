type ChampionStarsProps = {
  slots?: string[] | null;
  size?: 'sm' | 'md' | 'lg';
};

const STAR_STYLES: Record<string, string> = {
  yellow: 'text-amber-300',
  purple: 'text-fuchsia-400',
  red: 'text-red-500',
  empty: 'text-white/20',
};

function normalizeSlots(slots?: string[] | null) {
  if (!Array.isArray(slots)) {
    return ['empty', 'empty', 'empty', 'empty', 'empty', 'empty'];
  }

  const clean = slots.slice(0, 6).map((slot) =>
    ['yellow', 'purple', 'red', 'empty'].includes(slot) ? slot : 'empty'
  );

  while (clean.length < 6) clean.push('empty');

  return clean;
}

export default function ChampionStars({
  slots,
  size = 'md',
}: ChampionStarsProps) {
  const normalized = normalizeSlots(slots);

  const sizeClass = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-4xl',
  }[size];

  return (
    <div className={`flex items-center gap-0.5 ${sizeClass}`}>
      {normalized.map((slot, index) => (
        <span key={index} className={STAR_STYLES[slot] || STAR_STYLES.empty}>
          {slot === 'empty' ? '☆' : '★'}
        </span>
      ))}
    </div>
  );
}