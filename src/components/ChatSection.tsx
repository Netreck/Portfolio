import { useState, useRef, useEffect, type FormEvent } from 'react'
import { motion, useInView } from 'framer-motion'
import { Send, Sparkles } from 'lucide-react'
import ChatMessage from './ChatMessage'

interface Message {
  id: number
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  "What's your experience?",
  'Tell me about your projects',
  'What tech do you use?',
  'Are you available for work?',
]

const MOCK_RESPONSES: Record<string, string> = {
  "what's your experience?":
    "I've been building software for several years, focusing on full-stack web development and AI integrations. I've worked with Python, TypeScript, React, FastAPI, and various cloud platforms. I'm currently studying at UFABC and interning in tech.",
  'tell me about your projects':
    "I've built AI-powered tools, data dashboards, and automation systems. This portfolio itself is a chatbot interface that will soon be powered by a real AI backend! I'm always shipping something new.",
  'what tech do you use?':
    'My core stack is Python + TypeScript. Frontend: React, Tailwind, Framer Motion. Backend: FastAPI. For data & AI: PostgreSQL, LangChain, OpenAI APIs. I deploy with Docker on AWS.',
  'are you available for work?':
    "Yes! I'm open to freelance projects and full-time opportunities. Let's chat about what you're building.",
}

function getMockResponse(input: string): string {
  const lower = input.toLowerCase().trim()
  for (const [key, value] of Object.entries(MOCK_RESPONSES)) {
    if (lower.includes(key.split(' ').slice(0, 3).join(' ').toLowerCase())) {
      return value
    }
  }
  return "Thanks for the message! The AI backend is coming soon — powered by FastAPI and LLMs. Try one of the quick questions to learn more about me!"
}

export default function ChatSection() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: 'assistant',
      content:
        "Hey! I'm a virtual assistant. Ask me about my skills, projects, experience, or anything else!",
    },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || isTyping) return

    setMessages((prev) => [...prev, { id: Date.now(), role: 'user', content: msg }])
    setInput('')
    setIsTyping(true)

    setTimeout(() => {
      setIsTyping(false)
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'assistant', content: getMockResponse(msg) },
      ])
    }, 1000 + Math.random() * 800)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    handleSend()
  }

  return (
    <section id="chat" ref={sectionRef} className="relative z-10 px-6 pb-28 pt-12 md:px-12 lg:px-20">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto w-full max-w-2xl"
      >
        {/* Chat card */}
        <div className="glow-card overflow-hidden rounded-2xl border border-dark-600/60 bg-dark-800/50 backdrop-blur-sm">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-dark-600/40 px-5 py-4">
            <motion.div
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent/10"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' as const }}
            >
              <Sparkles size={16} className="text-accent" />
            </motion.div>
            <div>
              <p className="text-sm font-semibold text-cream">Chat with me</p>
              <div className="flex items-center gap-1.5">
                <span className="animate-pulse-dot h-1.5 w-1.5 rounded-full bg-accent" />
                <span className="font-mono text-[10px] text-accent">Online</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex h-[380px] flex-col gap-4 overflow-y-auto p-5">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} role={msg.role} content={msg.content} />
            ))}
            {isTyping && <ChatMessage role="assistant" content="" isTyping />}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion chips */}
          <div className="flex flex-wrap gap-2 border-t border-dark-600/30 bg-dark-900/30 px-5 py-3">
            {SUGGESTIONS.map((s) => (
              <motion.button
                key={s}
                onClick={() => handleSend(s)}
                disabled={isTyping}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="cursor-pointer rounded-full border border-dark-600/60 bg-dark-700/40 px-3 py-1.5 font-mono text-[11px] text-cream-muted transition-all duration-200 hover:border-accent/30 hover:text-accent disabled:opacity-30 disabled:cursor-not-allowed"
              >
                {s}
              </motion.button>
            ))}
          </div>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-3 border-t border-dark-600/40 px-5 py-4"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              disabled={isTyping}
              className="flex-1 bg-transparent text-sm text-cream placeholder:text-dark-400 outline-none disabled:opacity-40"
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || isTyping}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-accent text-dark-950 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              aria-label="Send"
            >
              <Send size={15} />
            </motion.button>
          </form>
        </div>

        <p className="mt-4 text-center font-mono text-[10px] text-dark-500">
          AI backend powered by FastAPI — coming soon
        </p>
      </motion.div>
    </section>
  )
}
