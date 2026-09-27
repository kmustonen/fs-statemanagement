import { beforeEach, describe, expect, it, vi } from 'vitest'
import anecdoteService from './services/anecdotes'
import useAnecdoteStore from './store'

vi.mock('./services/anecdotes')

const anecdotesFromBackend = [
  {
    content: 'If it hurts, do it more often',
    id: '47145',
    votes: 0
  },
  {
    content: 'Adding manpower to a late software project makes it later!',
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
})