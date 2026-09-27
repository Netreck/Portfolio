import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'
import { ArrowRight, Pause, Play } from 'lucide-react'
import type { Language } from '../../data/projects'
import { POSTS, POSTS_COPY } from '../../data/posts'

// A band of small write-ups below the projects. It advances one item at a time in
// whole steps (hold, then snap), pauses on hover, focus or the pause button, and
// becomes a static list under reduced motion. Only the first copy of each post is
// focusable; the repeats exist so the loop never shows a gap.
const MIN_ITEMS = 4
const HOLD_MS = 3200

export default function PostsTicker({ language }: { language: Language }) {
  const t = POSTS_COPY[language]
  const reduceMotion = useReducedMotion()
  const base = Array.from({ length: Math.max(1, Math.ceil(MIN_ITEMS / POSTS.length)) }, () => POSTS).flat()
  const loop = reduceMotion ? POSTS : [...base, ...base]

  const [index, setIndex] = useState(0)
  const [animate, setAnimate] = useState(true)
  const [paused, setPaused] = useState(false)
  const [hovered, setHovered] = useState(false)
  const [focused, setFocused] = useState(false)
  const [offset, setOffset] = useState(0)
  const itemRefs = useRef<(HTMLLIElement | null)[]>([])

  const halted = reduceMotion || paused || hovered || focused

  useEffect(() => {
    if (halted) return
    const timer = window.setInterval(() => {
      setAnimate(true)
      setIndex((current) => current + 1)
    }, HOLD_MS)
    return () => window.clearInterval(timer)
  }, [halted])

  // Past the first copy, jump back to the matching item without a transition.
  useEffect(() => {
    if (index < base.length) return
    const reset = window.setTimeout(() => {
      setAnimate(false)
      setIndex(index - base.length)
    }, 450)
    return () => window.clearTimeout(reset)
  }, [index, base.length])

  useEffect(() => {
    setOffset(itemRefs.current[index]?.offsetLeft ?? 0)
  }, [index, language])

  return (
    <section id="posts" aria-label={t.label} className="flex scroll-mt-32 border-y-2 border-ink bg-paper">
      <div className="flex shrink-0 items-stretch bg-ink text-paper">
        <h2 className="flex items-center gap-2.5 pl-4 pr-3 text-[17px] font-bold sm:pl-6">
          <span aria-hidden="true" className="h-3 w-3 bg-signal" />
          {t.label}
        </h2>
        {!reduceMotion && (
          <button
            type="button"
            onClick={() => setPaused((value) => !value)}
            aria-pressed={paused}
            aria-label={paused ? t.play : t.pause}
            className="on-ink flex w-12 cursor-pointer items-center justify-center border-l-2 border-paper hover:bg-signal hover:text-ink"
          >
            {paused ? <Play size={16} aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
          </button>
        )}
      </div>

      <div
        className={`min-w-0 flex-1 ${reduceMotion ? 'overflow-x-auto' : 'overflow-hidden'}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <ul
          className="flex w-max"
          style={
            reduceMotion
              ? undefined
              : {
                  transform: `translateX(-${offset}px)`,
                  transition: animate ? 'transform 420ms steps(6, end)' : 'none',
                }
          }
        >
          {loop.map((post, i) => {
            const primary = i < POSTS.length
            return (
              <li
                key={`${post.slug}-${i}`}
                ref={(el) => {
                  itemRefs.current[i] = el
                }}
                aria-hidden={primary ? undefined : true}
                className="flex"
              >
                <a
                  href={`/post/${post.slug}`}
                  tabIndex={primary ? undefined : -1}
                  onFocus={() => {
                    setFocused(true)
                    setAnimate(false)
                    setIndex(i)
                  }}
                  onBlur={() => setFocused(false)}
                  className={`group flex max-w-[calc(100vw-9.5rem)] items-center gap-4 px-5 py-4 text-ink no-underline hover:bg-signal sm:max-w-none sm:px-6 ${
                    reduceMotion && i === loop.length - 1 ? '' : 'border-r-2 border-ink'
                  }`}
                >
                  <span className="line-clamp-2 min-w-0 text-[16px] font-bold leading-tight sm:line-clamp-none sm:whitespace-nowrap sm:text-[17px]">{post.title[language]}</span>
                  <span className="hidden shrink-0 whitespace-nowrap text-[15px] text-ink-soft sm:inline">{post.teaser[language]}</span>
                  <span className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap text-[15px] font-semibold text-cobalt group-hover:text-ink">
                    {t.read}
                    <ArrowRight size={16} aria-hidden="true" />
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
