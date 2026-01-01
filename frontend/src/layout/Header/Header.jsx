import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import SearchFormContainer from "../../pages/HomePage/components/SearchFormContainer";
import Contactus from "./headerComponents/Contactus";
import useAuth from '../../features/Authentication/components/Authprovider';
import { useOnClickOutside } from "../../useOnClickOutside";
import './header.css';

export default function Header({ scrollToSearchForm }) {
    const [isContactUsOpen, setIsContactUsOpen] = useState(false);
    const ref1 = useRef();
    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [pic, setPic] = useState(null);
    const [userId, setUserId] = useState(null);

    useOnClickOutside(ref1, () => setIsContactUsOpen(false));

    // Get user info from localStorage
    useEffect(() => {
        const getUserInfo = () => {
            try {
                const userFetched = localStorage.getItem('user');
                
                if (userFetched) {
                    const user = JSON.parse(userFetched);
                    
                    // Update all state at once or use a single state object
                    setUserId(user.userId);
                    setUsername(`${user.prenom || ''} ${user.nom || ''}`);
                    setRole(user.role);
                    setPic(user.imgUrl);
                } else {
                    // Clear state if no user
                    setUserId(null);
                    setUsername(null);
                    setRole(null);
                    setPic(null);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                // Clear state on error
                setUserId(null);
                    setUsername(null);
                    setRole(null);
                    setPic(null);
            }
        };

        // Call immediately
        getUserInfo();

        // Listen for storage changes (if user logs in/out in another tab)
        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                getUserInfo();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        // Optional: Polling for changes (if needed)
        // const interval = setInterval(getUserInfo, 5000);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            // clearInterval(interval);
        };
    }, []); // Empty dependency array - runs once on mount

    const profileURL = role === 'client' ? '/clientprofile' : 
                      role === 'driver' ? '/driverprofile' : 
                      '/login';

    return (
        <div className="header">
            <div className="header-left">
                <h4 className="websitelogo">
                    <span><img src="../../public/logo.jpg" alt="Logo" /></span>
                    <Link to='/' className="linktohome">
                        <span>MoveMorocco</span>
                    </Link>
                </h4>
            </div>

            {(!role || role === 'client') && (
                <nav className="header-center">
                    <Link to='/' className="nav-item" onClick={scrollToSearchForm}>
                        🔍︎ Search Transport
                    </Link>
                    <Link to='/aboutus' className="nav-item">
                        <i className="icon">👤</i> About us
                    </Link>
                    <div className="contactuselement" ref={ref1}>
                        <Link 
                            className="nav-item" 
                            onClick={() => setIsContactUsOpen(prev => !prev)}
                        >
                            ✉ Contact us
                        </Link>
                        {isContactUsOpen && (
                            <div className='contactusComponent'>
                                <Contactus />
                            </div>
                        )}
                    </div>
                </nav>
            )}
            
            <div className="header-right">
                {role ? (
                    <Link to={profileURL} className="prf">
                        <img 
                            alt="Profile" 
                            className="user-avatar" 
                            src={pic || '../../../public/alt_img.webp'}
                        />
                        <span className="user-name">
                            {username || 'User'}
                        </span>
                    </Link>
                ) : (
                    <Link to='/login' className="login-btn">
                        Login | Sign up
                    </Link>
                )}
            </div>
        </div>
    );
}