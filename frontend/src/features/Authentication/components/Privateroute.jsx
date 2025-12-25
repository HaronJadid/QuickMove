import { Navigate,Outlet } from "react-router-dom";
import { useAuth } from "./Authprovider";


export default function Privateroute(){
    const {user}=useAuth()

    return user? <Outlet/>:<Navigate to='/' />;
}
