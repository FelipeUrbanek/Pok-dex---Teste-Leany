import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Favorites } from './pages/Favorites'
import { Compare } from './pages/Compare'

function App() {
  return (
    <>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/comparar" element={<Compare />} />
        </Route>
      </Routes>
      <ToastContainer 
        position="top-center" 
        autoClose={2500} 
        hideProgressBar 
        toastClassName="!rounded-2xl !bg-white/80 !backdrop-blur-md !text-gray-900 !font-semibold !shadow-2xl !border !border-gray-200"
      />
    </>
  )
}

export default App
