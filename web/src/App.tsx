import { useEffect } from 'react'
import GridBackground from './components/GridBackground'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'

export default function App() {
  useEffect(() => {
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
  }, [])

  return (
    <>
      <GridBackground />
      <ParticleField />
      <div className="grain-overlay" />
      <div className="scanlines" />

      <Navbar />
      <main>
        <Hero />
        <Projects />
      </main>
    </>
  )
}
