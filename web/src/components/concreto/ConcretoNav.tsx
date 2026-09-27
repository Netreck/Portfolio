import type { Language } from '../../data/projects'
import { LANDING } from './copy'

interface ConcretoNavProps {
  language: Language
  onLanguageChange: (language: Language) => void
  litSections: { experience: boolean; projects: boolean }
}

export default function ConcretoNav({ language, onLanguageChange, litSections }: ConcretoNavProps) {
  const t = LANDING[language]
  const links = [
    { href: '#about', label: t.nav.about, lit: false },
    { href: '#experience', label: t.nav.experience, lit: litSections.experience },
    { href: '#projects', label: t.nav.projects, lit: litSections.projects },
    { href: '#contact', label: t.nav.contact, lit: false },
  ]

  return (
    <header className="sticky top-0 z-50 border-b-2 border-ink bg-paper">
      <nav className="flex flex-wrap items-stretch justify-between gap-x-6 px-4 sm:px-8 lg:px-12">
        <a href="#about" className="lc flex h-16 items-center gap-3 text-lg font-bold tracking-tight text-ink no-underline">
          <span aria-hidden="true" className="h-3.5 w-3.5 bg-signal" />
          Gabriel Gonçalves
        </a>

        <ul className="order-3 -mx-4 flex w-[calc(100%+2rem)] items-stretch overflow-x-auto border-t-2 border-ink no-scrollbar sm:order-2 sm:mx-0 sm:w-auto sm:border-t-0">
          {links.map((link) => (
            <li key={link.href} className="flex">
              <a
                href={link.href}
                className={`lc flex h-12 items-center gap-2 whitespace-nowrap px-4 text-[15px] font-medium text-ink no-underline hover:bg-signal sm:h-16 ${
                  link.lit ? 'bg-signal' : ''
                }`}
              >
                {link.lit && <span aria-hidden="true" className="h-2 w-2 bg-ink" />}
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="order-2 flex items-center sm:order-3" role="group" aria-label="Language">
          {(['en', 'br'] as const).map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => onLanguageChange(code)}
              aria-pressed={language === code}
              aria-label={t.switchTo[code]}
              className={`-ml-0.5 h-9 w-11 cursor-pointer border-2 border-ink text-sm font-semibold first:ml-0 ${
                language === code ? 'bg-ink text-paper' : 'bg-paper text-ink hover:bg-signal'
              }`}
            >
              {code === 'en' ? 'en' : 'pt'}
            </button>
          ))}
        </div>
      </nav>
    </header>
  )
}
