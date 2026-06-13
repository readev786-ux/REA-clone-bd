import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, Clock, CalendarDays } from 'lucide-react'
import { Container, Badge, Spinner, Button } from '../components/ui/Primitives'
import { useBlogPost } from '../hooks/useData'
import { formatDate } from '../lib/format'

export default function InsightDetail() {
  const { slug } = useParams()
  const { data: post, isLoading } = useBlogPost(slug)

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-[72px]">
        <Spinner className="text-gold-deep" />
      </div>
    )
  }

  if (!post) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 pt-[72px] text-center">
        <h1 className="font-display text-3xl font-semibold text-navy-deep">Article not found</h1>
        <Link to="/insights" className="text-gold-deep underline">
          Back to Insights
        </Link>
      </div>
    )
  }

  const paragraphs = (post.body ?? '').split('\n').filter((p) => p.trim())

  return (
    <article className="pt-[72px]">
      {/* Hero */}
      <header className="relative overflow-hidden bg-navy-darker">
        <img
          src={post.cover_image ?? ''}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-navy-darker/80 to-navy-darker" />
        <Container className="relative z-10 py-16">
          <Link
            to="/insights"
            className="inline-flex items-center gap-2 text-sm text-white/60 transition hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" /> All insights
          </Link>
          <div className="mt-6 flex items-center gap-3 text-sm text-white/70">
            <Badge tone="gold">{post.category}</Badge>
            <span className="inline-flex items-center gap-1">
              <Clock className="h-4 w-4" /> {post.read_minutes} min read
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays className="h-4 w-4" /> {formatDate(post.published_at)}
            </span>
          </div>
          <h1 className="mt-4 max-w-3xl font-display text-3xl font-bold leading-tight text-white sm:text-5xl text-balance">
            {post.title}
          </h1>
          <p className="mt-3 text-sm text-gold/80">By {post.author}</p>
        </Container>
      </header>

      <Container className="py-14">
        <div className="mx-auto max-w-3xl">
          {post.excerpt && (
            <p className="mb-8 border-l-4 border-gold pl-5 font-display text-xl leading-relaxed text-navy-deep">
              {post.excerpt}
            </p>
          )}
          <div className="space-y-6">
            {paragraphs.map((p, i) => (
              <p key={i} className="text-base leading-relaxed text-navy-deep/85">
                {p}
              </p>
            ))}
          </div>

          <div className="mt-12 rounded-3xl bg-gradient-to-br from-navy to-navy-darker p-8 text-center text-white sm:p-12">
            <h3 className="font-display text-2xl font-semibold">
              Ready to explore AHS developments?
            </h3>
            <p className="mt-2 text-white/70">
              Speak with a consultant about compliant, high-yield opportunities.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button to="/developments">Browse developments</Button>
              <Button to="/contact" variant="ghost" className="text-white hover:bg-white/10">
                Contact us
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </article>
  )
}
