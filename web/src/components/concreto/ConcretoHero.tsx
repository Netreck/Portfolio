import { Github, Linkedin, Mail } from 'lucide-react'
import type { Language } from '../../data/projects'
import { PROFILE } from '../../data/profile'
import portrait from '../../Assets/Main/Gabriel-Goncalves.png'
import { CONTACT } from './copy'
import QuestionPlane from './QuestionPlane'

interface ConcretoHeroProps {
  language: Language
}

const socials = [
  { icon: Github, href: CONTACT.github, label: 'GitHub', external: true },
  { icon: Linkedin, href: CONTACT.linkedin, label: 'LinkedIn', external: true },
  { icon: Mail, href: `mailto:${CONTACT.email}`, label: 'Email', external: false },
]

export default function ConcretoHero({ language }: ConcretoHeroProps) {
  const copy = PROFILE[language]

  return (
    <section id="about" className="grid scroll-mt-28 lg:min-h-[calc(100svh-66px)] lg:grid-cols-12">
      <div className="flex flex-col justify-between gap-8 px-4 pb-10 pt-6 sm:px-8 lg:col-span-5 lg:px-12 lg:pb-12 lg:pt-12">
        <div>
          <div className="flex items-end gap-5 lg:block">
            <img
              src={portrait}
              alt="Gabriel Gonçalves"
              width={144}
              height={144}
              className="h-20 w-20 shrink-0 object-cover object-[50%_26%] sm:h-28 sm:w-28 lg:h-36 lg:w-36"
            />

            <h1 className="-mb-1.5 text-[clamp(2.75rem,4.6vw,4.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em] text-ink lg:mb-0 lg:mt-8">
              Gabriel
              <br />
              Gonçalves
            </h1>
          </div>

          <div className="mt-6 space-y-1.5 border-t-2 border-ink pt-4 text-[17px] font-medium leading-snug text-ink sm:text-lg">
            <p>{copy.role}</p>
            <p>{copy.studies}</p>
          </div>

          <p className="mt-5 max-w-[34rem] text-[17px] leading-relaxed text-ink-soft">{copy.summary}</p>
        </div>

        <ul className="flex gap-2">
          {socials.map(({ icon: Icon, href, label, external }) => (
            <li key={label}>
              <a
                href={href}
                aria-label={label}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
                className="flex h-12 w-12 items-center justify-center border-2 border-ink text-ink hover:bg-ink hover:text-paper"
              >
                <Icon size={20} strokeWidth={2} />
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div
        id="chat"
        className="relative scroll-mt-28 bg-cobalt px-4 pb-8 pt-12 sm:px-8 lg:col-span-7 lg:h-[calc(100svh-66px)] lg:min-h-[620px] lg:px-14 lg:pb-10 lg:pt-14"
      >
        <span
          aria-hidden="true"
          className="absolute -top-7 right-6 h-14 w-14 bg-signal sm:right-10 lg:-left-8 lg:right-auto lg:top-[58%] lg:h-16 lg:w-16"
        />
        <QuestionPlane language={language} />
      </div>
    </section>
  )
}
