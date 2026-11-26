import {createContext,useState,useEffect} from 'react'
import api from '../services/api'

const HabitContext=createContext()
export const HabitProvider=({children})=>{
    const[habits,setHabits]=useState([])
    const[isLoading,setIsLoading]=useState(true)
    const[settings,setSettings]=useState({
        displayName:'Gardener',
        theme:'light',
        animations:true,
        weekStartsOn:1,
    })
    

    useEffect(()=>{
        const fetchHabits=async()=>{
            try{
                const response=await api.get('/habits')
                setHabits(response.data)
            }catch(error){
                console.log('Error fetching habits:',error)
             }
             finally{
                setIsLoading(false)
             }
        }
        fetchHabits()
    },[])
    
    // Fetch settings
    useEffect(() => {
    const fetchSettings = async () => {
        try {
            const response = await api.get('/settings')
            setSettings(response.data)
        } catch (error) {
            console.log('Error fetching settings:', error)
        }
    }

    fetchSettings()
}, [])
    
    return(
        <HabitContext.Provider value={{habits,setHabits,isLoading,settings,setSettings}}>
            {children}
        </HabitContext.Provider>
    )

}
export default HabitContext