
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

import anecdoteService from './services/anecdotes'

/*const anecdotesAtStart = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]*/

let timeout = null

const useNotificationStore = create(devtools((set) => ({
  notification: null,
  actions: {
    setNotification: (notification) => {
      clearTimeout(timeout)
      set({ notification })
      timeout = setTimeout(() => set({ notification: null }), 5000)
    },
  }
})))


const useAnecdoteStore = create(devtools((set, get) => ({
  anecdotes: [],
  filter: '',
  actions: {
    create: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: state.anecdotes.concat(newAnecdote) }))
      useNotificationStore.getState().actions.setNotification(`you created '${newAnecdote.content}'`)
    },
    remove: async id => {
      const anecdote = get().anecdotes.find(anecdote => anecdote.id === id)
      await anecdoteService.remove(id)

      set(state => ({ anecdotes: state.anecdotes.filter(a => a.id !== id) }))
      useNotificationStore.getState().actions.setNotification(`you deleted '${anecdote.content}'`)
    },
    vote: async id => {
      const anecdote = get().anecdotes.find(anecdote => anecdote.id === id)
      const votedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }
      const updatedAnecdote = await anecdoteService.update(id, votedAnecdote)

      set(state => ({ anecdotes: state.anecdotes.map(a => a.id === id ? updatedAnecdote : a) }))
      useNotificationStore.getState().actions.setNotification(`you voted '${anecdote.content}'`)
    },
    setFilter: filter => set({ filter: filter }),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
  }
})))

export const useNotification = () => useNotificationStore((state) => state.notification)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)


export const useActions = () => useAnecdoteStore((state) => state.actions)
export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)

  return anecdotes.filter((anecdote) => anecdote.content.includes(filter))
}

export default useAnecdoteStore
