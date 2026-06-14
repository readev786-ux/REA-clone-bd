import { Link } from 'react-router-dom'
import { Facebook, Instagram, Mail, MapPin, MessageCircle, ShieldCheck } from 'lucide-react'
import { Logo } from '../ui/Logo'
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../../lib/supabase'
import { useContent } from '../../hooks/useData'

const columns = [
  {
    title: 'Explore',
    links: [
      { to: '/developments', label: 'All Developments' },
      { to: '/investments', label: 'Investment & Townships' },
      { to: '/about', label: 'About AHS' },
      { to: '/insights', label: 'Insights' },
    ],
  },
  {
    title: 'Company',
    links: [
      { to: '/contact', label: 'Contact & Estate Desk' },
      { to: '/faq', label: 'FAQ' },
      { to: '/about', label: 'Accreditations' },
      { to: '/admin', label: 'Staff Login' },
    ],
  },
]

export function Footer() {
  const c = useContent()
  return (
    <footer className="relative mt-24 overflow-hidden bg-navy-darker text-white/80">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(223,173,66,0.12),transparent_55%)]" />
      <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <Logo light />
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              {c(
                'footer.tagline',
                'Accredited premium residential, commercial and township developments across Bangladesh — built on integrity, escrow and approved standards.',
              )}
            </p>
            <div className="mt-5 flex gap-3">
              <a
                href={c('social.facebook', 'https://facebook.com')}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-gold hover:text-gold"
              >
                <Facebook className="h-4.5 w-4.5" />
              </a>
              <a
                href={c('social.instagram', 'https://instagram.com')}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-gold hover:text-gold"
              >
                <Instagram className="h-4.5 w-4.5" />
              </a>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition hover:border-gold hover:text-gold"
              >
                <MessageCircle className="h-4.5 w-4.5" />
              </a>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold/80">
                {col.title}
              </h4>
              <ul className="mt-5 space-y-3 text-sm">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link to={l.to} className="transition hover:text-gold">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div>
            <h4 className="font-mono text-xs uppercase tracking-[0.2em] text-gold/80">Reach us</h4>
            <ul className="mt-5 space-y-4 text-sm">
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" />
                <span>
                  Rajnigandha Tower Area, Dhaka Cantonment
                  <br />
                  VIP Road, Nayapaltan, Dhaka
                </span>
              </li>
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" />
                <a href={`mailto:${CONTACT_EMAIL}`} className="break-all transition hover:text-gold">
                  {CONTACT_EMAIL}
                </a>
              </li>
              <li className="flex gap-3">
                <MessageCircle className="mt-0.5 h-4.5 w-4.5 shrink-0 text-gold" />
                <a href={`https://wa.me/${WHATSAPP_NUMBER}`} className="transition hover:text-gold">
                  +{WHATSAPP_NUMBER}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-xs text-white/45 sm:flex-row">
          <p>© {new Date().getFullYear()} AHS Properties & Development Ltd. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold/70" />
            {c('footer.accreditation', 'RAJUK & Cantonment Approved · EDB Scheme Registered')}
          </p>
        </div>
      </div>
    </footer>
  )
}
