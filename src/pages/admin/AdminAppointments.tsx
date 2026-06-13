import { useMutation, useQueryClient } from '@tanstack/react-query'
import { CalendarClock, Mail, Phone } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useAppointments } from '../../hooks/useData'
import { updateAppointmentStatus } from '../../lib/queries'
import { Spinner } from '../../components/ui/Primitives'
import { formatDate } from '../../lib/format'
import type { Appointment } from '../../lib/types'

const statuses: Appointment['status'][] = ['pending', 'confirmed', 'cancelled']
const tone: Record<Appointment['status'], string> = {
  pending: 'bg-gold-wash text-gold-deep',
  confirmed: 'bg-mint/15 text-forest',
  cancelled: 'bg-black/5 text-ash',
}

export default function AdminAppointments() {
  const { isStaff } = useAuth()
  const { data, isLoading } = useAppointments(isStaff)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Appointment['status'] }) =>
      updateAppointmentStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['appointments'] }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">Appointments</h2>
        <p className="text-sm text-ash">Estate desk consultation bookings.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="text-gold-deep" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy/15 bg-white py-20 text-center">
          <CalendarClock className="h-10 w-10 text-gold-deep/60" />
          <p className="text-sm text-ash">No appointments booked yet.</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-black/5 bg-white card-shadow">
          <div className="divide-y divide-black/5">
            {data.map((a) => (
              <div key={a.id} className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <p className="font-display text-lg font-semibold text-navy-deep">{a.name}</p>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${tone[a.status]}`}>
                      {a.status}
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-ash">
                    <span className="inline-flex items-center gap-1.5 font-medium text-navy-deep">
                      <CalendarClock className="h-4 w-4 text-gold-deep" />
                      {a.preferred_date ? formatDate(a.preferred_date) : 'Flexible'} · {a.preferred_time}
                    </span>
                    {a.email && (
                      <span className="inline-flex items-center gap-1.5">
                        <Mail className="h-4 w-4" /> {a.email}
                      </span>
                    )}
                    {a.phone && (
                      <span className="inline-flex items-center gap-1.5">
                        <Phone className="h-4 w-4" /> {a.phone}
                      </span>
                    )}
                  </div>
                  {a.message && <p className="mt-2 text-sm text-ash">{a.message}</p>}
                </div>
                <select
                  value={a.status}
                  onChange={(e) =>
                    mutation.mutate({ id: a.id, status: e.target.value as Appointment['status'] })
                  }
                  className="shrink-0 rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold capitalize text-navy-deep outline-none focus:border-gold"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
