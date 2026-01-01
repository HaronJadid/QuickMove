import CltPersonalInfo from './components/CltPersonalInfo'
import './style/CltPersonalInfo.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/Authentication/components/Authprovider'
import Stats from '../../components/Stats'
import { useState } from 'react'

export default function Clientprofile(){
    const navigate=useNavigate()
    const {logout}=useAuth()

    const logoutfct=()=>{
        
        logout()
        navigate('/')
        
        


    }
    let [selectedTab,setSelectedTab]=useState('myprofile')

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
                    <button onClick={()=>setSelectedTab('mybookings')} className={(selectedTab=='mybookings')?"tab-item active":"tab-item"}>My Bookings</button>
                    <button onClick={()=>setSelectedTab('myratings')} className={(selectedTab=='myratings')?"tab-item active":"tab-item"}>My Ratings</button>
                </div>
            </div>
           {selectedTab=='myprofile' &&<CltPersonalInfo />}
           {selectedTab=='mybookings' &&<CltPersonalInfo />}
            <div className='logout-ctn' >
              <button onClick={logoutfct} className='logout'>Log out</button>
            </div>
      </div> 
    )
}