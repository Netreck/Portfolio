import type { Language } from '../data/projects'
import { PROFILE } from '../data/profile'

export default function Experience({ language }: { language: Language }) {
  const copy = PROFILE[language]

  return (
    <section id="experience" aria-labelledby="experience-title" className="relative z-10 scroll-mt-32 px-4 py-16 sm:px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-6xl">
        <h2 id="experience-title" className="font-display text-3xl font-bold text-cream sm:text-4xl">{copy.experienceTitle}</h2>
        <div className="mt-10 space-y-10 border-l border-accent/40 pl-5 sm:pl-8">
          {copy.experience.map((job) => (
            <article key={job.role} className="grid gap-3 md:grid-cols-[180px_minmax(0,1fr)] md:gap-8">
              <p className="font-mono text-xs leading-7 text-accent">{job.period}</p>
              <div>
                <h3 className="font-display text-xl font-bold text-cream">{job.role}</h3>
                <p className="mt-1 text-sm text-cream-muted">{job.organization}</p>
                <ul className="mt-4 max-w-3xl list-disc space-y-2 pl-4 text-sm leading-relaxed text-cream-muted marker:text-accent/60">
                  {job.highlights.map((highlight) => <li key={highlight}>{highlight}</li>)}
                </ul>
              </div>
            </article>
          ))}
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
