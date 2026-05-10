import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800">🍽️ Daily Menu Voting</h1>
          <div></div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center text-white">
          <h2 className="text-5xl font-bold mb-6">Welcome to Daily Menu Voting</h2>
          <p className="text-2xl mb-8 leading-relaxed">
            Where restaurants post menu items and employees vote on their favorites.
          </p>
          <p className="text-xl mb-12">
            Easy voting for Breakfast 🌅, Lunch 🍽️, and Dinner 🌙
          </p>

          {/* Two Option Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            {/* Admin Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">👨‍💼 Admin</h3>
              <p className="text-gray-700 mb-6">
                Manage menu items for each meal
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/admin-register')}
                  className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Register as Admin
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className="w-full px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  Admin Login
                </button>
              </div>
            </div>

            {/* User Card */}
            <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">🍽️ User</h3>
              <p className="text-gray-700 mb-6">
                Vote on your favorite menu items
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/user-register')}
                  className="w-full px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Register as User
                </button>
                <button
                  onClick={() => navigate('/user')}
                  className="w-full px-6 py-3 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  User Login
                </button>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="bg-white rounded-lg shadow-lg p-8 mt-12 max-w-2xl mx-auto text-left">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">How It Works</h3>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">1</div>
                <div>
                  <h4 className="font-bold text-gray-800">Admin Posts Items</h4>
                  <p className="text-gray-700">Admins register, login and add menu items for each meal type</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">2</div>
                <div>
                  <h4 className="font-bold text-gray-800">Users Vote</h4>
                  <p className="text-gray-700">Users register, login and vote on their favorite items before deadline</p>
                </div>
              </div>
              <div className="flex items-start">
                <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 mr-4 mt-1">3</div>
                <div>
                  <h4 className="font-bold text-gray-800">See Results</h4>
                  <p className="text-gray-700">Check which item won the most votes for each meal</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
