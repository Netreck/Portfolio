import { ArrowLeft, ArrowRight } from 'lucide-react'
import type { Language } from '../../data/projects'
import { POST_LIST } from '../../data/posts'
import ConcretoNav from './ConcretoNav'

interface PostsPageProps {
  language: Language
  onLanguageChange: (language: Language) => void
}

const COPY: Record<Language, { back: string; title: string; intro: string; count: (n: number) => string; read: string }> = {
  en: {
    back: 'Back to portfolio',
    title: 'Posts',
    intro: 'Short write-ups on things I built or configured that are too small for a full case study, each with a working demonstration.',
    count: (n) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    read: 'Read',
  },
  br: {
    back: 'Voltar ao portfólio',
    title: 'Posts',
    intro: 'Textos curtos sobre coisas que construí ou configurei e que são pequenas demais para um case study completo, cada um com uma demonstração funcionando.',
    count: (n) => `${n} ${n === 1 ? 'post' : 'posts'}`,
    read: 'Ler',
  },
}

export default function PostsPage({ language, onLanguageChange }: PostsPageProps) {
  const t = COPY[language]

  return (
    <div className="cz flex min-h-screen flex-col bg-paper text-ink">
      <ConcretoNav language={language} onLanguageChange={onLanguageChange} base="/" />

      <header className="border-b-2 border-ink px-4 pb-10 pt-6 sm:px-8 lg:px-12 lg:pb-12 lg:pt-8">
        <a href="/#posts" className="inline-flex items-center gap-2 text-[15px] font-semibold text-ink no-underline hover:bg-signal">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>
        <div className="mt-6 flex flex-wrap items-end justify-between gap-6">
          <h1 className="text-[clamp(2.75rem,6vw,5.5rem)] font-extrabold leading-[0.95] tracking-[-0.035em]">{t.title}</h1>
          <span className="tnum inline-flex items-center gap-2.5 bg-ink px-3 py-2 text-[16px] font-bold text-paper">
            <span aria-hidden="true" className="h-3 w-3 bg-signal" />
            {t.count(POST_LIST.length)}
          </span>
        </div>
        <p className="mt-6 max-w-[62ch] text-[clamp(1.125rem,1.5vw,1.3125rem)] font-medium leading-snug">{t.intro}</p>
      </header>

      <main className="flex-1 px-4 pb-20 sm:px-8 lg:px-12">
        <ol className="max-w-[1100px]">
          {POST_LIST.map((post, index) => (
            <li key={post.slug} className="border-b-2 border-ink">
              <a
                href={`/post/${post.slug}`}
                className="group grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 py-7 text-ink no-underline hover:bg-signal sm:grid-cols-[3rem_1fr_auto] sm:items-center sm:gap-x-6 sm:px-3 lg:py-9"
              >
                <span className="tnum flex h-10 w-10 items-center justify-center border-2 border-ink text-[17px] font-bold group-hover:bg-ink group-hover:text-paper sm:h-12 sm:w-12">
                  {index + 1}
                </span>
                <span className="min-w-0">
                  <span className="block text-[clamp(1.375rem,2.6vw,2.25rem)] font-bold leading-[1.1] tracking-[-0.02em]">
                    {post.title[language]}
                  </span>
                  <span className="mt-2 block text-[15px] font-medium text-ink-soft group-hover:text-ink">{post.teaser[language]}</span>
                </span>
                <span className="col-start-2 inline-flex items-center gap-2 text-[16px] font-bold text-cobalt group-hover:text-ink sm:col-start-auto">
                  {t.read}
                  <ArrowRight size={18} aria-hidden="true" />
                </span>
              </a>
            </li>
          ))}
        </ol>
      </main>

      <footer className="on-cobalt flex flex-wrap items-center gap-4 bg-cobalt px-4 py-8 text-paper sm:px-8 lg:px-12">
        <a href="/#posts" className="inline-flex items-center gap-2 text-[17px] font-semibold text-paper no-underline hover:bg-signal hover:text-ink">
          <ArrowLeft size={18} aria-hidden="true" />
          {t.back}
        </a>
      </footer>
    </div>
  )
}
