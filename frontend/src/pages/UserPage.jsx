import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI, mealAPI, voteAPI } from '../services/api';

const COLLEGES = ['VIT College', 'VIIT College', 'PUCT College', 'COEP College', 'Cummins College'];

export default function UserPage() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Location selection state
  const [showLocationSelection, setShowLocationSelection] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState('');

  // Meal voting state
  const [meals, setMeals] = useState([]);
  const [results, setResults] = useState([]);
  const [hasVoted, setHasVoted] = useState(false);
  const [userVote, setUserVote] = useState(null);
  const [activeTab, setActiveTab] = useState('meals');

  // Check if already logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.getCurrentUser();
        if (response.data && response.data.role === 'ROLE_USER') {
          setUser(response.data);
          setIsLoggedIn(true);
          setShowLocationSelection(true);
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
      
      if (response.data.user && response.data.user.role === 'ROLE_USER') {
        setUser(response.data.user);
        setIsLoggedIn(true);
        setShowLocationSelection(true);
        setEmail('');
        setPassword('');
      } else if (response.data.user && response.data.user.role === 'ROLE_ADMIN') {
        setLoginError('❌ This account is for admin. Use Admin Login instead.');
      } else {
        setLoginError('❌ Login failed');
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

  const handleLocationSelect = async (location) => {
    setSelectedLocation(location);
    setShowLocationSelection(false);
    await fetchMeals(location);
  };

  const fetchMeals = async (location) => {
    try {
      setLoading(true);
      setError('');
      
      const [mealsRes, resultsRes, votedRes] = await Promise.all([
        mealAPI.getByLocation(location),
        voteAPI.getResultsByLocation(location),
        voteAPI.checkVotedToday()
      ]);
      
      setMeals(mealsRes.data);
      setResults(resultsRes.data);
      setHasVoted(votedRes.data.hasVoted);
      setUserVote(votedRes.data.vote);
    } catch (err) {
      setError('Failed to load meals: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (mealId) => {
    try {
      setSuccess('');
      await voteAPI.submitVote(mealId);
      setSuccess('✅ Vote submitted successfully!');
      setHasVoted(true);
      
      // Update vote state and refresh results
      const meal = meals.find(m => m.id === mealId);
      setUserVote({ meal_id: mealId, meal_name: meal?.name });
      
      // Refresh results
      const resultsRes = await voteAPI.getResultsByLocation(selectedLocation);
      setResults(resultsRes.data);
      
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to submit vote: ' + err.message);
    }
  };

  const handleLogout = async () => {
    try {
      await authAPI.logout();
      setIsLoggedIn(false);
      setUser(null);
      setEmail('');
      setPassword('');
      setSelectedLocation('');
      setShowLocationSelection(false);
      setMeals([]);
      setResults([]);
      setHasVoted(false);
      setUserVote(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // LOGIN SCREEN
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">🗳️ User Voting System</h2>
            
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
                  placeholder="user@example.com"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
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
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition"
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="text-center mt-6 space-y-3">
              <p className="text-gray-700 text-sm">
                Don't have an account?{' '}
                <button
                  onClick={() => navigate('/user-register')}
                  className="text-green-600 font-semibold hover:text-green-700"
                >
                  Register here
                </button>
              </p>
              <p className="text-gray-700 text-sm">
                Are you an admin?{' '}
                <button
                  onClick={() => navigate('/admin')}
                  className="text-blue-600 font-semibold hover:text-blue-700"
                >
                  Admin Login
                </button>
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full px-4 py-2 bg-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-400 transition"
              >
                ← Back to Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // LOCATION SELECTION
  if (showLocationSelection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">🏫 Select Your College</h2>
            <p className="text-center text-gray-600 mb-8">Choose your college location to see available meals</p>
            
            <div className="space-y-3">
              {COLLEGES.map(college => (
                <button
                  key={college}
                  onClick={() => handleLocationSelect(college)}
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg font-semibold hover:from-green-600 hover:to-blue-600 transition"
                >
                  {college}
                </button>
              ))}
            </div>

            <button
              onClick={handleLogout}
              className="w-full mt-6 px-4 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  }

  // MAIN DASHBOARD
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🗳️ Voting System</h1>
            <p className="text-green-100 mt-1">Welcome, {user?.name || user?.email}</p>
            <p className="text-green-200 text-sm">📍 {selectedLocation}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={() => setShowLocationSelection(true)}
              className="block bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Change Location
            </button>
            <button
              onClick={handleLogout}
              className="block bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="max-w-7xl mx-auto mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      {success && (
        <div className="max-w-7xl mx-auto mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          {success}
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto flex">
          {['meals', 'results'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-4 font-semibold transition ${
                activeTab === tab
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {tab === 'meals' && '🍽️ Today\'s Meals'}
              {tab === 'results' && '📊 Voting Results'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        {loading && <p className="text-center text-gray-600 text-lg">Loading...</p>}

        {/* Meals Tab */}
        {activeTab === 'meals' && !loading && (
          <div>
            {hasVoted ? (
              <div className="bg-green-50 rounded-lg shadow-lg p-8 text-center border-2 border-green-200">
                <div className="text-5xl mb-4">✅</div>
                <h2 className="text-2xl font-bold text-green-800 mb-2">You already voted today!</h2>
                <p className="text-green-700 mb-4">
                  Your vote is for: <strong>{userVote?.meal_name || 'a meal'}</strong>
                </p>
                <p className="text-green-600">You can change your vote anytime</p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-6">Choose Your Favorite Meal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {meals.map(meal => (
                    <div
                      key={meal.id}
                      className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition border-2 border-gray-100 hover:border-green-500"
                    >
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{meal.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">🏪 {meal.restaurant_name}</p>
                      <p className="text-sm text-gray-600 mb-4">{meal.description}</p>
                      <div className="flex justify-between items-center mb-4">
                        <p className="text-2xl font-bold text-green-600">₹{meal.price}</p>
                        {meal.deadline && (
                          <p className="text-xs text-red-600 font-semibold">
                            ⏰ {new Date(meal.deadline).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                      {meal.vote_count && (
                        <p className="text-sm text-gray-500 mb-3">
                          {meal.vote_count} {meal.vote_count === 1 ? 'vote' : 'votes'}
                        </p>
                      )}
                      <button
                        onClick={() => handleVote(meal.id)}
                        className="w-full px-4 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition"
                      >
                        Vote for {meal.name}
                      </button>
                    </div>
                  ))}
                </div>
                {meals.length === 0 && (
                  <div className="text-center py-12 bg-gray-100 rounded-lg">
                    <p className="text-gray-600 text-lg">No meals available for today</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && !loading && (
          <div>
            <h2 className="text-2xl font-bold mb-6">Today's Voting Results</h2>
            {results.length > 0 ? (
              <div className="space-y-4">
                {results.map((result, idx) => (
                  <div key={result.id} className="bg-white rounded-lg shadow p-6">
                    <div className="flex justify-between items-center mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          #{idx + 1} {result.name}
                        </h3>
                        <p className="text-sm text-gray-600">🏪 {result.restaurant_name}</p>
                      </div>
                      <span className="text-3xl font-bold text-green-600">
                        {result.vote_count} {result.vote_count === 1 ? 'vote' : 'votes'}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-green-600 h-4 rounded-full transition-all duration-500"
                        style={{
                          width: `${results.length > 0 ? (result.vote_count / Math.max(...results.map(r => r.vote_count), 1)) * 100 : 0}%`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-gray-100 rounded-lg">
                <p className="text-gray-600 text-lg">No votes yet. Be the first to vote!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
