import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import SearchFormContainer from "../../pages/HomePage/components/SearchFormContainer";

import { useAuth } from '../../features/Authentication/components/Authprovider';
import { useOnClickOutside } from "../../useOnClickOutside";
import './header.css';
import { Search, Info, Mail, LogIn, User, Settings, LogOut, LayoutDashboard, ChevronDown } from 'lucide-react';

export default function Header({ scrollToSearchForm }) {

    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';


    const profileRef = useRef();

    const [role, setRole] = useState(null);
    const [username, setUsername] = useState(null);
    const [pic, setPic] = useState(null);
    const [userId, setUserId] = useState(null);

    const { logout } = useAuth();
    const navigate = useNavigate();


    useOnClickOutside(profileRef, () => setIsProfileDropdownOpen(false));

    // Get user info from localStorage
    useEffect(() => {
        const getUserInfo = () => {
            try {
                const userFetched = localStorage.getItem('user');

                if (userFetched) {
                    const user = JSON.parse(userFetched);

                    setUserId(user.userId);
                    setUsername(`${user.prenom || ''} ${user.nom || ''}`);
                    setRole(user.role);

                    const startUrl = user.imgUrl;
                    const finalUrl = startUrl
                        ? (startUrl.startsWith('http') ? startUrl : `${API_URL}${startUrl.startsWith('/') ? startUrl.slice(1) : startUrl}`)
                        : null;
                    setPic(finalUrl);
                } else {
                    setUserId(null);
                    setUsername(null);
                    setRole(null);
                    setPic(null);
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                setUserId(null);
                setUsername(null);
                setRole(null);
                setPic(null);
            }
        };

        getUserInfo();

        const handleStorageChange = (e) => {
            if (e.key === 'user') {
                getUserInfo();
            }
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    const profileURL = role === 'client' ? '/clientprofile' :
        role === 'driver' ? '/driverprofile' :
            '/login';

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsProfileDropdownOpen(false);
        // Force state update since localStorage change might not trigger immediately in same tab
        setRole(null);
        setUserId(null);
    };

    return (
        <div className="header">
            <div className="header-left">
                <Link to='/' className="logo-container">
                    <img src="/logo2.png" alt="Logo" className="logo-img" />
                    <span className="logo-text">QuickMove</span>
                </Link>
            </div>

            {(!role || role === 'client') && (
                <nav className="header-center">
                    <Link to='/' className="nav-item" onClick={scrollToSearchForm}>
                        <Search size={18} />
                        <span>Search Transport</span>
                    </Link>
                    <Link to='/aboutus' className="nav-item">
                        <Info size={18} />
                        <span>About us</span>
                    </Link>
                    <Link to='/contactus' className="nav-item">
                        <Mail size={18} />
                        <span>Contact us</span>
                    </Link>
                </nav>
            )}

            <div className="header-right">
                {role ? (
                    <div className="profile-dropdown-container" ref={profileRef}>
                        <div
                            className="profile-trigger"
                            onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                        >
                            <img
                                alt="Profile"
                                className="user-avatar"
                                src={pic || '/alt_img.webp'}
                            />
                            <span className="user-name-header">
                                {username || 'User'}
                            </span>
                            <ChevronDown size={16} className={`dropdown-arrow ${isProfileDropdownOpen ? 'open' : ''}`} />
                        </div>

                        {isProfileDropdownOpen && (
                            <div className="dropdown-menu">
                                <Link to={profileURL} className="dropdown-item" onClick={() => setIsProfileDropdownOpen(false)}>
                                    <LayoutDashboard size={18} />
                                    <span>Dashboard</span>
                                </Link>
                                <div className="dropdown-divider"></div>
                                <button className="dropdown-item logout-btn" onClick={handleLogout}>
                                    <LogOut size={18} />
                                    <span>Log Out</span>
                                </button>
                            </div>
                        )}
                    </div>
                ) : (
                    <Link to='/login' className="login-btn-header">
                        <LogIn size={18} />
                        <span>Login | Sign up</span>
                    </Link>
                )}
            </div>
        </div>
    );
}
