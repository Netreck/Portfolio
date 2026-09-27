import { useEffect, useState } from 'react'
import GridBackground from './components/GridBackground'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import ProjectPage from './components/ProjectPage'
import Landing from './components/concreto/Landing'
import HomelabPage from './components/concreto/HomelabPage'
import HireMatchPage from './components/concreto/HireMatchPage'
import PostPage from './components/concreto/PostPage'
import { getPostBySlug } from './data/posts'
import { getProjectBySlug, type Language } from './data/projects'

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    const stored = window.localStorage.getItem('portfolio_lang')
    return stored === 'br' ? 'br' : 'en'
  })

  const postMatch = window.location.pathname.match(/^\/post\/([^/]+)\/?$/)
  const activePost = postMatch ? getPostBySlug(postMatch[1]) : undefined
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

  const isSubpage = isProjectRoute || Boolean(postMatch)

  useEffect(() => {
    if (isSubpage) {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
      return
    }

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }

    // Links back from subpages carry a section anchor (e.g. /#projects): honor it.
    const target = window.location.hash ? document.getElementById(window.location.hash.slice(1)) : null
    if (target && window.location.hash !== '#about') {
      // Wait for web fonts: the layout above the target shrinks once Jost loads.
      void document.fonts.ready.then(() => requestAnimationFrame(() => target.scrollIntoView({ block: 'start' })))
      return
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
  }, [isSubpage])

  if (activePost) {
    return <PostPage post={activePost} language={language} onLanguageChange={setLanguage} />
  }

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
