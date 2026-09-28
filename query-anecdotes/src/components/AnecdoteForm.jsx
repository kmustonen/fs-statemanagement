const AnecdoteForm = ({ addAnecdote }) => {
  const onCreate = async (e) => {
    e.preventDefault()
    const content = e.target.anecdote.value
    e.target.reset()
    addAnecdote(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm