
import React, { useState } from 'react'
import useHabits from '../hooks/useHabits'
import api from '../services/api'

function HabitForm({
  categories = [],
  onAddCategory,
  isAddingCategory
}) {
  const { setHabits } = useHabits()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('')
  const[dailyTarget,setDailyTarget]=useState(1)
  // New category states
  const [showCategoryInput, setShowCategoryInput] = useState(false)
  const [newCategory, setNewCategory] = useState('')

  
  // Add Habit
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (
  !Number.isInteger(Number(dailyTarget)) ||
  Number(dailyTarget) < 1
) {
  alert('Please enter a valid session target')
  return
}

    if (!name.trim() || !category) {
      alert('Please enter habit name and select a category')
      return
    }

    const newHabit = {
      name: name.trim(),
      description,
      category,
      dailyTarget:Number(dailyTarget),
      completed: false,
    }

    try {
      const response = await api.post('/habits', newHabit)

      setHabits((previousHabits) => [
        ...previousHabits,
        response.data,
      ])

      setName('')
      setDescription('')
      setCategory('')
      setTarget(4)

      console.log('Habit added successfully')
    } catch (error) {
      console.error('Error adding habits:', error)
    }
  }

  // Add New Category
  const handleNewCategory = async () => {
    if (!newCategory.trim()) {
      alert('Please enter a category name')
      return
    }

    const addedCategory = await onAddCategory(newCategory)

    if (addedCategory) {
      setCategory(addedCategory.name)
      setNewCategory('')
      setShowCategoryInput(false)
    }
  }

  return (
    <div className='mt-2 rounded-2xl bg-white p-6 shadow-md'>

      <h2 className='mb-5 text-xl font-bold text-green-950'>
        Create a New Habit
      </h2>

      <form onSubmit={handleSubmit}>

        {/* Habit Name */}
        <div className='mb-4'>
          <label className='mb-2 block font-medium'>
            Habit Name
          </label>

          <input
            type='text'
            placeholder='e.g. Read books'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-600'
          />
        </div>

        {/* Description */}
        <div className='mb-4'>
          <label className='mb-2 block font-medium'>
            Description
          </label>

          <textarea
            placeholder='Write something about your habit...'
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-600'
            rows='3'
          />
        </div>

        {/* Category */}
        <div className='mb-4'>
          <label className='mb-2 block font-medium'>
            Select Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className='w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-green-600'
          >
            <option value=''>Select Category</option>

            {categories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>


          {/* Add New Category Button */}
          <button
            type='button'
            onClick={() => setShowCategoryInput(!showCategoryInput)}
            className='mt-3 inline-flex items-center gap-2 rounded-lg border border-green-600 px-4 py-2 font-medium text-green-700 transition hover:bg-green-50'
          >
            {showCategoryInput ? 'Cancel' : '+ Add New Category'}
          </button>

          {/* New Category Input */}
          {showCategoryInput && (
            <div className='mt-3 rounded-xl border border-green-200 bg-green-50 p-4'>

              <label className='mb-2 block font-medium text-green-900'>
                New Category Name
              </label>

              <input
                type='text'
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder='Enter category name...'
                className='w-full rounded-lg border border-gray-300 bg-white p-3 outline-none focus:border-green-600'
              />

              <button
                type='button'
                onClick={handleNewCategory}
                disabled={isAddingCategory}
                className='mt-3 rounded-lg bg-green-700 px-5 py-2 font-semibold text-white transition hover:bg-green-800 disabled:opacity-50'
              >
                {isAddingCategory ? 'Saving...' : 'Save Category'}
              </button>

            </div>
          )}
        </div>
        {/* Daily Session Target */}
<div className='mb-4'>
  <label className='mb-2 block font-medium'>
    Daily Session Target
  </label>

  <input
    type='number'
    min='4'
    value={dailyTarget}
    onChange={(e) => setDailyTarget(e.target.value)}
    className='w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-green-600'
    placeholder='Enter daily target'
  />

  <p className='mt-1 text-sm text-gray-500'>
    How many sessions do you want to complete daily?
  </p>
</div>

        {/* Add Habit Button */}
        <button
          type='submit'
          className='rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800'
        >
          Add Habit
        </button>

      </form>
    </div>
  )
}

export default HabitForm
