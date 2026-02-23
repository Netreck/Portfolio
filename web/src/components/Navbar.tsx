import { motion } from 'framer-motion'
import type { Language } from '../data/projects'

interface NavbarProps {
  language: Language
  onLanguageChange: (language: Language) => void
  isProjectRoute?: boolean
}

const navLabels: Record<Language, string[]> = {
  en: ['About', 'Projects', 'Chat'],
  br: ['Sobre', 'Projetos', 'Chat'],
}

export default function Navbar({ language, onLanguageChange, isProjectRoute = false }: NavbarProps) {
  const labels = navLabels[language]
  const hrefPrefix = isProjectRoute ? '/#' : '#'
  const hrefKeys = ['about', 'projects', 'chat']

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' as const }}
      className="fixed left-0 right-0 top-0 z-50 flex items-center justify-between border-b border-dark-700/40 bg-dark-950/70 px-6 py-4 backdrop-blur-md"
    >
      <motion.span
        className="font-mono text-sm font-semibold text-accent"
        whileHover={{ scale: 1.05 }}
      >
        {'<dev />'}
      </motion.span>

      <div className="flex items-center gap-1">
        {labels.map((label, i) => (
          <motion.a
            key={label}
            href={`${hrefPrefix}${hrefKeys[i]}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1), duration: 0.4, ease: 'easeOut' as const }}
            className="rounded-lg px-3 py-1.5 font-mono text-xs text-cream-muted transition-all duration-300 hover:bg-accent-glow hover:text-accent"
          >
            {label}
          </motion.a>
        ))}
      </div>

      <div className="flex items-center gap-1 rounded-lg border border-dark-600/70 bg-dark-900/65 p-1">
        <button
          type="button"
          onClick={() => onLanguageChange('en')}
          className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
            language === 'en' ? 'bg-accent/20 text-accent' : 'text-cream-muted hover:text-cream'
          }`}
          aria-label="Switch language to English"
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => onLanguageChange('br')}
          className={`rounded-md px-2.5 py-1 font-mono text-[11px] transition-colors ${
            language === 'br' ? 'bg-accent/20 text-accent' : 'text-cream-muted hover:text-cream'
          }`}
          aria-label="Mudar idioma para Português"
        >
          BR
        </button>
      </div>
    </motion.nav>
  )
}
