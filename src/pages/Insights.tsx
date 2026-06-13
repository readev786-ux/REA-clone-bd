import { Link } from 'react-router-dom'
import { ArrowRight, Clock } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Container, Badge, Spinner } from '../components/ui/Primitives'
import { Reveal } from '../components/ui/Reveal'
import { useBlogPosts } from '../hooks/useData'
import { formatDate } from '../lib/format'

export default function Insights() {
  const { data: posts, isLoading } = useBlogPosts()
  const [featured, ...rest] = posts ?? []

  return (
    <>
      <PageHeader
        kicker="Real Estate & Investment Insights"
        title="Smart City Housing & Development in Bangladesh"
        intro="Keep up with Bangladesh real estate laws, guidelines and modern smart-city perspectives from the AHS editorial desk."
        crumb="Insights"
        image="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=2000&q=80"
      />

      <Container className="py-16">
        {isLoading ? (
          <div className="flex justify-center py-20">
            <Spinner className="text-gold-deep" />
          </div>
        ) : (
          <>
            {featured && (
              <Reveal>
                <Link
                  to={`/insights/${featured.slug}`}
                  className="group grid overflow-hidden rounded-[2rem] border border-black/5 bg-white card-shadow lg:grid-cols-2"
                >
                  <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
                    <img
                      src={featured.cover_image ?? ''}
                      alt={featured.title}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col justify-center p-8 sm:p-12">
                    <div className="flex items-center gap-3 text-xs text-ash">
                      <Badge tone="gold">{featured.category}</Badge>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5" /> {featured.read_minutes} min read
                      </span>
                    </div>
                    <h2 className="mt-4 font-display text-2xl font-semibold leading-tight text-navy-deep group-hover:text-gold-deep sm:text-3xl">
                      {featured.title}
                    </h2>
                    <p className="mt-3 leading-relaxed text-ash">{featured.excerpt}</p>
                    <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold-deep">
                      Read article <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </Reveal>
            )}

            <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post, i) => (
                <Reveal key={post.id} delay={i * 80}>
                  <Link
                    to={`/insights/${post.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-black/5 bg-white card-shadow transition hover:-translate-y-1.5"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={post.cover_image ?? ''}
                        alt={post.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="flex items-center gap-3 text-xs text-ash">
                        <Badge tone="gold">{post.category}</Badge>
                        <span>{post.read_minutes} min</span>
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
          </>
        )}
      </Container>
    </>
  )
}
