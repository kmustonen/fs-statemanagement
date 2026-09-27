import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

import anecdoteService from '../services/anecdotes'
import useAnecdoteStore from '../store'
import { useAnecdotes, useActions } from '../store'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    update: vi.fn(),
  }
}))

const anecdotesFromBackend = [
  {
    content: 'If it hurts, do it more often',
    id: '47145',
    votes: 0
  },
  {
    content: 'Adding manpower to a late software project makes it later!',
    id: '21149',
    votes: 5
  },
  {
    content: 'Adding manpower to a late software project makes it often!',
    id: '21149',
    votes: 1
  }
]

beforeEach(() => {
  vi.resetAllMocks()
  useAnecdoteStore.setState({ anecdotes: [], filter: '' })
})

describe('anecdote store', () => {
  it('anecdotes state is initialized as empty', () => {
    expect(useAnecdoteStore.getState().anecdotes).toStrictEqual([])
  })

  it('anecdotes state is initialized with the anecdotes from the backend', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotesFromBackend)

    await useAnecdoteStore.getState().actions.initialize()

    expect(useAnecdoteStore.getState().anecdotes).toStrictEqual(anecdotesFromBackend)
    expect(anecdoteService.getAll).toHaveBeenCalledTimes(1)
  })

  it('anecdotes returns anecdotes sorted by votes', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotesFromBackend)
    await useAnecdoteStore.getState().actions.initialize()

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toStrictEqual(anecdotesFromBackend.toSorted((a, b) => b.votes - a.votes))
  })

  it('anecdotes returns ancdotes matching the filter', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotesFromBackend)
    await useAnecdoteStore.getState().actions.initialize()
    await useAnecdoteStore.getState().actions.setFilter('Adding')

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toStrictEqual(anecdotesFromBackend.filter((anecdote) => anecdote.content.includes('Adding')))
  })

  it('voting increases votes of an anecdote', async () => {
    const anecdote = anecdotesFromBackend[0]
    useAnecdoteStore.setState({ anecdotes: [anecdote] })
    anecdoteService.update.mockResolvedValue({ ...anecdote, votes: anecdote.votes + 1 })

    const { result } = renderHook(() => useActions())

    await act(async () => {
      await result.current.vote(anecdote.id)
    })

    const { result: anecdotesResult } = renderHook(() => useAnecdotes())
    expect(anecdotesResult.current[0].votes).toBe(anecdote.votes + 1)
  })
})
