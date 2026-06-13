import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Inbox,
  CalendarClock,
  Building2,
  Upload,
  Images,
  LogOut,
  ExternalLink,
} from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Logo } from '../../components/ui/Logo'
import { Spinner } from '../../components/ui/Primitives'

const nav = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/inquiries', label: 'Inquiries', icon: Inbox, end: false },
  { to: '/admin/appointments', label: 'Appointments', icon: CalendarClock, end: false },
  { to: '/admin/projects', label: 'Developments', icon: Building2, end: false },
  { to: '/admin/import', label: 'Import CSV', icon: Upload, end: false },
  { to: '/admin/media', label: 'Media Library', icon: Images, end: false },
]

export default function AdminLayout() {
  const { session, isStaff, loading, signOut, profile } = useAuth()
  const navigate = useNavigate()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-sand">
        <Spinner className="text-gold-deep" />
      </div>
    )
  }

  if (!session || !isStaff) {
    navigate('/admin/login', { replace: true })
    return null
  }

  return (
    <div className="flex min-h-screen bg-sand">
      {/* Sidebar */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-black/5 bg-white px-5 py-6 lg:flex">
        <Logo />
        <nav className="mt-10 flex flex-1 flex-col gap-1">
          {nav.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${
                  isActive
                    ? 'bg-navy text-white'
                    : 'text-navy-deep/70 hover:bg-navy/5 hover:text-navy-deep'
                }`
              }
            >
              <n.icon className="h-5 w-5" />
              {n.label}
            </NavLink>
          ))}
        </nav>
        <a
          href="/"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-ash hover:text-gold-deep"
        >
          <ExternalLink className="h-5 w-5" /> View live site
        </a>
        <button
          onClick={async () => {
            await signOut()
            navigate('/admin/login')
          }}
          className="mt-1 flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-clay hover:bg-clay/5"
        >
          <LogOut className="h-5 w-5" /> Sign out
        </button>
      </aside>

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 border-b border-black/5 bg-white/80 px-6 py-4 backdrop-blur">
          <div className="flex items-center gap-3">
            {/* Mobile nav */}
            <div className="flex gap-1 lg:hidden">
              {nav.map((n) => (
                <NavLink
                  key={n.to}
                  to={n.to}
                  end={n.end}
                  className={({ isActive }) =>
                    `flex h-10 w-10 items-center justify-center rounded-lg ${
                      isActive ? 'bg-navy text-white' : 'text-navy-deep/60'
                    }`
                  }
                >
                  <n.icon className="h-5 w-5" />
                </NavLink>
              ))}
            </div>
            <h1 className="hidden font-display text-lg font-semibold text-navy-deep sm:block">
              Estate Management Console
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-sm font-semibold text-navy-deep">{profile?.full_name}</p>
              <p className="text-xs capitalize text-ash">{profile?.role}</p>
            </div>
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-wash font-semibold text-gold-deep">
              {profile?.full_name?.[0] ?? 'A'}
            </span>
          </div>
        </header>

        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
