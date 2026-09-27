import type { CSSProperties } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import type { Language } from '../../data/projects'
import { PROFILE } from '../../data/profile'
import { LANDING } from './copy'

interface ChronologyProps {
  language: Language
}

const MONTHS: Record<string, number> = {
  jan: 0, feb: 1, fev: 1, mar: 2, apr: 3, abr: 3, may: 4, mai: 4, jun: 5,
  jul: 6, aug: 7, ago: 7, sep: 8, set: 8, oct: 9, out: 9, nov: 10, dec: 11, dez: 11,
}

// "Jun 2026" -> months since Jan 2024; "Present"/"Presente" -> today.
function toMonth(token: string, today: number): number | null {
  if (/present/i.test(token)) return today
  const match = token.trim().match(/([a-zç]{3})[a-zç]*\.?\s+(\d{4})/i)
  if (!match) return null
  const month = MONTHS[match[1].toLowerCase()]
  if (month === undefined) return null
  return (Number(match[2]) - AXIS_START_YEAR) * 12 + month
}

function parsePeriod(period: string, today: number): [number, number] | null {
  const [start, end] = period.split(/\s+[—–-]\s+/)
  const from = toMonth(start ?? '', today)
  const to = toMonth(end ?? '', today)
  if (from === null || to === null) return null
  return [from, Math.max(to + 1, from + 1)]
}

const AXIS_START_YEAR = 2024
const AXIS_YEARS = [2024, 2025, 2026, 2027]
const AXIS_MONTHS = AXIS_YEARS.length * 12

// Narrow rulers read at quarter resolution: bars snap to whole quarters.
function barStyle(from: number, to: number, color: string) {
  const fromQ = Math.round(from / 3) * 3
  const toQ = Math.max(fromQ + 3, Math.round(to / 3) * 3)
  return {
    '--bar': color,
    '--left': pct(from),
    '--width': `calc(${pct(to)} - ${pct(from)})`,
    '--cells': to - from,
    '--left-q': pct(fromQ),
    '--width-q': `calc(${pct(toQ)} - ${pct(fromQ)})`,
    '--cells-q': (toQ - fromQ) / 3,
  } as CSSProperties
}

// Stepped easing: bars grow in whole grid steps.
const stepEase = (steps: number) => (t: number) => Math.min(1, Math.ceil(t * steps) / steps)

const pct = (month: number) => `${(Math.min(Math.max(month, 0), AXIS_MONTHS) / AXIS_MONTHS) * 100}%`

