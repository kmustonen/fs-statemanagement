import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ContextProvider } from './NotificationContext.jsx'

import App from './App.jsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={queryClient}>
    <ContextProvider>
      <App />
    </ContextProvider>
  </QueryClientProvider>
)