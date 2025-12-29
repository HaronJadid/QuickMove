import CltPersonalInfo from './components/CltPersonalInfo'
import './style/CltPersonalInfo.css'
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
            <CltPersonalInfo />
            <div className='logout-ctn'>
              <button onClick={logoutfct} className='logout'>Log out</button>
            </div>
        </>
    )
}