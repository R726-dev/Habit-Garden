import {useContext} from 'react'
import HabitContext from '../context/HabitContext'

const useHabits=()=>{
    return useContext(HabitContext)
}

export default useHabits