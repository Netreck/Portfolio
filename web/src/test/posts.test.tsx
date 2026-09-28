import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { POST_LIST } from '../data/posts'

describe('posts are loaded', () => {
  it('the list has posts with unique slugs and text in both languages', () => {
    expect(POST_LIST.length).toBeGreaterThan(0)
    expect(new Set(POST_LIST.map((post) => post.slug)).size).toBe(POST_LIST.length)
    for (const post of POST_LIST) {
      for (const language of ['en', 'br'] as const) {
        expect(post.title[language].trim()).not.toBe('')
        expect(post.teaser[language].trim()).not.toBe('')
      }
    }
  })

  it('the /posts page lists every post, in order, with a link to it', () => {
    window.history.pushState({}, '', '/posts')
    render(<App />)
    const items = within(screen.getByRole('main')).getAllByRole('listitem')
    expect(items).toHaveLength(POST_LIST.length)
    POST_LIST.forEach((post, index) => {
      const link = within(items[index]).getByRole('link')
      expect(link).toHaveAttribute('href', `/post/${post.slug}`)
      expect(link).toHaveTextContent(post.title.en)
    })
  })

  it('every listed post opens a page with its own title', () => {
    for (const post of POST_LIST) {
      window.history.pushState({}, '', `/post/${post.slug}`)
      const { unmount } = render(<App />)
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(post.title.en)
      unmount()
    }
  })

  it('the posts show in Portuguese when PT is selected', () => {
    window.localStorage.setItem('portfolio_lang', 'br')
    window.history.pushState({}, '', '/posts')
    render(<App />)
    for (const post of POST_LIST) {
      expect(screen.getByText(post.title.br)).toBeInTheDocument()
    }
  })
})
