import { motion } from 'framer-motion'

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' as const }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-dark-950/70 border-b border-dark-700/40"
    >
      <motion.span
        className="font-mono text-sm font-semibold text-accent"
        whileHover={{ scale: 1.05 }}
      >
        {'<dev />'}
      </motion.span>

      <div className="flex items-center gap-1">
        {['About', 'Projects', 'Chat'].map((item, i) => (
          <motion.a
            key={item}
            href={`#${item.toLowerCase()}`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * (i + 1), duration: 0.4, ease: 'easeOut' as const }}
            className="px-3 py-1.5 rounded-lg font-mono text-xs text-cream-muted transition-all duration-300 hover:text-accent hover:bg-accent-glow"
          >
            {item}
          </motion.a>
        ))}
      </div>
    </motion.nav>
  )
}
