import { Link } from 'react-router-dom'
import {
  ArrowRight,
  ShieldCheck,
  Landmark,
  TrendingUp,
  Gem,
  HandCoins,
  HardHat,
  Quote,
  Star,
} from 'lucide-react'
import { Hero } from '../components/home/Hero'
import { Container, SectionHeading, Button, Badge } from '../components/ui/Primitives'
import { Reveal } from '../components/ui/Reveal'
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard'
import { PartnersMarquee } from '../components/PartnersMarquee'
import {
  useFeaturedProjects,
  usePartners,
  useTestimonials,
  useBlogPosts,
  useContent,
} from '../hooks/useData'
import { formatDate } from '../lib/format'

const values = [
  {
    icon: ShieldCheck,
    title: 'Built on Integrity & Escrow',
    body: 'Every transaction is escrow-backed and released against verified construction and title milestones.',
  },
  {
    icon: Landmark,
    title: 'RAJUK & Cantonment Approved',
    body: 'Fully cleared land mutation titles and national building-safety compliance on every development.',
  },
  {
    icon: TrendingUp,
    title: 'High-Yield Optimization',
    body: 'Dedicated consultants with unparalleled market insight engineer durable, appreciating returns.',
  },
  {
    icon: Gem,
    title: 'Uncompromising Quality',
    body: 'European cabinetry, silent VRF cooling and premium materials with delivery assurance.',
  },
  {
    icon: HandCoins,
    title: 'Off-Market Advisory',
    body: 'Private placement consultation and priority option letters for high-net-worth capital pools.',
  },
  {
    icon: HardHat,
    title: 'Approved Standards',
    body: 'Guaranteed compliance with national building safety acts and accredited engineering oversight.',
  },
]

