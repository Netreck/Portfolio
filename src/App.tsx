import GridBackground from './components/GridBackground'
import ParticleField from './components/ParticleField'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Projects from './components/Projects'
import ChatSection from './components/ChatSection'

export default function App() {
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
        <ChatSection />
      </main>
    </>
  )
}
