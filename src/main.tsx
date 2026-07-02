import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
})

console.log(
  '%c🚀 Olá! Aqui é o Felipe Urbanek! %c\n\nEu sabia que você viria olhar o console! 👀\n%cDeixei a arquitetura desta Pokédex redonda, performática e escalável. Utilizei React Query, Zustand, GSAP e Tailwind para garantir um código de alto nível e uma UX impecável.\n\nMuito obrigado pela oportunidade! Espero que goste do resultado tanto quanto eu curti construir! ⚡',
  'color: #FFF; background: linear-gradient(to right, #173EA5, #3B4CCA); font-size: 20px; font-weight: 900; padding: 4px 12px; border-radius: 8px;',
  'color: #FFCB05; font-size: 16px; font-weight: bold; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);',
  'color: #4ade80; font-size: 14px; line-height: 1.6; font-weight: 600; text-shadow: 1px 1px 2px rgba(0,0,0,0.8);'
)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
        <ToastContainer
          position="bottom-center"
          autoClose={2500}
          hideProgressBar
          newestOnTop
          closeButton={false}
          toastClassName="!mb-24 !rounded-2xl !bg-gray-900 !text-white !font-bold !shadow-2xl !border !border-gray-800"
        />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
