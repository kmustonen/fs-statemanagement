import { beforeEach, describe, expect, it, vi } from 'vitest'
import { renderHook } from '@testing-library/react'

import anecdoteService from '../services/anecdotes'
import useAnecdoteStore from '../store'
import { useAnecdotes } from '../store'

vi.mock('../services/anecdotes')

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

  it('anecdotes returns only anecdotes matching the filter', async () => {
    anecdoteService.getAll.mockResolvedValue(anecdotesFromBackend)
    await useAnecdoteStore.getState().actions.initialize()
    await useAnecdoteStore.getState().actions.setFilter('Adding')

    const { result } = renderHook(() => useAnecdotes())

    expect(result.current).toStrictEqual(anecdotesFromBackend.filter((anecdote) => anecdote.content.includes('Adding')))
  })
})