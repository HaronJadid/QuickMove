import DrPersonalInfo from './components/DrPersonalInfo'
import './style/DrPersonalInfo.css'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../features/Authentication/components/Authprovider'

export default function Driverprofile(){
      const navigate=useNavigate()
      const {logout}=useAuth()

      const logoutfct=()=>{
        
        logout()
        navigate('/')
    
       }

    return (
        <>
            <DrPersonalInfo />
             <div className='logout-ctn'>
              <button onClick={logoutfct} className='logout'>Log out</button>
            </div>
        </>
    )
}