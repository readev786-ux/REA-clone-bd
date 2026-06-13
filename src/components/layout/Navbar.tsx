import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone } from 'lucide-react'
import { Logo } from '../ui/Logo'

const links = [
  { to: '/', label: 'Home' },
  { to: '/developments', label: 'Developments' },
  { to: '/investments', label: 'Investments' },
  { to: '/about', label: 'About' },
  { to: '/insights', label: 'Insights' },
  { to: '/contact', label: 'Contact' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isHome = location.pathname === '/'
  const transparent = isHome && !scrolled

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={`transition-all duration-300 ${
          transparent ? 'bg-transparent' : 'glass card-shadow'
        }`}
      >
        <nav className="mx-auto flex h-[72px] w-full max-w-7xl items-center justify-between px-5 sm:px-8">
          <Logo light={transparent} />

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    transparent
                      ? 'text-white/85 hover:text-white'
                      : 'text-navy-deep/80 hover:text-navy-deep'
                  } ${isActive ? 'text-gold-deep' : ''}`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <span className="absolute inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-gold" />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/contact"
              className="btn-gold hidden items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold sm:inline-flex"
            >
              <Phone className="h-4 w-4" />
              Book a viewing
            </Link>
            <button
              onClick={() => setOpen((o) => !o)}
              className={`inline-flex h-11 w-11 items-center justify-center rounded-xl lg:hidden ${
                transparent ? 'text-white' : 'text-navy-deep'
              }`}
              aria-label="Toggle menu"
            >
              {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="glass border-t border-white/30 lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-1 px-5 py-4 sm:px-8">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `rounded-xl px-4 py-3 text-base font-medium ${
                    isActive ? 'bg-gold-wash text-gold-deep' : 'text-navy-deep hover:bg-navy/5'
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              className="btn-gold mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold"
            >
              <Phone className="h-4 w-4" /> Book a viewing
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
