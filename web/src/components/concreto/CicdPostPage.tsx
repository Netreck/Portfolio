import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Pause, Play, RotateCcw } from 'lucide-react'
import type { Language } from '../../data/projects'
import {
  CHECKS,
  CICD_COPY,
  ROUTES,
  STEPS,
  TRADEOFFS,
  type Env,
  type EnvRoute,
} from '../../data/cicd'
import ConcretoNav from './ConcretoNav'
import { Question } from './CaseStudy'

interface CicdPostPageProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

const STEP_MS = 900
// -4 idle · -3 push · -2 workflow picked · -1 runner on the machine · 0..10 steps · 11 done
const IDLE = -4

// One deploy, played in whole steps and shared by the route strip and the step list.
// Under reduced motion it shows the finished run and does not advance.
function usePipeline(reduceMotion: boolean | null) {
  const [index, setIndex] = useState(reduceMotion ? STEPS.length : IDLE)
  const [playing, setPlaying] = useState(!reduceMotion)

  useEffect(() => {
    if (!playing) return
    if (index >= STEPS.length) {
      const hold = window.setTimeout(() => setIndex(IDLE), 2800)
      return () => window.clearTimeout(hold)
    }
    const tick = window.setTimeout(() => setIndex((i) => i + 1), STEP_MS)
    return () => window.clearTimeout(tick)
  }, [index, playing])

  return {
    index,
    playing,
    toggle: () => setPlaying((p) => !p),
    replay: () => {
      setIndex(IDLE)
      setPlaying(true)
    },
  }
}

type Pipeline = ReturnType<typeof usePipeline>

// Long shell commands wrap only between tokens: after / . , ( = and spaces, and after }}.
function Breakable({ text }: { text: string }) {
  const parts = text.split(/(?<=[/.,(= ]|}})/)
  return (
    <>
      {parts.map((part, i) => (
        <span key={i}>
          {part}
          {i < parts.length - 1 && <wbr />}
        </span>
      ))}
    </>
  )
}

function EnvToggle({ env, onChange, label }: { env: Env; onChange: (env: Env) => void; label: string }) {
  return (
    <div className="inline-flex" role="group" aria-label={label}>
      {ROUTES.map((route) => (
        <button
          key={route.env}
          type="button"
          aria-pressed={env === route.env}
          onClick={() => onChange(route.env)}
          className={`-ml-0.5 h-11 cursor-pointer border-2 border-paper px-4 text-[15px] font-semibold first:ml-0 ${
            env === route.env ? 'bg-signal text-ink' : 'bg-ink text-paper hover:bg-paper hover:text-ink'
          }`}
        >
          {route.env === 'dev' ? 'DEV' : 'PROD'}
        </button>
      ))}
    </div>
  )
}

function PlayControls({ pipe, language }: { pipe: Pipeline; language: Language }) {
  const t = CICD_COPY[language]
  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={pipe.toggle}
        className="inline-flex h-11 cursor-pointer items-center gap-2 border-2 border-paper px-4 text-[15px] font-semibold text-paper hover:bg-paper hover:text-ink"
      >
        {pipe.playing ? <Pause size={16} aria-hidden="true" /> : <Play size={16} aria-hidden="true" />}
        {pipe.playing ? t.pause : t.play}
      </button>
      <button
        type="button"
        onClick={pipe.replay}
        className="inline-flex h-11 cursor-pointer items-center gap-2 border-2 border-paper px-4 text-[15px] font-semibold text-paper hover:bg-paper hover:text-ink"
      >
        <RotateCcw size={16} aria-hidden="true" />
        {t.replay}
      </button>
    </div>
  )
}

// GitHub → workflow → the runner on the machine with the matching label, lit in whole steps.
function RouteStrip({ route, index, language }: { route: EnvRoute; index: number; language: Language }) {
  const stages = [
    { title: `git push ${route.branch}`, sub: 'GitHub', lit: index >= -3 },
    { title: route.workflow, sub: `runs-on: [self-hosted, linux, ${route.label}]`, lit: index >= -2 },
    { title: `${route.machine} · ${route.role[language]}`, sub: route.address, lit: index >= -1 },
  ]
  return (
    <ol className="grid gap-3 md:grid-flow-col md:auto-cols-fr md:gap-6">
      {stages.map((stage) => (
        <li
          key={stage.title}
          className={`relative border-2 px-4 py-4 after:absolute after:left-8 after:top-full after:h-3 after:w-1 after:bg-cobalt last:after:hidden md:after:left-full md:after:top-1/2 md:after:h-1 md:after:w-6 md:after:-translate-y-1/2 ${
            stage.lit ? 'border-cobalt bg-cobalt text-paper' : 'border-paper text-paper'
          }`}
        >
          <p className="tnum text-[17px] font-bold">{stage.title}</p>
          <p className={`tnum mt-0.5 break-words font-mono text-[13px] ${stage.lit ? 'text-cobalt-tint' : 'text-[#c8c8c2]'}`}>{stage.sub}</p>
        </li>
      ))}
    </ol>
  )
}

