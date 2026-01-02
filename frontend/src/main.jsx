import React,{ StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Authprovider from './features/Authentication/components/Authprovider.jsx'
/* import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 10, // 10 minutes
    },
  },
});



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
      
        <Authprovider>
            <App />
        </Authprovider>
{/*         <ReactQueryDevtools initialIsOpen={false} />
 */}      </BrowserRouter>
    </QueryClientProvider>
    
  </StrictMode>
)
