type EquipmentItem = {
  principal?: string;
  substats?: string[] | string;
};

type EquipmentData = Record<string, EquipmentItem>;

const GEAR_BASE = 'https://lafogataderaid.com/images/gear';

const SLOT_CONFIG = [
  { key: 'arma', label: 'Arma', image: `${GEAR_BASE}/weapon.jpg` },
  { key: 'casco', label: 'Casco', image: `${GEAR_BASE}/helmet.jpg` },
  { key: 'escudo', label: 'Escudo', image: `${GEAR_BASE}/shield.jpg` },
  { key: 'guantes', label: 'Guantes', image: `${GEAR_BASE}/gloves.jpg` },
  { key: 'pecho', label: 'Pecho', image: `${GEAR_BASE}/chest.jpg` },
  { key: 'botas', label: 'Botas', image: `${GEAR_BASE}/boots.jpg` },
  { key: 'anillo', label: 'Anillo', image: `${GEAR_BASE}/ring.jpg` },
  { key: 'amuleto', label: 'Amuleto', image: `${GEAR_BASE}/amulet.jpg` },
  { key: 'estandarte', label: 'Estandarte', image: `${GEAR_BASE}/banner.jpg` },
];

function normalizeEquipment(input: any): EquipmentData {
  if (!input) return {};

  let parsed = input;

  if (typeof input === 'string') {
    try {
      parsed = JSON.parse(input);
    } catch {
      return {};
    }
  }

  if (typeof parsed !== 'object' || Array.isArray(parsed)) return {};

  return parsed;
}

function getSubstatsText(value?: string[] | string) {
  if (!value) return '';
  if (Array.isArray(value)) return value.join('\n');
  return value;
}

export default function IdealEquipment({ equipment }: { equipment: any }) {
  const data = normalizeEquipment(equipment);

  return (
    <section className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-2xl backdrop-blur md:p-6">
      <div className="mb-4">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/45">
          Atributos de equipo ideales
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {SLOT_CONFIG.map((slot) => {
          const item = data[slot.key] || {};
          const principal = item.principal || '—';
          const substats = getSubstatsText(item.substats);

          return (
            <div
              key={slot.key}
              className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/25 px-3 py-3"
            >
              <img
                src={slot.image}
                alt={slot.label}
                className="h-[50px] w-[50px] shrink-0 rounded-md object-cover opacity-90"
              />

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.18em] text-white/45">
                  {slot.label}
                </p>

                <p className="mt-1 text-lg font-bold leading-tight text-amber-300">
                  {principal}
                </p>

                {substats ? (
                  <p className="mt-1 whitespace-pre-line text-xs leading-tight text-white/60">
                    {substats}
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}