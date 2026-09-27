import { useAnecdotes, useActions } from '../store'

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const actions = useActions()

  const vote = (id) => {
    actions.vote(id)
  }

  const remove = (id) => {
    actions.remove(id)
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
          {anecdote.votes === 0 && <button onClick={() => remove(anecdote.id)}>delete</button>}
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList
