import { motion } from 'framer-motion'
import { ArrowLeft, ExternalLink, Github } from 'lucide-react'
import type { Project } from '../data/projects'

interface ProjectPageProps {
  project: Project | null
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function ProjectPage({ project }: ProjectPageProps) {
  if (!project) {
    return (
      <main className="relative z-10 min-h-screen px-6 pb-16 pt-24 md:px-12 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          className="mx-auto max-w-3xl rounded-3xl border border-dark-600/50 bg-dark-800/70 p-8 backdrop-blur-sm"
        >
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Project</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-cream">Projeto nao encontrado</h1>
          <p className="mt-4 text-sm leading-relaxed text-dark-300">
            Nao foi possivel localizar esta pagina de projeto.
          </p>
          <a
            href="/#projects"
            className="mt-8 inline-flex items-center gap-2 rounded-xl border border-dark-600/70 bg-dark-900/60 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream-muted transition-colors hover:border-accent/45 hover:text-accent"
          >
            <ArrowLeft size={14} />
            Voltar para projetos
          </a>
        </motion.div>
      </main>
    )
  }

  return (
    <main className="relative z-10 min-h-screen px-6 pb-20 pt-24 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto max-w-4xl"
      >
        <a
          href="/#projects"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-dark-600/70 bg-dark-900/60 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream-muted transition-colors hover:border-accent/45 hover:text-accent"
        >
          <ArrowLeft size={14} />
          Voltar para projetos
        </a>

        <section className="glow-card rounded-3xl border border-dark-600/60 bg-dark-800/70 p-8 backdrop-blur-sm md:p-10">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Project Detail</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-cream md:text-4xl">{project.title}</h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-dark-300">{project.intro}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-dark-600/60 bg-dark-700/50 px-2.5 py-1 font-mono text-[11px] text-cream-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8 rounded-2xl border border-dark-600/50 bg-dark-900/45 p-5">
            <h2 className="font-display text-xl font-semibold text-cream">Resumo</h2>
            <p className="mt-3 text-sm leading-relaxed text-dark-300">{project.description}</p>
          </div>

          <div className="mt-7">
            <h2 className="font-display text-xl font-semibold text-cream">Destaques</h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-dark-300">
              {project.highlights.map((item) => (
                <li key={item} className="rounded-xl border border-dark-600/40 bg-dark-900/35 px-4 py-2.5">
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-dark-950 transition-colors hover:bg-accent-dim"
          >
            <Github size={15} />
            Ver no GitHub
            <ExternalLink size={13} />
          </a>
        </section>
      </motion.div>
    </main>
  )
}
