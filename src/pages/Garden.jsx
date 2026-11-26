
import React, { useEffect, useState } from 'react'
import useHabits from '../hooks/useHabits'
import api from '../services/api'
import { Sprout, TreeDeciduous } from 'lucide-react'
import { motion } from 'framer-motion'

function Garden() {
  const { habits, isLoading, settings } = useHabits()

  const [sessions, setSessions] = useState([])

  // Fetch session history
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions')
        setSessions(response.data)
      } catch (error) {
        console.error('Error fetching garden sessions:', error)
      }
    }

    fetchSessions()
  }, [])

  // Today's date
  const today = new Date().toDateString()

  // Get today's session count for a habit
  const getTodaySessionCount = (habitId) => {
    return sessions.filter((session) => {
      return (
        session.habitId === habitId &&
        new Date(session.completedAt).toDateString() === today
      )
    }).length
  }

  // Calculate progress percentage
  const getHabitProgress = (habit) => {
    const target = Number(habit.dailyTarget) || 4
    const count = getTodaySessionCount(habit.id)

    return Math.min(100, Math.round((count / target) * 100))
  }

  // Check whether daily target is completed
  const isHabitCompleted = (habit) => {
    return getHabitProgress(habit) >= 100
  }

  // Summary calculations
  const totalHabits = habits.length

  const completedHabits = habits.filter(
    (habit) => isHabitCompleted(habit)
  ).length

  const pendingHabits = totalHabits - completedHabits

  return (
    <div>
      {/* Page Heading */}
      <h1 className='mt-2 text-3xl font-bold text-green-950'>
        My Garden
      </h1>

      <p className='mt-2 text-gray-600'>
        Watch your habits grow!
      </p>

      {/* Total Plants Card */}
      <div className='mt-6 rounded-xl bg-white p-5 shadow-sm'>
        {isLoading ? (
          <p className='text-gray-500'>
            Loading your garden...
          </p>
        ) : (
          <>
            <h2 className='text-lg font-semibold text-green-950'>
              Total Plants
            </h2>

            <p className='mt-2 text-3xl font-bold text-green-700'>
              {totalHabits}
            </p>

            <p className='mt-1 text-sm text-gray-500'>
              Habits growing in your garden
            </p>

            {totalHabits === 0 && (
              <p className='mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800'>
                Your garden is empty. Add your first habit to start growing! 🌱
              </p>
            )}
          </>
        )}
      </div>

      {/* Garden Summary */}
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2'>

        {/* Completed Habits */}
        <div className='rounded-xl bg-green-100 p-5'>
          <h3 className='text-sm font-medium text-green-900'>
            Completed Habits
          </h3>

          <p className='mt-2 text-2xl font-bold text-green-700'>
            {completedHabits}
          </p>
        </div>

        {/* Pending Habits */}
        <div className='rounded-xl bg-yellow-400 p-5'>
          <h3 className='text-sm font-medium text-yellow-900'>
            Pending Habits
          </h3>

          <p className='mt-2 text-2xl font-bold text-yellow-900'>
            {pendingHabits}
          </p>
        </div>
      </div>

      {/* Garden Plants */}
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>

        {habits.map((habit) => {
          const progress = getHabitProgress(habit)
          const completedSessions = getTodaySessionCount(habit.id)
          const dailyTarget = Number(habit.dailyTarget) || 4
          const completed = progress >= 100

          return (
            <motion.div
              key={habit.id}
              initial={
                settings.animations
                  ? { opacity: 0, y: 20 }
                  : false
              }
              animate={{ opacity: 1, y: 0 }}
              transition={
                settings.animations
                  ? { duration: 0.4, delay: 0.1 }
                  : { duration: 0 }
              }
              whileHover={
                settings.animations
                  ? { scale: 1.02 }
                  : {}
              }
              whileTap={
                settings.animations
                  ? { scale: 0.98 }
                  : {}
              }
              className='rounded-xl bg-white p-5 shadow-sm'
            >
              {/* Plant Growth Stage */}
              <div className='mb-3 flex items-center gap-2'>

                {completed ? (
                  <TreeDeciduous
                    size={40}
                    className='text-green-700'
                  />
                ) : (
                  <Sprout
                    size={40}
                    className='text-green-500'
                  />
                )}

                <span className='text-sm font-medium text-green-700'>
                  {completed
                    ? 'Fully Grown'
                    : progress >= 75
                    ? 'Almost Grown'
                    : progress >= 25
                    ? 'Growing'
                    : 'Seedling'}
                </span>
              </div>

              {/* Habit Name */}
              <h3 className='break-words text-lg font-semibold text-green-950'>
                {habit.name}
              </h3>

              {/* Category */}
              <p className='mt-1 text-sm text-gray-500'>
                {habit.category}
              </p>

              {/* Completion Status */}
              <div className='mt-3 flex items-center justify-between gap-2'>

                <span className='text-sm font-medium text-green-700'>
                  {completed
                    ? 'Growing well!'
                    : 'Keep growing!'}
                </span>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    completed
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700'
                  }`}
                >
                  {completed ? 'Completed' : 'Pending'}
                </span>
              </div>

              {/* Plant Growth Progress */}
              <div className='mt-3 h-2 w-full overflow-hidden rounded-full bg-green-100'>
                <motion.div
                  initial={false}
                  animate={{ width: `${progress}%` }}
                  transition={
                    settings.animations
                      ? { duration: 0.5 }
                      : { duration: 0 }
                  }
                  className='h-full rounded-full bg-green-600'
                />
              </div>

              {/* Session Progress */}
              <p className='mt-2 text-xs text-gray-500'>
                {completedSessions} / {dailyTarget} sessions completed today
              </p>

              {/* Growth Percentage */}
              <p className='mt-1 text-right text-xs font-medium text-green-700'>
                {progress}% grown
              </p>

            </motion.div>
          )
        })}

      </div>
    </div>
  )
}

export default Garden
