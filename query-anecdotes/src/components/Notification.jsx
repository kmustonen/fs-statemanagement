import useNotificationContext from '../hooks/useContext'

const Notification = () => {
  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 5,
  }

  const { message } = useNotificationContext()

  return (message && <div data-testid="notification" style={style}>{message}</div>)
}

export default Notification
