import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Lock } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Logo } from '../../components/ui/Logo'

export default function AdminLogin() {
  const { signIn, session, isStaff, loading } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    if (!loading && session && isStaff) navigate('/admin', { replace: true })
  }, [loading, session, isStaff, navigate])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error } = await signIn(email, password)
    setBusy(false)
    if (error) setError(error)
    else navigate('/admin', { replace: true })
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-darker px-5">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(223,173,66,0.15),transparent_55%)]" />
      <div className="relative w-full max-w-md">
        <div className="mb-8 flex justify-center">
          <Logo light />
        </div>
        <div className="rounded-3xl border border-white/10 bg-white/95 p-8 shadow-2xl backdrop-blur">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy text-gold">
              <Lock className="h-5 w-5" />
            </span>
            <div>
              <h1 className="font-display text-xl font-semibold text-navy-deep">Staff sign in</h1>
              <p className="text-xs text-ash">AHS Estate Management Console</p>
            </div>
          </div>

          <form onSubmit={onSubmit} className="mt-7 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">
                Email
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                placeholder="admin@ahsproperties.com"
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ash">
                Password
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-navy/15 bg-white px-4 py-3 text-sm outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                placeholder="••••••••"
              />
            </label>
            {error && <p className="text-sm text-clay">{error}</p>}
            <button
              type="submit"
              disabled={busy}
              className="btn-gold inline-flex w-full items-center justify-center gap-2 rounded-full px-6 py-3.5 text-sm font-semibold disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 rounded-xl bg-gold-wash px-4 py-3 text-center text-xs text-gold-deep">
            Demo: admin@ahsproperties.com · AhsAdmin2026!
          </p>
        </div>
      </div>
    </div>
  )
}