export default function Chronology({ language }: ChronologyProps) {
  const copy = PROFILE[language]
  const t = LANDING[language]
  const reduceMotion = useReducedMotion()
  const now = new Date()
  const today = (now.getFullYear() - AXIS_START_YEAR) * 12 + now.getMonth()

  const tracks = [
    ...copy.experience.map((job) => ({ job, tone: job.current ? 'signal' : 'solid' })),
    { job: copy.community, tone: 'outline' },
  ]
    .map(({ job, tone }) => ({ job, tone, span: parsePeriod(job.period, today) }))
    .filter((track): track is typeof track & { span: [number, number] } => track.span !== null)
    .sort((a, b) => a.span[0] - b.span[0])

  const orgCount = (organization: string) => tracks.filter((track) => track.job.organization === organization).length
  const shortRole = (role: string) => role.split(/\s+[—–-]\s+/)[0]

  const rows = [
    ...copy.experience.map((job) => ({ job, group: 'work' as const })),
    { job: copy.community, group: 'community' as const },
  ]

  return (
    <section id="experience" aria-labelledby="experience-title" className="scroll-mt-28 border-t-2 border-ink">
      <div className="px-4 pb-20 pt-16 sm:px-8 lg:px-12 lg:pb-28 lg:pt-24">
        <h2
          id="experience-title"
          className="max-w-[14ch] text-[clamp(2.5rem,5.2vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.035em]"
        >
          {copy.experienceTitle}
        </h2>

        {/* Year ruler: every role is a flat bar placed by its dates */}
        <figure className="mt-14 lg:mt-20" aria-label={t.roles}>
          <div className="cz-ruler relative">
            <div className="grid grid-cols-4 border-b-2 border-ink">
              {AXIS_YEARS.map((year) => (
                <span key={year} className="tnum border-l-2 border-ink pb-2 pl-2 text-sm font-semibold sm:text-base">
                  {year}
                </span>
              ))}
            </div>

            <ul className="relative mt-5 space-y-3">
              {tracks.map(({ job, tone, span: [from, to] }, index) => {
                const anchorRight = from / AXIS_MONTHS > 0.5
                const barColor =
                  tone === 'signal'
                    ? 'var(--color-signal)'
                    : tone === 'outline'
                      ? 'var(--color-cobalt)'
                      : 'var(--color-ink)'
                const repeated = orgCount(job.organization) > 1

                return (
                  <li key={`${job.organization}-${job.role}`} className="relative h-11 sm:h-14">
                    <span
                      className={`absolute top-0 z-10 -mx-1 whitespace-nowrap px-1 text-[13px] font-semibold leading-none sm:text-sm ${
                        'bg-paper text-ink'
                      }`}
                      style={anchorRight ? { right: `calc(100% - ${pct(to)} + 0.875rem)` } : { left: pct(from) }}
                    >
                      {repeated ? (
                        <>
                          <span className="hidden sm:inline">{job.organization} · </span>
                          {shortRole(job.role)}
                        </>
                      ) : (
                        job.organization
                      )}
                    </span>
                    <motion.span
                      aria-hidden="true"
                      className="cz-bar absolute bottom-0 origin-left"
                      style={barStyle(from, to, barColor)}
                      initial={reduceMotion ? false : { scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true, amount: 0.6 }}
                      transition={{ duration: 0.64, delay: index * 0.12, ease: stepEase(8) }}
                    />
                  </li>
                )
              })}

            </ul>

            <div
              className="pointer-events-none absolute bottom-0 top-0 w-0.5 bg-cobalt"
              style={{ left: pct(today + now.getDate() / 31) }}
              aria-hidden="true"
            >
              <span className="absolute -top-7 left-1.5 text-[13px] font-semibold text-cobalt sm:text-sm">{t.today}</span>
            </div>
          </div>
        </figure>

        {/* Roles */}
        <div className="mt-16 border-t-2 border-ink lg:mt-24">
          {rows.map(({ job, group }, index) => {
            const showCommunityHeading = group === 'community' && rows[index - 1]?.group !== 'community'
            const keyColor = job.current ? 'bg-signal' : group === 'community' ? 'bg-cobalt' : 'bg-ink'

            return (
              <div key={`${job.organization}-${job.role}`}>
                {showCommunityHeading && (
                  <h3 className="border-b-2 border-ink pb-4 pt-12 text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold tracking-[-0.02em]">
                    {copy.communityTitle}
                  </h3>
                )}
                <article className="grid gap-4 border-b-2 border-ink py-5 sm:py-7 lg:grid-cols-12 lg:gap-8">
                  <div className="self-start py-3 lg:col-span-4">
                    <p className="tnum flex items-center gap-3 text-[15px] font-medium text-ink-soft">
                      <span aria-hidden="true" className={`h-4 w-4 shrink-0 border-2 border-ink ${keyColor}`} />
                      {job.period}
                    </p>
                    <p className="mt-1 pl-7 text-xl font-semibold leading-snug">{job.organization}</p>
                    <div className="mt-3 flex flex-wrap gap-2 pl-7">
                      {job.current && (
                        <span className="inline-flex items-center gap-2 bg-ink px-2.5 py-1 text-sm font-semibold text-paper">
                          <span aria-hidden="true" className="h-2.5 w-2.5 bg-signal" />
                          {copy.currentLabel}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-8 lg:py-3">
                    <h4 className="text-[clamp(1.375rem,2vw,1.75rem)] font-semibold leading-tight tracking-[-0.015em]">
                      {job.role}
                    </h4>
                    <ul className="mt-4 max-w-[62ch] space-y-2 text-[17px] leading-relaxed text-ink-soft">
                      {job.highlights.map((highlight) => (
                        <li key={highlight} className="flex gap-3">
                          <span aria-hidden="true" className="mt-[0.6em] h-2 w-2 shrink-0 bg-cobalt" />
                          <span>{highlight}</span>
                        </li>
                      ))}
                    </ul>
                    {job.technologies && (
                      <p className="mt-5 text-[15px] font-medium text-ink">{job.technologies.join(' / ')}</p>
                    )}
                  </div>
                </article>
              </div>
            )
          })}
        </div>

        {/* Education and skills */}
        <div className="mt-16 grid gap-14 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-4">
            <h3 className="text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold tracking-[-0.02em]">{copy.educationTitle}</h3>
            <p className="mt-5 text-[17px] font-medium">
              {copy.university}
            </p>
            <ul className="mt-5 space-y-5">
              {copy.education.map((course) => (
                <li key={course.degree} className="flex gap-3">
                  <span aria-hidden="true" className="mt-1 h-4 w-4 shrink-0 border-2 border-ink" />
                  <div>
                    <p className="text-[17px] font-semibold leading-snug">{course.degree}</p>
                    <p className="tnum mt-0.5 text-[15px] text-ink-soft">{course.completion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-8">
            <h3 className="text-[clamp(1.75rem,2.6vw,2.25rem)] font-bold tracking-[-0.02em]">{copy.skillsTitle}</h3>
            <dl className="mt-5 grid gap-8 sm:grid-cols-2">
              {copy.skills.map((group) => (
                <div key={group.label} className="border-t-2 border-ink pt-4">
                  <dt className="text-[17px] font-semibold">{group.label}</dt>
                  <dd className="mt-2 text-[17px] leading-relaxed text-ink-soft">{group.details}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}
