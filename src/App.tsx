import './App.css'
import { Button } from './components/ui/button'
import { Routes, Route } from 'react-router-dom'
import { Navbar } from './components/Navbar'
import News from './pages/News'
import Login from './pages/Login'
import { QueryClientProvider } from 'react-query'
import { QueryClient } from 'react-query'

function App() {
  const queryClient = new QueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      <Navbar />
      <div className="flex flex-col min-h-svh">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/news" element={<News />} />
          <Route path="/" element={
            <div className="flex items-center justify-center flex-1">
              <Button>Click me</Button>
            </div>
          } />
        </Routes>
      </div>
    </QueryClientProvider>
  )
}

export default App
