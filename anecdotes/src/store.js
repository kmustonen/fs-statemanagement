
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

/*const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]*/

const useAnecdoteStore = create((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
    },
    vote: async id => {
      const anecdote = get().anecdotes.find(anecdote => anecdote.id === id)
      const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
      const updatedAnecdote = await anecdoteService.update(id, votedAnecdote)

      set(
        state => ({
          anecdotes: state.anecdotes.map(anecdote =>
            anecdote.id === id ? updatedAnecdote : anecdote
          )
        })
      )
    },
    setFilter: filter => set({ filter: filter }),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
  }
}))

export const useActions = () => useAnecdoteStore((state) => state.actions)

export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  return anecdotes.filter((anecdote) => anecdote.content.includes(filter))
}
