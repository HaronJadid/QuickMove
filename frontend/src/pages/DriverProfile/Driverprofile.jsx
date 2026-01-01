import DrPersonalInfo from './components/DrPersonalInfo'
import './style/DrPersonalInfo.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/Authentication/components/Authprovider'
import Stats from '../../components/Stats'
import { useState } from 'react'
import CitiesComponent from './components/CitiesComponent'


export default function Driverprofile(){
      const navigate=useNavigate()
      const {logout}=useAuth()
      let [selectedTab,setSelectedTab]=useState('myprofile')

      const logoutfct=()=>{
        
        logout()
        navigate('/')
    
       }

    return (
       <div style={{background:' linear-gradient(135deg, #d64c5e 0%, #c41e3a 100%)',padding:40,
            display: 'flex',
            justifyContent: 'center' ,
            flexDirection:'column',
            alignItems:'center'
                }}>
            <div style={{
                alignSelf:'start',
                fontSize:30,
                fontWeight:700,
                marginLeft:40,
                
                
            }}>▥ Dashboard</div>
            <Stats/>
            <div className="tabs-wrapper">
                <div className="tabs-container">
                    <button onClick={()=>setSelectedTab('myprofile')} className={(selectedTab=='myprofile')?"tab-item active":"tab-item"}>My Profile</button>
                    <button onClick={()=>setSelectedTab('myrequests')} className={(selectedTab=='myrequests')?"tab-item active":"tab-item"}>My Requests</button>
                    <button onClick={()=>setSelectedTab('myvehicules')} className={(selectedTab=='myvehicules')?"tab-item active":"tab-item"}>My Vehicules</button>
                    <button onClick={()=>setSelectedTab('cities')} className={(selectedTab=='cities')?"tab-item active":"tab-item"}>Cities</button>
                    <button onClick={()=>setSelectedTab('myratings')} className={(selectedTab=='myratings')?"tab-item active":"tab-item"}>My Ratings</button>

                </div>
            </div>
            {selectedTab=='myprofile' &&<DrPersonalInfo />}
            {selectedTab=='cities' &&<CitiesComponent />}
            <div className='logout-ctn' >
                <button onClick={logoutfct} className='logout'>Log out</button>
            </div>
        </div> 
        )
    }