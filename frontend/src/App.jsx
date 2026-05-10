import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import AdminPage from './pages/AdminPage'
import AdminRegister from './pages/AdminRegister'
import UserPage from './pages/UserPage'
import UserRegister from './pages/UserRegister'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/admin-register" element={<AdminRegister />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
