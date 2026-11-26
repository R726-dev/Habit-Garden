
import React, { useState,useEffect,useRef } from 'react'
import { Search, Bell, UserCircle, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import useHabits from '../hooks/useHabits'
import {useAuth} from'../context/AuthContext'

function Navbar() {
  const [search, setSearch] = useState('')
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const[showNotifications,setShowNotifications]=useState(false)
  const{logout}=useAuth()

  const navigate = useNavigate()
  const { settings } = useHabits()

  const handleSearch = (e) => {
    e.preventDefault()

    if (search.trim()) {
      navigate(`/habits?search=${encodeURIComponent(search.trim())}`)
      setShowMobileSearch(false)
    }
  }
  const notificationRef = useRef(null)
// fetch function for notification
useEffect(() => {
  const handleOutsideClick = (event) => {
    if (
      notificationRef.current &&
      !notificationRef.current.contains(event.target)
    ) {
      setShowNotifications(false)
    }
  }

  document.addEventListener('mousedown', handleOutsideClick)

  return () => {
    document.removeEventListener('mousedown', handleOutsideClick)
  }
}, [])

  return (
    <header className='relative flex w-full flex-wrap items-center justify-between gap-3 rounded-xl bg-white p-3 shadow-sm sm:p-4'>

      {/* Left Section */}
      <div className='min-w-0'>
        <h2 className='text-base font-bold text-green-950 sm:text-lg'>
          Habit Garden
        </h2>

        <p className='truncate text-xs text-gray-500'>
          Welcome back, {settings.displayName}
        </p>
      </div>

      {/* Right Section */}
      <div className='flex shrink-0 items-center gap-2 sm:gap-3'>

        {/* Desktop Search */}
        <form
          onSubmit={handleSearch}
          className='hidden items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 sm:flex'
        >
          <Search size={18} className='text-gray-400' />

          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search...'
            className='w-32 bg-transparent text-sm outline-none'
          />
        </form>

        {/* Mobile Search Button */}
        <button
          type='button'
          onClick={() => setShowMobileSearch((previous) => !previous)}
          className='rounded-lg p-2 text-gray-600 transition hover:bg-green-50 hover:text-green-700 sm:hidden'
        >
          <Search size={21} />
        </button>

        {/* Notification */}
        
{/* Notification */}
<div className='relative'>
  <button
    type='button'
    onClick={() => {
      setShowNotifications((previous) => !previous)
      setShowProfile(false)
    }}
    className='relative rounded-lg p-2 text-gray-600 transition hover:bg-green-50 hover:text-green-700'
    aria-label='Notifications'
    aria-expanded={showNotifications}
  >
    <Bell size={21} />

    <span className='absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white'></span>
  </button>

  {showNotifications && (
    <div className='absolute right-0 top-full z-50 mt-2 w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-100 bg-white shadow-xl'>

      {/* Header */}
      <div className='flex items-center justify-between border-b border-gray-100 px-4 py-3'>
        <h3 className='font-semibold text-gray-800'>
          Notifications
        </h3>

        <button
          type='button'
          onClick={() => setShowNotifications(false)}
          className='text-xs font-medium text-green-700 hover:text-green-900'
        >
          Close
        </button>
      </div>

      {/* Notification Content */}
      <div className='max-h-72 overflow-y-auto p-3'>
        <div className='rounded-lg bg-green-50 p-3'>
          <p className='text-sm font-semibold text-green-900'>
            Welcome to Habit Garden!
          </p>

          <p className='mt-1 text-xs leading-5 text-green-700'>
            Keep building your daily habits and watch your garden grow.
          </p>
        </div>

        <div className='mt-2 rounded-lg p-3 transition hover:bg-gray-50'>
          <p className='text-sm font-medium text-gray-800'>
            Stay consistent
          </p>

          <p className='mt-1 text-xs leading-5 text-gray-500'>
            Complete your daily sessions to reach your habit targets.
          </p>
        </div>
      </div>

    </div>
  )}
</div>


        {/* Profile Dropdown */}
        <div className='relative'>

          <button
            type='button'
            onClick={() => setShowProfile((previous) => !previous)}
            className='flex items-center gap-2 rounded-lg p-2 text-gray-600 transition hover:bg-green-50 hover:text-green-700'
          >
            <UserCircle size={23} />

            <span className='hidden max-w-28 truncate text-sm font-medium sm:inline'>
              {settings.displayName}
            </span>
          </button>

          {showProfile && (
            <div className='absolute right-0 top-full z-50 mt-2 w-52 max-w-[calc(100vw-2rem)] rounded-xl border border-gray-100 bg-white p-2 shadow-lg'>

              {/* Profile */}
              <button
                type='button'
                onClick={() => {
                  navigate('/profile')
                  setShowProfile(false)
                }}
                className='w-full rounded-lg px-3 py-3 text-left text-sm text-gray-700 transition hover:bg-green-50'
              >
                Profile
              </button>

              {/* Settings */}
              <button
                type='button'
                onClick={() => {
                  navigate('/settings')
                  setShowProfile(false)
                }}
                className='w-full rounded-lg px-3 py-3 text-left text-sm text-gray-700 transition hover:bg-green-50'
              >
                Settings
              </button>

              <div className='my-1 border-t border-gray-100'></div>

              {/* Logout */}
              <button
                type='button'
                onClick={() =>{ 
                  logout()
                  navigate('/login')
                  setShowProfile(false)}}
                className='flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 transition hover:bg-red-50'
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>
          )}
        </div>
      </div>

      {/* Mobile Search Input */}
      {showMobileSearch && (
        <form
          onSubmit={handleSearch}
          className='flex w-full items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 sm:hidden'
        >
          <Search size={18} className='text-gray-400' />

          <input
            type='text'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder='Search habits...'
            className='min-w-0 flex-1 bg-transparent text-sm outline-none'
          />
        </form>
      )}

    </header>
  )
}

export default Navbar
