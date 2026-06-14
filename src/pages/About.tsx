import { Award, ShieldCheck, ArrowRight } from 'lucide-react'
import { getIcon } from '../lib/icons'
import { PageHeader } from '../components/layout/PageHeader'
import { Container, SectionHeading, Button, Badge } from '../components/ui/Primitives'
import { Reveal } from '../components/ui/Reveal'
import { usePartners, useContent, useFeatureCards } from '../hooks/useData'

const FALLBACK_PRINCIPLES = [
  { icon: 'ShieldCheck', title: 'Integrity & Escrow', body: 'We register a formal escrow trail on every reservation, protecting buyers at each milestone.' },
  { icon: 'Building2', title: 'Approved Standards', body: 'RAJUK and Cantonment approvals with fully cleared land mutation titles before release.' },
  { icon: 'HeartHandshake', title: 'Social Impact', body: 'A commitment to philanthropy and community uplift woven through our development ethos.' },
]

export default function About() {
  const { data: partners } = usePartners()
  const c = useContent()
  const stats = [
    { value: c('about.stat1_value', '8'), label: c('about.stat1_label', 'Flagship developments') },
    { value: c('about.stat2_value', '18+'), label: c('about.stat2_label', 'Signature units') },
    { value: c('about.stat3_value', '11+'), label: c('about.stat3_label', 'Government partners') },
    { value: c('about.stat4_value', '100%'), label: c('about.stat4_label', 'Approved standards') },
  ]
  const featureCards = useFeatureCards().data
  const principles =
    (featureCards ?? []).filter((cd) => cd.section === 'about_principles').length
      ? (featureCards ?? []).filter((cd) => cd.section === 'about_principles')
      : FALLBACK_PRINCIPLES

  return (
    <>
      <PageHeader
        kicker={c('page.about.kicker', 'A Legacy of Trust and Vision')}
        title={c('page.about.title', 'AHS Properties & Development Ltd.')}
        intro={c('page.about.intro', 'A legacy of elite discipline, integrity and visionary leadership — delivering premium residential and commercial spaces across Bangladesh.')}
        crumb="About"
        image={c('page.about.image', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=2000&q=80')}
      />

      {/* Story */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal>
              <p className="kicker mb-3">{c('about.story.kicker', 'Our Story')}</p>
              <h2 className="font-display text-3xl font-semibold leading-tight text-navy-deep sm:text-4xl">
                {c('about.story.heading', 'Innovative architecture, merging art with utility')}
              </h2>
              <p className="mt-5 leading-relaxed text-ash">
                {c(
                  'about.story.body1',
                  'Founded on a legacy of elite discipline and integrity, AHS Properties & Development Ltd. has become a trusted name in Bangladesh luxury real estate. Our dedicated consultants bring unparalleled market insight, local knowledge and legal clarity to every transaction.',
                )}
              </p>
              <p className="mt-4 leading-relaxed text-ash">
                {c(
                  'about.story.body2',
                  'From the green corridors of Jolshiri Abashon to elevated penthouses inside Dhaka Cantonment, we build on approved standards and deliver with uncompromising material quality and delivery assurance.',
                )}
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <Badge tone="gold">
                  <Award className="h-3.5 w-3.5" /> Bangladesh Real Estate Excellence Award
                </Badge>
                <Badge tone="navy">EDB Scheme Approved</Badge>
                <Badge tone="green">RAJUK & Cantonment Approved</Badge>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <div className="grid grid-cols-2 gap-4">
                <img
                  src={c('about.story.image1', 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80')}
                  alt="AHS development"
                  className="aspect-[3/4] w-full rounded-3xl object-cover card-shadow"
                />
                <img
                  src={c('about.story.image2', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80')}
                  alt="AHS residence"
                  className="mt-8 aspect-[3/4] w-full rounded-3xl object-cover card-shadow"
                />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Stats band */}
      <section className="bg-navy-darker py-16 text-white">
        <Container>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-4xl font-bold text-gold sm:text-5xl">{s.value}</p>
                <p className="mt-2 text-sm text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder */}
      <section className="py-20">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
            <Reveal className="relative">
              <div className="relative overflow-hidden rounded-[2rem] card-shadow">
                <img
                  src={c('founder.image', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1000&q=80')}
                  alt="AHS founder portrait"
                  className="aspect-[4/5] w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-ink/70 to-transparent" />
                <div className="glass-dark absolute bottom-5 left-5 right-5 rounded-2xl p-5 text-white">
                  <p className="font-display text-lg font-semibold">
                    {c('founder.name', 'DIG Md. Abu Kalam Siddique')}
                  </p>
                  <p className="text-sm text-gold">{c('founder.role', 'Founder & Principal Broker')}</p>
                </div>
              </div>
            </Reveal>
            <Reveal delay={120}>
              <SectionHeading
                align="left"
                kicker="Leadership"
                title={c('about.leadership.heading', 'A founder defined by service & vision')}
                intro={c('about.leadership.body', 'Our founder brings a lifetime of disciplined public service and an unwavering commitment to integrity, translating that ethos into how we build, sell and steward property.')}
              />
              <p className="mt-5 leading-relaxed text-ash">
                Under this leadership, AHS partners with national authorities — from RAJUK and the
                Cantonment Board to the Bangladesh Navy and port authorities — to uphold the highest
                standards of compliance and trust.
              </p>
              <div className="mt-8">
                <Button to="/contact">
                  Speak with our team <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Principles */}
      <section className="bg-gradient-to-b from-cream to-sand py-20">
        <Container>
          <SectionHeading
            kicker="Our Commitment"
            title="Principles that hold up our foundations"
          />
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {principles.map((p, i) => {
              const Icon = getIcon(p.icon)
              return (
                <Reveal key={p.title} delay={i * 80}>
                  <div className="h-full rounded-3xl border border-black/5 bg-white p-8 card-shadow">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-wash text-gold-deep">
                      <Icon className="h-7 w-7" />
                    </div>
                    <h3 className="mt-6 font-display text-xl font-semibold text-navy-deep">
                      {p.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ash">{p.body}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Accreditations */}
      {partners && partners.length > 0 && (
        <section className="py-20">
          <Container>
            <SectionHeading
              kicker="Our Trusted Accreditations & Prestigious Clients"
              title="Government & Regulatory Partners"
            />
            <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {partners.map((p) => (
                <div
                  key={p.id}
                  className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-black/5 bg-white p-6 text-center card-shadow"
                >
                  {p.logo_url ? (
                    <img
                      src={p.logo_url}
                      alt={p.name}
                      loading="lazy"
                      className="h-14 w-14 object-contain"
                    />
                  ) : (
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-navy/5">
                      <ShieldCheck className="h-7 w-7 text-gold-deep" />
                    </div>
                  )}
                  <p className="text-xs font-medium leading-snug text-navy-deep/80">{p.name}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}
    </>
  )
}
