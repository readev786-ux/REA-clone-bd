import type { Partner } from '../lib/types'

export function PartnersMarquee({ partners }: { partners: Partner[] }) {
  const withLogos = partners.filter((p) => p.logo_url)
  if (withLogos.length === 0) return null
  const loop = [...withLogos, ...withLogos]
  return (
    <div className="relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-navy-darker to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-navy-darker to-transparent" />
      <div className="flex w-max animate-marquee pause-on-hover items-center gap-14">
        {loop.map((p, i) => (
          <div key={`${p.id}-${i}`} className="flex h-16 w-28 shrink-0 items-center justify-center">
            <img
              src={p.logo_url ?? ''}
              alt={p.name}
              title={p.name}
              loading="lazy"
              className="max-h-14 max-w-[7rem] object-contain opacity-80 brightness-0 invert transition hover:opacity-100"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