export default function Home() {
  const { data: featured, isLoading } = useFeaturedProjects()
  const { data: partners } = usePartners()
  const { data: testimonials } = useTestimonials()
  const { data: posts } = useBlogPosts()
  const c = useContent()

  return (
    <>
      <Hero />

      {/* Accreditations marquee band */}
      <section className="bg-navy-darker py-10">
        <Container>
          <p className="mb-7 text-center font-mono text-[0.7rem] uppercase tracking-[0.25em] text-gold/70">
            Government & Regulatory Partners · Trusted Accreditations
          </p>
          <PartnersMarquee partners={partners ?? []} />
        </Container>
      </section>

      {/* Featured developments */}
      <section className="py-24">
        <Container>
          <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
            <SectionHeading
              align="left"
              kicker="Signature Portfolio"
              title="Featured Developments"
              intro="A curated selection of our most sought-after estates and townships across Jolshiri Abashon and Dhaka Cantonment."
            />
            <Button to="/developments" variant="outline" size="sm" className="shrink-0">
              View all developments <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : featured?.map((p, i) => (
                  <Reveal key={p.id} delay={i * 90}>
                    <PropertyCard project={p} />
                  </Reveal>
                ))}
          </div>
        </Container>
      </section>

      {/* Why choose us */}
      <section className="relative overflow-hidden bg-gradient-to-b from-cream to-sand py-24">
        <Container>
          <SectionHeading
            kicker="Why AHS"
            title="Excellence engineered into every foundation"
            intro="Our commitment to excellence drives everything we do — from approvals and escrow to material quality and after-sales care."
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.title} delay={i * 70}>
                <div className="group h-full rounded-3xl border border-black/5 bg-paper p-8 card-shadow transition hover:-translate-y-1.5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-navy text-gold transition group-hover:bg-gold group-hover:text-navy">
                    <v.icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-6 font-display text-xl font-semibold text-navy-deep">
                    {v.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-ash">{v.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* Founder spotlight */}
      <section className="py-24">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <Reveal className="relative">
              <div className="relative overflow-hidden rounded-[2rem] card-shadow">
                <img
                  src={c(
                    'founder.image',
                    'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1100&q=80',
                  )}
                  alt="AHS Founder & Principal Broker"
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
              <div className="absolute -right-4 -top-4 hidden h-24 w-24 rounded-2xl border border-gold/40 sm:block" />
            </Reveal>

            <Reveal delay={120}>
              <p className="kicker mb-3">{c('founder.kicker', 'A Legacy of Trust and Vision')}</p>
              <h2 className="font-display text-3xl font-semibold leading-tight text-navy-deep sm:text-4xl">
                {c('founder.heading', 'Visionary leadership, elite discipline')}
              </h2>
              <p className="mt-5 text-base leading-relaxed text-ash">
                {c(
                  'founder.body',
                  'AHS Properties & Development Ltd. is built on a legacy of elite discipline, integrity and visionary leadership. We merge innovative architecture with utility to deliver premium residential and commercial spaces across Bangladesh.',
                )}
              </p>
              <p className="mt-4 text-base leading-relaxed text-ash">
                As proud recipient of the Bangladesh Real Estate Excellence Award, we partner with
                national authorities to set new standards of quality, compliance and delivery
                assurance.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Badge tone="gold">
                  <Star className="h-3.5 w-3.5" /> Bangladesh Real Estate Excellence Award
                </Badge>
                <Badge tone="navy">EDB Scheme Approved</Badge>
              </div>
              <div className="mt-9">
                <Button to="/about">
                  Discover our story <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Testimonials */}
      {testimonials && testimonials.length > 0 && (
        <section className="bg-navy-darker py-24 text-white">
          <Container>
            <SectionHeading
              light
              kicker="Client Voices"
              title="Trusted by families & investors"
              intro="Dedicated professionals ready to help you find your perfect property — here is what our clients say."
            />
            <div className="mt-14 grid gap-6 md:grid-cols-3">
              {testimonials.map((t, i) => (
                <Reveal key={t.id} delay={i * 90}>
                  <figure className="glass-dark flex h-full flex-col rounded-3xl p-7">
                    <Quote className="h-8 w-8 text-gold/70" />
                    <blockquote className="mt-4 flex-1 text-sm leading-relaxed text-white/80">
                      “{t.quote}”
                    </blockquote>
                    <figcaption className="mt-6 flex items-center gap-3 border-t border-white/10 pt-5">
                      {t.avatar_url && (
                        <img
                          src={t.avatar_url}
                          alt={t.name}
                          className="h-11 w-11 rounded-full object-cover ring-2 ring-gold/40"
                        />
                      )}
                      <div>
                        <p className="text-sm font-semibold text-white">{t.name}</p>
                        <p className="text-xs text-gold/80">{t.role}</p>
                      </div>
                    </figcaption>
                  </figure>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Insights preview */}
      {posts && posts.length > 0 && (
        <section className="py-24">
          <Container>
            <div className="flex flex-col items-end justify-between gap-6 sm:flex-row">
              <SectionHeading
                align="left"
                kicker="Insights"
                title="Real Estate & Investment Insights"
                intro="Keep up with Bangladesh real estate laws, guidelines and modern smart-city perspectives."
              />
              <Button to="/insights" variant="outline" size="sm" className="shrink-0">
                All insights <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-12 grid gap-7 md:grid-cols-3">
              {posts.slice(0, 3).map((post, i) => (
                <Reveal key={post.id} delay={i * 90}>
                  <Link
                    to={`/insights/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-paper card-shadow transition hover:-translate-y-1.5"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.cover_image ?? ''}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-xs text-ash">
                        <Badge tone="gold">{post.category}</Badge>
                        <span>{post.read_minutes} min read</span>
                      </div>
                      <h3 className="mt-3 font-display text-lg font-semibold leading-snug text-navy-deep group-hover:text-gold-deep">
                        {post.title}
                      </h3>
                      <p className="mt-2 line-clamp-2 flex-1 text-sm text-ash">{post.excerpt}</p>
                      <p className="mt-4 text-xs text-ash/70">{formatDate(post.published_at)}</p>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA */}
      <section className="pb-24">
        <Container>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-navy px-8 py-16 text-center sm:px-16">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(223,173,66,0.22),transparent_55%)]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-semibold text-white sm:text-4xl text-balance">
                {c('home.cta.title', 'Let us help you discover your next key investment in Bangladesh')}
              </h2>
              <p className="mt-4 text-white/70">
                {c(
                  'home.cta.subtitle',
                  'Direct access to dedicated consultants with local and legal insights. Reserve a private consultation or request a live tour today.',
                )}
              </p>
              <div className="mt-9 flex flex-wrap justify-center gap-4">
                <Button to="/contact" size="lg">
                  Reserve private consultation <ArrowRight className="h-4 w-4" />
                </Button>
                <Button to="/developments" variant="ghost" size="lg" className="text-white hover:bg-white/10">
                  Browse developments
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
