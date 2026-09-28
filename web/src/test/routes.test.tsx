import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from '../App'
import { POST_LIST } from '../data/posts'
import { projects } from '../data/projects'

function renderAt(path: string) {
  window.history.pushState({}, '', path)
  return render(<App />)
}

const pageTitle = () => screen.getByRole('heading', { level: 1 })

describe('each route renders its own page', () => {
  it.each([
    ['/', /Gabriel\s*Gonçalves/],
    ['/posts', /^Posts$/],
    ['/Posts', /^Posts$/],
    ['/project/homelab-pessoal', /Personal Homelab/],
    ['/project/hirematch-ai', /HireMatch AI/],
    ['/post/cdn-cloudfront', /How I use AWS CDN/],
    ['/post/cicd-portfolio', /How I ship this portfolio with CI\/CD/],
  ])('%s', (path, title) => {
    renderAt(path)
    expect(pageTitle()).toHaveTextContent(title)
  })
})

describe('links point to the right pages', () => {
  it('top navigation on the landing uses in-page anchors and /posts', () => {
    renderAt('/')
    const nav = within(screen.getAllByRole('navigation')[0])
    expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '#about')
    expect(nav.getByRole('link', { name: 'Experience' })).toHaveAttribute('href', '#experience')
    expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '#projects')
    expect(nav.getByRole('link', { name: 'Posts' })).toHaveAttribute('href', '/posts')
    expect(nav.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '#contact')
  })

  it('top navigation on a subpage returns to the landing sections', () => {
    renderAt('/posts')
    const nav = within(screen.getAllByRole('navigation')[0])
    expect(nav.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/#about')
    expect(nav.getByRole('link', { name: 'Projects' })).toHaveAttribute('href', '/#projects')
    expect(nav.getByRole('link', { name: 'Posts' })).toHaveAttribute('aria-current', 'page')
  })

  it('every project on the landing links to its case study', () => {
    renderAt('/')
    for (const project of projects) {
      const hrefs = screen.getAllByRole('link').map((link) => link.getAttribute('href'))
      expect(hrefs).toContain(`/project/${project.slug}`)
    }
  })

  it('the posts band links to the posts index and to each post', () => {
    renderAt('/')
    const band = within(document.getElementById('posts')!)
    const hrefs = band.getAllByRole('link').map((link) => link.getAttribute('href'))
    expect(hrefs).toContain('/posts')
    for (const post of POST_LIST) {
      expect(hrefs).toContain(`/post/${post.slug}`)
    }
  })

  it('post pages link back to the posts band', () => {
    renderAt('/post/cicd-portfolio')
    const backLinks = screen.getAllByRole('link', { name: /Back to portfolio/ })
    expect(backLinks.length).toBeGreaterThan(0)
    for (const link of backLinks) expect(link).toHaveAttribute('href', '/#posts')
  })
})
