import { useContext } from "react";
import { useEffect, useState } from "react"
import { createContext } from "react"

const Authcontext=createContext();

export default function Authprovider({children}){
    const [user,setUser]=useState(null)
    const [loading,setLoading]=useState(true)

    useEffect(()=>{
        const isloggedin=async()=>{
        try{
            const storeduser=localStorage.getItem('user')

            if(storeduser){
                setUser(JSON.parse(storeduser))
            }

        }catch(err){
           console.error("Error parsing user from local storage", err);
        }finally{
            setLoading(false)
        }
        }
        isloggedin()



    }
    ,[])

    const login=(userdata)=>{
        setUser(userdata)
        localStorage.setItem('user',JSON.stringify(userdata))

    }

    const logout=()=>{
        setUser(null)
        localStorage.removeItem('user')
    }
    
    return(
        <Authcontext.Provider value={{user,loading,login,logout}}>
            {!loading && children}
        </Authcontext.Provider>

    )
}
 
export const useAuth=()=>{
   return useContext(Authcontext)
}