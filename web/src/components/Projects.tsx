import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { projects } from '../data/projects'

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
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.15 })

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
      </motion.div>

      <div
        className="grid gap-5 px-6 pb-4 md:grid-cols-2 md:px-12 lg:px-20"
      >
        {projects.map((project, i) => (
          <motion.a
            key={project.title}
            href={`/project/${project.slug}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover={{ y: -6, transition: { duration: 0.25 } }}
            className="group glow-card flex cursor-pointer flex-col rounded-2xl border border-dark-600/60 bg-dark-800/50 p-5 backdrop-blur-sm transition-all duration-300"
          >
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
            <div className="mt-5 flex items-center justify-between border-t border-dark-600/40 pt-3">
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                Ver pagina do projeto
              </span>
              <ArrowRight size={14} className="text-accent transition-transform group-hover:translate-x-1" />
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
