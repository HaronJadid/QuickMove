import DrPersonalInfo from './components/DrPersonalInfo'
import './style/DrPersonalInfo.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/Authentication/components/Authprovider'
import Stats from './components/Stats'


export default function Driverprofile(){
      const navigate=useNavigate()
      const {logout}=useAuth()

      const logoutfct=()=>{
        
        logout()
        navigate('/')
    
       }

    return (
        <div style={{background:' linear-gradient(135deg, #d64c5e 0%, #c41e3a 100%)'}}>
            <Stats/>
            <div className="tabs-wrapper">
                <div className="tabs-container">
                    <button className="tab-item">My Bookings</button>
                    <button className="tab-item">My Ratings</button>
                    <button className="tab-item active">My Profile</button>
                </div>
            </div>

            <DrPersonalInfo />
             <div className='logout-ctn'>
              <button onClick={logoutfct} className='logout'>Log out</button>
            </div>
        </div>
    )
}