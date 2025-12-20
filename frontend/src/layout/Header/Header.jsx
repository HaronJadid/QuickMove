import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import axios from "axios";
import SearchFormContainer from "../../pages/HomePage/components/SearchFormContainer";
import Contactus from "./headerComponents/Contactus";
import useAuth from '../../features/Authentication/components/Authprovider'
import { useEffect } from "react";

import { useOnClickOutside } from "../../useOnClickOutside";

import './header.css'; 



export default function Header({scrollToSearchForm}) {
    

    let [isContactUsOpen,setisContactUsOpen]=useState(false)
    const ref1=useRef()
    const userinfo=null
    useOnClickOutside(ref1,()=>{setisContactUsOpen(false)})


    const user=localStorage.getItem()
     useEffect(async()=>{
        if(user){
         const id=localStorage.getItem('userdata.id')
         const res=await axios.get('http://localhost:3000/api/user/:id')
         userinfo={
            username:res.prenom+ ' '+res.nom ,
            pic:res.imgUrl

         }

        }
      
    }
      )
  

   
    return (
        <div className="header">
            <div className="header-left">
                <h4 className="websitelogo">
                    <span><img src="../../public/logo.jpg"/></span> 
                    <Link to='/' className="linktohome"><span>MoveMorocco</span> </Link> 
                </h4>            </div>

            <nav className="header-center">
                <Link className="nav-item" onClick={scrollToSearchForm}>🔍︎ Search Transport</Link>
                <Link to='/aboutus' className="nav-item">
                    <i className="icon">👤</i> About us
                </Link>
                <div className="contactuselement" ref={ref1} >
                 <Link className="nav-item" onClick={()=>setisContactUsOpen((i)=>!i)}>✉ Contact us
                 </Link>
                  {isContactUsOpen &&  ( <div className='contactusComponent'> <Contactus  />   </div> )}
                   
                </div>
                <div>
                {user && <Link to='/' className="nav-item">▥ Dashboard</Link>} 
                </div>

            </nav>
            
            <div className="header-right">
                {user && <div className="not-bell">🔔︎</div>}
                
                {user? (
                        <Link to='/clientprofile' className="prf">
                            <img alt="Profile picture" className="user-avatar" src={userinfo.pic || '../../../public/alt_img.webp'}></img>
                            <span className="user-name">{userinfo.username}</span>
                        </Link>
                     )
                :
                (<Link to='/login' className="login-btn">Login | Sign up</Link>) }
            </div>
                
        </div>
    );
}