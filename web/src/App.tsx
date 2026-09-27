import { useEffect, useState } from 'react'
import GridBackground from './components/GridBackground'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import ProjectPage from './components/ProjectPage'
import Landing from './components/concreto/Landing'
import HomelabPage from './components/concreto/HomelabPage'
import HireMatchPage from './components/concreto/HireMatchPage'
import { getProjectBySlug, type Language } from './data/projects'

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = window.localStorage.getItem('portfolio_lang')
    return stored === 'br' ? 'br' : 'en'
  })

  const routeMatch = window.location.pathname.match(/^\/project\/([^/]+)\/?$/)
  const projectSlug = routeMatch?.[1]
  const activeProject = projectSlug ? getProjectBySlug(projectSlug) ?? null : null
  const isProjectRoute = Boolean(routeMatch)
  // Case studies migrate to the Concreto world one at a time.
  const isConcretoRoute = !isProjectRoute || projectSlug === 'homelab-pessoal' || projectSlug === 'hirematch-ai'

  useEffect(() => {
    // Concreto routes: the landing and migrated case studies; the rest keep the lab world.
    document.documentElement.dataset.world = isConcretoRoute ? 'concreto' : 'lab'
  }, [isConcretoRoute])

  useEffect(() => {
    window.localStorage.setItem('portfolio_lang', language)
    document.documentElement.lang = language === 'br' ? 'pt-BR' : 'en'
  }, [language])

  useEffect(() => {
    if (isProjectRoute) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    if (window.location.hash !== '#about') {
      window.history.replaceState(
        null,
        '',
        `${window.location.pathname}${window.location.search}#about`,
      )
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    })
  }, [isProjectRoute])

  if (!isProjectRoute) {
    return <Landing language={language} onLanguageChange={setLanguage} />
  }

  if (projectSlug === 'homelab-pessoal') {
    return <HomelabPage language={language} onLanguageChange={setLanguage} />
  }

  if (projectSlug === 'hirematch-ai') {
    return <HireMatchPage language={language} onLanguageChange={setLanguage} />
  }

  return (
    <>
      <GridBackground />
      <ParticleField />
      <div className="grain-overlay" />
      <div className="scanlines" />

      <Navbar
        language={language}
        onLanguageChange={setLanguage}
        isProjectRoute={isProjectRoute}
      />

      <ProjectPage project={activeProject} language={language} />
    </>
  )
}
