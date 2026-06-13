import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Mail, Phone, Inbox } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { useInquiries } from '../../hooks/useData'
import { updateInquiryStatus } from '../../lib/queries'
import { Spinner } from '../../components/ui/Primitives'
import { formatDate } from '../../lib/format'
import type { Inquiry } from '../../lib/types'

const statuses: Inquiry['status'][] = ['new', 'contacted', 'closed']

export default function AdminInquiries() {
  const { isStaff } = useAuth()
  const { data, isLoading } = useInquiries(isStaff)
  const qc = useQueryClient()

  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: Inquiry['status'] }) =>
      updateInquiryStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['inquiries'] }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-navy-deep">Inquiries</h2>
        <p className="text-sm text-ash">Leads captured from contact and property forms.</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16">
          <Spinner className="text-gold-deep" />
        </div>
      ) : !data || data.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-navy/15 bg-white py-20 text-center">
          <Inbox className="h-10 w-10 text-gold-deep/60" />
          <p className="text-sm text-ash">No inquiries yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {data.map((i) => (
            <div
              key={i.id}
              className="rounded-2xl border border-black/5 bg-white p-5 card-shadow sm:flex sm:items-start sm:justify-between sm:gap-6"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <p className="font-display text-lg font-semibold text-navy-deep">{i.name}</p>
                  <span className="rounded-full bg-navy/5 px-2.5 py-0.5 text-xs font-medium capitalize text-navy">
                    {i.source}
                  </span>
                </div>
                <div className="mt-2 flex flex-wrap gap-4 text-sm text-ash">
                  {i.email && (
                    <a href={`mailto:${i.email}`} className="inline-flex items-center gap-1.5 hover:text-gold-deep">
                      <Mail className="h-4 w-4" /> {i.email}
                    </a>
                  )}
                  {i.phone && (
                    <a href={`tel:${i.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold-deep">
                      <Phone className="h-4 w-4" /> {i.phone}
                    </a>
                  )}
                </div>
                {i.property_interest && (
                  <p className="mt-2 text-sm font-medium text-navy-deep/80">
                    Interested in: {i.property_interest}
                  </p>
                )}
                {i.message && <p className="mt-2 text-sm text-ash">{i.message}</p>}
                <p className="mt-2 text-xs text-ash/70">{formatDate(i.created_at)}</p>
              </div>
              <div className="mt-4 shrink-0 sm:mt-0">
                <select
                  value={i.status}
                  onChange={(e) =>
                    mutation.mutate({ id: i.id, status: e.target.value as Inquiry['status'] })
                  }
                  className="rounded-full border border-navy/15 bg-white px-4 py-2 text-sm font-semibold capitalize text-navy-deep outline-none focus:border-gold"
                >
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
