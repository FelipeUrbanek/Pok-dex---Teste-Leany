import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { Home } from './pages/Home'
import { Favorites } from './pages/Favorites'
import { Compare } from './pages/Compare'
import { Preloader } from './components/Preloader'

function App() {
  return (
    <>
      <Preloader />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/favoritos" element={<Favorites />} />
          <Route path="/comparar" element={<Compare />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
