import { useEffect, useState, type ReactNode } from 'react'

// Shared pieces of the Concreto case-study pages: question sections and the
// sticky index that tracks which question is on screen.

interface QuestionProps {
  id: string
  title: string
  children: ReactNode
  first?: boolean
  className?: string
}

export function Question({ id, title, children, first = false, className = '' }: QuestionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-28 pb-16 lg:pb-24 ${first ? 'pt-6 lg:pt-8' : 'border-t-2 border-ink pt-10 lg:pt-12'} ${className}`}
    >
      <h2
        id={`${id}-title`}
        className="max-w-[22ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.03em]"
      >
        {title}
      </h2>
      <div className={first ? 'mt-6 lg:mt-8' : 'mt-8 lg:mt-10'}>{children}</div>
    </section>
  )
}

export function useActiveQuestion(ids: string[]) {
  const [active, setActive] = useState(ids[0])
  const key = ids.join('|')

  useEffect(() => {
    const sections = key
      .split('|')
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [key])

  return active
}

interface QuestionIndexProps {
  label: string
  questions: { id: string; title: string }[]
  active: string
}

export function QuestionIndex({ label, questions, active }: QuestionIndexProps) {
  const links = (
    <ol className="mt-3 border-t-2 border-ink">
      {questions.map((q) => {
        const isActive = active === q.id
        return (
          <li key={q.id} className="border-b-2 border-ink">
            <a
              href={`#${q.id}`}
              aria-current={isActive ? 'true' : undefined}
              className={`flex items-start gap-3 px-2 py-3 text-[16px] font-semibold leading-snug text-ink no-underline hover:bg-signal ${
                isActive ? 'lg:bg-signal' : ''
              }`}
            >
              <span aria-hidden="true" className={`mt-1 h-3.5 w-3.5 shrink-0 border-2 border-ink ${isActive ? 'lg:bg-ink' : ''}`} />
              {q.title}
            </a>
          </li>
        )
      })}
    </ol>
  )

  return (
    <>
      {/* Small screens: the index folds away so the first answer follows the header. */}
      <details className="group border-b-2 border-ink py-4 lg:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between text-[16px] font-semibold [&::-webkit-details-marker]:hidden">
          {label}
          <span aria-hidden="true" className="h-3.5 w-3.5 border-2 border-ink group-open:bg-ink" />
        </summary>
        {links}
      </details>
      <nav aria-label={label} className="hidden lg:sticky lg:top-[66px] lg:col-span-3 lg:block lg:self-start lg:py-12">
        <p className="text-[14px] font-semibold text-ink-soft">{label}</p>
        {links}
      </nav>
    </>
  )
}

export function StatusBadge({ online, label }: { online: boolean; label: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 border-2 border-ink px-2.5 py-1 text-[14px] font-semibold ${
        online ? 'bg-signal text-ink' : 'bg-paper text-ink'
      }`}
    >
      <span aria-hidden="true" className={`h-2.5 w-2.5 border-2 border-ink ${online ? 'bg-ink' : ''}`} />
      {label}
    </span>
  )
}
