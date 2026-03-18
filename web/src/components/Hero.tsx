import { useEffect, useState } from 'react'
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
  { icon: Github, href: 'https://github.com/Netreck', label: 'GitHub', external: true },
  {
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/gabriel-victor-71187b223',
    label: 'LinkedIn',
    external: true,
  },
  { icon: Mail, href: 'mailto:gabrielvgonc@gmail.com', label: 'Email', external: false },
]

interface HeroProps {
  language: Language
}

export default function Hero({ language }: HeroProps) {
  const [isChatExpanded, setIsChatExpanded] = useState(false)
  const [supportsExpandedChat, setSupportsExpandedChat] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 1024px)')
    const syncExpandedMode = (matches: boolean) => {
      setSupportsExpandedChat(matches)
      if (!matches) {
        setIsChatExpanded(false)
      }
    }

    syncExpandedMode(mediaQuery.matches)

    const handleChange = (event: MediaQueryListEvent) => {
      syncExpandedMode(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const shouldExpandChat = supportsExpandedChat && isChatExpanded

  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section
      id="about"
      className="relative z-10 flex min-h-[100svh] items-start px-4 pb-20 pt-32 sm:px-6 sm:pb-24 sm:pt-36 md:px-12 lg:px-20 lg:pb-28 lg:pt-24"
    >
      <motion.div
        layout
        transition={layoutSpring}
        className={`mx-auto grid w-full gap-10 lg:gap-12 ${
          shouldExpandChat
            ? 'max-w-none grid-cols-1 lg:grid-cols-1 lg:items-start'
            : 'max-w-6xl lg:grid-cols-[minmax(0,1fr)_minmax(430px,520px)] lg:items-center'
        }`}
      >
        <motion.div
          layout
          transition={layoutSpring}
          animate={{ y: shouldExpandChat ? 16 : 0 }}
          className={shouldExpandChat ? 'order-1 lg:order-2' : 'order-1'}
        >
          <motion.div
            className="mx-auto flex max-w-2xl flex-col items-center text-center lg:mx-0 lg:items-start lg:text-left"
            variants={container}
            initial="hidden"
            animate="show"
          >
          <motion.div variants={scaleIn} className="relative mb-8">
            <div className="absolute -inset-3 rounded-full bg-accent/10 blur-2xl" />
            <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-2 border-dark-600 bg-dark-800 ring-1 ring-accent/20 sm:h-32 sm:w-32">
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
            className="font-display text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
          >
            <span className="text-cream">Gabriel </span>
            <span className="text-accent">Goncalves</span>
          </motion.h1>

          <motion.p 
  variants={fadeUp} 
  className="mt-3 font-mono text-sm leading-relaxed text-cream-muted sm:text-base"
>
  Tech Rotation Intern - Bank of America <br />
  Computer Science - Universidade Federal do ABC (UFABC)
</motion.p>

          <motion.p
            variants={fadeUp}
            className="mt-5 max-w-lg font-body text-sm leading-relaxed text-dark-300 sm:text-base"
          >
            Interest in Software Engineering, Data Science and Devops.
          </motion.p>

          <motion.div variants={fadeUp} className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {socials.map(({ icon: Icon, href, label, external }) => (
              <motion.a
                key={label}
                href={href}
                aria-label={label}
                target={external ? '_blank' : undefined}
                rel={external ? 'noreferrer' : undefined}
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
          className={`relative w-full ${shouldExpandChat ? 'order-2 lg:order-1' : 'order-2'}`}
        >
          <AnimatePresence mode="wait">
            <motion.p
              key={shouldExpandChat ? 'expanded-title' : 'default-title'}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: 'easeOut' as const }}
              className="mb-3 text-center font-mono text-[10px] tracking-[0.18em] text-accent uppercase sm:text-[11px] lg:text-left"
            >
              {shouldExpandChat ? 'Live Conversation Mode' : 'Rag chatbot '}
            </motion.p>
          </AnimatePresence>
          <ChatSection
            language={language}
            featured
            expandToFullWidth={shouldExpandChat}
            onFirstUserMessage={() => {
              if (supportsExpandedChat) {
                setIsChatExpanded(true)
              }
            }}
            onExpandRequest={() => {
              if (supportsExpandedChat) {
                setIsChatExpanded(true)
              }
            }}
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
        className="absolute bottom-8 left-1/2 z-20 hidden -translate-x-1/2 flex-col items-center gap-2 rounded-2xl border border-dark-600/70 bg-dark-900/65 px-4 py-2 text-dark-300 backdrop-blur-md transition-colors duration-300 hover:border-accent/45 hover:text-accent md:flex"
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
