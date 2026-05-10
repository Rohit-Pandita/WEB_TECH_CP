import React, { useState } from 'react'
import { restaurantAPI } from '../services/api'

const COLLEGES = ['VIT College', 'VIIT College', 'PUCT College', 'COEP College', 'Cummins College']

function RestaurantManager({ restaurants, onDataChange }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', location: '' })
  const [error, setError] = useState('')

  const handleAddNew = () => {
    setFormData({ name: '', location: '' })
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  const handleEdit = (restaurant) => {
    setFormData({ name: restaurant.name, location: restaurant.location || '' })
    setEditingId(restaurant.id)
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (!formData.name.trim()) {
        setError('Restaurant name is required')
        return
      }
      
      if (editingId) {
        await restaurantAPI.update(editingId, formData.name, formData.location)
      } else {
        await restaurantAPI.create(formData.name, formData.location)
      }
      setShowForm(false)
      onDataChange()
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save restaurant')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this restaurant?')) {
      try {
        await restaurantAPI.delete(id)
        onDataChange()
      } catch (err) {
        setError('Failed to delete restaurant')
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <button
        onClick={handleAddNew}
        className="mb-6 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition font-semibold"
      >
        + Add Restaurant
      </button>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? 'Edit Restaurant' : 'Add New Restaurant'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Restaurant Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Pizza Hut, KFC, Subway"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                College Location
              </label>
              <select
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Select College Location</option>
                {COLLEGES.map(college => (
                  <option key={college} value={college}>{college}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {restaurants.map((restaurant) => (
          <div key={restaurant.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-indigo-100 hover:shadow-lg transition">
            <h3 className="text-lg font-bold text-gray-800 mb-2">{restaurant.name}</h3>
            {restaurant.location && (
              <p className="text-sm text-gray-600 mb-4">📍 {restaurant.location}</p>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => handleEdit(restaurant)}
                className="flex-1 text-blue-600 hover:text-blue-800 font-semibold py-2 px-3 bg-blue-100 rounded hover:bg-blue-200 transition"
              >
                ✎ Edit
              </button>
              <button
                onClick={() => handleDelete(restaurant.id)}
                className="flex-1 text-red-600 hover:text-red-800 font-semibold py-2 px-3 bg-red-100 rounded hover:bg-red-200 transition"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {restaurants.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No restaurants found. Add one to get started!</p>
        </div>
      )}
    </div>
  )
}

export default RestaurantManager
