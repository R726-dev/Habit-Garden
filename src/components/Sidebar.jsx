import{NavLink} from 'react-router-dom'
import{LayoutDashboard,
        Flower2,
        Sprout,
        BarChart,
        Trophy,
        Settings}from 'lucide-react'
import useHabits from '../hooks/useHabits'
function Sidebar(){
    const {settings}=useHabits()
    const menuItems=[
        {name:'Dashboard',path:'/',icon:LayoutDashboard},
        {name:'My Garden',path:'/garden',icon:Flower2},
        {name:'My Habits',path:'/habits',icon:Sprout},
        {name:'Statistics',path:'/statistics',icon:BarChart},
        {name:'Achievements',path:'/achievements',icon:Trophy},
        {name:'Settings',path:'/settings',icon:Settings}
    ]
    return(
        <aside className={`w-full shrink-0 md:min-h-screen md:w-64 md:p-6 ${
            settings.theme==='dark'
            ?'bg-[#2b96c0] text-white'
            :'bg-green-950 text-white'}`}
            >
            <h1 className='text-xl font-bold mb-4 md:text-2xl'>
                Habit Garden
            </h1>
            <nav className='flex flex-row flex-nowrap gap-2 overflow-x-auto pb-2 md:flex-col md:overflow-visible md:pb-0 md:gap'>
                {menuItems.map((item)=>{
                    const Icon=item.icon
                    return(
                        <NavLink 
                        key={item.name}
                        to={item.path}
                        end={item.path==='/'}
                        className={({isActive})=>
                            `flex shrink-0 items-center  justify-center gap-3 p-3  whitespace-nowrap rounded-xl transition sm:text-sm md:w-full md:justify-start md:gap-3 md:p-3 md:text-base ${
                                isActive
                                ? 'bg-green-700 text-white'
                                :settings.theme==='dark'?
                                'bg-[#172033] text-white'
                                :'bg-[#0F766E] text-white'
                                
                            }`
                        }
                    >
                        <Icon size={20}/>
                        <span>{item.name}</span>
                    </NavLink>
                    )
                })}
            
            </nav>
        </aside>
    )
}
export default Sidebar

