import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

interface Project {
  title: string
  description: string
  tags: string[]
}

const projects: Project[] = [
  {
    title: 'Analytics Dashboard',
    description: 'Real-time dashboard with interactive data visualizations and live metrics',
    tags: ['React', 'D3.js', 'PostgreSQL'],
  },
  {
    title: 'Mobile App',
    description: 'Cross-platform fitness tracking application with social features',
    tags: ['React Native', 'Firebase'],
  },
  {
    title: 'Open Source CLI',
    description: 'Developer productivity tool with 2k+ GitHub stars',
    tags: ['Rust', 'CLI'],
  },
  {
    title: 'AI Content Generator',
    description: 'AI-powered content creation platform for marketing teams',
    tags: ['Python', 'OpenAI', 'Next.js'],
  },
  {
    title: 'E-Commerce Platform',
    description: 'Full-stack marketplace with payments and real-time inventory',
    tags: ['React', 'Node.js', 'Stripe'],
  },
  {
    title: 'SaaS Analytics',
    description: 'Business analytics with custom reports and team collaboration',
    tags: ['TypeScript', 'AWS', 'GraphQL'],
  },
]

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease },
  }),
}

export default function Projects() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return
    const amount = 340
    scrollRef.current.scrollBy({
      left: dir === 'left' ? -amount : amount,
      behavior: 'smooth',
    })
  }

  return (
    <section id="projects" ref={sectionRef} className="relative z-10 py-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
        className="mb-10 flex items-center justify-between px-6 md:px-12 lg:px-20"
      >
        <div>
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-accent">
            Featured Projects
          </p>
          <h2 className="font-display text-2xl font-bold text-cream sm:text-3xl">
            Things I've built
          </h2>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <button
            onClick={() => scroll('left')}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-dark-600 bg-dark-800/60 text-cream-muted transition-all hover:border-accent/40 hover:text-accent"
            aria-label="Scroll left"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => scroll('right')}
            className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border border-dark-600 bg-dark-800/60 text-cream-muted transition-all hover:border-accent/40 hover:text-accent"
            aria-label="Scroll right"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </motion.div>

      {/* Carousel */}
      <div
        ref={scrollRef}
        className="no-scrollbar flex gap-5 overflow-x-auto px-6 pb-4 md:px-12 lg:px-20"
      >
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group glow-card min-w-[280px] max-w-[320px] flex-shrink-0 cursor-pointer rounded-2xl border border-dark-600/60 bg-dark-800/50 p-5 backdrop-blur-sm transition-all duration-300"
          >
            {/* Icon row */}
            <div className="mb-4 flex items-center justify-between">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <span className="font-mono text-sm font-bold">{i + 1}</span>
              </div>
              <motion.div
                initial={{ opacity: 0, x: -5 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="text-dark-400 opacity-0 transition-opacity group-hover:opacity-100"
              >
                <ExternalLink size={14} />
              </motion.div>
            </div>

            <h3 className="mb-2 font-display text-lg font-semibold text-cream transition-colors group-hover:text-accent">
              {project.title}
            </h3>
            <p className="mb-4 text-sm leading-relaxed text-dark-300">
              {project.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1.5">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-dark-600/60 bg-dark-700/50 px-2 py-0.5 font-mono text-[10px] text-cream-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
