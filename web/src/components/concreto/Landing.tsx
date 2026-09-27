import { useCallback, useState } from 'react'
import type { Language } from '../../data/projects'
import ConcretoNav from './ConcretoNav'
import ConcretoHero from './ConcretoHero'
import Chronology from './Chronology'
import ProjectPlanes from './ProjectPlanes'
import Closing from './Closing'
import { findLit, SECTION_KEYS, type LitKey } from './lit'

interface LandingProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function Landing({ language, onLanguageChange }: LandingProps) {
  // The latest answer decides what is lit; each new answer replaces it.
  const [lit, setLit] = useState<Set<LitKey>>(() => new Set())
  const handleAnswer = useCallback((text: string) => setLit(findLit(text)), [])

  const litSections = {
    experience: SECTION_KEYS.experience.some((key) => lit.has(key)),
    projects: SECTION_KEYS.projects.some((key) => lit.has(key)),
  }

  return (
    <div className="cz min-h-screen bg-paper text-ink">
      <ConcretoNav language={language} onLanguageChange={onLanguageChange} litSections={litSections} />
      <main>
        <ConcretoHero language={language} onAnswer={handleAnswer} />
        <Chronology language={language} lit={lit} />
        <ProjectPlanes language={language} lit={lit} />
      </main>
      <Closing language={language} />
    </div>
  )
}
