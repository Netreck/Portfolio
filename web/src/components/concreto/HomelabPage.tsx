import { useEffect, useState, type ReactNode } from 'react'
import { ArrowLeft, Github } from 'lucide-react'
import type { Language } from '../../data/projects'
import {
  ADMIN_PATH,
  HARDWARE,
  HOMELAB_COPY,
  HOMELAB_REPO,
  MACHINES,
  POLICIES,
  PUBLIC_PATH,
  SNAPSHOT_DATE,
  ZONES,
  type Hop,
} from '../../data/homelab'
import proxmenuxMonitor from '../../Assets/Home-lab/proxmenux-example.png'
import ConcretoNav from './ConcretoNav'
import ArchitectureDiagram from './ArchitectureDiagram'

interface HomelabPageProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

function HopList({ hops, language }: { hops: Hop[]; language: Language }) {
  return (
    <ol className="border-t-2 border-ink xl:columns-2 xl:gap-10">
      {hops.map((hop, index) => (
        <li
          key={`${hop.node}-${index}`}
          className="grid break-inside-avoid grid-cols-[2rem_1fr] gap-x-4 border-b-2 border-ink py-4"
        >
          <span className="tnum flex h-8 w-8 items-center justify-center border-2 border-ink bg-signal text-[15px] font-bold">
            {index + 1}
          </span>
          <div className="min-w-0">
            <p className="text-[17px] font-semibold leading-snug">{hop.node}</p>
            <p className="tnum mt-0.5 text-[15px] font-medium text-cobalt">{hop.where}</p>
            <p className="mt-1.5 text-[16px] leading-relaxed text-ink-soft">{hop.detail[language]}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

interface QuestionProps {
  id: string
  title: string
  children: ReactNode
  first?: boolean
  className?: string
}

function Question({ id, title, children, first = false, className = '' }: QuestionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-28 pb-16 pt-10 lg:pb-24 lg:pt-12 ${first ? '' : 'border-t-2 border-ink'} ${className}`}
    >
      <h2
        id={`${id}-title`}
        className="max-w-[22ch] text-[clamp(2rem,3.6vw,3.25rem)] font-bold leading-[1.02] tracking-[-0.03em]"
      >
        {title}
      </h2>
      <div className="mt-8 lg:mt-10">{children}</div>
    </section>
  )
}

export default function HomelabPage({ language, onLanguageChange }: HomelabPageProps) {
  const t = HOMELAB_COPY[language]
  const [active, setActive] = useState(t.q[0].id)

  useEffect(() => {
    const sections = t.q.map((q) => document.getElementById(q.id)).filter((el): el is HTMLElement => el !== null)
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (visible.length > 0) setActive(visible[0].target.id)
      },
      { rootMargin: '-35% 0px -60% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [t.q])

  const zoneName = (zone: string) => ZONES.find((z) => z.id === zone)?.name ?? zone

  return (
    <div className="cz min-h-screen bg-paper text-ink">
      <ConcretoNav language={language} onLanguageChange={onLanguageChange} base="/" />

      <header className="relative border-b-2 border-ink px-4 pb-10 pt-8 sm:px-8 lg:px-12 lg:pb-14 lg:pt-10">
        <a href="/#projects" className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink no-underline hover:bg-signal">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>

        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="text-[clamp(2.75rem,5.6vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
              {t.title}
            </h1>
            <p className="mt-6 max-w-[58ch] text-[clamp(1.125rem,1.5vw,1.3125rem)] font-medium leading-snug">{t.thesis}</p>
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <a
              href={HOMELAB_REPO}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-14 items-center gap-3 bg-ink px-5 text-[17px] font-semibold text-paper no-underline hover:bg-cobalt"
            >
              <Github size={20} aria-hidden="true" />
              {t.repo}
            </a>
          </div>
        </div>

        <dl className="mt-10 grid grid-cols-2 border-l-2 border-t-2 border-ink sm:grid-cols-5">
          {t.facts.map((fact) => (
            <div key={fact.label} className="border-b-2 border-r-2 border-ink px-4 py-3">
              <dt className="text-[14px] font-medium text-ink-soft">{fact.label}</dt>
              <dd className="tnum mt-0.5 text-[19px] font-bold leading-tight">{fact.value}</dd>
            </div>
          ))}
          <div className="col-span-2 border-b-2 border-r-2 border-ink bg-signal px-4 py-3 sm:col-span-1">
            <dt className="text-[14px] font-medium">{t.snapshot}</dt>
            <dd className="tnum mt-0.5 text-[19px] font-bold leading-tight">{SNAPSHOT_DATE[language]}</dd>
          </div>
        </dl>
      </header>

      <section
        aria-label={t.practiceTitle}
        className="grid gap-10 border-b-2 border-ink px-4 py-12 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12 lg:py-16"
      >
        <p className="max-w-[40ch] text-[clamp(1.375rem,2.3vw,2rem)] font-medium leading-[1.3] tracking-[-0.015em] lg:col-span-7">
          {t.intro}
        </p>
        <div className="lg:col-span-5">
          <h2 className="text-[17px] font-semibold">{t.practiceTitle}</h2>
          <dl className="mt-3 border-t-2 border-ink">
            {t.practice.map((item) => (
              <div key={item.area} className="grid gap-1 border-b-2 border-ink py-3 sm:grid-cols-[9.5rem_1fr] sm:gap-4">
                <dt className="flex items-center gap-2.5 text-[16px] font-bold">
                  <span aria-hidden="true" className="h-2.5 w-2.5 shrink-0 bg-cobalt" />
                  {item.area}
                </dt>
                <dd className="text-[16px] leading-relaxed text-ink-soft">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="grid grid-cols-1 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <nav aria-label={t.questionsLabel} className="py-8 lg:sticky lg:top-[66px] lg:col-span-3 lg:self-start lg:py-12">
          <p className="text-[14px] font-semibold text-ink-soft">{t.questionsLabel}</p>
          <ol className="mt-3 border-t-2 border-ink">
            {t.q.map((q) => {
              const isActive = active === q.id
              return (
                <li key={q.id} className="border-b-2 border-ink">
                  <a
                    href={`#${q.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className={`flex items-start gap-3 px-2 py-3 text-[16px] font-semibold leading-snug text-ink no-underline hover:bg-signal ${
                      isActive ? 'bg-signal' : ''
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`mt-1 h-3.5 w-3.5 shrink-0 border-2 border-ink ${isActive ? 'bg-ink' : ''}`}
                    />
                    {q.title}
                  </a>
                </li>
              )
            })}
          </ol>
        </nav>

        <main className="min-w-0 lg:col-span-9">
          <Question id="ingress" title={t.q[0].title} first>
            <ArchitectureDiagram language={language} mode="public" />
            <div className="mt-10 grid gap-5 text-[17px] leading-relaxed xl:grid-cols-2 xl:gap-10">
              {t.ingressWhy.map((paragraph) => (
                <p key={paragraph} className="max-w-[60ch]">
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-10">
              <HopList hops={PUBLIC_PATH} language={language} />
            </div>
          </Question>

          <Question id="admin" title={t.q[1].title}>
            <ArchitectureDiagram language={language} mode="admin" />
            <p className="mt-10 max-w-[68ch] text-[17px] leading-relaxed">{t.adminWhy}</p>
            <div className="mt-10">
              <HopList hops={ADMIN_PATH} language={language} />
            </div>
          </Question>

          <Question id="isolation" title={t.q[2].title}>
            <ArchitectureDiagram language={language} mode="zones" />

            <div className="mt-10 overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
                <thead>
                  <tr className="border-y-2 border-ink">
                    {Object.values(t.zonesTable).map((heading) => (
                      <th key={heading} scope="col" className="px-3 py-2.5 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ZONES.map((zone) => (
                    <tr key={zone.id} className="border-b-2 border-ink">
                      <th scope="row" className="px-3 py-3 font-bold">{zone.name}</th>
                      <td className="px-3 py-3 font-medium">{zone.bridge}</td>
                      <td className="tnum px-3 py-3">{zone.subnet}</td>
                      <td className="tnum px-3 py-3">{zone.gateway}</td>
                      <td className="px-3 py-3 text-ink-soft">{zone.purpose[language]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-[14px] text-ink-soft">{t.gatewayNote}</p>

            <h3 className="mt-14 text-[clamp(1.5rem,2.2vw,1.875rem)] font-bold tracking-[-0.02em]">{t.policiesTitle}</h3>
            <ul className="mt-5 border-t-2 border-ink">
              {POLICIES.map((policy, index) => (
                <li key={`${policy.from}-${policy.to}`} className="grid gap-2 border-b-2 border-ink py-3.5 sm:grid-cols-[16rem_1fr] sm:gap-6">
                  <span className="flex items-center gap-2.5 text-[16px] font-bold">
                    {policy.from === '*' ? (
                      <span aria-hidden="true" className="h-8 w-8 shrink-0 border-2 border-ink" />
                    ) : (
                      <span className="tnum flex h-8 w-8 shrink-0 items-center justify-center border-2 border-ink bg-signal text-[15px]">
                        {index + 1}
                      </span>
                    )}
                    {policy.from === '*' ? (
                      <span>pfSense</span>
                    ) : (
                      <>
                        <span>{policy.from}</span>
                        <span aria-hidden="true" className="h-2.5 w-6 bg-cobalt" />
                        <span className="sr-only">→</span>
                        <span>{policy.to}</span>
                      </>
                    )}
                  </span>
                  <span className="text-[16px] leading-relaxed text-ink-soft">{policy.rule[language]}</span>
                </li>
              ))}
            </ul>

            <h3 className="mt-14 text-[clamp(1.5rem,2.2vw,1.875rem)] font-bold tracking-[-0.02em]">{t.inventoryTitle}</h3>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] border-collapse text-left text-[15px]">
                <thead>
                  <tr className="border-y-2 border-ink">
                    {Object.values(t.inventoryTable).map((heading) => (
                      <th key={heading} scope="col" className="px-3 py-2.5 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MACHINES.map((machine) => (
                    <tr key={machine.id} className="border-b-2 border-ink">
                      <th scope="row" className="tnum whitespace-nowrap px-3 py-3 font-bold">{machine.id}</th>
                      <td className="whitespace-nowrap px-3 py-3 font-medium">{machine.name}</td>
                      <td className="px-3 py-3">
                        {machine.id === 'VM107' ? (language === 'br' ? 'Todas' : 'All') : zoneName(machine.zone)}
                      </td>
                      <td className="tnum whitespace-nowrap px-3 py-3">{machine.address}</td>
                      <td className="px-3 py-3 text-ink-soft">{machine.purpose[language]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Question>

          <Question id="health" title={t.q[3].title}>
            <div className="grid gap-10 xl:grid-cols-12">
              <div className="space-y-5 text-[17px] leading-relaxed xl:col-span-5">
                {t.health.map((paragraph) => (
                  <p key={paragraph} className="max-w-[60ch]">
                    {paragraph}
                  </p>
                ))}
              </div>
              <figure className="xl:col-span-7">
                <img
                  src={proxmenuxMonitor}
                  alt={t.healthAlt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[16/10] w-full border-2 border-ink object-cover object-top"
                />
                <figcaption className="mt-3 text-[15px] text-ink-soft">{t.healthCaption}</figcaption>
              </figure>
            </div>
          </Question>

          <Question id="hardware" title={t.q[4].title}>
            <dl className="border-t-2 border-ink">
              {HARDWARE.map((row) => (
                <div key={row.value} className="grid gap-1 border-b-2 border-ink py-3.5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <dt className="text-[16px] font-medium text-ink-soft">{row.part[language]}</dt>
                  <dd className="tnum text-[18px] font-semibold">{row.value}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 max-w-[60ch] text-[17px] leading-relaxed">{t.hardwareNote}</p>
          </Question>

          <Question id="limits" title={t.q[5].title} className="on-ink -mx-4 mb-16 bg-ink px-4 text-paper sm:-mx-8 sm:px-8 lg:mx-0 lg:px-10">
            <div className="grid gap-12 xl:grid-cols-2">
              <div>
                <h3 className="text-[clamp(1.5rem,2.2vw,1.875rem)] font-bold tracking-[-0.02em]">{t.limitsTitle}</h3>
                <ul className="mt-5 border-t-2 border-paper">
                  {t.limits.map((item) => (
                    <li key={item} className="flex gap-3 border-b-2 border-paper py-3.5 text-[17px] leading-relaxed">
                      <span aria-hidden="true" className="mt-[0.45em] h-3 w-3 shrink-0 bg-paper" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[clamp(1.5rem,2.2vw,1.875rem)] font-bold tracking-[-0.02em]">{t.nextTitle}</h3>
                <ul className="mt-5 border-t-2 border-paper">
                  {t.next.map((item) => (
                    <li key={item} className="flex gap-3 border-b-2 border-paper py-3.5 text-[17px] leading-relaxed">
                      <span aria-hidden="true" className="mt-[0.45em] h-3 w-3 shrink-0 border-2 border-paper" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Question>
        </main>
      </div>

      <footer className="on-cobalt flex flex-wrap items-center justify-between gap-4 bg-cobalt px-4 py-8 text-paper sm:px-8 lg:px-12">
        <a href="/#projects" className="inline-flex items-center gap-2 text-[17px] font-semibold text-paper no-underline hover:bg-signal hover:text-ink">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>
        <a
          href={HOMELAB_REPO}
          target="_blank"
          rel="noreferrer"
          className="inline-flex h-12 items-center gap-2.5 bg-signal px-4 font-semibold text-ink no-underline hover:bg-paper"
        >
          <Github size={18} aria-hidden="true" />
          {t.repo}
        </a>
      </footer>
    </div>
  )
}
