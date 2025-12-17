import { useState } from "react";
import { Link } from "react-router-dom";
import { useRef } from "react";

import SearchFormContainer from "../../pages/HomePage/components/SearchFormContainer";
import Contactus from "./headerComponents/Contactus";
import useAuth from '../../features/Authentication/components/Authprovider'


import { useOnClickOutside } from "../../useOnClickOutside";

import './header.css'; 



export default function Header({scrollToSearchForm}) {
    

    let [isContactUsOpen,setisContactUsOpen]=useState(false)
    const ref1=useRef()

    useOnClickOutside(ref1,()=>{setisContactUsOpen(false)})

    const user=true
  

    const mockdata={
        username:'bob',
        pic:'https://th.bing.com/th?q=Beautiful+Bouquet+of+Flowers&w=120&h=120&c=1&rs=1&qlt=70&o=7&cb=1&dpr=1.3&pid=InlineBlock&rm=3&ucfimg=1&mkt=en-XA&cc=MA&setlang=en&adlt=strict&t=1&mw=247'
    }


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
                            <img alt="Profile picture" className="user-avatar" src={mockdata.pic}></img>
                            <span className="user-name">{mockdata.username}</span>
                        </Link>
                     )
                :
                (<Link to='/login' className="login-btn">Login | Sign up</Link>) }
            </div>
                
        </div>
    );
}