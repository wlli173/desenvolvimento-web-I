// frontend/src/App.jsx
import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './contexts/ThemeContext'      // << ADICIONADO
import { AuthProvider } from './contexts/AuthContext'
import PrivateRoute from './components/PrivateRoute'
import Header from './components/Header'
import Login from './pages/Login'
import Register from './pages/Register'
import Home from './pages/Home'
import Livros from './pages/Livros'
import Favoritos from './pages/Favoritos'
import Reviews from './pages/ReviewsPage'
import './App.css'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
                <Route path="/livros" element={<PrivateRoute><Livros /></PrivateRoute>} />
                <Route path="/favoritos" element={<PrivateRoute><Favoritos /></PrivateRoute>} />
                <Route path="/reviews" element={<PrivateRoute><Reviews /></PrivateRoute>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
