import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Github, Linkedin, Mail } from 'lucide-react'
import ChatSection from './ChatSection'
import type { Language } from '../data/projects'
import gabrielProfileImage from '../Assets/Main/Gabriel-Goncalves.png'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.4 } },
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
}

const scaleIn = {
  hidden: { opacity: 0, scale: 0.8 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease } },
}

const layoutSpring = { type: 'spring', stiffness: 120, damping: 20, mass: 0.85 } as const

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
]

interface HeroProps {
  language: Language
}

export default function Hero({ language }: HeroProps) {
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="about"
      className="relative z-10 flex min-h-screen items-start px-6 pb-28 pt-24 md:px-12 lg:px-20"
    >
      <motion.div
        layout
        transition={layoutSpring}
        className={`mx-auto grid w-full gap-10 ${
          isChatExpanded
            ? 'max-w-none grid-cols-1 lg:grid-cols-1 lg:items-start'
            : 'max-w-6xl lg:grid-cols-[minmax(0,1fr)_minmax(430px,520px)] lg:items-center'
        }`}
      >
        <motion.div
          layout
          transition={layoutSpring}
          animate={{ y: isChatExpanded ? 16 : 0 }}
          className={`${
            isChatExpanded ? 'order-2' : 'order-1'
          }`}
        >
          <motion.div
            className="flex flex-col items-center text-center lg:items-start lg:text-left"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <motion.div variants={scaleIn} className="relative mb-8">
            <div className="absolute -inset-3 rounded-full bg-accent/10 blur-2xl" />
            <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-dark-600 bg-dark-800 ring-1 ring-accent/20">
              <img
                src={gabrielProfileImage}
                alt="Gabriel Goncalves"
                className="h-full w-full object-cover"
              />
            </div>
            <motion.div
              className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-dark-950 bg-accent"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="mb-2 font-mono text-sm tracking-widest text-accent uppercase"
          >
            Hi, I'm
          </motion.p>

          <motion.h1
            variants={fadeUp}
            className="font-display text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl"
          >
            <span className="text-cream">Gabriel </span>
            <span className="text-accent">Goncalves</span>
          </motion.h1>

          <motion.p 
  variants={fadeUp} 
  className="mt-3 font-mono text-base text-cream-muted"
>
  Tech Rotation Intern - Bank of America <br />
  Computer Science - Universidade Federal do ABC (UFABC)
</motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-lg font-body text-base leading-relaxed text-dark-300"
          >
            Interest in Data Science, Devops and Data Engineering.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
            {socials.map(({ icon: Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                whileHover={{ scale: 1.15, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark-600 bg-dark-800/60 text-cream-muted transition-colors duration-300 hover:border-accent/40 hover:bg-accent-glow hover:text-accent"
              >
                <Icon size={18} />
              </motion.a>
            ))}
          </motion.div>
          </motion.div>
        </motion.div>

        <motion.div
          layout
          transition={layoutSpring}
          className={`relative w-full ${isChatExpanded ? 'order-1' : 'order-2'}`}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={isChatExpanded ? 'expanded-title' : 'default-title'}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' as const }}
              className="mb-3 text-center font-mono text-[11px] tracking-[0.18em] text-accent uppercase lg:text-left"
            >
              {isChatExpanded ? 'Live Conversation Mode' : 'Rag chatbot '}
            </motion.p>
          </AnimatePresence>
          <ChatSection
            language={language}
            featured
            expandToFullWidth={isChatExpanded}
            onFirstUserMessage={() => setIsChatExpanded(true)}
            onExpandRequest={() => setIsChatExpanded(true)}
            onCollapseRequest={() => setIsChatExpanded(false)}
          />
        </motion.div>
      </motion.div>

      <motion.button
        type="button"
        aria-label="Scroll down to projects"
        onClick={scrollToProjects}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, ease: 'easeOut' as const }}
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.96 }}
        className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 rounded-2xl border border-dark-600/70 bg-dark-900/65 px-4 py-2 text-dark-300 backdrop-blur-md transition-colors duration-300 hover:border-accent/45 hover:text-accent"
      >
        <span className="font-mono text-[10px] tracking-[0.18em] uppercase">Scroll to Projects</span>
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.35, repeat: Infinity, ease: 'easeInOut' as const }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </motion.button>
    </section>
  )
}
