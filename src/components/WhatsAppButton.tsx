import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '../lib/supabase'

export function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    'Hello AHS Properties, I would like to know more about your developments.',
  )}`
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with AHS Properties on WhatsApp"
      className="group fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3.5 text-white shadow-xl shadow-[#25D366]/30 transition-transform hover:scale-105"
    >
      <MessageCircle className="h-6 w-6" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-semibold opacity-0 transition-all duration-300 group-hover:max-w-[120px] group-hover:opacity-100">
        WhatsApp us
      </span>
    </a>
  )
}
