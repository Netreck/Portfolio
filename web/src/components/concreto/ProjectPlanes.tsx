import { ArrowRight, Github } from 'lucide-react'
import { projects, type Language } from '../../data/projects'
import proxmenuxMonitor from '../../Assets/Home-lab/proxmenux-example.png'
import hirematchHomepage from '../../Assets/HirematchAI/HirematchHomepage.png'
import { LANDING } from './copy'
import PostsTicker from './PostsTicker'

interface ProjectPlanesProps {
  language: Language
}

const COVERS: Record<string, { src: string; alt: Record<Language, string> }> = {
  'homelab-pessoal': {
    src: proxmenuxMonitor,
    alt: {
      en: 'ProxMenux monitor showing the homelab node healthy, with live CPU and memory charts',
      br: 'Monitor ProxMenux mostrando o nó do homelab saudável, com gráficos de CPU e memória ao vivo',
    },
  },
  'hirematch-ai': {
    src: hirematchHomepage,
    alt: { en: 'HireMatch AI homepage', br: 'Página inicial do HireMatch AI' },
  },
}

// Each project owns a full-width plane; the planes alternate ink and yellow.
const PLANES = [
  { plane: 'on-ink bg-ink text-paper', muted: 'text-[#c8c8c2]', rule: 'border-paper', cta: 'bg-signal text-ink hover:bg-paper' },
  { plane: 'on-signal bg-signal text-ink', muted: 'text-[#3d3500]', rule: 'border-ink', cta: 'bg-ink text-paper hover:bg-cobalt' },
]

export default function ProjectPlanes({ language }: ProjectPlanesProps) {
  const t = LANDING[language]

  return (
    <section id="projects" aria-labelledby="projects-title" className="scroll-mt-28 border-t-2 border-ink">
      <div className="grid gap-6 px-4 pb-16 pt-16 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:pb-20 lg:pt-24">
        <h2
          id="projects-title"
          className="text-[clamp(2.25rem,4.4vw,4rem)] font-bold leading-[0.98] tracking-[-0.035em] lg:col-span-8"
        >
          {t.projectsTitle}
        </h2>
        <p className="max-w-[46ch] self-end text-[17px] leading-relaxed text-ink-soft lg:col-span-4">{t.projectsIntro}</p>
      </div>

      <PostsTicker language={language} />

      {projects.map((project, index) => {
        const localized = language === 'br' && project.pt ? project.pt : project
        const style = PLANES[index % PLANES.length]
        const cover = COVERS[project.slug]
        const mirrored = index % 2 === 1

        return (
          <article
            key={project.slug}
            aria-labelledby={`project-${project.slug}`}
            className={`relative grid gap-10 px-4 py-14 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 lg:py-20 ${style.plane}`}
          >
            <span
              className={`absolute top-0 inline-flex items-center gap-2 px-4 py-2.5 text-[15px] font-bold ${mirrored ? 'left-0' : 'right-0'} ${
                project.online
                  ? index % 2 === 0
                    ? 'bg-signal text-ink'
                    : 'bg-ink text-paper'
                  : index % 2 === 0
                    ? 'border-2 border-paper text-paper'
                    : 'border-2 border-ink text-ink'
              }`}
            >
              <span
                aria-hidden="true"
                className={`h-3 w-3 border-2 ${project.online ? (index % 2 === 0 ? 'border-ink bg-ink' : 'border-paper bg-signal') : index % 2 === 0 ? 'border-paper' : 'border-ink'}`}
              />
              {project.online ? t.online : t.offline}
            </span>
            <div className={`flex flex-col lg:col-span-5 ${mirrored ? 'lg:order-2 lg:col-start-8' : ''}`}>
              <h3
                id={`project-${project.slug}`}
                className="text-[clamp(2.25rem,4vw,3.75rem)] font-extrabold leading-[0.95] tracking-[-0.035em]"
              >
                {localized.title}
              </h3>
              <p className="mt-5 text-xl font-medium leading-snug">{localized.subtitle}</p>
              <p className={`mt-4 max-w-[52ch] text-[17px] leading-relaxed ${style.muted}`}>{localized.description}</p>

              <p className={`mt-6 border-t-2 pt-4 text-[15px] font-medium ${style.rule}`}>{project.tags.join(' / ')}</p>

              <div className="mt-8 flex flex-wrap gap-3 lg:mt-auto lg:pt-10">
                <a
                  href={`/project/${project.slug}`}
                  className={`group inline-flex h-14 items-center gap-3 px-5 text-[17px] font-semibold no-underline ${style.cta}`}
                >
                  <span>{t.caseStudy}</span>
                  <ArrowRight size={20} strokeWidth={2.25} aria-hidden="true" />
                </a>
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={`inline-flex h-14 items-center gap-2.5 border-2 px-5 text-[17px] font-semibold no-underline hover:bg-paper hover:text-ink ${style.rule}`}
                >
                  <Github size={18} strokeWidth={2} aria-hidden="true" />
                  <span>{t.code}</span>
                </a>
              </div>
            </div>

            {cover && (
              <a
                href={`/project/${project.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className={`block self-center lg:col-span-7 ${mirrored ? 'lg:order-1 lg:col-start-1' : 'lg:col-start-6'}`}
              >
                <img
                  src={cover.src}
                  alt={cover.alt[language]}
                  loading="lazy"
                  decoding="async"
                  className={`aspect-[16/10] w-full border-2 object-cover object-top ${style.rule}`}
                />
              </a>
            )}

          </article>
        )
      })}
    </section>
  )
}
