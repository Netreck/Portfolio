import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import type { Language } from '../../data/projects'
import {
  FEATURES,
  HIREMATCH_APP,
  HIREMATCH_COPY,
  HIREMATCH_REPO,
  RUNTIME,
  SCORE_MODES,
  type Feature,
  type ScoreMode,
} from '../../data/hirematch'
import feedbackScreen from '../../Assets/HirematchAI/feedback.png'
import ConcretoNav from './ConcretoNav'
import { Question, QuestionIndex, StatusBadge, useActiveQuestion } from './CaseStudy'

interface HireMatchPageProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

const TONE_BG: Record<ScoreMode['segments'][number]['tone'], string> = {
  cobalt: 'bg-cobalt',
  ink: 'bg-ink',
  tint: 'bg-cobalt-tint',
}

// One score = 100 squares; each segment fills its weight, in order.
function ScoreGrid({ mode, language, example }: { mode: ScoreMode; language: Language; example?: string }) {
  const cells = mode.segments.flatMap((segment) => Array.from({ length: segment.weight }, () => segment.tone))
  const formula = mode.segments
    .map((segment) => `${(segment.weight / 100).toFixed(2)} × ${segment.label[language].toLowerCase()}`)
    .join(' + ')

  return (
    <figure className="flex flex-col">
      <figcaption>
        <p className="text-[clamp(1.25rem,1.8vw,1.5rem)] font-bold leading-tight tracking-[-0.015em]">{mode.title[language]}</p>
        <p className="tnum mt-1 text-[15px] font-medium text-cobalt">{mode.endpoint}</p>
      </figcaption>

      <div className="mt-5 grid max-w-[320px] grid-cols-10 gap-[3px]" role="img" aria-label={formula}>
        {cells.map((tone, index) => (
          <span key={index} className={`aspect-square ${TONE_BG[tone]} ${tone === 'tint' ? 'ring-1 ring-inset ring-cobalt' : ''}`} />
        ))}
      </div>

      <ul className="mt-5 max-w-[420px] border-t-2 border-ink">
        {mode.segments.map((segment) => (
          <li key={segment.label.en} className="flex items-center gap-3 border-b-2 border-ink py-2.5">
            <span aria-hidden="true" className={`h-4 w-4 shrink-0 border-2 border-ink ${TONE_BG[segment.tone]}`} />
            <span className="flex-1 text-[16px] font-medium">{segment.label[language]}</span>
            <span className="tnum text-[18px] font-bold">{segment.weight}</span>
          </li>
        ))}
      </ul>

      <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-ink-soft">{mode.note[language]}</p>
      {example && <p className="mt-4 max-w-[52ch] border-t-2 border-ink pt-4 text-[16px] font-medium leading-relaxed">{example}</p>}
    </figure>
  )
}

function Pipeline({ feature, language }: { feature: Feature; language: Language }) {
  return (
    <ol className="grid gap-4 lg:grid-flow-col lg:auto-cols-fr lg:gap-5">
      {feature.steps.map((step, index) => (
        <li
          key={step.title}
          className="relative border-2 border-ink bg-paper p-4 after:absolute after:left-8 after:top-full after:h-4 after:w-1 after:bg-cobalt last:after:hidden lg:after:left-full lg:after:top-1/2 lg:after:h-1 lg:after:w-5 lg:after:-translate-y-1/2"
        >
          <span className="tnum flex h-8 w-8 items-center justify-center border-2 border-ink bg-paper text-[15px] font-bold">
            {index + 1}
          </span>
          <p className="mt-3 text-[17px] font-semibold leading-snug">{step.title}</p>
          <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{step.detail[language]}</p>
        </li>
      ))}
    </ol>
  )
}

