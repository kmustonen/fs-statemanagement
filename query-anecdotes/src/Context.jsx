import { createContext, useState } from 'react'

const Context = createContext()

export default Context

let timeout = null

export const ContextProvider = (props) => {
  const [message, setMessage] = useState(null)

  const notify = async (message) => {
    clearTimeout(timeout)
    setMessage(message)
    timeout = setTimeout(() => setMessage(null), 5000)
  }

  return (
    <Context.Provider value={{ notify, message }}>
      {props.children}
    </Context.Provider>
  )
}