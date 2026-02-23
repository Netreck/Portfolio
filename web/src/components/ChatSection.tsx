import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { Maximize2, Send, Sparkles, X } from 'lucide-react'
import ChatMessage from './ChatMessage'
import type { Language } from '../data/projects'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

interface ChatSectionProps {
  language: Language
  featured?: boolean
  expandToFullWidth?: boolean
  onFirstUserMessage?: () => void
  onExpandRequest?: () => void
  onCollapseRequest?: () => void
}

interface ChatApiSource {
  source_name: string
  score: number
  excerpt: string
}

interface ChatApiResponse {
  answer: string
  sources: ChatApiSource[]
}

const CHAT_COPY = {
  en: {
    title: 'Chat with me',
    online: 'Online',
    fullscreen: 'Fullscreen chat',
    closeFullscreen: 'Close fullscreen',
    sources: 'Sources',
    placeholder: 'Ask me anything...',
    connected: 'Connected to RAG API',
    initialMessage: `## Hello! 👋

I’m a **RAG chatbot** powered by information about my skills and projects.

You can ask me about:
- technical skills
- professional experience
- projects I've built
- goals and interests

Feel free to ask anything!`,
    suggestions: [
      'What is your professional experience?',
      'What are your main personal projects?',
      'Tell me more about yourself',
      'Which technologies do you have experience with?',
    ],
    connectionError:
      'I could not reach the RAG API.\n\nCheck if backend is running on `http://localhost:8000` and ingestion has already been executed.',
  },
  br: {
    title: 'Converse comigo',
    online: 'Online',
    fullscreen: 'Expandir chat',
    closeFullscreen: 'Fechar chat expandido',
    sources: 'Fontes',
    placeholder: 'Pergunte o que quiser...',
    connected: 'Conectado à RAG API',
    initialMessage: `## Olá! 👋

Eu sou um **chatbot RAG** alimentado por informações sobre minhas habilidades e projetos.

Você pode me perguntar sobre:
- habilidades técnicas
- experiência profissional
- projetos que construí
- objetivos e interesses

Fique à vontade para perguntar qualquer coisa!`,
    suggestions: [
      'Qual sua experiência profissional?',
      'Quais são seus principais projetos pessoais?',
      'Me diga mais sobre você',
      'Quais tecnologias você tem experiência?',
    ],
    connectionError:
      'Não consegui conectar com a API RAG.\n\nVerifique se o backend está rodando em `http://localhost:8000` e se a ingestão já foi executada.',
  },
} as const

const RAG_API_BASE_URL =
  import.meta.env.VITE_RAG_API_URL ?? (import.meta.env.DEV ? 'http://localhost:8000' : '')

const layoutSpring = { type: 'spring', stiffness: 130, damping: 20, mass: 0.85 } as const

