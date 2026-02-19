import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
}

export default function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  const isBot = role === 'assistant'

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      className={`flex gap-3 ${isBot ? '' : 'flex-row-reverse'}`}
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300, damping: 20 }}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${
          isBot
            ? 'bg-accent/10 text-accent'
            : 'bg-dark-600 text-cream-muted'
        }`}
      >
        {isBot ? <Bot size={15} /> : <User size={15} />}
      </motion.div>

      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isBot
            ? 'rounded-tl-md bg-dark-700/70 text-cream-muted border border-dark-600/50'
            : 'rounded-tr-md bg-accent/10 text-cream border border-accent/15'
        }`}
      >
        {isTyping ? (
          <div className="flex items-center gap-1.5 py-1">
            {[0, 1, 2].map((i) => (
              <motion.span
                key={i}
                className="h-1.5 w-1.5 rounded-full bg-accent"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1, 0.8] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </div>
        ) : (
          content
        )}
      </div>
    </motion.div>
  )
}
