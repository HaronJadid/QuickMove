import CltPersonalInfo from './components/CltPersonalInfo'




export default function Driverprofile(){
    const logout=()=>{
        const {logout}=useAuth()
        logout()


    }

    return (
        <>
            <CltPersonalInfo />
            <button onClick={logout}>Log out</button>
        </>
    )
}