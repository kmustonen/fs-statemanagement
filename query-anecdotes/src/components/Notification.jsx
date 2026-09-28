import useNotify from '../hooks/useNotify'

const Notification = () => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const { message } = useNotify()

  return (message && <div data-testid="notification" style={style}>{message}</div>)
}

export default Notification
