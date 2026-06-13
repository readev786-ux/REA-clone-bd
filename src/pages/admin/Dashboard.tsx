import { Link } from 'react-router-dom'
import { Inbox, CalendarClock, Building2, LayoutGrid, ArrowRight } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useInquiries, useAppointments, useProjects } from '../../hooks/useData'
import { Spinner } from '../../components/ui/Primitives'
import { formatDate } from '../../lib/format'

export default function Dashboard() {
  const { isStaff } = useAuth()
  const { data: inquiries, isLoading: li } = useInquiries(isStaff)
  const { data: appointments, isLoading: la } = useAppointments(isStaff)
  const { data: projects } = useProjects()

  const newInquiries = inquiries?.filter((i) => i.status === 'new').length ?? 0
  const pendingAppts = appointments?.filter((a) => a.status === 'pending').length ?? 0

  const cards = [
    { label: 'New inquiries', value: newInquiries, total: inquiries?.length ?? 0, icon: Inbox, to: '/admin/inquiries', tone: 'bg-clay/10 text-clay' },
    { label: 'Pending appointments', value: pendingAppts, total: appointments?.length ?? 0, icon: CalendarClock, to: '/admin/appointments', tone: 'bg-gold-wash text-gold-deep' },
    { label: 'Developments', value: projects?.length ?? 0, total: projects?.length ?? 0, icon: Building2, to: '/admin/projects', tone: 'bg-navy/5 text-navy' },
    { label: 'Featured live', value: projects?.filter((p) => p.featured).length ?? 0, total: projects?.length ?? 0, icon: LayoutGrid, to: '/admin/projects', tone: 'bg-mint/15 text-forest' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">Welcome back</h2>
        <p className="text-sm text-ash">Here is what is happening across your estate desk today.</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="group rounded-2xl border border-black/5 bg-white p-6 card-shadow transition hover:-translate-y-1"
          >
            <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${c.tone}`}>
              <c.icon className="h-6 w-6" />
            </div>
            <p className="mt-5 font-display text-4xl font-bold text-navy-deep">{c.value}</p>
            <p className="mt-1 flex items-center justify-between text-sm text-ash">
              {c.label}
              <ArrowRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
            </p>
          </Link>
        ))}
      </div>

      <div className="rounded-2xl border border-black/5 bg-white card-shadow">
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-4">
          <h3 className="font-display text-lg font-semibold text-navy-deep">Recent inquiries</h3>
          <Link to="/admin/inquiries" className="text-sm font-semibold text-gold-deep">
            View all
          </Link>
        </div>
        {li || la ? (
          <div className="flex justify-center py-12">
            <Spinner className="text-gold-deep" />
          </div>
        ) : inquiries && inquiries.length > 0 ? (
          <ul className="divide-y divide-black/5">
            {inquiries.slice(0, 6).map((i) => (
              <li key={i.id} className="flex items-center justify-between gap-4 px-6 py-4">
                <div className="min-w-0">
                  <p className="truncate font-semibold text-navy-deep">{i.name}</p>
                  <p className="truncate text-sm text-ash">
                    {i.property_interest ?? i.message ?? i.email ?? '—'}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${
                      i.status === 'new'
                        ? 'bg-clay/10 text-clay'
                        : i.status === 'contacted'
                          ? 'bg-gold-wash text-gold-deep'
                          : 'bg-black/5 text-ash'
                    }`}
                  >
                    {i.status}
                  </span>
                  <p className="mt-1 text-xs text-ash/70">{formatDate(i.created_at)}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-12 text-center text-sm text-ash">No inquiries yet.</p>
        )}
      </div>
    </div>
  )
}
