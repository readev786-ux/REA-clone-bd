import { Button } from '../components/ui/Primitives'

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-navy-darker px-6 text-center text-white">
      <p className="font-display text-8xl font-bold text-gold-gradient">404</p>
      <h1 className="mt-4 font-display text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 max-w-md text-white/60">
        The address you are looking for has moved or never existed. Let us guide you back to our
        portfolio.
      </p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Button to="/">Return home</Button>
        <Button to="/developments" variant="ghost" className="text-white hover:bg-white/10">
          Browse developments
        </Button>
      </div>
    </section>
  )
}
