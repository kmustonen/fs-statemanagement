import { useActions } from '../store'

const Filter = () => {
  const actions = useActions()

  const handleChange = (e) => {
    actions.setFilter(e.target.value)
  }

  const style = {
    marginBottom: 10
  }

  return (
    <div style={style}>
      filter <input onChange={handleChange} data-testid="filter" />
    </div>
  )
}

export default Filter
