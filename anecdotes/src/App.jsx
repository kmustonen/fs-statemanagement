import { useEffect } from 'react'

import AnecdoteForm from './components/AnecdoteForm'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import { useActions } from './store.js'
import anecdoteService from './services/anecdotes'


const App = () => {
  const { initialize } = useActions()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
