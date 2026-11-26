
import React, { useState, useEffect } from 'react'
import HabitForm from '../components/HabitForm'
import useHabits from '../hooks/useHabits'
import api from '../services/api'

import {
  Search,
  Save,
  Sprout,
  Pencil,
  X,
  AlertCircle,
  Check,
  Trash,
  LoaderCircle,
  ListFilter,
  CheckCircle,
  ArrowDownAZ
} from 'lucide-react'

import { motion, AnimatePresence } from 'framer-motion'
import { useSearchParams } from 'react-router-dom'

function Habits() {
  const { habits, setHabits, isLoading, settings } = useHabits()

  const [searchParams] = useSearchParams()

  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [editingHabit, setEditingHabit] = useState(null)

  const [isSaving, setIsSaving] = useState(false)
  const [isSavingSession, setIsSavingSession] = useState(null)

  const [successMessage, setSuccessMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const [sortOrder, setSortOrder] = useState('az')

  const [categories, setCategories] = useState([])
  const [sessions, setSessions] = useState([])
  const [completions, setCompletions] = useState([])

  const [isAddingCategory, setIsAddingCategory] = useState(false)

  // Success Message Timer
  useEffect(() => {
    if (!successMessage) return

    const timer = setTimeout(() => {
      setSuccessMessage('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [successMessage])

  // Error Message Timer
  useEffect(() => {
    if (!errorMessage) return

    const timer = setTimeout(() => {
      setErrorMessage('')
    }, 3000)

    return () => clearTimeout(timer)
  }, [errorMessage])

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories')
        setCategories(response.data)
      } catch (error) {
        console.error('Failed to fetch categories:', error)
      }
    }

    fetchCategories()
  }, [])

  // Fetch Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions')
        setSessions(response.data)

        console.log('Fetched sessions:', response.data)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      }
    }

    fetchSessions()
  }, [])

  // Fetch Completion History
  useEffect(() => {
    const fetchCompletions = async () => {
      try {
        const response = await api.get('/completions')
        setCompletions(response.data)
      } catch (error) {
        console.error('Error fetching completions:', error)
      }
    }

    fetchCompletions()
  }, [])

  // Get Search From URL
  useEffect(() => {
    setSearch(searchParams.get('search') || '')
  }, [searchParams])

  // Filter Habits
  const filteredHabits = habits.filter((habit) => {
    const matchesSearch = habit.name.toLowerCase()
      .includes(search.toLowerCase())

    const matchesCategory =
      selectedCategory === '' ||
      habit.category === selectedCategory

    return matchesSearch && matchesCategory
  })

  // Sort Habits
  const sortedHabits = [...filteredHabits].sort((a, b) => {
    if (sortOrder === 'az') {
      return a.name.localeCompare(b.name)
    }

    return b.name.localeCompare(a.name)
  })

  // Get Today's Session Count
  const getTodaySessionCount = (habitId) => {
    const today = new Date().toDateString()

    return sessions.filter((session) => {
      return (
        session.habitId === habitId &&
        new Date(session.completedAt).toDateString() === today
      )
    }).length
  }

  // Calculate Habit Progress
  const getHabitProgress = (habit) => {
    const dailyTarget = Number(habit.dailyTarget) || 4

    const completedSessions = getTodaySessionCount(habit.id)

    return Math.min(
      100,
      Math.round((completedSessions / dailyTarget) * 100)
    )
  }

  // Complete One Habit Session
  const handleCompleteSession = async (habitId) => {
    if (isSavingSession !== null) return

    try {
      setIsSavingSession(habitId)
      setErrorMessage('')

      const habit = habits.find((item) => item.id === habitId)

      if (!habit) return

      const dailyTarget = Number(habit.dailyTarget) || 4

      const today = new Date().toDateString()

      // Get Today's Sessions
      const todaySessions = sessions.filter((session) => {
        return (
          session.habitId === habitId &&
          new Date(session.completedAt).toDateString() === today
        )
      })

      // Check Daily Target
      if (todaySessions.length >= dailyTarget) {
        setSuccessMessage('Your daily target is already completed!')
        return
      }

      // Save Session to Backend
      const sessionResponse = await api.post('/sessions', {
        habitId,
        completedAt: new Date().toISOString()
      })

      // Update Sessions State
      setSessions((previousSessions) => [
        ...previousSessions,
        sessionResponse.data
      ])

      const newCount = todaySessions.length + 1

      // Automatically Complete Habit
      if (newCount >= dailyTarget) {
        const completedAt = new Date().toISOString()

        // Save Completion History
        const completionResponse = await api.post('/completions', {
          habitId,
          habitName: habit.name,
          category: habit.category,
          completedAt
        })

        // Update Habit Status
        const habitResponse = await api.put(`/habits/${habitId}`, {
          ...habit,
          completed: true,
          completedAt
        })

        setHabits((previousHabits) =>
          previousHabits.map((item) =>
            item.id === habitId ? habitResponse.data : item
          )
        )

        setCompletions((previousCompletions) => [
          ...previousCompletions,
          completionResponse.data
        ])

        setSuccessMessage(
          'Congratulations! Your daily target is completed!'
        )
      } else {
        setSuccessMessage('Session completed successfully!')
      }

    } catch (error) {
      console.error('Error completing session:', error)

      setErrorMessage(
        'Unable to save session. Please try again!'
      )

    } finally {
      setIsSavingSession(null)
    }
  }

  // Delete Habit
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      'Are you sure you want to delete this habit?'
    )

    if (!confirmDelete) return

    try {
      await api.delete(`/habits/${id}`)

      setHabits((previousHabits) =>
        previousHabits.filter((habit) => habit.id !== id)
      )

      setSuccessMessage('Habit deleted successfully')

    } catch (error) {
      console.error('Error deleting habits:', error)

      setErrorMessage(
        'Unable to delete habit. Please try again!'
      )
    }
  }

  // Add Custom Category
  const handleAddCategory = async (categoryName) => {
    const categoryNameTrimmed = categoryName.trim()

    if (!categoryNameTrimmed) {
      alert('Please enter a category name')
      return null
    }

    const alreadyExists = categories.some(
      (item) =>
        item.name.toLowerCase() ===
        categoryNameTrimmed.toLowerCase()
    )

    if (alreadyExists) {
      alert('This category already exists')
      return null
    }

    try {
      setIsAddingCategory(true)

      const response = await api.post('/categories', {
        name: categoryNameTrimmed
      })

      setCategories((previous) => [
        ...previous,
        response.data
      ])

      return response.data

    } catch (error) {
      console.error('Error adding category:', error)
      alert('Unable to add category')
      return null

    } finally {
      setIsAddingCategory(false)
    }
  }

  return (
    <div>

      <h1 className='mt-3 text-3xl font-bold text-green-950'>
        My Habits
      </h1>

      <HabitForm
        categories={categories}
        onAddCategory={handleAddCategory}
        isAddingCategory={isAddingCategory}
      />

      {/* Success Message */}
      {successMessage && (
        <div className='mt-4 flex items-center gap-2 rounded-lg border border-green-200 bg-green-100 p-4 font-medium text-green-800 shadow-sm'>
          <CheckCircle size={20} />
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {errorMessage && (
        <div className='mt-4 flex items-center gap-2 rounded-lg border border-red-200 bg-red-100 p-4 font-medium text-red-800 shadow-sm'>
          <AlertCircle size={20} />
          {errorMessage}
        </div>
      )}

      {/* Edit Habit */}
      {editingHabit && (
        <div className='mt-6 rounded-xl bg-white p-5 shadow-md'>

          <h2 className='mb-4 flex items-center text-xl font-bold text-green-900'>
            <Pencil size={20} />
            Edit Habit
          </h2>

          <input
            type='text'
            value={editingHabit.name}
            onChange={(e) =>
              setEditingHabit({
                ...editingHabit,
                name: e.target.value
              })
            }
            className='mb-3 w-full rounded-lg border p-3'
            placeholder='Habit Name'
          />

          <textarea
            value={editingHabit.description}
            onChange={(e) =>
              setEditingHabit({
                ...editingHabit,
                description: e.target.value
              })
            }
            className='mb-3 w-full rounded-lg border p-3'
            placeholder='Habit description'
          />

          <select
            value={editingHabit.category}
            onChange={(e) =>
              setEditingHabit({
                ...editingHabit,
                category: e.target.value
              })
            }
            className='w-full rounded-lg border p-3'
          >
            {categories.map((category) => (
              <option
                key={category.id}
                value={category.name}
              >
                {category.name}
              </option>
            ))}
          </select>

          {/* Saving */}
          {isSaving && (
            <p className='mt-2 text-sm text-gray-500'>
              Please wait, saving your habit...
            </p>
          )}

          <button
            disabled={isSaving}
            onClick={async () => {
              if (!editingHabit.name.trim()) {
                alert('Please enter a habit name!')
                return
              }

              try {
                setIsSaving(true)
                setErrorMessage('')

                const response = await api.put(
                  `/habits/${editingHabit.id}`,
                  editingHabit
                )

                setHabits((previousHabits) =>
                  previousHabits.map((habit) =>
                    habit.id === editingHabit.id
                      ? response.data
                      : habit
                  )
                )

                setSuccessMessage('Habit updated successfully!')
                setEditingHabit(null)

              } catch (error) {
                console.error('Error updating habit:', error)

                setErrorMessage(
                  'Unable to update habit. Please try again!'
                )

              } finally {
                setIsSaving(false)
              }
            }}
            className={`mt-4 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2 text-white ${
              isSaving
                ? 'cursor-not-allowed bg-gray-400'
                : 'bg-green-700 hover:bg-green-800'
            }`}
          >
            {isSaving ? (
              <>
                <LoaderCircle
                  size={16}
                  className={
                    settings.animations ? 'animate-spin' : ''
                  }
                />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <Save size={16} />
                <span>Save changes</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setSuccessMessage('')
              setEditingHabit(null)
            }}
            className='ml-3 mt-4 inline-flex items-center gap-1 rounded-lg bg-gray-200 px-5 py-2 text-gray-700 hover:bg-gray-300'
          >
            <X size={18} />
            Cancel
          </button>

        </div>
      )}

      {/* Search */}
      <div className='relative'>

        <Search
          size={24}
          className='absolute left-4 top-1/2 -translate-y-1/2 text-gray-400'
        />

        <input
          type='text'
          placeholder='Search your habits...'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className='mt-2 w-full rounded-lg border border-gray-300 py-2 pl-12 outline-none focus:border-green-600'
        />

      </div>

      {/* Category Filter */}
      <div className='relative'>

        <ListFilter
          size={28}
          className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className='mt-4 inline-flex w-full appearance-none items-center justify-center rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-5 outline-none focus:border-green-600'
        >
          <option value=''>All Categories</option>

          {categories.map((category) => (
            <option
              key={category.id}
              value={category.name}
            >
              {category.name}
            </option>
          ))}

        </select>

      </div>

      {/* Sort Habits */}
      <div className='relative'>

        <ArrowDownAZ
          size={28}
          className='pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'
        />

        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className='mt-4 inline-flex w-full items-center justify-center rounded-lg border border-gray-300 bg-white py-3 pl-10 pr-4'
        >
          <option value='az'>Name: A to Z</option>
          <option value='za'>Name: Z to A</option>
        </select>

      </div>

      {/* Clear Filters */}
      {(search || selectedCategory || sortOrder !== 'az') && (
        <button
          onClick={() => {
            setSearch('')
            setSelectedCategory('')
            setSortOrder('az')
          }}
          className='mt-3 flex items-center gap-2 rounded-lg bg-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-300'
        >
          <X size={22} />
          Clear Filters
        </button>
      )}

      <h2 className=' mt-8 flex items-center gap-2 text-2xl font-bold text-green-950'>
        <Sprout size={24} />
        Your Habits
      </h2>

      <p className='mb-3 mt-2 text-gray-500'>
        You have {habits.length} habits in total
      </p>

      {/* Loading */}
      {isLoading ? (

        <div className='flex items-center justify-center gap-2 py-8 text-green-700'>

          <motion.div
            animate={
              settings.animations
                ? { rotate: 360 }
                : { rotate: 0 }
            }
            transition={
              settings.animations
                ? {
                    duration: 1,
                    repeat: Infinity,
                    ease: 'linear'
                  }
                : { duration: 0 }
            }
            className='h-10 w-10 rounded-full border-4 border-green-200 border-t-green-700'
          />

          <p className='mt-3 text-sm font-medium text-green-700'>
            Growing your garden...
          </p>

        </div>

      ) : habits.length === 0 ? (

        <div className='rounded-xl border border-green-300 bg-green-50 p-8 text-center'>

          <h3 className='text-xl font-semibold text-green-800'>
            Your garden is waiting
          </h3>

          <p className='mt-2 text-gray-600'>
            Add your first habit and start growing every day.
          </p>

        </div>

      ) : filteredHabits.length === 0 ? (

        <div className='mt-4 rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm'>

          <Search size={32} className='mx-auto mb-3 text-gray-400' />

          <h3 className='text-lg font-semibold text-gray-700'>
            No matching habits found
          </h3>

          <p className='mt-2 text-gray-500'>
            Try changing your search or category filter
          </p>

        </div>

      ) : (

        <div className='mx-auto grid w-full max-w-9xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6'>

          <AnimatePresence>

            {sortedHabits.map((habit, index) => {

              const progress = getHabitProgress(habit)
              const completedSessions = getTodaySessionCount(habit.id)
              const dailyTarget = Number(habit.dailyTarget) || 4
              const targetReached = progress >= 100

              return (
                <motion.div
                  layout={settings.animations}
                  key={habit.id}

                  initial={
                    settings.animations
                      ? { opacity: 0, y: 15 }
                      : false
                  }

                  animate={{ opacity: 1, y: 0 }}

                  exit={
                    settings.animations
                      ? { opacity: 0, scale: 0.9 }
                      : {}
                  }

                  transition={
                    settings.animations
                      ? {
                          duration: 0.3,
                          delay: index * 0.1
                        }
                      : { duration: 0 }
                  }

                  className={`rounded-xl bg-white p-5 shadow-md sm:p-5 lg:p-6 ${
                    settings.animations
                      ? 'transition-all duration-300 hover:-translate-y-1 hover:shadow-lg'
                      : ''
                  }`}
                >

                  {/* Habit Name */}
                  <h3 className='break-words text-xl font-bold text-green-900 sm:text-xl lg:text-2xl'>
                    {habit.name}
                  </h3>

                  {/* Description */}
                  <p
                    className={`mb-3 mt-3 break-words rounded-lg bg-gray-50 p-3 leading-relaxed text-gray-400 ${
                      settings.animations
                        ? 'transition-colors duration-300 hover:bg-green-50'
                        : ''
                    }`}
                  >
                    {habit.description}
                  </p>

                  {/* Category */}
                  <span
                    className={`mt-3 inline-block rounded-lg px-4 py-2 text-md font-medium ${
                      habit.category === 'Learning'
                        ? 'bg-blue-100 text-blue-800'
                        : habit.category === 'Health'
                        ? 'bg-green-100 text-green-800'
                        : habit.category === 'Personal'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}
                  >
                    {habit.category}
                  </span>

                  {/* Daily Session Progress */}
                  <div className='mt-5'>

                    <div className='mb-2 flex items-center justify-between'>

                      <span className='font-semibold text-green-900'>
                        Daily Progress
                      </span>

                      <span className='font-bold text-green-700'>
                        {progress}%
                      </span>

                    </div>

                    {/* Progress Bar */}
                    <div className='h-3 overflow-hidden rounded-full bg-gray-200'>

                      <motion.div
                        className='h-full rounded-full bg-green-600'
                        initial={false}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.5 }}
                      />

                    </div>

                    <p className='mt-2 text-sm text-gray-500'>
                      {completedSessions} / {dailyTarget} sessions completed today
                    </p>

                  </div>

                  {/* Complete Session Button */}
                  <button
                    disabled={
                      isSavingSession === habit.id ||
                      targetReached
                    }

                    onClick={() => handleCompleteSession(habit.id)}

                    className='mt-4 w-full rounded-lg bg-green-700 px-4 py-3 font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-gray-400'
                  >
                    {isSavingSession === habit.id
                      ? 'Saving Session...'
                      : targetReached
                      ? 'Daily Target Reached ✓'
                      : 'Complete Session'}
                  </button>

                  {/* Automatic Completion Message */}
                  {targetReached && (
                    <div className='mt-3 rounded-lg bg-green-100 px-3 py-2 text-center font-semibold text-green-800'>
                      <Check size={18} className='mr-1 inline' />
                      Daily Target Completed!
                    </div>
                  )}

                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(habit.id)}
                    className={`m-2 inline-flex flex-wrap items-center justify-center gap-2 rounded-lg bg-red-300 px-4 py-2 text-red-700 hover:bg-red-200 ${
                      settings.animations
                        ? 'transition-all duration-200 hover:scale-105'
                        : ''
                    }`}
                  >
                    <Trash size={18} />
                    Delete
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => setEditingHabit(habit)}
                    className={`m-2 inline-flex flex-wrap items-center justify-center gap-2 rounded-lg bg-blue-300 px-4 py-2 text-md text-blue-700 hover:bg-blue-200 ${
                      settings.animations
                        ? 'transition-all duration-200 hover:scale-105'
                        : ''
                    }`}
                  >
                    <Pencil size={18} />
                    Edit
                  </button>

                </motion.div>
              )
            })}

          </AnimatePresence>

        </div>
      )}

    </div>
  )
}

export default Habits
