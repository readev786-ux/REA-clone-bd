import { Mail, MapPin, MessageCircle, Clock, CalendarHeart } from 'lucide-react'
import { PageHeader } from '../components/layout/PageHeader'
import { Container, SectionHeading } from '../components/ui/Primitives'
import { InquiryForm, AppointmentForm } from '../components/Forms'
import { CONTACT_EMAIL, WHATSAPP_NUMBER } from '../lib/supabase'
import { useContent } from '../hooks/useData'

export default function Contact() {
  const c = useContent()
  const details = [
    {
      icon: MapPin,
      title: 'Visit our Estate Desk',
      lines: [
        c('contact.address1', 'Rajnigandha Tower Area, Dhaka Cantonment'),
        c('contact.address2', 'VIP Road, Nayapaltan, Dhaka'),
      ],
    },
    {
      icon: Mail,
      title: 'Email',
      lines: [CONTACT_EMAIL],
      href: `mailto:${CONTACT_EMAIL}`,
    },
    {
      icon: MessageCircle,
      title: 'WhatsApp / Call',
      lines: [`+${WHATSAPP_NUMBER}`],
      href: `https://wa.me/${WHATSAPP_NUMBER}`,
    },
    {
      icon: Clock,
      title: 'Estate Desk hours',
      lines: [
        c('contact.hours1', 'Sat – Thu · 10:00 AM – 7:00 PM'),
        c('contact.hours2', 'Friday by appointment'),
      ],
    },
  ]

  return (
    <>
      <PageHeader
        kicker={c('page.contact.kicker', 'Estate Desk')}
        title={c('page.contact.title', "Let's find your perfect property")}
        intro={c('page.contact.intro', 'Dedicated professionals ready to help you find your perfect property or next key investment opportunity in Bangladesh.')}
        crumb="Contact"
        image={c('page.contact.image', 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=2000&q=80')}
      />

      {/* Details + inquiry */}
      <section className="py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr]">
            <div>
              <SectionHeading
                align="left"
                kicker="Reach us"
                title="Our address & contact information"
                intro="Direct access to dedicated consultants with local and legal insights."
              />
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {details.map((d) => {
                  const inner = (
                    <div className="h-full rounded-2xl border border-black/5 bg-white p-6 card-shadow transition hover:-translate-y-1">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-wash text-gold-deep">
                        <d.icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 font-semibold text-navy-deep">{d.title}</h3>
                      {d.lines.map((l) => (
                        <p key={l} className="mt-1 text-sm text-ash">
                          {l}
                        </p>
                      ))}
                    </div>
                  )
                  return d.href ? (
                    <a key={d.title} href={d.href} target="_blank" rel="noreferrer">
                      {inner}
                    </a>
                  ) : (
                    <div key={d.title}>{inner}</div>
                  )
                })}
              </div>

              <div className="mt-6 overflow-hidden rounded-2xl border border-black/5 card-shadow">
                <iframe
                  title="AHS Properties office"
                  className="h-64 w-full"
                  loading="lazy"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=90.378%2C23.812%2C90.402%2C23.828&layer=mapnik&marker=23.820%2C90.390"
                />
              </div>
            </div>

            <div className="rounded-3xl border border-black/5 bg-white p-8 card-shadow">
              <h3 className="font-display text-2xl font-semibold text-navy-deep">
                Send us a message
              </h3>
              <p className="mt-1 text-sm text-ash">
                Tell us about your requirements and a consultant will respond within one business day.
              </p>
              <div className="mt-6">
                <InquiryForm source="contact" />
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Appointment calendar */}
      <section className="bg-gradient-to-b from-cream to-sand py-16">
        <Container>
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:items-center">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full bg-navy px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-gold">
                <CalendarHeart className="h-4 w-4" /> Estate Desk Appointment Calendar
              </span>
              <h2 className="mt-5 font-display text-3xl font-semibold leading-tight text-navy-deep sm:text-4xl">
                Reserve your private consultation room
              </h2>
              <p className="mt-4 leading-relaxed text-ash">
                Please supply all credentials to reserve your consultant calendar seat. Request a
                live tour and presentation of any AHS development at a time that suits you.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-navy-deep/80">
                <li>· Private, unhurried walkthrough with a senior consultant</li>
                <li>· Full title, escrow and compliance documentation on hand</li>
                <li>· Virtual tours available for overseas (NRB) clients</li>
              </ul>
            </div>
            <div className="rounded-3xl border border-black/5 bg-white p-8 card-shadow">
              <AppointmentForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
