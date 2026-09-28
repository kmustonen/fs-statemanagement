import { useContext } from 'react'
import Context from '../NotificationContext'

const useNotify = () => useContext(Context)

export default useNotify