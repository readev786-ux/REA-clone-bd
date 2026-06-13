import { useState, type ReactNode } from 'react'
import { CheckCircle2, Loader2, Send } from 'lucide-react'
import { submitAppointment, submitInquiry } from '../lib/queries'
import { useProjects } from '../hooks/useData'
import type { Inquiry } from '../lib/types'

const inputCls =
  'w-full rounded-xl border border-navy/15 bg-white/70 px-4 py-3 text-sm text-navy-deep placeholder:text-ash/60 outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/30'

function Field({
  label,
  children,
  required,
}: {
  label: string
  children: ReactNode
  required?: boolean
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">
        {label} {required && <span className="text-clay">*</span>}
      </span>
      {children}
    </label>
  )
}

function SuccessPanel({ title, message }: { title: string; message: string }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-mint/30 bg-mint/10 px-6 py-10 text-center">
      <CheckCircle2 className="h-12 w-12 text-forest" />
      <h4 className="font-display text-xl font-semibold text-forest">{title}</h4>
      <p className="max-w-sm text-sm text-forest/80">{message}</p>
    </div>
  )
}

// ---------------------------------------------------------------------
// Inquiry / contact form
// ---------------------------------------------------------------------
export function InquiryForm({
  source = 'contact',
  projectId,
  propertyInterest,
}: {
  source?: Inquiry['source']
  projectId?: string
  propertyInterest?: string
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) {
      setError('Please tell us your name.')
      return
    }
    setStatus('loading')
    setError('')
    try {
      await submitInquiry({
        ...form,
        source,
        project_id: projectId,
        property_interest: propertyInterest,
      })
      setStatus('done')
    } catch {
      setStatus('error')
      setError('Something went wrong. Please try again or WhatsApp us directly.')
    }
  }

  if (status === 'done') {
    return (
      <SuccessPanel
        title="Request received"
        message="A senior AHS consultant will reach out shortly to arrange your private consultation."
      />
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Your name" />
        </Field>
        <Field label="Phone">
          <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+880 1XXX XXXXXX" />
        </Field>
      </div>
      <Field label="Email">
        <input
          type="email"
          className={inputCls}
          value={form.email}
          onChange={set('email')}
          placeholder="name@example.com"
        />
      </Field>
      <Field label="Tell us about your requirements">
        <textarea
          className={`${inputCls} min-h-[120px] resize-y`}
          value={form.message}
          onChange={set('message')}
          placeholder="Tell us about your property requirements..."
        />
      </Field>
      {error && <p className="text-sm text-clay">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Sending…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Submit pre-reservation & request call
          </>
        )}
      </button>
    </form>
  )
}

// ---------------------------------------------------------------------
// Appointment / estate-desk booking form
// ---------------------------------------------------------------------
const TIME_SLOTS = ['10:00 AM', '11:30 AM', '01:00 PM', '03:00 PM', '04:30 PM', '06:00 PM']

export function AppointmentForm() {
  const { data: projects } = useProjects()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferred_date: '',
    preferred_time: TIME_SLOTS[0],
    project_id: '',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [error, setError] = useState('')

  const set =
    (k: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setForm((f) => ({ ...f, [k]: e.target.value }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || (!form.phone.trim() && !form.email.trim())) {
      setError('Please supply your name and a phone or email before reserving your seat.')
      return
    }
    setStatus('loading')
    setError('')
    try {
      await submitAppointment({ ...form, project_id: form.project_id || null })
      setStatus('done')
    } catch {
      setStatus('error')
      setError('Could not reserve your slot. Please try again.')
    }
  }

  if (status === 'done') {
    return (
      <SuccessPanel
        title="Seat reserved"
        message="Your Estate Desk appointment is pending confirmation. We will text you to confirm the slot."
      />
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" required>
          <input className={inputCls} value={form.name} onChange={set('name')} placeholder="Your name" />
        </Field>
        <Field label="Phone">
          <input className={inputCls} value={form.phone} onChange={set('phone')} placeholder="+880 1XXX XXXXXX" />
        </Field>
      </div>
      <Field label="Email">
        <input type="email" className={inputCls} value={form.email} onChange={set('email')} placeholder="name@example.com" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Preferred date">
          <input type="date" className={inputCls} value={form.preferred_date} onChange={set('preferred_date')} />
        </Field>
        <Field label="Preferred time">
          <select className={inputCls} value={form.preferred_time} onChange={set('preferred_time')}>
            {TIME_SLOTS.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Development of interest">
        <select className={inputCls} value={form.project_id} onChange={set('project_id')}>
          <option value="">Any / not sure yet</option>
          {projects?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Notes">
        <textarea
          className={`${inputCls} min-h-[90px] resize-y`}
          value={form.message}
          onChange={set('message')}
          placeholder="Anything we should prepare for your visit?"
        />
      </Field>
      {error && <p className="text-sm text-clay">{error}</p>}
      <button
        type="submit"
        disabled={status === 'loading'}
        className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-60"
      >
        {status === 'loading' ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Reserving…
          </>
        ) : (
          'Reserve private consultation room'
        )}
      </button>
    </form>
  )
}
