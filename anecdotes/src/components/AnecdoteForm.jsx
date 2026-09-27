import { useActions } from '../store'

const AnecdoteForm = () => {
  const actions = useActions()

  const create = (anecdote) => {
    actions.create(anecdote)
  }

  const submit = (e) => {
    e.preventDefault()
    const anecdote = e.target.elements.anecdote.value
    e.target.reset()
    create(anecdote)
  }

  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={submit}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
