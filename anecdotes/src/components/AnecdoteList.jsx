import { useAnecdotes, useActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const actions = useActions()

  const vote = (id) => {
    actions.vote(id)
  }

  return (
    <div>
      {anecdotes.toSorted((a, b) => b.votes - a.votes).map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
