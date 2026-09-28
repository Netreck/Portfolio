import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it, vi } from 'vitest'
import QuestionPlane from '../components/concreto/QuestionPlane'

// The chatbot backend is not under test: fetch is replaced with a canned reply.
function mockFetch(response: () => Promise<Response>) {
  const fetchMock = vi.fn(response)
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('asking a short question', () => {
  it('shows the question, sends it to /rag/chat and shows the answer', async () => {
    const fetchMock = mockFetch(async () =>
      new Response(JSON.stringify({ answer: 'I work at Bank of America.', sources: [] }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    )
    const user = userEvent.setup()
    render(<QuestionPlane language="en" />)

    await user.type(screen.getByRole('textbox'), 'Where do you work?{Enter}')

    expect(await screen.findByRole('heading', { name: 'Where do you work?' })).toBeInTheDocument()
    expect(await screen.findByText('I work at Bank of America.')).toBeInTheDocument()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit]
    expect(url).toMatch(/\/rag\/chat$/)
    expect(init.method).toBe('POST')
    expect(JSON.parse(String(init.body))).toMatchObject({ message: 'Where do you work?', language: 'en' })
  })

  it('a suggested question can be asked with one click', async () => {
    const fetchMock = mockFetch(async () => new Response(JSON.stringify({ answer: 'Two projects.', sources: [] }), { status: 200 }))
    const user = userEvent.setup()
    render(<QuestionPlane language="en" />)

    await user.click(screen.getByRole('button', { name: 'What are your main personal projects?' }))

    expect(await screen.findByText('Two projects.')).toBeInTheDocument()
    expect(JSON.parse(String((fetchMock.mock.calls[0] as unknown as [string, RequestInit])[1].body)).message).toBe(
      'What are your main personal projects?',
    )
  })

  it('tells the visitor the chatbot is offline when the request fails', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    mockFetch(async () => {
      throw new Error('network down')
    })
    const user = userEvent.setup()
    render(<QuestionPlane language="en" />)

    await user.type(screen.getByRole('textbox'), 'Hi{Enter}')

    expect(await screen.findByRole('alert')).toHaveTextContent('The chatbot is offline right now')
    expect(screen.getByRole('button', { name: 'Try again' })).toBeInTheDocument()
  })
})