export default function HireMatchPage({ language, onLanguageChange }: HireMatchPageProps) {
  const t = HIREMATCH_COPY[language]
  const questions = [
    { id: 'score', title: t.scoreQuestion },
    ...FEATURES.map((feature) => ({ id: feature.id, title: feature.question[language] })),
    { id: 'runtime', title: t.runtimeQuestion },
    { id: 'status', title: t.statusQuestion },
  ]
  const active = useActiveQuestion(questions.map((q) => q.id))

  return (
    <div className="cz min-h-screen bg-paper text-ink">
      <ConcretoNav language={language} onLanguageChange={onLanguageChange} base="/" />

      <header className="border-b-2 border-ink px-4 pb-8 pt-6 sm:px-8 lg:px-12 lg:pb-8 lg:pt-8">
        <a href="/#projects" className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink no-underline hover:bg-signal">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>

        <div className="mt-6 grid gap-6 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <h1 className="text-[clamp(2.75rem,5.6vw,5.25rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">{t.title}</h1>
            <p className="mt-6 max-w-[58ch] text-[clamp(1.125rem,1.5vw,1.3125rem)] font-medium leading-snug">{t.thesis}</p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <div className="flex flex-wrap gap-3 lg:justify-end">
              <a
                href={HIREMATCH_REPO}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center gap-3 bg-ink px-5 text-[17px] font-semibold text-paper no-underline hover:bg-cobalt"
              >
                <Github size={20} aria-hidden="true" />
                {t.repo}
              </a>
              <a
                href={HIREMATCH_APP}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-14 items-center gap-3 border-2 border-ink px-5 text-[17px] font-semibold text-ink no-underline hover:bg-signal"
              >
                <ExternalLink size={20} aria-hidden="true" />
                {t.openApp}
              </a>
            </div>
            <p className="max-w-[40ch] text-[14px] leading-snug text-ink-soft lg:text-right">{t.coldStart}</p>
          </div>
        </div>

        <dl className="mt-6 grid grid-cols-2 border-l-2 border-t-2 border-ink sm:grid-cols-4">
          {t.facts.map((fact, index) => (
            <div key={fact.label} className="border-b-2 border-r-2 border-ink px-4 py-3">
              <dt className="text-[14px] font-medium text-ink-soft">{fact.label}</dt>
              <dd className="mt-0.5 flex items-center gap-2 text-[19px] font-bold leading-tight">
                {index === 0 && <span aria-hidden="true" className="h-3 w-3 shrink-0 border-2 border-ink" />}
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <section role="note" aria-label={t.archivedTitle} className="on-ink bg-ink px-4 py-5 text-paper sm:px-8 lg:px-12">
        <div className="grid gap-3 lg:grid-cols-12 lg:gap-10">
          <p className="flex items-center gap-3 text-[17px] font-bold lg:col-span-3">
            <span aria-hidden="true" className="h-4 w-4 shrink-0 border-2 border-paper" />
            {t.archivedTitle}
          </p>
          <p className="max-w-[80ch] text-[16px] leading-relaxed lg:col-span-9">{t.archived}</p>
        </div>
      </section>

      <div className="grid grid-cols-1 px-4 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-12">
        <QuestionIndex label={t.questionsLabel} questions={questions} active={active} />

        <main className="min-w-0 lg:col-span-9">
          <Question id="score" title={t.scoreQuestion} first>
            <p className="max-w-[60ch] text-[17px] leading-relaxed">{t.scoreIntro}</p>
            <div className="mt-6 grid gap-14 xl:grid-cols-2 xl:gap-10">
              {SCORE_MODES.map((mode) => (
                <ScoreGrid key={mode.id} mode={mode} language={language} example={mode.id === 'custom' ? t.example : undefined} />
              ))}
            </div>
            <p className="mt-3 text-[15px] text-ink-soft">{t.scaleNote}</p>
          </Question>

          {FEATURES.map((feature) => (
            <Question key={feature.id} id={feature.id} title={feature.question[language]}>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                <StatusBadge online={feature.online} label={feature.online ? t.online : t.offline} />
                <span className="text-[17px] font-bold">{feature.technique[language]}</span>
                <span className="tnum text-[15px] font-medium text-cobalt">{feature.endpoint}</span>
              </div>
              <p className="mt-5 max-w-[68ch] text-[17px] leading-relaxed">{feature.summary[language]}</p>
              <div className="mt-8">
                <Pipeline feature={feature} language={language} />
              </div>
              {feature.id === 'feedback' && (
                <figure className="mt-10">
                  <img
                    src={feedbackScreen}
                    alt={t.feedbackAlt}
                    loading="lazy"
                    decoding="async"
                    className="h-auto w-full border-2 border-ink"
                  />
                  <figcaption className="mt-3 text-[15px] text-ink-soft">{t.feedbackCaption}</figcaption>
                </figure>
              )}
            </Question>
          ))}

          <Question id="runtime" title={t.runtimeQuestion}>
            <dl className="border-t-2 border-ink">
              {RUNTIME.map((row) => (
                <div key={row.part.en} className="grid gap-1 border-b-2 border-ink py-3.5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                  <dt className="text-[16px] font-medium text-ink-soft">{row.part[language]}</dt>
                  <dd className="text-[17px] font-semibold">{row.value[language]}</dd>
                </div>
              ))}
            </dl>
          </Question>

          <Question
            id="status"
            title={t.statusQuestion}
            className="on-ink -mx-4 mb-16 bg-ink px-4 text-paper sm:-mx-8 sm:px-8 lg:mx-0 lg:px-10"
          >
            <p className="max-w-[62ch] text-[clamp(1.125rem,1.5vw,1.3125rem)] leading-relaxed">{t.statusText}</p>
          </Question>
        </main>
      </div>

      <footer className="on-cobalt flex flex-wrap items-center justify-between gap-4 bg-cobalt px-4 py-8 text-paper sm:px-8 lg:px-12">
        <a href="/#projects" className="inline-flex items-center gap-2 text-[17px] font-semibold text-paper no-underline hover:bg-signal hover:text-ink">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>
        <a
          href={HIREMATCH_REPO}
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
