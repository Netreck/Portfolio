import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, ExternalLink, Sparkles } from 'lucide-react'
import { projects } from '../data/projects'

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

const cardVariants = {
  hidden: { opacity: 0, y: 34, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 0.14 + i * 0.08, duration: 0.55, ease },
  }),
}

export default function Projects() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.12 })

  return (
    <section id="projects" ref={sectionRef} className="relative z-10 py-24">
      <div className="pointer-events-none absolute inset-x-6 top-20 -z-10 h-40 rounded-full bg-accent/12 blur-3xl md:inset-x-12 lg:inset-x-20" />

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, ease: 'easeOut' as const }}
        className="mb-10 px-6 md:px-12 lg:px-20"
      >
        <div className="rounded-3xl border border-dark-600/60 bg-dark-800/50 p-7 backdrop-blur-sm md:p-8">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
            <Sparkles size={12} />
            Project Overview
          </div>
          <h2 className="max-w-3xl font-display text-3xl font-bold leading-tight text-cream sm:text-4xl">
            Real projects focused on infrastructure reliability and practical AI applications
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-dark-300 sm:text-base">
            These case studies document how I design systems end-to-end, from platform architecture and observability to model-driven product decisions.
          </p>
        </div>
      </motion.div>

      <div className="grid gap-5 px-6 md:grid-cols-2 md:px-12 lg:px-20">
        {projects.map((project, i) => (
          <motion.a
            key={project.slug}
            href={`/project/${project.slug}`}
            custom={i}
            variants={cardVariants}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            whileHover={{ y: -8, transition: { duration: 0.28 } }}
            className="group relative overflow-hidden rounded-3xl border border-dark-600/60 bg-dark-800/55 p-6 backdrop-blur-sm transition-all duration-300 hover:border-accent/45"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-accent/15 blur-3xl transition-opacity duration-300 group-hover:opacity-90" />

            <div className="relative">
              <div className="mb-5 flex items-center justify-between gap-4">
                <span className="rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-accent">
                  {project.status}
                </span>
                <ExternalLink size={14} className="text-dark-400 transition-colors group-hover:text-accent" />
              </div>

              <h3 className="font-display text-2xl font-semibold text-cream transition-colors group-hover:text-accent">
                {project.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-dark-300">{project.subtitle}</p>
              <p className="mt-4 text-sm leading-relaxed text-dark-300">{project.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md border border-dark-600/60 bg-dark-700/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-cream-muted"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-dark-600/45 pt-4">
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
                  Explore case study
                </span>
                <ArrowRight
                  size={15}
                  className="text-accent transition-transform duration-300 group-hover:translate-x-1.5"
                />
              </div>
            </div>
          </motion.a>
        ))}
      </div>
    </section>
  )
}
