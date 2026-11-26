import React,{useEffect} from 'react'
import api from '../services/api'
import useHabits from '../hooks/useHabits'

function Settings() {
  const {settings, setSettings} = useHabits()
useEffect(()=>{
  const fetchSettings=async()=>{
    try{
      const response=await api.get('/settings')
      setSettings(response.data)
    }
    catch(error){
      console.error('Error fetching settings:',error)
    }
  }
  fetchSettings()
},[])
// updating setting function
const handleChange=(e)=>{
  const{name,value,type,checked}=e.target

  setSettings((previousSettings)=>({
    ...previousSettings,
    [name]:type==='checkbox'?checked:name==='weekStartOn'?Number(value):value,
  }))
}
// Saving setting function
const handleSave = async () => {
  try {
    await api.put('/settings', settings)
    alert('Settings saved successfully!')
  } catch (error) {
    console.error('Error saving settings:', error)
    alert('Unable to save settings. Please try again!')
  }
}
  return (
    <div>
        <h1 className='text-3xl font-bold text-green-950'>
            Settings
        </h1>
      
      <p className='mt-2 text-gray-600'>
        Customize your Habit Garden Experience.
      </p>

      {/* Display Name Settings */}
      <div className='mt-8 rounded-xl bg-white p-6 shadow-sm'>
        <h2 className='text-xl font-bold text-green-950'>
          Profile Settings
        </h2>
        <div className='mt-5'>
          <label className='mb-2 block text-sm font-medium text-gray-700'>
            Display Name
          </label>
          <input type='text'
          name='displayName'
          value={settings.displayName}
          onChange={handleChange}
          placeholder='Enter your name'
          className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 sm:w-1/2'/>
        </div>
      </div>
      {/* Theme Settings */}
<div className='mt-6 rounded-xl bg-white p-6 shadow-sm'>
  <h2 className='text-xl font-bold text-green-950'>
    Appearance
  </h2>

  <p className='mt-2 text-sm text-gray-500'>
    Choose your preferred theme.
  </p>

  <div className='mt-5'>
    <label className='mb-2 block text-sm font-medium text-gray-700'>
      Select Theme
    </label>

    <select
      name='theme'
      value={settings.theme}
      onChange={handleChange}
      className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 sm:w-1/2'
    >
      <option value='light'>Light Mode</option>
      <option value='dark'>Dark Mode</option>
    </select>
  </div>
</div>
{/* Animation Settings */}
<div className='mt-6 rounded-xl bg-white p-6 shadow-sm'>
  <h2 className='text-xl font-bold text-green-950'>
    Animations
  </h2>

  <div className='mt-5 flex flex-wrap items-center justify-between gap-4'>
    <div>
      <h3 className='font-medium text-gray-800'>
        Enable Animations
      </h3>

      <p className='mt-1 text-sm text-gray-500'>
        Turn interface animations on or off.
      </p>
    </div>

    <input
      type='checkbox'
      name='animations'
      checked={settings.animations}
      onChange={handleChange}
      className='h-5 w-5 accent-green-600'
    />
  </div>
</div>
{/* Week Start Settings */}
<div className='mt-6 rounded-xl bg-white p-6 shadow-sm'>
  <h2 className='text-xl font-bold text-green-950'>
    Calendar Settings
  </h2>

  <div className='mt-5'>
    <label className='mb-2 block text-sm font-medium text-gray-700'>
      Week Starts On
    </label>

    <select
      name='weekStartsOn'
      value={settings.weekStartsOn}
      onChange={handleChange}
      className='w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600 sm:w-1/2'
    >
      <option value={1}>Monday</option>
      <option value={0}>Sunday</option>
    </select>
  </div>
</div>
{/* Save Settings */}
<div className='mt-8 flex justify-end'>
  <button
    onClick={handleSave}
    className='rounded-lg bg-green-700 px-6 py-3 font-semibold text-white transition hover:bg-green-800'
  >
    Save Settings
  </button>
</div>

    </div>
    
  )
}

export default Settings
