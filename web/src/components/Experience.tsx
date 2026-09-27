import { Building2 } from 'lucide-react'
import type { Language } from '../data/projects'
import { PROFILE } from '../data/profile'

export default function Experience({ language }: { language: Language }) {
  const copy = PROFILE[language]
  const companies = [...new Set(copy.experience.map((job) => job.organization))]

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative z-10 scroll-mt-32 px-4 py-16 sm:px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <h2 id="experience-title" className="font-display text-3xl font-bold text-cream sm:text-4xl">{copy.experienceTitle}</h2>
        <div className="mt-10 border-t border-dark-600/70">
          {companies.map((company) => {
            const jobs = copy.experience.filter((job) => job.organization === company)
            const isCurrentCompany = jobs.some((job) => job.current)

            return (
              <article key={company} className="grid gap-7 border-b border-dark-600/70 py-8 sm:py-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-12">
                <header className="flex items-center gap-4 self-start lg:sticky lg:top-28">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border ${isCurrentCompany ? 'border-accent/25 bg-accent/10 text-accent' : 'border-dark-600 bg-dark-800 text-cream-muted'}`}>
                    <Building2 size={22} strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  <h3 className="font-display text-xl font-bold leading-snug text-cream">{company}</h3>
                </header>

                <ol className="ml-2 border-l border-dark-600/80 sm:ml-0">
                  {jobs.map((job) => (
                    <li key={job.role} className="relative pb-8 pl-6 last:pb-0 sm:pl-8">
                      <span aria-hidden="true" className={`absolute -left-[5px] top-5 h-[9px] w-[9px] rounded-full ring-4 ring-dark-950 ${job.current ? 'bg-accent' : 'bg-dark-500'}`} />
                      <div className={job.current ? 'rounded-2xl border border-accent/15 bg-dark-800/60 p-5 sm:p-6' : 'py-3 sm:px-6'}>
                        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                          <p className="font-mono text-xs text-cream-muted">{job.period}</p>
                          {job.current && <span className="rounded-md bg-accent/10 px-2 py-1 text-xs font-medium text-accent">{copy.currentLabel}</span>}
                        </div>
                        <h4 className="max-w-xl font-display text-lg font-bold leading-snug text-cream sm:text-xl">{job.role}</h4>
                        <ul className="mt-4 max-w-2xl space-y-2 text-sm leading-relaxed text-cream-muted">
                          {job.highlights.map((highlight) => (
                            <li key={highlight} className="flex gap-3">
                              <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-dark-400" />
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                        {job.technologies && (
                          <p className="mt-5 border-t border-dark-600/50 pt-3 text-xs leading-relaxed text-cream-muted">
                            {job.technologies.join(' / ')}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </article>
            )
          })}
        </div>

        <div className="mt-14 grid gap-10 border-t border-dark-600/60 pt-10 md:grid-cols-2 md:gap-12">
          <div>
            <h2 className="font-display text-2xl font-bold text-cream">{copy.communityTitle}</h2>
            <h3 className="mt-5 font-semibold text-cream">{copy.community.role}</h3>
            <p className="mt-1 text-sm text-cream-muted">{copy.community.organization}</p>
            <p className="mt-2 font-mono text-xs text-accent">{copy.community.period}</p>
            <p className="mt-4 text-sm leading-relaxed text-cream-muted">{copy.community.highlights[0]}</p>
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-cream">{copy.educationTitle}</h2>
            <p className="mt-5 text-sm text-cream-muted">{copy.university}</p>
            {copy.education.map((course) => (
              <div key={course.degree} className="mt-4">
                <h3 className="font-semibold text-cream">{course.degree}</h3>
                <p className="mt-1 font-mono text-xs text-accent">{course.completion}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-10 border-t border-dark-600/60 pt-10">
          <h2 className="font-display text-2xl font-bold text-cream">{copy.skillsTitle}</h2>
          <dl className="mt-5 grid gap-6 md:grid-cols-2 md:gap-12">
            {copy.skills.map((group) => (
              <div key={group.label}>
                <dt className="font-semibold text-cream">{group.label}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-cream-muted">{group.details}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
