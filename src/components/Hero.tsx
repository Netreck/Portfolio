import { motion } from 'framer-motion'
import { ArrowDown, Github, Linkedin, Mail } from 'lucide-react'

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

const socials = [
  { icon: Github, href: '#', label: 'GitHub' },
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Mail, href: '#', label: 'Email' },
]

export default function Hero() {
  return (
    <section id="about" className="relative z-10 flex min-h-screen items-center justify-center px-6 pt-20">
      <motion.div
        className="flex flex-col items-center text-center"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {/* Avatar image */}
        <motion.div variants={scaleIn} className="relative mb-8">
          <div className="absolute -inset-3 rounded-full bg-accent/10 blur-2xl" />
          <div className="relative h-32 w-32 overflow-hidden rounded-2xl border-2 border-dark-600 bg-dark-800 ring-1 ring-accent/20">
            <div className="flex h-full w-full items-center justify-center">
              <span className="font-display text-4xl font-bold text-accent">G</span>
            </div>
          </div>
          {/* Online dot */}
          <motion.div
            className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-[3px] border-dark-950 bg-accent"
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>

        {/* Greeting */}
        <motion.p
          variants={fadeUp}
          className="mb-2 font-mono text-sm tracking-widest text-accent uppercase"
        >
          Hi, I'm
        </motion.p>

        {/* Name */}
        <motion.h1
          variants={fadeUp}
          className="font-display text-5xl font-extrabold leading-tight tracking-tight sm:text-6xl md:text-7xl"
        >
          <span className="text-cream">Gabriel </span>
          <span className="text-accent">Goncalves</span>
        </motion.h1>

        {/* Title */}
        <motion.p
          variants={fadeUp}
          className="mt-3 font-mono text-base text-cream-muted"
        >
          Full-Stack Developer
        </motion.p>

        {/* Bio */}
        <motion.p
          variants={fadeUp}
          className="mt-5 max-w-lg font-body text-base leading-relaxed text-dark-300"
        >
          Building intelligent tools and sleek interfaces.
          Exploring the intersection of AI&nbsp;and web development.
        </motion.p>

        {/* Social links */}
        <motion.div variants={fadeUp} className="mt-8 flex items-center gap-3">
          {socials.map(({ icon: Icon, href, label }) => (
            <motion.a
              key={label}
              href={href}
              aria-label={label}
              whileHover={{ scale: 1.15, y: -2 }}
              whileTap={{ scale: 0.95 }}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-dark-600 bg-dark-800/60 text-cream-muted transition-colors duration-300 hover:border-accent/40 hover:text-accent hover:bg-accent-glow"
            >
              <Icon size={18} />
            </motion.a>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.button
          variants={fadeUp}
          onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
          className="mt-16 flex cursor-pointer flex-col items-center gap-2 text-dark-400 transition-colors hover:text-accent"
          aria-label="Scroll down"
        >
          <span className="font-mono text-[10px] uppercase tracking-widest">Explore</span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' as const }}
          >
            <ArrowDown size={16} />
          </motion.div>
        </motion.button>
      </motion.div>
    </section>
  )
}
