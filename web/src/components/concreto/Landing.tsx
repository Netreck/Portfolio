import type { Language } from '../../data/projects'
import ConcretoNav from './ConcretoNav'
import ConcretoHero from './ConcretoHero'
import Chronology from './Chronology'
import ProjectPlanes from './ProjectPlanes'
import Closing from './Closing'

interface LandingProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

export default function Landing({ language, onLanguageChange }: LandingProps) {
  return (
    <div className="cz min-h-screen bg-paper text-ink">
      <ConcretoNav language={language} onLanguageChange={onLanguageChange} />
      <main>
        <ConcretoHero language={language} />
        <Chronology language={language} />
        <ProjectPlanes language={language} />
      </main>
      <Closing language={language} />
    </div>
  )
}
