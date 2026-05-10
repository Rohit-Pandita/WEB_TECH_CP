import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Navbar({ user, onLogout, isAdmin = false }) {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-2xl font-bold text-indigo-600">
            🗳️ Voting System
          </Link>
          
          <div className="flex items-center gap-6">
            <div className="text-gray-700">
              <span className="font-semibold">{user?.username}</span>
              {isAdmin && <span className="ml-2 bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">Admin</span>}
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition font-semibold"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
