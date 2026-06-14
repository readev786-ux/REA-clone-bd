import { ArrowRight } from 'lucide-react'
import { getIcon } from '../lib/icons'
import { PageHeader } from '../components/layout/PageHeader'
import { Container, SectionHeading, Button } from '../components/ui/Primitives'
import { Reveal } from '../components/ui/Reveal'
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard'
import { useProjects, useFeatureCards } from '../hooks/useData'

const FALLBACK_PILLARS = [
  { icon: 'TrendingUp', title: 'High-Yield Optimization', body: 'Portfolios structured for durable appreciation across Jolshiri and Dhaka growth corridors.' },
  { icon: 'FileText', title: 'Priority Option Letters', body: 'Secure first-right allocations on upcoming releases through private placement consultation.' },
  { icon: 'ShieldCheck', title: 'Escrow-Backed Capital', body: 'Funds released only against verified title and construction milestones — built on integrity.' },
  { icon: 'Globe2', title: 'NRB & Residency Support', body: 'Permanent residency pathways and remote reservation for overseas Bangladeshi investors.' },
]

export default function Investments() {
  const { data, isLoading } = useProjects()
  const investmentProjects = (data ?? []).filter(
    (p) => p.category === 'investment' || p.category === 'township',
  )
  const featureCards = useFeatureCards().data
  const pillars =
    (featureCards ?? []).filter((cd) => cd.section === 'investment_pillars').length
      ? (featureCards ?? []).filter((cd) => cd.section === 'investment_pillars')
      : FALLBACK_PILLARS

  return (
    <>
      <PageHeader
        kicker="Investment Projects & Townships"
        title="Build wealth on approved foundations"
        intro="Master-planned townships and curated investment portfolios engineered for elite capital pools seeking compliant, high-yield exposure to Bangladeshi real estate."
        crumb="Investments"
        image="https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=2000&q=80"
      />

      {/* Pillars */}
      <section className="py-20">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {pillars.map((p, i) => {
              const Icon = getIcon(p.icon)
              return (
                <Reveal key={p.title} delay={i * 80}>
                  <div className="h-full rounded-3xl border border-black/5 bg-white p-7 card-shadow">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mt-5 font-display text-lg font-semibold text-navy-deep">
                      {p.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ash">{p.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Projects */}
      <section className="bg-gradient-to-b from-cream to-sand py-20">
        <Container>
          <SectionHeading
            kicker="Opportunities"
            title="Townships & Investment Portfolios"
            intro="Why Jolshiri Abashon is selected by elite capital pools — explore our flagship investment-grade developments."
          />
          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : investmentProjects.map((p) => <PropertyCard key={p.id} project={p} />)}
          </div>

          <div className="mt-14 overflow-hidden rounded-[2rem] bg-navy px-8 py-14 text-center sm:px-16">
            <div className="mx-auto max-w-2xl">
              <h3 className="font-display text-2xl font-semibold text-white sm:text-3xl">
                Design a private placement consultation
              </h3>
              <p className="mt-3 text-white/70">
                Off-market and high-net-worth advisory tailored to your capital goals.
              </p>
              <div className="mt-7">
                <Button to="/contact" size="lg">
                  Request investment advisory <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