function StepList({ index, language }: { index: number; language: Language }) {
  const t = CICD_COPY[language]
  const finished = index >= STEPS.length
  const site = index < 0 || finished ? 'up' : STEPS[index].site
  const stateText = { done: language === 'br' ? 'concluído' : 'done', running: t.running, pending: '' }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_9rem]">
      <ol className="border-t-2 border-ink">
        {STEPS.map((step, i) => {
          const state = i < index ? 'done' : i === index ? 'running' : 'pending'
          return (
            <li key={step.title.en} className="grid grid-cols-[2rem_1fr] items-start gap-x-4 border-b-2 border-ink py-2.5">
              <span
                className={`tnum mt-0.5 flex h-8 w-8 items-center justify-center border-2 border-ink text-[14px] font-bold ${
                  state === 'done' ? 'bg-ink text-paper' : state === 'running' ? 'bg-signal text-ink' : 'bg-paper text-ink'
                }`}
              >
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className={`text-[16px] font-semibold ${state === 'pending' ? 'text-ink-soft' : ''}`}>
                  {step.title[language]}
                  {state !== 'pending' && <span className="sr-only"> ({stateText[state]})</span>}
                </p>
                {step.command && (
                  <p className="mt-0.5 break-normal font-mono text-[13px] text-cobalt">
                    <Breakable text={step.command} />
                  </p>
                )}
              </div>
            </li>
          )
        })}
      </ol>

      {/* Reachability of the environment being deployed: above the steps on small screens */}
      <div className="order-first flex flex-row items-center gap-3 lg:order-none lg:flex-col lg:items-stretch">
        <p className="text-[14px] font-semibold">{t.siteLabel}</p>
        <div
          className={`flex h-12 flex-1 items-center justify-center border-2 border-ink text-[18px] font-bold lg:h-auto lg:min-h-24 lg:flex-none ${
            site === 'down' ? 'bg-paper text-ink' : 'bg-cobalt text-paper'
          }`}
        >
          {site === 'down' ? t.siteDown : t.siteUp}
        </div>
        <div className="hidden flex-col gap-[3px] lg:flex" aria-hidden="true">
          {STEPS.map((step, i) => (
            <span
              key={step.title.en}
              className={`h-2.5 ${step.site === 'down' ? 'border-2 border-ink' : 'bg-cobalt'} ${i === index ? 'outline outline-2 outline-offset-1 outline-signal' : ''}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

// Push B arrives while A is running: A stops where it was and is cancelled; B deploys.
function ConcurrencySim({ language, reduceMotion }: { language: Language; reduceMotion: boolean | null }) {
  const t = CICD_COPY[language]
  const TOTAL = 16
  const B_START = 6
  const END = B_START + TOTAL
  const [tick, setTick] = useState(reduceMotion ? END : 0)
  const [paused, setPaused] = useState(Boolean(reduceMotion))

  useEffect(() => {
    if (paused) return
    const timer = window.setInterval(() => setTick((v) => (v >= END + 4 ? 0 : v + 1)), 380)
    return () => window.clearInterval(timer)
  }, [paused, END])

  const aFilled = Math.min(tick, B_START)
  const bFilled = Math.max(0, Math.min(tick - B_START, TOTAL))
  const aCancelled = tick >= B_START
  const bState = tick < B_START ? '' : bFilled >= TOTAL ? t.succeeded : t.running

  const row = (name: string, filled: number, state: string, cancelled: boolean, visible: boolean) => (
    <div className={`grid gap-2 border-b-2 border-ink py-3 sm:grid-cols-[6rem_1fr_7rem] sm:items-center sm:gap-4 ${visible ? '' : 'invisible'}`}>
      <span className="text-[16px] font-bold">{name}</span>
      <div className="relative flex gap-[3px]" aria-hidden="true">
        {Array.from({ length: TOTAL }, (_, i) => (
          <span key={i} className={`h-4 flex-1 border-2 border-ink ${i < filled ? 'bg-ink' : 'bg-paper'}`} />
        ))}
        {cancelled && (
          <span
            className="absolute top-1/2 h-1 -translate-y-1/2 bg-paper"
            style={{ left: 0, width: `calc(${(filled / TOTAL) * 100}% + 3px)` }}
          />
        )}
      </div>
      <span className={`text-[15px] font-bold ${state === t.succeeded ? 'justify-self-start bg-signal px-2 py-0.5' : ''} ${cancelled ? 'line-through' : ''}`}>
        {state}
      </span>
    </div>
  )

  return (
    <div>
      {!reduceMotion && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="mb-4 inline-flex h-11 cursor-pointer items-center gap-2 border-2 border-ink px-4 text-[15px] font-semibold hover:bg-signal"
        >
          {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          {paused ? t.play : t.pause}
        </button>
      )}
      <div className="border-t-2 border-ink">
        {row(t.runA, aFilled, aCancelled ? t.cancelled : t.running, aCancelled, true)}
        {row(t.runB, bFilled, bState, false, tick >= B_START)}
      </div>
    </div>
  )
}

export default function CicdPostPage({ language, onLanguageChange }: CicdPostPageProps) {
  const t = CICD_COPY[language]
  const reduceMotion = useReducedMotion()
  const [env, setEnv] = useState<Env>('prod')
  const route = ROUTES.find((r) => r.env === env)!
  const pipe = usePipeline(reduceMotion)

  const changeEnv = (next: Env) => {
    setEnv(next)
    if (!reduceMotion) pipe.replay()
  }

  return (
    <div className="cz min-h-screen bg-paper text-ink">
      <ConcretoNav language={language} onLanguageChange={onLanguageChange} base="/" />

      <header className="border-b-2 border-ink px-4 pb-8 pt-6 sm:px-8 lg:px-12 lg:pb-10 lg:pt-8">
        <a href="/#posts" className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink no-underline hover:bg-signal">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>
        <h1 className="mt-6 max-w-[20ch] text-[clamp(2.5rem,5vw,4.75rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">{t.title}</h1>
        <p className="mt-6 max-w-[64ch] text-[clamp(1.125rem,1.5vw,1.3125rem)] font-medium leading-snug">{t.thesis}</p>
        <dl className="mt-8 grid border-l-2 border-t-2 border-ink md:grid-cols-[2fr_1.2fr_1.2fr]">
          {t.facts.map((fact, i) => (
            <div key={fact.label} className={`border-b-2 border-r-2 border-ink px-4 py-3 ${i === t.facts.length - 1 ? 'bg-signal' : ''}`}>
              <dt className={`text-[14px] font-medium ${i === t.facts.length - 1 ? 'text-ink' : 'text-ink-soft'}`}>{fact.label}</dt>
              <dd className="mt-0.5 text-[17px] font-bold leading-snug">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </header>

<section aria-labelledby="envs-title" className="border-b-2 border-ink px-4 py-12 sm:px-8 lg:px-12 lg:py-14">
  <div className="grid max-w-[1100px] gap-8 lg:grid-cols-12 lg:gap-10">
    <div className="lg:col-span-4">
      <h2 id="envs-title" className="text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em]">
        {language === 'br' ? 'Por que DEV e PROD?' : 'Why DEV and PROD?'}
      </h2>
      <p className="mt-4 text-[17px] leading-relaxed">
        {language === 'br'
          ? 'O mesmo pipeline roda nos dois. A diferença é quem dispara e quem vê o resultado.'
          : 'The same pipeline runs on both. What differs is what starts it and who sees the result.'}
      </p>
    </div>
    <div className="overflow-x-auto lg:col-span-8">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="border-y-2 border-ink text-[14px]">
            <th scope="col" className="px-3 py-2.5 font-semibold">{language === 'br' ? 'Ambiente' : 'Environment'}</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">{language === 'br' ? 'Disparado por' : 'Triggered by'}</th>
            <th scope="col" className="px-3 py-2.5 font-semibold">{language === 'br' ? 'Para quê' : 'What for'}</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-b-2 border-ink">
            <th scope="row" className="px-3 py-4 align-top">
              <span className="block text-[22px] font-extrabold">DEV</span>
              <span className="tnum text-[13px] font-medium text-ink-soft">CT109</span>
            </th>
            <td className="px-3 py-4 align-top font-mono text-[14px]">push → Dev</td>
            <td className="px-3 py-4 align-top text-[16px] leading-relaxed">
              {language === 'br' ? 'Testar cada mudança numa cópia real, sem afetar o público.' : 'Test every change on a real copy, without touching visitors.'}
            </td>
          </tr>
          <tr className="border-b-2 border-ink bg-signal">
            <th scope="row" className="px-3 py-4 align-top">
              <span className="block text-[22px] font-extrabold">PROD</span>
              <span className="tnum text-[13px] font-medium">CT108</span>
            </th>
            <td className="px-3 py-4 align-top font-mono text-[14px]">merge → main</td>
            <td className="px-3 py-4 align-top text-[16px] leading-relaxed">
              {language === 'br' ? 'Publicar só o que já passou no DEV.' : 'Publish only what already passed on DEV.'}
            </td>
          </tr>
        </tbody>
      </table>
      <p className="mt-3 text-[14px] text-ink-soft">
        {language === 'br' ? 'Ambos também aceitam Actions → Run workflow.' : 'Both also accept Actions → Run workflow.'}
      </p>
    </div>
  </div>
</section>

      {/* First demo at the fold: the environment switch and the job's route, moving */}
      <section aria-labelledby="routing-title" className="on-ink bg-ink px-4 py-12 text-paper sm:px-8 lg:px-12 lg:py-14">
        <div className="max-w-[1100px]">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <h2 id="routing-title" className="max-w-[26ch] text-[clamp(1.75rem,3vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em]">
                {t.routingTitle}
              </h2>
              <p className="mt-4 max-w-[60ch] text-[17px] leading-relaxed">{t.routingText}</p>
            </div>
            <EnvToggle env={env} onChange={changeEnv} label={t.envToggle} />
          </div>
          <div className="mt-8">
            <RouteStrip route={route} index={pipe.index} language={language} />
          </div>
          {!reduceMotion && (
            <div className="mt-6">
              <PlayControls pipe={pipe} language={language} />
            </div>
          )}
        </div>
      </section>

      <main className="px-4 sm:px-8 lg:px-12">
        <div className="max-w-[1100px]">
          <Question id="pipeline" title={t.pipelineTitle} first>
            <p className="mb-6 max-w-[62ch] text-[17px] leading-relaxed">{t.pipelineText}</p>
            <StepList index={pipe.index} language={language} />
            <p className="mt-4 text-[14px] text-ink-soft">{t.stepsNote}</p>
          </Question>

          <Question id="concurrency" title={t.concurrencyTitle}>
            <p className="mb-6 max-w-[62ch] text-[17px] leading-relaxed">{t.concurrencyText}</p>
            <ConcurrencySim language={language} reduceMotion={reduceMotion} />
          </Question>

          <Question id="checks" title={t.checksTitle}>
            <p className="mb-6 max-w-[62ch] text-[17px] leading-relaxed">{t.checksText}</p>
            <ul className="border-t-2 border-ink">
              {CHECKS.map((check) => (
                <li key={check.command} className="grid gap-1.5 border-b-2 border-ink py-3.5 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
                  <code className="break-normal font-mono text-[13px] text-cobalt sm:text-[14px]">
                    <Breakable text={`$ ${check.command}`} />
                  </code>
                  <span className="flex items-start gap-2 text-[15px] font-semibold">
                    <ArrowRight size={16} className="mt-0.5 shrink-0" aria-hidden="true" />
                    {check.expect[language]}
                  </span>
                </li>
              ))}
            </ul>
          </Question>

          <Question id="tradeoffs" title={t.tradeoffsTitle} className="on-ink -mx-4 mb-16 bg-ink px-4 text-paper sm:-mx-8 sm:px-8 lg:mx-0 lg:px-10">
            <ul className="border-t-2 border-paper">
              {TRADEOFFS.map((item) => (
                <li key={item.title.en} className="grid gap-3 border-b-2 border-paper py-5 lg:grid-cols-[14rem_1fr_1fr] lg:gap-8">
                  <p className="text-[18px] font-bold leading-snug">{item.title[language]}</p>
                  <p className="text-[16px] leading-relaxed">
                    <span className="block text-[13px] font-semibold text-cobalt-tint">{t.tradeoffWhy}</span>
                    {item.why[language]}
                  </p>
                  <p className="text-[16px] leading-relaxed text-[#c8c8c2]">
                    <span className="block text-[13px] font-semibold text-paper">{t.tradeoffCost}</span>
                    {item.cost[language]}
                  </p>
                </li>
              ))}
            </ul>
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
