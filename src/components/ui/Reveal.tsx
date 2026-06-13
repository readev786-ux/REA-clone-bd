import { useEffect, useRef, useState, type ReactNode } from 'react'

/** Fades children up when they scroll into view. */
export function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: ReactNode
  delay?: number
  className?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true)
          observer.disconnect()
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? undefined : 0,
        animation: shown ? `fade-up 0.7s cubic-bezier(0.2,0.7,0.2,1) ${delay}ms forwards` : undefined,
      }}
    >
      {children}
    </div>
  )
}
