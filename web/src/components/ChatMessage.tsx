import type { ComponentPropsWithoutRef } from 'react'
import { motion } from 'framer-motion'
import { Bot, User } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface ChatMessageProps {
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
}

function unwrapSingleMarkdownFence(text: string): string {
  const match = text.match(/^\s*```(?:[\w-]+)?\s*([\s\S]*?)\s*```\s*$/)
  return match ? match[1].trim() : text
}

export default function ChatMessage({ role, content, isTyping }: ChatMessageProps) {
  const isBot = role === 'assistant'
  const markdownClass = isBot ? 'text-cream-muted break-words' : 'text-cream break-words'
  const normalizedContent = unwrapSingleMarkdownFence(content)

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
        className={`max-w-[85%] break-words rounded-2xl px-4 py-3 text-sm leading-relaxed ${
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
          <div className={markdownClass}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: (props) => <p {...props} className="mb-2 last:mb-0" />,
                ul: (props) => (
                  <ul {...props} className="mb-2 ml-5 list-disc space-y-1 last:mb-0" />
                ),
                ol: (props) => (
                  <ol {...props} className="mb-2 ml-5 list-decimal space-y-1 last:mb-0" />
                ),
                li: (props) => <li {...props} className="pl-1" />,
                blockquote: (props) => (
                  <blockquote
                    {...props}
                    className="mb-2 border-l-2 border-accent/40 pl-3 italic text-dark-300 last:mb-0"
                  />
                ),
                a: (props) => (
                  <a
                    {...props}
                    target="_blank"
                    rel="noreferrer"
                    className="text-accent underline decoration-accent/60 underline-offset-2 transition-colors hover:text-accent-dim"
                  />
                ),
                pre: (props) => (
                  <pre
                    {...props}
                    className="mb-2 whitespace-pre-wrap break-words bg-transparent p-0 font-body text-sm leading-relaxed last:mb-0"
                  />
                ),
                code: ({ className, children, ...props }: ComponentPropsWithoutRef<'code'>) => {
                  const isCodeBlock = Boolean(className?.includes('language-'))

                  if (isCodeBlock) {
                    return (
                      <code
                        {...props}
                        className={`whitespace-pre-wrap break-words font-body text-inherit ${className ?? ''}`}
                      >
                        {children}
                      </code>
                    )
                  }

                  return (
                    <code
                      {...props}
                      className="break-all rounded-md bg-dark-900/70 px-1.5 py-0.5 font-mono text-[12px] text-accent"
                    >
                      {children}
                    </code>
                  )
                },
              }}
            >
              {normalizedContent}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </motion.div>
  )
}
