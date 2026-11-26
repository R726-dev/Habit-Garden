
import React, { useEffect, useState } from 'react'
import useHabits from '../hooks/useHabits'
import {
  Sprout,
  Trophy,
  Star,
  Award,
  Lock
} from 'lucide-react'
import api from '../services/api'

function Achievements() {
  const { habits, isLoading } = useHabits()

  const [sessions, setSessions] = useState([])
  const [savedAchievements, setSavedAchievements] = useState([])

  const [isSessionsLoading, setIsSessionsLoading] = useState(true)
  const [isSavedLoading, setIsSavedLoading] = useState(true)

  // Fetch sessions
  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/sessions')
        setSessions(response.data)
      } catch (error) {
        console.error('Error fetching sessions:', error)
      } finally {
        setIsSessionsLoading(false)
      }
    }

    fetchSessions()
  }, [])

  // Fetch saved achievements
  useEffect(() => {
    const fetchSavedAchievements = async () => {
      try {
        const response = await api.get('/achievements')
        setSavedAchievements(response.data)
      } catch (error) {
        console.error('Error fetching achievements:', error)
      } finally {
        setIsSavedLoading(false)
      }
    }

    fetchSavedAchievements()
  }, [])

  // Calculate successful habit-days
  const habitDayCompletions = {}

  habits.forEach((habit) => {
    const dailyTarget = Number(habit.dailyTarget) || 4

    const dailySessionCounts = {}

    sessions
      .filter((session) => session.habitId === habit.id)
      .forEach((session) => {
        const date = new Date(session.completedAt)

        if (Number.isNaN(date.getTime())) return

        const day = date.toDateString()

        dailySessionCounts[day] =
          (dailySessionCounts[day] || 0) + 1
      })

    Object.entries(dailySessionCounts).forEach(([day, count]) => {
      if (count >= dailyTarget) {
        const key = `${habit.id}_${day}`
        habitDayCompletions[key] = habit.id
      }
    })
  })

  // Total successful habit-days
  const totalSuccessfulHabitDays =
    Object.keys(habitDayCompletions).length

  // Different habits that reached their daily target
  const uniqueCompletedHabits = new Set(
    Object.values(habitDayCompletions)
  ).size

  const totalHabits = habits.length

  // Achievement list
  const achievements = [
    {
      title: 'First Step',
      description: 'Add your first habit',
      unlocked: totalHabits >= 1
    },
    {
      title: 'Habit Collector',
      description: 'Create 5 habits',
      unlocked: totalHabits >= 5
    },
    {
      title: 'Habit Master',
      description: 'Create 10 habits',
      unlocked: totalHabits >= 10
    },
    {
      title: 'First Success',
      description: 'Reach your daily target for one habit',
      unlocked: totalSuccessfulHabitDays >= 1
    },
    {
      title: 'Growing Strong',
      description: 'Reach daily targets for 5 different habits',
      unlocked: uniqueCompletedHabits >= 5
    },
    {
      title: 'Consistency Star',
      description: 'Reach your daily target on 10 habit-days',
      unlocked: totalSuccessfulHabitDays >= 10
    },
    {
      title: 'Dedicated Gardener',
      description: 'Reach your daily target on 25 habit-days',
      unlocked: totalSuccessfulHabitDays >= 25
    },
    {
      title: 'Garden Champion',
      description: 'Reach your daily target on 50 habit-days',
      unlocked: totalSuccessfulHabitDays >= 50
    }
  ]

  const unlockedAchievements = achievements.filter(
    (achievement) => achievement.unlocked
  )

  // Save newly unlocked achievements
  const unlockedAchievementKey = unlockedAchievements
    .map((achievement) => achievement.title)
    .join('|')

  useEffect(() => {
    const saveUnlockedAchievements = async () => {
      if (
        isLoading ||
        isSessionsLoading ||
        isSavedLoading
      ) {
        return
      }

      try {
        const updatedAchievements = [...savedAchievements]

        for (const achievement of unlockedAchievements) {
          let hasChanges=false
          for(const achievement of unlockedAchievements){
          const alreadySaved = updatedAchievements.some(
            (item) => item.title === achievement.title
          )

          if (!alreadySaved) {
            const response = await api.post('/achievements', {
              title: achievement.title,
              description: achievement.description,
              unlockedAt: new Date().toISOString()
            })

            updatedAchievements.push(response.data)
          }
        }
        // Update state only when new achievement is saved
        if(hasChanges){
          setSavedAchievements(updatedAchievements)}
        }
}catch(error){
  console.error('Error saving achievements:',error)
}
    }


    saveUnlockedAchievements()
  }, [
    isLoading,
    isSessionsLoading,
    isSavedLoading,
    unlockedAchievementKey,
    savedAchievements
  ])

  const achievementIcons = [
    Sprout,
    Trophy,
    Star,
    Award,
    Sprout,
    Star,
    Award,
    Trophy
  ]

  const unlockedCount = unlockedAchievements.length

  const progressPercentage =
    achievements.length === 0
      ? 0
      : Math.round(
          (unlockedCount / achievements.length) * 100
        )

  if (isLoading || isSessionsLoading || isSavedLoading) {
    return (
      <div className='flex min-h-60 items-center justify-center'>
        <p className='text-sm font-medium text-green-700'>
          Loading achievements...
        </p>
      </div>
    )
  }

  return (
    <div className='w-full min-w-0 pb-6'>

      {/* Page Heading */}
      <h1 className='mt-2 text-2xl font-bold text-green-950 sm:text-3xl'>
        Achievements
      </h1>

      <p className='mt-2 text-sm text-gray-600 sm:text-base'>
        Celebrate your progress and milestones!
      </p>

      {/* Achievement Progress */}
      <div className='mt-6 rounded-xl bg-white p-4 shadow-sm sm:mt-8 sm:p-6'>

        <div className='flex items-center justify-between gap-3'>
          <h2 className='text-base font-bold text-green-950 sm:text-lg'>
            Your Progress
          </h2>

          <span className='shrink-0 text-sm font-semibold text-green-700'>
            {unlockedCount} / {achievements.length}
          </span>
        </div>

        <div className='mt-4 h-3 w-full overflow-hidden rounded-full bg-gray-200'>
          <div
            className='h-3 rounded-full bg-green-600 transition-all duration-500'
            style={{
              width: `${progressPercentage}%`
            }}
          />
        </div>

        <p className='mt-2 text-xs text-gray-500 sm:text-sm'>
          {progressPercentage}% achievements unlocked
        </p>
      </div>

      {/* Achievement Cards */}
      <div className='mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4'>

        {achievements.map((achievement, index) => {
          const Icon = achievementIcons[index] || Star

          const savedAchievement = savedAchievements.find(
            (item) => item.title === achievement.title
          )

          return (
            <div
              key={achievement.title}
              className={`min-w-0 rounded-xl p-5 shadow-sm transition ${
                achievement.unlocked
                  ? 'bg-white'
                  : 'bg-gray-100 opacity-70 '
              }`}
            >

              <Icon
                size={36}
                className={
                  achievement.unlocked
                    ? 'text-green-600'
                    : 'text-gray-400'
                }
              />

              <h2 className='mt-4 break-words text-lg font-bold text-green-950'>
                {achievement.title}
              </h2>

              <p className='mt-2 text-sm leading-5 text-gray-700'>
                {achievement.description}
              </p>

              {/* Unlock Status */}
              <p className='mt-3 text-sm font-semibold'>
                {achievement.unlocked ? (
                  <span className='text-green-700'>
                    Unlocked ✓
                  </span>
                ) : (
                  <span className='flex items-center gap-1 text-gray-500'>
                    <Lock size={14} />
                    Locked
                  </span>
                )}
              </p>

              {/* Unlock Date */}
              {achievement.unlocked &&
                savedAchievement?.unlockedAt && (
                  <p className='mt-2 text-xs text-gray-500'>
                    Unlocked on:{' '}
                    {new Date(
                      savedAchievement.unlockedAt
                    ).toLocaleDateString()}
                  </p>
                )}

            </div>
          )
        })}

      </div>

      {/* Completion Message */}
      {achievements.every(
        (achievement) => achievement.unlocked
      ) && (
        <div className='mt-8 rounded-xl bg-green-100 p-5 text-center'>

          <Trophy
            size={36}
            className='mx-auto text-green-700'
          />

          <h2 className='mt-3 text-xl font-bold text-green-950'>
            Amazing Work!
          </h2>

          <p className='mt-2 text-sm text-green-800'>
            Congratulations! You have unlocked all achievements.
          </p>

        </div>
      )}

    </div>
  )
}

export default Achievements
