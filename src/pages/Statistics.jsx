
import React, { useEffect, useState } from 'react'
import useHabits from '../hooks/useHabits'
import api from '../services/api'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

function Statistics() {
  const { habits, isLoading, settings } = useHabits()

  const [sessions, setSessions] = useState([])
  const [sessionsLoading, setSessionsLoading] = useState(true)

  // Fetch Sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions')
        setSessions(response.data)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setSessionsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  // Today's Date
  const today = new Date().toDateString()

  // Get Daily Target
  const getDailyTarget = (habit) => {
    return Number(habit.dailyTarget) || 1
  }

  // Get Today's Session Count
  const getTodaySessionCount = (habitId) => {
    return sessions.filter((session) => (
      session.habitId === habitId &&
      new Date(session.completedAt).toDateString() === today
    )).length
  }

  // Calculate Habit Progress
  const getHabitProgress = (habit) => {
    const count = getTodaySessionCount(habit.id)
    const target = getDailyTarget(habit)

    return Math.min(
      100,
      Math.round((count / target) * 100)
    )
  }

  // Basic Statistics
  const totalHabits = habits.length

  const completedHabits = habits.filter(
    (habit) => getHabitProgress(habit) >= 100
  ).length

  const pendingHabits = totalHabits - completedHabits

  const completionRate = totalHabits > 0
    ? Math.round((completedHabits / totalHabits) * 100)
    : 0

  // Today's Total Sessions
  const todaySessions = sessions.filter((session) => (
    new Date(session.completedAt).toDateString() === today
  )).length

  // Category Statistics
  const categoryStats = [
    ...new Set(
      habits.map((habit) => habit.category).filter(Boolean)
    )
  ].map((category) => ({
    category,
    count: habits.filter(
      (habit) => habit.category === category
    ).length
  }))

  // Weekly Progress
  const weekStartsOn = settings.weekStartsOn ?? 1

  const todayDate = new Date()
  todayDate.setHours(0, 0, 0, 0)

  const dayOffset =
    (todayDate.getDay() - weekStartsOn + 7) % 7

  const startOfWeek = new Date(todayDate)
  startOfWeek.setDate(todayDate.getDate() - dayOffset)

  const weeklyData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek)
    date.setDate(startOfWeek.getDate() + index)

    const completed = sessions.filter((session) => (
      new Date(session.completedAt).toDateString() ===
      date.toDateString()
    )).length

    return {
      day: date.toLocaleDateString('en-US', {
        weekday: 'short'
      }),
      date: date.toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'short'
      }),
      completed
    }
  })

  // Weekly Total
  const weeklyTotal = weeklyData.reduce(
    (total, item) => total + item.completed,
    0
  )

  // Weekly Target Through Today
  const daysElapsedThisWeek = dayOffset + 1

  const dailySessionTarget = habits.reduce(
    (total, habit) => total + getDailyTarget(habit),
    0
  )

  const weeklyTarget = dailySessionTarget * daysElapsedThisWeek

  const weeklyCompletionRate = weeklyTarget > 0
    ? Math.min(
        100,
        Math.round((weeklyTotal / weeklyTarget) * 100)
      )
    : 0

  // Monthly Progress
  const currentMonth = todayDate.getMonth()
  const currentYear = todayDate.getFullYear()

  const monthlyTotal = sessions.filter((session) => {
    if (!session.completedAt) return false

    const date = new Date(session.completedAt)

    return (
      date.getMonth() === currentMonth &&
      date.getFullYear() === currentYear
    )
  }).length

  // Monthly Target Through Today
  const daysElapsedThisMonth = todayDate.getDate()

  const monthlyTarget = dailySessionTarget * daysElapsedThisMonth

  const monthlyCompletionRate = monthlyTarget > 0
    ? Math.min(
        100,
        Math.round((monthlyTotal / monthlyTarget) * 100)
      )
    : 0

  // Loading State
  if (isLoading || sessionsLoading) {
    return (
      <p className='mt-6 text-gray-500'>
        Loading statistics...
      </p>
    )
  }

  return (
    <div>

      {/* Page Heading */}
      <h1 className='mt-2 text-3xl font-bold text-green-950'>
        Statistics
      </h1>

      <p className='mt-2 text-gray-600'>
        Track your habit sessions, progress and growth.
      </p>

      {/* Statistics Cards */}
      <div className='mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4'>

        <div className='rounded-xl bg-white p-5 shadow-sm'>
          <h3 className='text-sm font-medium text-gray-500'>
            Total Habits
          </h3>
          <p className='mt-2 text-3xl font-bold text-green-900'>
            {totalHabits}
          </p>
        </div>

        <div className='rounded-xl bg-green-50 p-5 shadow-sm'>
          <h3 className='text-sm font-medium text-green-700'>
            Completed Today
          </h3>
          <p className='mt-2 text-3xl font-bold text-green-900'>
            {completedHabits}
          </p>
        </div>

        <div className='rounded-xl bg-yellow-500 p-5 shadow-sm'>
          <h3 className='text-sm font-medium text-yellow-800'>
            Pending Today
          </h3>
          <p className='mt-2 text-3xl font-bold text-yellow-900'>
            {pendingHabits}
          </p>
        </div>

        <div className='rounded-xl bg-blue-500 p-5 shadow-sm'>
          <h3 className='text-sm font-medium text-blue-800'>
            Completion Rate
          </h3>
          <p className='mt-2 text-3xl font-bold text-blue-900'>
            {completionRate}%
          </p>
        </div>

      </div>

      {/* Today's Session Summary */}
      <div className='mt-6 rounded-xl bg-white p-5 shadow-sm'>
        <h2 className='text-lg font-semibold text-green-950'>
          Today's Session Summary
        </h2>

        <p className='mt-3 text-3xl font-bold text-green-700'>
          {todaySessions}
        </p>

        <p className='mt-1 text-sm text-gray-500'>
          Total sessions completed today
        </p>
      </div>

      {/* Overall Progress */}
      <div className='mt-6 rounded-xl bg-white p-5 shadow-sm'>

        <div className='flex items-center justify-between gap-3'>
          <h2 className='text-lg font-semibold text-green-950'>
            Overall Daily Progress
          </h2>

          <span className='text-sm font-bold text-green-700'>
            {completionRate}%
          </span>
        </div>

        <div className='mt-4 h-3 w-full overflow-hidden rounded-full bg-green-100'>
          <div
            className='h-full rounded-full bg-green-600 transition-all duration-500'
            style={{ width: `${completionRate}%` }}
          />
        </div>

        <p className='mt-2 text-sm text-gray-500'>
          {completedHabits} out of {totalHabits} habits reached their daily target.
        </p>

      </div>

      {/* Individual Habit Performance */}
      <div className='mt-6 rounded-xl bg-white p-5 shadow-sm'>

        <h2 className='text-lg font-semibold text-green-950'>
          Habit Performance
        </h2>

        <div className='mt-5 space-y-5'>

          {habits.map((habit) => {
            const count = getTodaySessionCount(habit.id)
            const target = getDailyTarget(habit)
            const progress = getHabitProgress(habit)

            return (
              <div key={habit.id}>

                <div className='mb-2 flex justify-between gap-3'>
                  <span className='font-medium text-green-950'>
                    {habit.name}
                  </span>

                  <span className='font-semibold text-green-700'>
                    {progress}%
                  </span>
                </div>

                <div className='h-2 overflow-hidden rounded-full bg-gray-100'>
                  <div
                    className='h-full rounded-full bg-green-600 transition-all duration-500'
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className='mt-2 text-sm text-gray-500'>
                  {count} / {target} sessions completed today
                </p>

              </div>
            )
          })}

          {habits.length === 0 && (
            <p className='text-gray-500'>
              Add habits to see their performance.
            </p>
          )}

        </div>
      </div>

      {/* Category-wise Statistics */}
      {totalHabits > 0 && (
        <div className='mt-6 rounded-xl bg-white p-5 shadow-sm'>

          <h2 className='text-lg font-semibold text-green-950'>
            Category-wise Statistics
          </h2>

          <div className='mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2'>

            {categoryStats.map((item) => (
              <div
                key={item.category}
                className='rounded-lg bg-green-50 p-4'
              >
                <h3 className='font-medium text-green-900'>
                  {item.category}
                </h3>

                <p className='mt-2 text-2xl font-bold text-green-700'>
                  {item.count}
                </p>

                <p className='text-sm text-gray-500'>
                  {item.count === 1 ? 'Habit' : 'Habits'}
                </p>
              </div>
            ))}

          </div>
        </div>
      )}

      {/* Weekly Progress Chart */}
      {totalHabits > 0 && (
        <div className='mt-6 rounded-xl bg-white p-5 shadow-sm'>

          <h2 className='text-lg font-semibold text-green-950'>
            Weekly Progress
          </h2>

          <p className='mt-1 text-sm text-gray-500'>
            Sessions completed during the current week
          </p>

          <div className='mt-5 h-72 w-full'>

            <ResponsiveContainer width='100%' height='100%'>
              <BarChart data={weeklyData}>

                <CartesianGrid strokeDasharray='3 3' />

                <XAxis
                  dataKey='day'
                  tickFormatter={(day, index) => {
                    const item = weeklyData[index]
                    return item ? `${day} (${item.date})` : day
                  }}
                  interval={0}
                  angle={-25}
                  textAnchor='end'
                  height={60}
                />

                <YAxis allowDecimals={false} />

                <Tooltip />

                <Bar
                  dataKey='completed'
                  name='Sessions'
                  fill='#15803d'
                  radius={[6, 6, 0, 0]}
                />

              </BarChart>
            </ResponsiveContainer>

          </div>

          {/* Weekly Summary */}
          <div className='mt-4 rounded-lg bg-green-50 p-4'>

            <p className='text-sm text-green-700'>
              Total sessions completed this week
            </p>

            <p className='mt-1 text-2xl font-bold text-green-900'>
              {weeklyTotal}
            </p>

            <p className='mt-2 text-sm font-medium text-green-700'>
              Weekly Session Completion Rate: {weeklyCompletionRate}%
            </p>

          </div>
        </div>
      )}

      {/* Monthly Overview */}
      {totalHabits > 0 && (
        <div className='mt-6 rounded-xl bg-white p-5 shadow-sm'>

          <h2 className='text-lg font-semibold text-green-950'>
            Monthly Overview
          </h2>

          <p className='mt-2 text-sm text-gray-500'>
            Sessions completed this month
          </p>

          <p className='mt-3 text-3xl font-bold text-green-700'>
            {monthlyTotal}
          </p>

          <div className='mt-4 h-2 w-full overflow-hidden rounded-full bg-green-100'>
            <div
              className='h-full rounded-full bg-green-600 transition-all duration-500'
              style={{ width: `${monthlyCompletionRate}%` }}
            />
          </div>

          <p className='mt-2 text-sm font-medium text-green-700'>
            Monthly Session Completion Rate: {monthlyCompletionRate}%
          </p>

        </div>
      )}

    </div>
  )
}

export default Statistics
