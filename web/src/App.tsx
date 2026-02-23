import { useEffect } from 'react'
import GridBackground from './components/GridBackground'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import ProjectPage from './components/ProjectPage'
import { getProjectBySlug } from './data/projects'

export default function App() {
  const routeMatch = window.location.pathname.match(/^\/project\/([^/]+)\/?$/)
  const projectSlug = routeMatch?.[1]
  const activeProject = projectSlug ? getProjectBySlug(projectSlug) ?? null : null
  const isProjectRoute = Boolean(routeMatch)

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

  return (
    <>
      <GridBackground />
      <ParticleField />
      <div className="grain-overlay" />
      <div className="scanlines" />

      {isProjectRoute ? (
        <ProjectPage project={activeProject} />
      ) : (
        <>
          <Navbar />
          <main>
            <Hero />
            <Projects />
          </main>
        </>
      )}
    </>
  )
}
