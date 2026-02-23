import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Layers,
  Sparkles,
  User,
  X,
} from 'lucide-react'
import type { Project, ProjectImage, ProjectStorySection } from '../data/projects'

interface ProjectPageProps {
  project: Project | null
}

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number]

function EmptyProjectState() {
  return (
    <main className="relative z-10 min-h-screen px-6 pb-16 pt-24 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto max-w-3xl rounded-3xl border border-dark-600/50 bg-dark-800/70 p-8 backdrop-blur-sm"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-accent">Project Page</p>
        <h1 className="mt-3 font-display text-3xl font-bold text-cream">Project not found</h1>
        <p className="mt-4 text-sm leading-relaxed text-dark-300">
          The requested route does not match an available project page.
        </p>
        <a
          href="/#projects"
          className="mt-8 inline-flex items-center gap-2 rounded-xl border border-dark-600/70 bg-dark-900/60 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream-muted transition-colors hover:border-accent/45 hover:text-accent"
        >
          <ArrowLeft size={14} />
          Back to projects
        </a>
      </motion.div>
    </main>
  )
}

function StoryBlock({
  section,
  onImageClick,
}: {
  section: ProjectStorySection
  onImageClick: (image: ProjectImage) => void
}) {
  return (
    <section className="mt-14 border-t border-dark-700/50 pt-10 first:mt-0 first:border-t-0 first:pt-0">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent/90">
          {section.label}
        </p>
        <h2 className="mt-3 font-display text-3xl font-semibold leading-tight text-cream">
          {section.title}
        </h2>
        <div className="mt-6 space-y-5">
          {section.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-[17px] leading-8 text-dark-300">
              {paragraph}
            </p>
          ))}
        </div>
      </div>

      {section.images && section.images.length > 0 && (
        <div
          className={`mx-auto mt-8 grid gap-4 ${
            section.images.length === 1 ? 'max-w-4xl grid-cols-1' : 'max-w-5xl grid-cols-1 md:grid-cols-2'
          }`}
        >
          {section.images.map((image) => (
            <figure
              key={image.src}
              className="overflow-hidden rounded-2xl border border-dark-600/65 bg-dark-900/45"
            >
              <button
                type="button"
                onClick={() => onImageClick(image)}
                className="block w-full cursor-zoom-in overflow-hidden"
                aria-label={`Open image in full screen: ${image.alt}`}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="max-h-[560px] w-full bg-dark-950/40 object-contain transition-transform duration-500 hover:scale-[1.01]"
                />
              </button>
              <figcaption className="border-t border-dark-600/55 px-4 py-3 text-sm leading-relaxed text-dark-300">
                {image.caption}
              </figcaption>
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}

function HowItWorks({ project }: { project: Project }) {
  const layout = [
    { x: 72, y: 52, w: 250 },
    { x: 390, y: 36, w: 250 },
    { x: 688, y: 176, w: 250 },
    { x: 390, y: 292, w: 250 },
    { x: 82, y: 334, w: 250 },
  ]

  const connectors = [
    // 1 -> 2: right edge of node 1 to left edge of node 2
    { id: '1-2', d: 'M292 132 L340 116' },
    // 2 -> 3: right edge of node 2 to left edge of node 3, routed orthogonally
    { id: '2-3', d: 'M610 116 L760 116 L760 160' },
    // 3 -> 4: left edge of node 3 to right edge of node 4, routed below boxes
    { id: '3-4', d: 'M760 356 L760 400 L620 400' },
    // 4 -> 5: left edge of node 4 to right edge of node 5
    { id: '4-5', d: 'M340 400   L292 414' },
  ]

  return (
    <section className="mt-16 rounded-3xl border border-dark-600/65 bg-gradient-to-b from-dark-800/70 to-dark-900/40 p-6 md:p-8">
      <div className="mb-6 flex items-center gap-2">
        <Sparkles size={15} className="text-accent" />
        <h2 className="font-display text-2xl font-semibold text-cream">How it works</h2>
      </div>

      <div className="space-y-3 md:hidden">
        {project.flow.map((step, index) => (
          <article
            key={step.title}
            className="rounded-2xl border border-dark-600/65 bg-dark-900/55 p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              {index === 0 ? (
                <User size={18} className="text-accent" />
              ) : (
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 font-mono text-xs font-semibold text-accent">
                  {index + 1}
                </span>
              )}
              <h3 className="font-display text-lg font-semibold text-cream">{step.title}</h3>
            </div>
            <p className="text-sm leading-relaxed text-dark-300">{step.detail}</p>
          </article>
        ))}
      </div>

      <div className="relative hidden h-[520px] overflow-hidden rounded-2xl border border-dark-600/60 bg-dark-900/45 md:block">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(74,222,128,0.13)_1px,transparent_0)] [background-size:24px_24px]" />

        <svg
          viewBox="0 0 1000 520"
          className="pointer-events-none absolute inset-0 h-full w-full"
          aria-hidden="true"
        >
          <defs>
            <marker
              id="flowArrowHead"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M0,0 L8,4 L0,8 Z" fill="rgba(74, 222, 128, 0.92)" />
            </marker>
          </defs>
          {connectors.map((connector, index) => (
            <g key={connector.id}>
              <path
                d={connector.d}
                fill="none"
                stroke="rgba(74, 222, 128, 0.18)"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <motion.path
                d={connector.d}
                fill="none"
                stroke="rgba(74, 222, 128, 0.85)"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="4 9"
                markerEnd="url(#flowArrowHead)"
                animate={{ strokeDashoffset: [0, -54] }}
                transition={{
                  duration: 2.6,
                  repeat: Infinity,
                  ease: 'linear',
                  delay: index * 0.16,
                }}
              />
            </g>
          ))}
        </svg>

        {project.flow.map((step, index) => {
          const slot = layout[index] ?? { x: 70 + index * 120, y: 70 + index * 40, w: 240 }
          return (
            <motion.article
              key={step.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
              className="absolute min-h-[160px] rounded-2xl border border-dark-600/70 bg-dark-800/88 p-4 shadow-[0_0_0_1px_rgba(74,222,128,0.05),0_12px_26px_rgba(0,0,0,0.34)]"
              style={{ left: slot.x, top: slot.y, width: slot.w }}
            >
              <div className="mb-3 flex items-center gap-2">
                {index === 0 ? (
                  <User size={18} className="text-accent" />
                ) : (
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent/15 font-mono text-xs font-semibold text-accent">
                    {index + 1}
                  </span>
                )}
                <h3 className="font-display text-lg font-semibold leading-tight text-cream">
                  {step.title}
                </h3>
              </div>
              <p className="text-sm leading-relaxed text-dark-300">{step.detail}</p>
            </motion.article>
          )
        })}
      </div>
    </section>
  )
}

export default function ProjectPage({ project }: ProjectPageProps) {
  const [selectedImage, setSelectedImage] = useState<ProjectImage | null>(null)

  useEffect(() => {
    if (!selectedImage) return

    const previousOverflow = document.body.style.overflow
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelectedImage(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleEscape)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleEscape)
    }
  }, [selectedImage])

  if (!project) return <EmptyProjectState />

  return (
    <main className="relative z-10 min-h-screen px-6 pb-24 pt-24 md:px-12 lg:px-20">
      <div className="pointer-events-none absolute inset-x-6 top-12 -z-10 h-40 rounded-full bg-accent/15 blur-3xl md:inset-x-12 lg:inset-x-20" />

      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="mx-auto max-w-6xl"
      >
        <a
          href="/#projects"
          className="mb-6 inline-flex items-center gap-2 rounded-xl border border-dark-600/70 bg-dark-900/60 px-4 py-2 font-mono text-xs uppercase tracking-wider text-cream-muted transition-colors hover:border-accent/45 hover:text-accent"
        >
          <ArrowLeft size={14} />
          Back to projects
        </a>

        <header className="rounded-3xl border border-dark-600/60 bg-dark-800/55 p-7 backdrop-blur-sm md:p-9">
          <p className="inline-flex items-center rounded-full border border-accent/35 bg-accent/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-accent">
            {project.status}
          </p>
          <h1 className="mt-4 max-w-4xl font-display text-4xl font-bold leading-tight text-cream md:text-5xl">
            {project.title}
          </h1>
          <p className="mt-3 max-w-3xl text-base leading-relaxed text-dark-300 md:text-lg">
            {project.subtitle}
          </p>
          <p className="mt-6 max-w-3xl text-[17px] leading-8 text-dark-300">{project.intro}</p>

          <div className="mt-6 flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-dark-600/60 bg-dark-700/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-cream-muted"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-dark-950 transition-colors hover:bg-accent-dim"
            >
              <Github size={15} />
              Open on GitHub
              <ExternalLink size={13} />
            </a>
            <a
              href="/#projects"
              className="inline-flex items-center gap-2 rounded-xl border border-dark-600/70 bg-dark-900/60 px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-cream-muted transition-colors hover:border-accent/45 hover:text-accent"
            >
              View all projects
            </a>
          </div>
        </header>

        <section className="mt-10 rounded-3xl border border-dark-600/60 bg-dark-800/45 p-6 backdrop-blur-sm md:p-7">
          <div className="flex items-center gap-2">
            <Layers size={15} className="text-accent" />
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-accent">Overview</p>
          </div>
          <p className="mt-4 max-w-4xl text-[17px] leading-8 text-dark-300">{project.overview}</p>
          <p className="mt-4 max-w-4xl text-[17px] leading-8 text-dark-300">{project.description}</p>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {project.stats.map((stat) => (
              <article
                key={stat.label}
                className="rounded-2xl border border-dark-600/60 bg-dark-900/50 p-4"
              >
                <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-accent/80">
                  {stat.label}
                </p>
                <p className="mt-2 font-display text-2xl font-bold text-cream">{stat.value}</p>
                <p className="mt-1 text-xs leading-relaxed text-dark-300">{stat.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <div className="mt-12">
          {project.story.map((section) => (
            <StoryBlock
              key={`${section.label}-${section.title}`}
              section={section}
              onImageClick={setSelectedImage}
            />
          ))}
        </div>

        <HowItWorks project={project} />

        <section className="mt-14 rounded-3xl border border-dark-600/60 bg-dark-800/45 p-6 backdrop-blur-sm md:p-7">
          <h2 className="font-display text-2xl font-semibold text-cream">Stack and domains</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {project.stack.map((group) => (
              <article
                key={group.group}
                className="rounded-2xl border border-dark-600/60 bg-dark-900/45 p-4"
              >
                <h3 className="font-display text-lg font-semibold text-cream">{group.group}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span
                      key={item}
                      className="rounded-md border border-dark-600/60 bg-dark-700/50 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wide text-cream-muted"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-3xl border border-dark-600/60 bg-dark-800/45 p-6 backdrop-blur-sm md:p-7">
          <h2 className="font-display text-2xl font-semibold text-cream">Key implementation points</h2>
          <ul className="mt-4 grid gap-3 md:grid-cols-2">
            {project.highlights.map((item) => (
              <li
                key={item}
                className="rounded-2xl border border-dark-600/55 bg-dark-900/45 px-4 py-3 text-sm leading-relaxed text-dark-300"
              >
                {item}
              </li>
            ))}
          </ul>
        </section>
      </motion.article>

      {selectedImage && (
        <div
          className="fixed inset-0 z-[120] bg-dark-950/92 p-4 backdrop-blur-sm md:p-8"
          role="dialog"
          aria-modal="true"
          aria-label={selectedImage.alt}
          onClick={() => setSelectedImage(null)}
        >
          <button
            type="button"
            onClick={() => setSelectedImage(null)}
            className="absolute right-4 top-4 inline-flex h-10 w-10 items-center justify-center rounded-full border border-dark-600 bg-dark-900/70 text-cream-muted transition-colors hover:border-accent/50 hover:text-accent md:right-7 md:top-7"
            aria-label="Close full screen image"
          >
            <X size={18} />
          </button>

          <div
            className="mx-auto flex h-full max-w-7xl items-center justify-center"
            onClick={(event) => event.stopPropagation()}
          >
            <figure className="max-h-full w-full">
              <img
                src={selectedImage.src}
                alt={selectedImage.alt}
                className="mx-auto max-h-[84vh] w-auto max-w-full object-contain"
              />
              <figcaption className="mt-4 text-center text-sm text-dark-300">
                {selectedImage.caption}
              </figcaption>
            </figure>
          </div>
        </div>
      )}
    </main>
  )
}
