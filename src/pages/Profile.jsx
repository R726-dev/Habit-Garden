
import React from 'react'
import useHabits from '../hooks/useHabits'
import { UserCircle } from 'lucide-react'

function Profile() {
  const { settings } = useHabits()

  return (
    <div className='mt-6 rounded-2xl bg-white p-6 shadow-sm sm:p-8'>
      <div className='flex flex-col items-center gap-4 sm:flex-row'>
        <UserCircle size={70} className='text-green-700' />

        <div className='text-center sm:text-left'>
          <h1 className='text-2xl font-bold text-green-950'>
            {settings.displayName}
          </h1>

          <p className='text-sm text-gray-500'>
            Habit Garden Member
          </p>
        </div>
      </div>
    </div>
  )
}

export default Profile
