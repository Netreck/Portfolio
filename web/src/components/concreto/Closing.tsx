import { ArrowRight, ArrowUp, Github, Linkedin } from 'lucide-react'
import type { Language } from '../../data/projects'
import { CONTACT, LANDING } from './copy'

export default function Closing({ language }: { language: Language }) {
  const t = LANDING[language]

  return (
    <footer id="contact" className="on-cobalt scroll-mt-28 bg-cobalt text-paper">
      <div className="grid gap-12 px-4 pb-10 pt-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-12 lg:pt-24">
        <div className="lg:col-span-8">
          <h2 className="lc text-[clamp(2.5rem,5.2vw,4.75rem)] font-bold leading-[0.95] tracking-[-0.035em]">
            {t.closeTitle}
          </h2>
          <p className="mt-6 text-lg text-cobalt-tint">{t.closeLead}</p>
          <a
            href={`mailto:${CONTACT.email}`}
            className="mt-4 inline-block break-all text-[clamp(1.75rem,3.6vw,3.25rem)] font-semibold leading-tight tracking-[-0.02em] text-signal underline decoration-[3px] underline-offset-[0.18em] hover:bg-signal hover:text-ink hover:no-underline"
          >
            {CONTACT.email}
          </a>

          <ul className="mt-10 flex flex-wrap gap-3">
            <li>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2.5 border-2 border-paper px-4 font-semibold text-paper no-underline hover:bg-paper hover:text-cobalt"
              >
                <Linkedin size={18} aria-hidden="true" />
                LinkedIn
              </a>
            </li>
            <li>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-12 items-center gap-2.5 border-2 border-paper px-4 font-semibold text-paper no-underline hover:bg-paper hover:text-cobalt"
              >
                <Github size={18} aria-hidden="true" />
                GitHub
              </a>
            </li>
            <li>
              <a
                href="#chat"
                className="inline-flex h-12 items-center gap-2.5 bg-signal px-4 font-semibold text-ink no-underline hover:bg-paper"
              >
                <ArrowUp size={18} aria-hidden="true" />
                <span className="lc">{t.askAgain}</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="flex flex-col justify-end lg:col-span-4">
          <div className="border-t-2 border-paper pt-5">
            <span aria-hidden="true" className="block h-6 w-6 bg-signal" />
            <p className="mt-4 text-[17px] leading-relaxed">{t.proof}</p>
            <a
              href="/project/homelab-pessoal"
              className="mt-4 inline-flex items-center gap-2 font-semibold text-signal underline hover:bg-signal hover:text-ink hover:no-underline"
            >
              <span className="lc">{t.proofLink}</span>
              <ArrowRight size={18} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t-2 border-cobalt-line px-4 py-5 text-sm text-cobalt-tint sm:px-8 lg:px-12">
        <span className="lc font-semibold text-paper">Gabriel Gonçalves</span>
        <span className="tnum">{new Date().getFullYear()}</span>
      </div>
    </footer>
  )
}
