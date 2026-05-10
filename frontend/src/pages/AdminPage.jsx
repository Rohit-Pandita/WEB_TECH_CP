import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, mealAPI } from '../services/api';
import DishManager from '../components/DishManager';

export default function AdminPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [user, setUser] = useState(null);
  
  const [activeTab, setActiveTab] = useState('menu');
  const [meals, setMeals] = useState([]);
  const [activeMealDate, setActiveMealDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (response.data && response.data.role === 'ROLE_ADMIN') {
          setUser(response.data);
          setIsLoggedIn(true);
          fetchData();
        }
      } catch (err) {
        // Not logged in
      }
    };
    checkAuth();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      setLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.data.user && response.data.user.role === 'ROLE_ADMIN') {
        setUser(response.data.user);
        setIsLoggedIn(true);
        setEmail('');
        setPassword('');
        fetchData();
      } else {
        setLoginError('❌ Only hotel owner accounts can access this page');
      }
    } catch (err) {
      if (err.response?.status === 401) {
        setLoginError('❌ Invalid email or password');
      } else {
        setLoginError('❌ Login failed: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      setUser(null);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchData = async (date = activeMealDate) => {
    try {
      setLoading(true);
      setError('');
      const targetDate = date || activeMealDate;
      setActiveMealDate(targetDate);
      const mealsRes = await mealAPI.getOwnerMenu(targetDate);
      setMeals(mealsRes.data || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch menu data');
    } finally {
      setLoading(false);
    }
  };

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center px-4 py-6">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8">Hotel Owner Login</h2>
            
            {loginError && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                {loginError}
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="owner@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoComplete="email"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  autoComplete="current-password"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Logging in...' : 'Login as Owner'}
              </button>
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-700 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/admin-register')}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Register here
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-5 sm:p-6">
        <div className="max-w-7xl mx-auto flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-bold">Hotel Owner Dashboard</h1>
            <p className="text-blue-100 mt-1 break-words">
              {user?.hotelName || user?.name || user?.email}
              {user?.address ? ` - ${user.address}` : ''}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition w-full sm:w-auto"
          >
            Logout
          </button>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex overflow-x-auto">
          {['menu'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 sm:px-6 py-4 font-semibold transition whitespace-nowrap ${
                activeTab === tab
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'menu' && '🍽️ Menu'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {loading && <p className="text-center text-gray-600">Loading...</p>}
        
        {activeTab === 'menu' && (
          <DishManager meals={meals} currentDate={activeMealDate} onDataChange={fetchData} />
        )}
      </div>
    </div>
  );
}
