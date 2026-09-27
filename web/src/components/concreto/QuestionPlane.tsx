import { useEffect, useLayoutEffect, useRef, useState, type FormEvent, type KeyboardEvent } from 'react'
import { ArrowRight, CornerDownLeft } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Language } from '../../data/projects'
import { CONTACT, LANDING } from './copy'

interface Source {
  source_name: string
  score: number
  excerpt: string
}

interface Exchange {
  id: number
  question: string
  answer?: string
  sources?: Source[]
  failed?: boolean
}

interface QuestionPlaneProps {
  language: Language
  onAnswer: (litText: string) => void
}

const PLACEHOLDER: Record<Language, string> = {
  en: 'Ask me anything...',
  br: 'Pergunte o que quiser...',
}

const SUGGESTIONS: Record<Language, string[]> = {
  en: [
    'What is your professional experience?',
    'What are your main personal projects?',
    'Tell me more about yourself',
    'Which technologies do you have experience with?',
  ],
  br: [
    'Qual sua experiência profissional?',
    'Quais são seus principais projetos pessoais?',
    'Me diga mais sobre você',
    'Quais tecnologias você tem experiência?',
  ],
}

const STATUS: Record<Language, { offline: string; emailMe: string; retry: string; pending: string }> = {
  en: {
    offline: 'The chatbot is offline right now. Try again in a moment, or email me directly:',
    emailMe: CONTACT.email,
    retry: 'Try again',
    pending: 'Searching my resume and projects…',
  },
  br: {
    offline: 'O chatbot está fora do ar agora. Tente de novo em instantes ou me mande um e-mail:',
    emailMe: CONTACT.email,
    retry: 'Tentar de novo',
    pending: 'Buscando no meu currículo e nos projetos…',
  },
}

const RAG_API_BASE_URL =
  import.meta.env.VITE_RAG_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '')

function sizeFor(text: string, inThread: boolean): 'xl' | 'lg' | 'md' | 'sm' {
  if (inThread) return text.length > 60 ? 'sm' : 'md'
  if (text.length <= 26) return 'xl'
  if (text.length <= 64) return 'lg'
  return 'md'
}

function unwrapFence(text: string): string {
  const match = text.match(/^\s*```(?:[\w-]+)?\s*([\s\S]*?)\s*```\s*$/)
  return match ? match[1].trim() : text
}

