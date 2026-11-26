
import React from 'react'
import { Sprout } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

function Login() {
  const navigate = useNavigate()

  const handleLogin = () => {
    navigate('/')
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-green-50 p-4'>
      <div className='w-full max-w-md rounded-2xl bg-white p-6 shadow-lg sm:p-8'>

        <div className='mb-6 flex flex-col items-center'>
          <Sprout size={45} className='text-green-600' />

          <h1 className='mt-3 text-2xl font-bold text-green-950'>
            Habit Garden
          </h1>

          <p className='mt-2 text-sm text-gray-500'>
            Welcome back, Gardener!
          </p>
        </div>

        <form onSubmit={(e) => {
          e.preventDefault()
          handleLogin()
        }}>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Email
          </label>

          <input
            type='email'
            placeholder='Enter your email'
            required
            className='mb-4 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-500'
          />

          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Password
          </label>

          <input
            type='password'
            placeholder='Enter your password'
            required
            className='mb-6 w-full rounded-lg border border-gray-200 px-4 py-3 outline-none focus:border-green-500'
          />

          <button
            type='submit'
            className='w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800'
          >
            Login
          </button>
        </form>

      </div>
    </div>
  )
}

export default Login
