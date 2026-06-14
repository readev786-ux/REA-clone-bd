import { useState } from 'react'
import { Plus, Minus, MessageCircleQuestion } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Container, Spinner, Button } from '../components/ui/Primitives'
import { useFaqs, useContent } from '../hooks/useData'

export default function Faq() {
  const { data: faqs, isLoading } = useFaqs()
  const [open, setOpen] = useState<string | null>(null)
  const c = useContent()

  return (
    <>
      <PageHeader
        kicker={c('page.faq.kicker', 'Frequently Asked Questions')}
        title={c('page.faq.title', 'Answers for confident buyers')}
        intro={c('page.faq.intro', 'Everything you need to know about approvals, payments, eligibility and delivery at AHS Properties.')}
        crumb="FAQ"
        image={c('page.faq.image', 'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?auto=format&fit=crop&w=2000&q=80')}
      />

      <Container className="py-16">
        <div className="mx-auto max-w-3xl">
          {isLoading ? (
            <div className="flex justify-center py-16">
              <Spinner className="text-gold-deep" />
            </div>
          ) : (
            <div className="space-y-4">
              {faqs?.map((faq) => {
                const isOpen = open === faq.id
                return (
                  <div
                    key={faq.id}
                    className="overflow-hidden rounded-2xl border border-black/5 bg-white card-shadow"
                  >
                    <button
                      onClick={() => setOpen(isOpen ? null : faq.id)}
                      className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                    >
                      <span className="flex items-center gap-3 font-display text-lg font-semibold text-navy-deep">
                        {faq.question}
                      </span>
                      <span
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition ${
                          isOpen ? 'bg-gold text-navy' : 'bg-navy/5 text-navy'
                        }`}
                      >
                        {isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ${
                        isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="px-6 pb-6 leading-relaxed text-ash">{faq.answer}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          <div className="mt-12 flex flex-col items-center gap-4 rounded-3xl bg-navy px-8 py-12 text-center text-white">
            <MessageCircleQuestion className="h-10 w-10 text-gold" />
            <h3 className="font-display text-2xl font-semibold">Still have a question?</h3>
            <p className="max-w-md text-white/70">
              Our consultants are ready with local and legal insights to guide your decision.
            </p>
            <Button to="/contact" className="mt-2">
              Talk to a consultant
            </Button>
          </div>
        </div>
      </Container>
    </>
  )
}
