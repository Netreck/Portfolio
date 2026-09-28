import { useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import type { Language } from '../../data/projects'
import { POSTS_COPY, type Post } from '../../data/posts'
import ConcretoNav from './ConcretoNav'
import { Question } from './CaseStudy'
import CdnDiagram, { type CacheMode } from './CdnDiagram'
import RoundTripSim from './RoundTripSim'

interface PostPageProps {
  post: Post
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function PostPage({ post, language, onLanguageChange }: PostPageProps) {
  const t = POSTS_COPY[language]
  const [mode, setMode] = useState<CacheMode>('miss')
  const steps = mode === 'hit' ? post.hitSteps : post.missSteps
  const facts = [
    { label: t.stack, value: post.stack.join(' · ') },
    { label: t.result, value: t.resultValue },
  ]

  return (
    <div className="cz min-h-screen bg-paper text-ink">
      <ConcretoNav language={language} onLanguageChange={onLanguageChange} base="/" />

      <header className="border-b-2 border-ink px-4 pb-8 pt-6 sm:px-8 lg:px-12 lg:pb-10 lg:pt-8">
        <a href="/#posts" className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink no-underline hover:bg-signal">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>
        <h1 className="mt-6 max-w-[18ch] text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">
          {post.title[language]}
        </h1>
        <p className="mt-6 max-w-[62ch] text-[clamp(1.125rem,1.5vw,1.3125rem)] font-medium leading-snug">{post.thesis[language]}</p>

        <dl className="mt-8 grid border-l-2 border-t-2 border-ink sm:grid-cols-[3fr_2fr]">
          {facts.map((fact) => (
            <div key={fact.label} className={`border-b-2 border-r-2 border-ink px-4 py-3 ${fact.label === t.result ? 'bg-signal' : ''}`}>
              <dt className={`text-[14px] font-medium ${fact.label === t.result ? 'text-ink' : 'text-ink-soft'}`}>{fact.label}</dt>
              <dd className="mt-0.5 text-[17px] font-bold leading-snug">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

      {/* The payoff first: global reach and the measured hit/miss difference */}
      <section aria-labelledby="benefit-title" className="on-ink bg-ink px-4 py-12 text-paper sm:px-8 lg:px-12 lg:py-16">
        <div className="grid max-w-[1300px] gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <h2 id="benefit-title" className="text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em]">
              {post.benefit.title[language]}
            </h2>
            <p className="mt-5 max-w-[52ch] text-[17px] leading-relaxed">{post.benefit.text[language]}</p>
          </div>

          <div className="lg:col-span-7">
            <p className="text-[15px] font-semibold text-[#c8c8c2]">{post.benefit.measuredTitle[language]}</p>
            <ul className="mt-4 border-t-2 border-paper">
              {post.benefit.measurements.map((m) => (
                <li key={m.label.en} className="border-b-2 border-paper py-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                    <span className="text-[17px] font-semibold">{m.label[language]}</span>
                    <span className={`tnum text-[clamp(2.25rem,4.4vw,3.5rem)] font-extrabold leading-none tracking-[-0.03em] ${m.lit ? 'text-signal' : ''}`}>
                      {m.ms} ms
                    </span>
                  </div>
                  {/* One square = 20 ms */}
                  <div className="mt-3 flex flex-wrap gap-[3px]" aria-hidden="true">
                    {Array.from({ length: Math.max(1, Math.round(m.ms / 20)) }, (_, i) => (
                      <span key={i} className={`h-3.5 w-3.5 ${m.lit ? 'bg-signal' : 'border-2 border-paper'}`} />
                    ))}
                  </div>
                  <p className="tnum mt-2 text-[14px] text-[#c8c8c2]">{m.detail[language]}</p>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-[clamp(1.25rem,2vw,1.625rem)] font-bold text-signal">{post.benefit.speedup[language]}</p>
            <p className="mt-2 max-w-[60ch] text-[16px] leading-relaxed">{post.benefit.size[language]}</p>
            <p className="mt-4 max-w-[70ch] text-[14px] leading-relaxed text-[#c8c8c2]">{post.benefit.note[language]}</p>
          </div>
        </div>
      </section>

      <RoundTripSim language={language} />

      <main className="px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1100px]">
          <Question id="path" title={t.pathTitle} first>
            <div className="inline-flex" role="group" aria-label={t.pathTitle}>
              {(['miss', 'hit'] as const).map((value) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={mode === value}
                  onClick={() => setMode(value)}
                  className={`-ml-0.5 h-11 cursor-pointer border-2 border-ink px-4 text-[15px] font-semibold first:ml-0 ${
                    mode === value ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-signal'
                  }`}
                >
                  {value === 'hit' ? t.hit : t.miss}
                </button>
              ))}
            </div>

            <div className="mt-6">
              <CdnDiagram language={language} mode={mode} label={`${t.diagramLabel}: ${mode === 'hit' ? t.hit : t.miss}`} />
            </div>

            <ol className="mt-8 border-t-2 border-ink" aria-live="polite">
              {steps.map((step, index) => (
                <li key={step.en} className="grid grid-cols-[2rem_1fr] gap-x-4 border-b-2 border-ink py-3.5">
                  <span className="tnum flex h-8 w-8 items-center justify-center border-2 border-ink bg-signal text-[15px] font-bold">
                    {index + 1}
                  </span>
                  <p className="self-center text-[17px] leading-relaxed">{step[language]}</p>
                </li>
              ))}
            </ol>
          </Question>

          <Question id="proof" title={t.proofTitle}>
            <ul className="border-t-2 border-ink sm:hidden">
              {post.evidence.map((row) => (
                <li key={row.request.en + row.asset.en} className="border-b-2 border-ink py-3">
                  <p className="flex items-center justify-between gap-3">
                    <span className="text-[16px] font-bold">{row.request[language]}</span>
                    <span className={`border-2 border-ink px-2 py-0.5 text-[14px] font-semibold ${row.result.startsWith('Hit') ? 'bg-signal' : ''}`}>
                      {row.result}
                    </span>
                  </p>
                  <p className="mt-1.5 text-[15px]">{row.asset[language]}</p>
                  <p className="tnum mt-0.5 text-[15px] text-ink-soft">Cache-Control: {row.cacheControl[language]}</p>
                </li>
              ))}
            </ul>
            <div className="hidden overflow-x-auto sm:block">
              <table className="w-full min-w-[640px] border-collapse text-left text-[15px]">
                <thead>
                  <tr className="border-y-2 border-ink">
                    {Object.values(t.proofTable).map((heading) => (
                      <th key={heading} scope="col" className="px-3 py-2.5 font-semibold">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {post.evidence.map((row) => (
                    <tr key={row.request.en + row.asset.en} className="border-b-2 border-ink">
                      <th scope="row" className="whitespace-nowrap px-3 py-3 font-bold">{row.request[language]}</th>
                      <td className="px-3 py-3">{row.asset[language]}</td>
                      <td className="whitespace-nowrap px-3 py-3">
                        <span
                          className={`inline-flex items-center gap-2 border-2 border-ink px-2 py-0.5 font-semibold ${
                            row.result.startsWith('Hit') ? 'bg-signal' : ''
                          }`}
                        >
                          {row.result}
                        </span>
                      </td>
                      <td className="tnum px-3 py-3">{row.cacheControl[language]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <h3 className="mt-12 text-[clamp(1.5rem,2.2vw,1.875rem)] font-bold tracking-[-0.02em]">{t.expiryTitle}</h3>
            <p className="mt-4 max-w-[68ch] text-[17px] leading-relaxed">{post.expiry[language]}</p>
          </Question>

          <Question
            id="why"
            title={t.whyTitle}
            className="on-ink -mx-4 mb-16 bg-ink px-4 text-paper sm:-mx-8 sm:px-8 lg:mx-0 lg:px-10"
          >
            <div className="max-w-[68ch] space-y-5 text-[17px] leading-relaxed">
              {post.summary[language].map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Question>
        </div>
      </main>

      <footer className="on-cobalt flex flex-wrap items-center gap-4 bg-cobalt px-4 py-8 text-paper sm:px-8 lg:px-12">
        <a href="/#posts" className="inline-flex items-center gap-2 text-[17px] font-semibold text-paper no-underline hover:bg-signal hover:text-ink">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>
      </footer>
    </div>
  )
}