export default function QuestionPlane({ language, onAnswer }: QuestionPlaneProps) {
  const t = LANDING[language]
  const [exchanges, setExchanges] = useState<Exchange[]>([])
  const [input, setInput] = useState('')
  const [pending, setPending] = useState(false)
  const fieldRef = useRef<HTMLTextAreaElement>(null)
  const threadRef = useRef<HTMLDivElement>(null)
  const inThread = exchanges.length > 0
  const latest = exchanges[exchanges.length - 1]
  // Re-align once the answer or error lands: it only now has height to scroll to.
  const latestResolved = Boolean(latest && (latest.answer !== undefined || latest.failed))
  const size = sizeFor(input || PLACEHOLDER[language], inThread)

  useLayoutEffect(() => {
    const field = fieldRef.current
    if (!field) return
    field.style.height = '0px'
    field.style.height = `${field.scrollHeight}px`
  }, [input, size, language])

  useEffect(() => {
    const thread = threadRef.current
    const latest = thread?.querySelector<HTMLElement>('[data-latest]')
    if (!thread || !latest) return
    if (window.matchMedia('(min-width: 1024px)').matches) {
      thread.scrollTo({ top: latest.offsetTop - thread.offsetTop })
    } else {
      latest.scrollIntoView({ block: 'start' })
    }
  }, [exchanges.length, latestResolved])

  const ask = async (text?: string) => {
    const question = (text ?? input).trim()
    if (!question || pending) return

    const id = Date.now()
    setExchanges((prev) => [...prev, { id, question }])
    setInput('')
    setPending(true)

    try {
      const response = await fetch(`${RAG_API_BASE_URL}/rag/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: question, top_k: 4, language: language === 'br' ? 'pt' : 'en' }),
      })

      if (!response.ok) {
        let detail = `HTTP ${response.status}`
        try {
          const errorData = (await response.json()) as { detail?: string }
          if (errorData.detail?.trim()) detail = errorData.detail.trim()
        } catch {
          // Keep status-only detail when response body is not JSON.
        }
        throw new Error(detail)
      }

      const data = (await response.json()) as { answer: string; sources: Source[] }
      const sources = Array.isArray(data.sources) ? data.sources : []
      setExchanges((prev) => prev.map((ex) => (ex.id === id ? { ...ex, answer: data.answer, sources } : ex)))
      onAnswer([data.answer, ...sources.map((source) => source.source_name)].join('\n'))
    } catch (error) {
      console.error('RAG chat request failed', error)
      setExchanges((prev) => prev.map((ex) => (ex.id === id ? { ...ex, failed: true } : ex)))
    } finally {
      setPending(false)
      fieldRef.current?.focus({ preventScroll: true })
    }
  }

  const retry = (exchange: Exchange) => {
    setExchanges((prev) => prev.filter((ex) => ex.id !== exchange.id))
    void ask(exchange.question)
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    void ask()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) {
      event.preventDefault()
      void ask()
    }
  }

  const field = (
    <form onSubmit={handleSubmit} className="cz-field">
      <label htmlFor="cz-question" className="sr-only">
        {PLACEHOLDER[language]}
      </label>
      <div className="flex items-end gap-4 sm:gap-6">
        <textarea
          id="cz-question"
          ref={fieldRef}
          rows={1}
          value={input}
          data-size={size}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={inThread ? t.newQuestion : PLACEHOLDER[language]}
          className="cz-question"
          enterKeyHint="send"
        />
        <button
          type="submit"
          disabled={!input.trim() || pending}
          aria-label={t.send}
          className={`flex shrink-0 cursor-pointer items-center justify-center bg-signal text-ink disabled:cursor-not-allowed disabled:bg-transparent disabled:text-signal disabled:outline-2 disabled:-outline-offset-2 disabled:outline-signal ${
            inThread ? 'h-12 w-12' : 'h-14 w-14 sm:h-16 sm:w-16'
          }`}
        >
          {inThread ? <CornerDownLeft size={20} strokeWidth={2.25} /> : <ArrowRight size={26} strokeWidth={2.25} />}
        </button>
      </div>
      <div aria-hidden="true" className="cz-field-rule mt-4 h-0.5 bg-cobalt-line" />
    </form>
  )

  return (
    <div className="on-cobalt flex h-full min-h-0 flex-col">
      {!inThread ? (
        <div className="flex flex-1 flex-col justify-center gap-10 py-4 lg:gap-14">
          {field}

          <div>
            <p className="sr-only">{t.suggestionsLabel}</p>
            <ul className="flex flex-col items-start gap-4 lg:gap-2">
              {SUGGESTIONS[language].map((suggestion) => (
                <li key={suggestion}>
                  <button
                    type="button"
                    onClick={() => void ask(suggestion)}
                    className="cz-ghost lc cursor-pointer text-left text-[clamp(1.375rem,2.3vw,2.125rem)] font-semibold leading-[1.15] tracking-[-0.02em]"
                  >
                    {suggestion}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <p className="max-w-md text-[15px] leading-relaxed text-cobalt-tint">{t.grounding}</p>
        </div>
      ) : (
        <>
          <div
            ref={threadRef}
            className="cz-thread lg:-mr-3 lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:pr-3"
            aria-live="polite"
            aria-busy={pending}
          >
            <ol className="flex flex-col gap-10 pb-8">
              {exchanges.map((exchange, index) => {
                const isLatest = index === exchanges.length - 1
                return (
                <li key={exchange.id} data-latest={isLatest ? '' : undefined} className="scroll-mt-32">
                  <h2
                    className={`lc font-bold tracking-[-0.035em] text-signal ${
                      isLatest
                        ? 'text-[clamp(2.75rem,5vw,5rem)] leading-[0.98]'
                        : 'text-[clamp(1.5rem,2.4vw,2.125rem)] leading-tight'
                    }`}
                  >
                    {exchange.question}
                  </h2>

                  {exchange.answer !== undefined && (
                    <div className="mt-5">
                      <div className="cz-answer max-w-[68ch]">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: (props) => <a {...props} target="_blank" rel="noreferrer" />,
                          }}
                        >
                          {unwrapFence(exchange.answer)}
                        </ReactMarkdown>
                      </div>

                      {exchange.sources && exchange.sources.length > 0 && (
                        <div className="mt-6 max-w-[68ch] border-t-2 border-cobalt-line pt-4">
                          <p className="lc text-sm font-semibold text-paper">{t.sources}</p>
                          <ol className="mt-3 space-y-3">
                            {exchange.sources.map((source, index) => (
                              <li key={`${source.source_name}-${index}`} className="flex gap-3">
                                <span className="tnum flex h-6 w-6 shrink-0 items-center justify-center bg-signal text-xs font-bold text-ink">
                                  {index + 1}
                                </span>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium text-paper">
                                    {source.source_name}{' '}
                                    <span className="tnum text-cobalt-tint">{source.score.toFixed(2)}</span>
                                  </p>
                                  <p className="mt-0.5 line-clamp-2 text-sm leading-snug text-cobalt-tint">{source.excerpt}</p>
                                </div>
                              </li>
                            ))}
                          </ol>
                        </div>
                      )}
                    </div>
                  )}

                  {exchange.failed && (
                    <div role="alert" className="mt-6 max-w-[68ch] border-2 border-signal p-5 text-[17px] leading-relaxed text-paper">
                      <p>
                        {STATUS[language].offline}{' '}
                        <a href={`mailto:${CONTACT.email}`} className="font-semibold text-signal underline">
                          {STATUS[language].emailMe}
                        </a>
                      </p>
                      <button
                        type="button"
                        onClick={() => retry(exchange)}
                        disabled={pending}
                        className="lc mt-4 h-11 cursor-pointer bg-signal px-4 font-semibold text-ink hover:bg-paper disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {STATUS[language].retry}
                      </button>
                    </div>
                  )}
                </li>
                )
              })}
            </ol>

            {pending && (
              <div className="flex items-center gap-4 pb-8" role="status">
                <div className="cz-typing flex gap-2" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <p className="text-[15px] text-cobalt-tint">{STATUS[language].pending}</p>
              </div>
            )}
          </div>

          <div className="shrink-0 pt-2">{field}</div>
        </>
      )}
    </div>
  )
}
