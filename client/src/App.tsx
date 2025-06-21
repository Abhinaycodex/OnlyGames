import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AnimatedBackground from './components/AnimatedBackground'
import Home from './pages/Home'
import Explore from './pages/Explore'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import { Toaster } from './components/Toaster'
import Avatar from './pages/Avatar'
import { LogOut } from 'lucide-react'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background flex flex-col relative">
              <AnimatedBackground />
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-grow relative z-10">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/explore" element={<Explore />} />
                  <Route path="/profile/:id" element={<Profile />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/avatar" element={<Avatar />} />
                  <Route path="/creator-dashboard" element={<Dashboard />} />
                  <Route path="/creator-dashboard/:section" element={<Dashboard />} />
                  <Route path="/creator-dashboard/:section/:subSection" element={<Dashboard />} />
                  <Route path="*" element={<div>404 Not Found</div>} />

                </Routes>
              </main>
              <Footer />
            </div>
            <Toaster />
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App
