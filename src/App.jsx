import React from 'react'
import{useEffect} from 'react'
import api from './services/api'
import {Routes,Route} from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Garden from './pages/Garden'
import Habits from './pages/Habits'
import Statistics from './pages/Statistics'
import Achievements from './pages/Achievements'
import Settings from './pages/Settings'
import Navbar from './components/Navbar'
import useHabits from './hooks/useHabits'
import Profile from './pages/Profile'
import Login from './pages/Login'
function App() {
  const{settings }=useHabits()
  useEffect(()=>{
    const testConnection=async()=>{
      try{
        const response=await api.get('/habits')
        console.log('Backend connected successfully')
        console.log(response.data)
      }catch(error){
        console.error('Backend connection failed:',error)
      }
    }
    testConnection()
  },[])
  return (
    <div className={`flex min-h-screen flex-col md:flex-row ${
       settings.theme === 'dark'
    ? 'dark-theme bg-[#0B1220] text-[#F1F5F9]'
    : 'light-theme bg-[#F1F5F9] text-[#334155]'
      }`}>
      <Sidebar/>
      <main className='min-w-0 flex-1 p-4 sm:p-8 md:p-10'>
        <Navbar/>
        <Routes>
          <Route path='/' element={<Dashboard/>}/>
          <Route path='/garden' element={<Garden/>}/>
          <Route path='/habits' element={<Habits/>}/>
          <Route path='/statistics' element={<Statistics/>}/>
          <Route path='/achievements' element={<Achievements/>}/>
          <Route path='/settings' element={<Settings/>}/>
          <Route path='/profile' element={<Profile />} />
          <Route path='/login' element={<Login />} />
          
        </Routes>
        
      </main>
      
    </div>
  )
}

export default App
