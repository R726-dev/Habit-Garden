
import React, { useEffect, useState } from 'react'
import useHabits from '../hooks/useHabits'
import api from '../services/api'

function Dashboard() {
  const { habits, isLoading } = useHabits()

  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(true)

  // Fetch Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions')
        setSessions(response.data)
      } catch (error) {
        console.error('Error fetching dashboard sessions:', error)
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  // Today's Session Count
  const getTodaySessionCount = (habitId) => {
    const today = new Date().toDateString()

    return sessions.filter((session) => (
      session.habitId === habitId &&
      new Date(session.completedAt).toDateString() === today
    )).length
  }

  // Daily Target
  const getDailyTarget = (habit) => {
    return Number(habit.dailyTarget) || 4
  }

  // Habit Progress
  const getHabitProgress = (habit) => {
    const completedSessions = getTodaySessionCount(habit.id)
    const target = getDailyTarget(habit)

    return Math.min(
      100,
      Math.round((completedSessions / target) * 100)
    )
  }

  const totalHabits = habits.length

  // Completed Habits Today
  const completedToday = habits.filter(
    (habit) => getHabitProgress(habit) >= 100
  ).length

  // Pending Habits Today
  const pendingToday = totalHabits - completedToday

  // Overall Progress
  const progress = totalHabits > 0
    ? Math.round((completedToday / totalHabits) * 100)
    : 0

  if (isLoading || sessionsLoading) {
    return (
      <p className='mt-5 text-green-700'>
        Loading your dashboard...
      </p>
    )
  }

  return (
    <div className='mb-8 mt-3'>

      {/* Welcome */}
      <h2 className='text-2xl font-semibold text-green-900'>
        Welcome back, Gardener!
      </h2>

      <p className='mt-2 text-gray-600'>
        Every small step brings you closer to your goals.
        Keep growing!
      </p>

      {/* Dashboard Cards */}
      <div className='mt-8 grid grid-cols-1 gap-6 md:grid-cols-3'>

        {/* Total Habits */}
        <div className='rounded-xl bg-white p-6 shadow'>
          <h2 className='text-lg font-semibold'>
            Total Habits
          </h2>

          <p className='mt-3 text-3xl font-bold text-green-700'>
            {totalHabits}
          </p>
        </div>

        {/* Completed Today */}
        <div className='rounded-xl bg-green-100 p-6 shadow'>
          <h2 className='text-lg font-semibold text-green-900'>
            Completed Today
          </h2>

          <p className='mt-3 text-3xl font-bold text-green-700'>
            {completedToday}
          </p>
        </div>

        {/* Pending Today */}
        <div className='rounded-xl bg-yellow-600 p-6 shadow'>
          <h2 className='text-lg font-semibold text-yellow-100'>
            Pending Today
          </h2>

          <p className='mt-3 text-3xl font-bold text-yellow-700'>
            {pendingToday}
          </p>
        </div>

      </div>

      {/* Overall Daily Progress */}
      <div className='mt-8 rounded-xl bg-white p-6 shadow'>

        <h2 className='text-xl font-bold text-green-950'>
          Today's Progress
        </h2>

        <div className='mt-4 h-4 w-full overflow-hidden rounded-full bg-gray-200'>
          <div
            className='h-4 rounded-full bg-green-600 transition-all duration-500'
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className='mt-3 text-gray-600'>
          {completedToday} out of {totalHabits} habits completed ({progress}%)
        </p>

      </div>

      {/* Individual Habit Progress */}
      <div className='mt-8 rounded-xl bg-white p-6 shadow'>

        <h2 className='text-xl font-bold text-green-950'>
          Your Habit Progress
        </h2>

        {habits.length === 0 ? (
          <p className='mt-4 text-gray-500'>
            No habits yet. Add your first habit to get started!
          </p>
        ) : (
          <div className='mt-5 space-y-5'>

            {habits.map((habit) => {
              const count = getTodaySessionCount(habit.id)
              const target = getDailyTarget(habit)
              const habitProgress = getHabitProgress(habit)
              const isCompleted = habitProgress >= 100

              return (
                <div key={habit.id}>

                  <div className='mb-2 flex items-center justify-between gap-3'>
                    <h3 className='font-semibold text-green-950'>
                      {habit.name}
                    </h3>

                    <span className='text-sm font-semibold text-green-700'>
                      {habitProgress}%
                    </span>
                  </div>

                  <div className='h-3 w-full overflow-hidden rounded-full bg-gray-200'>
                    <div
                      className='h-full rounded-full bg-green-600 transition-all duration-500'
                      style={{ width: `${habitProgress}%` }}
                    />
                  </div>

                  <div className='mt-2 flex items-center justify-between text-sm'>
                    <span className='text-gray-500'>
                      {count} / {target} sessions completed
                    </span>

                    <span className={
                      isCompleted
                        ? 'font-medium text-green-700'
                        : 'text-yellow-700'
                    }>
                      {isCompleted ? 'Completed' : 'In Progress'}
                    </span>
                  </div>

                </div>
              )
            })}

          </div>
        )}

      </div>

    </div>
  )
}

export default Dashboard
