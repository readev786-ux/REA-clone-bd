// Formatting helpers — Bangladeshi conventions (Lakh / Crore, ৳).

const CRORE = 10_000_000
const LAKH = 100_000

/** Format a BDT amount using local Lakh / Crore notation, e.g. "৳ 2.15 Cr". */
export function formatBDT(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return 'Price on request'
  if (amount >= CRORE) {
    const cr = amount / CRORE
    return `৳ ${trim(cr)} Cr`
  }
  if (amount >= LAKH) {
    const lk = amount / LAKH
    return `৳ ${trim(lk)} Lakh`
  }
  return `৳ ${amount.toLocaleString('en-IN')}`
}

/** "From ৳ 1.55 Cr" style label for a project's starting price. */
export function formatStartingPrice(amount: number | null | undefined): string {
  if (!amount) return 'Price on request'
  return `From ${formatBDT(amount)}`
}

function trim(n: number): string {
  // up to 2 decimals, no trailing zeros
  return Number(n.toFixed(2)).toString()
}

/** Square metres → square feet (rounded). */
export function sqmToSqft(sqm: number | null | undefined): number | null {
  if (!sqm) return null
  return Math.round(sqm * 10.7639)
}

export function formatArea(sqm: number | null | undefined): string {
  const sqft = sqmToSqft(sqm)
  if (!sqm || !sqft) return '—'
  return `${sqm.toLocaleString()} m² · ${sqft.toLocaleString()} ft²`
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export const CATEGORY_LABELS: Record<string, string> = {
  residential: 'Residential',
  commercial: 'Commercial',
  township: 'Township',
  investment: 'Investment',
}

export const STATUS_LABELS: Record<string, string> = {
  ongoing: 'Ongoing',
  completed: 'Completed',
  upcoming: 'Upcoming',
}
