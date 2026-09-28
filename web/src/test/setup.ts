import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'

// jsdom lacks these browser APIs; the pages use them for motion and scrolling.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return []
  }
}
// Assigned directly (not vi.stubGlobal) so a test's vi.unstubAllGlobals() keeps them.
window.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver

// Report reduced motion so every demo renders its finished, static state.
window.matchMedia = (query: string) =>
  ({
    matches: query.includes('prefers-reduced-motion'),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  }) as MediaQueryList

window.scrollTo = vi.fn() as unknown as typeof window.scrollTo
Element.prototype.scrollTo = vi.fn() as unknown as typeof Element.prototype.scrollTo
Element.prototype.scrollIntoView = vi.fn()

beforeEach(() => {
  window.localStorage.clear()
})

afterEach(() => {
  cleanup()
})
