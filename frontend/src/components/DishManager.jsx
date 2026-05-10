import React, { useState } from 'react'
import { mealAPI } from '../services/api'

const toDateInputValue = (value) => {
  if (!value) return ''
  if (typeof value === 'string' && value.length >= 10) {
    return value.slice(0, 10)
  }
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return ''
  return parsed.toISOString().slice(0, 10)
}

const toDateTimeLocalInputValue = (value) => {
  if (!value) return ''
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return typeof value === 'string' ? value.slice(0, 16) : ''
  }

  const pad = (num) => String(num).padStart(2, '0')
  const year = parsed.getFullYear()
  const month = pad(parsed.getMonth() + 1)
  const day = pad(parsed.getDate())
  const hours = pad(parsed.getHours())
  const minutes = pad(parsed.getMinutes())
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function DishManager({ meals, restaurantId, currentDate, onDataChange }) {
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    description: '',
    mealDate: new Date().toISOString().split('T')[0],
    deadline: ''
  })
  const [error, setError] = useState('')

  const handleAddNew = () => {
    setFormData({ 
      name: '', 
      price: '', 
      description: '',
      mealDate: new Date().toISOString().split('T')[0],
      deadline: ''
    })
    setEditingId(null)
    setShowForm(true)
    setError('')
  }

  const handleEdit = (meal) => {
    setFormData({ 
      name: meal.name, 
      price: meal.price,
      description: meal.description || '',
      mealDate: toDateInputValue(meal.meal_date),
      deadline: toDateTimeLocalInputValue(meal.deadline)
    })
    setEditingId(meal.id)
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const savedDate = formData.mealDate

      if (!formData.name || !formData.price) {
        setError('Name and price are required')
        return
      }

      if (editingId) {
        await mealAPI.update(
          editingId, 
          formData.name, 
          parseFloat(formData.price), 
          formData.description,
          formData.mealDate,
          formData.deadline || null
        )
      } else {
        await mealAPI.create(
          formData.name, 
          parseFloat(formData.price), 
          formData.description || '',
          restaurantId,
          formData.mealDate,
          formData.deadline || null
        )
      }
      setShowForm(false)
      setFormData({ 
        name: '', 
        price: '', 
        description: '',
        mealDate: new Date().toISOString().split('T')[0],
        deadline: ''
      })
      // Refresh using the saved meal date so the current date view stays in sync.
      setTimeout(() => {
        onDataChange(savedDate)
      }, 300)
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save meal')
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal?')) {
      try {
        await mealAPI.delete(id)
        onDataChange(currentDate)
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to delete meal')
      }
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
      <button
        onClick={handleAddNew}
        className="mb-6 bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-semibold w-full sm:w-auto"
      >
        + Add Meal
      </button>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
          {error}
        </div>
      )}

      {showForm && (
        <div className="mb-8 p-4 sm:p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-bold mb-4">
            {editingId ? 'Edit Meal' : 'Add New Meal'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Paneer Tikka Masala"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (₹)
                </label>
                <input
                  type="number"
                  min="10"
                  max="50000"
                  step="10"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="e.g., 150"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={formData.mealDate}
                  onChange={(e) => setFormData({ ...formData, mealDate: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <input
                type="text"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="e.g breakfast, lunch or dinner"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Voting Deadline (Optional)
              </label>
              <input
                type="datetime-local"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">Users can change votes before this deadline</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition w-full sm:w-auto"
              >
                Save Meal
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500 transition w-full sm:w-auto"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {meals && meals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200 hover:shadow-lg transition"
            >
              <h3 className="text-lg font-bold text-gray-800 mb-2">{meal.name}</h3>
              
              {meal.description && (
                <p className="text-sm text-gray-600 mb-2">{meal.description}</p>
              )}
              
              <div className="space-y-2 mb-4 text-sm">
                <p className="text-gray-700">
                  <span className="font-semibold">₹{meal.price}</span>
                </p>
                <p className="text-gray-600">
                  📅 {new Date(meal.meal_date).toLocaleDateString()}
                </p>
                {meal.deadline && (
                  <p className="text-red-600 font-semibold">
                    ⏰ Deadline: {new Date(meal.deadline).toLocaleString()}
                  </p>
                )}
                {meal.vote_count !== undefined && (
                  <div className="bg-white rounded p-2">
                    <p className="text-center font-bold text-green-600">
                      {meal.vote_count} {meal.vote_count === 1 ? 'vote' : 'votes'}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleDelete(meal.id)}
                  className="w-full text-red-600 hover:text-red-800 font-semibold py-2 px-3 bg-red-100 rounded hover:bg-red-200 transition"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No meals added yet. Create your first meal!</p>
        </div>
      )}
    </div>
  )
}

export default DishManager