export default function ChatSection({
  language,
  featured = false,
  expandToFullWidth = false,
  onFirstUserMessage,
  onExpandRequest,
  onCollapseRequest,
}: ChatSectionProps) {
  const copy = CHAT_COPY[language]
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content: copy.initialMessage,
},
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const hasSentFirstUserMessage = useRef(false)
  const messagesListRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  useEffect(() => {
    const list = messagesListRef.current
    if (!list) return
    list.scrollTo({ top: list.scrollHeight, behavior: 'smooth' })
  }, [messages, isTyping])

  useEffect(() => {
    setMessages((prev) => {
      const hasUserMessage = prev.some((msg) => msg.role === 'user')
      if (hasUserMessage) return prev
      return [{ id: 0, role: 'assistant', content: copy.initialMessage }]
    })
  }, [copy.initialMessage])

  const handleSend = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || isTyping) return

    if (!hasSentFirstUserMessage.current) {
      hasSentFirstUserMessage.current = true
      onFirstUserMessage?.()
    }

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: msg }])
    setInput('')
    setIsTyping(true)

    try {
      const response = await fetch(`${RAG_API_BASE_URL}/rag/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msg, top_k: 4 }),
      })

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`)
      }

      const data = (await response.json()) as ChatApiResponse
      const sourcesSection =
        Array.isArray(data.sources) && data.sources.length > 0
          ? `\n\n---\n**${copy.sources}**\n${data.sources
              .map(
                (source, index) =>
                  `${index + 1}. **${source.source_name}** (${source.score.toFixed(2)})\n> ${source.excerpt}`,
              )
              .join('\n')}`
          : ''
      const assistantMessage = `${data.answer}${sourcesSection}`

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: assistantMessage },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: 'assistant',
          content: copy.connectionError,
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void handleSend()
  }

  const chatCard = (
    <div
      className={`overflow-hidden rounded-2xl border backdrop-blur-sm ${
        featured && expandToFullWidth
          ? 'glow-card rounded-3xl border-accent/50 bg-dark-800/85 shadow-[0_0_0_1px_rgba(74,222,128,0.24),0_28px_90px_rgba(74,222,128,0.12)]'
          : featured
            ? 'glow-card border-accent/40 bg-dark-800/75 shadow-[0_0_0_1px_rgba(74,222,128,0.18),0_24px_70px_rgba(74,222,128,0.12)]'
            : 'glow-card border-dark-600/60 bg-dark-800/50'
      }`}
    >
      <div className="flex items-center justify-between border-b border-dark-600/40 px-5 py-4">
        <div>
          <div className="flex items-center gap-3">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
            >
              <Sparkles size={16} className="text-accent" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-cream">{copy.title}</p>
              <div className="flex items-center gap-1.5">
                <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="font-mono text-[10px] text-accent">{copy.online}</span>
              </div>
            </div>
          </div>
        </div>
        {featured && (
          <div className="flex items-center gap-2">
            {!expandToFullWidth && (
              <motion.button
                type="button"
                title={copy.fullscreen}
                aria-label={copy.fullscreen}
                onClick={onExpandRequest}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-dark-600/70 bg-dark-700/50 text-cream-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent"
              >
                <Maximize2 size={14} />
              </motion.button>
            )}
            {expandToFullWidth && (
              <motion.button
                type="button"
                title={copy.closeFullscreen}
                aria-label={copy.closeFullscreen}
                onClick={onCollapseRequest}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-dark-600/70 bg-dark-700/50 text-cream-muted transition-colors duration-200 hover:border-accent/40 hover:text-accent"
              >
                <X size={14} />
              </motion.button>
            )}
          </div>
        )}
      </div>

      <div
        ref={messagesListRef}
        className={`flex flex-col gap-4 overflow-y-auto p-5 ${
          featured
            ? expandToFullWidth
              ? 'h-[52vh] min-h-[430px] max-h-[650px]'
              : 'h-[400px]'
            : 'h-[380px]'
        }`}
      >
        {messages.map((msg) => (
          <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
        ))}
        {isTyping && <ChatMessage role="assistant" content="" isTyping />}
      </div>

      <div className="flex flex-wrap gap-2 border-t border-dark-600/30 bg-dark-900/30 px-5 py-3">
        {copy.suggestions.map((s) => (
          <motion.button
            key={s}
            onClick={() => void handleSend(s)}
            disabled={isTyping}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="cursor-pointer rounded-full border border-dark-600/60 bg-dark-700/40 px-3 py-1.5 font-mono text-[11px] text-cream-muted transition-all duration-200 hover:border-accent/30 hover:text-accent disabled:cursor-not-allowed disabled:opacity-30"
          >
            {s}
          </motion.button>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex items-center gap-3 border-t border-dark-600/40 px-5 py-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={copy.placeholder}
          disabled={isTyping}
          className="flex-1 bg-transparent text-sm text-cream placeholder:text-dark-400 outline-none disabled:opacity-40"
        />
        <motion.button
          type="submit"
          disabled={!input.trim() || isTyping}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-accent text-dark-950 transition-all disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Send"
        >
          <Send size={15} />
        </motion.button>
      </form>
    </div>
  )

  if (featured) {
    return (
      <motion.div
        layout
        id="chat"
        ref={sectionRef}
        initial={{ opacity: 0, y: 35, scale: 0.98 }}
        animate={
          isInView
            ? { opacity: 1, y: 0, scale: expandToFullWidth ? 1 : 0.995 }
            : { opacity: 0, y: 35, scale: 0.98 }
        }
        transition={{ ...layoutSpring, duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
        className={`relative mx-auto w-full ${expandToFullWidth ? 'max-w-none' : 'max-w-xl'}`}
      >
        <div
          className={`pointer-events-none absolute -z-10 rounded-[2rem] bg-accent/18 blur-3xl transition-all duration-700 ${
            expandToFullWidth ? '-inset-8' : '-inset-5'
          }`}
        />
        {chatCard}
      </motion.div>
    )
  }

  return (
    <section id="chat" ref={sectionRef} className="relative z-10 px-6 pb-28 pt-12 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-2xl"
      >
        {chatCard}
        <p className="mt-4 text-center font-mono text-[10px] text-dark-500">
          {copy.connected}
        </p>
      </motion.div>
    </section>
  )
}
