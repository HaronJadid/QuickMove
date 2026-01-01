import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import SearchFormContainer from "../../pages/HomePage/components/SearchFormContainer";
import Contactus from "./headerComponents/Contactus";
import { useAuth } from '../../features/Authentication/components/Authprovider';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher';
import { useOnClickOutside } from "../../useOnClickOutside";
import './header.css';

export default function Header({ scrollToSearchForm }) {
    const { t } = useTranslation();
    const { user, logout } = useAuth(); // Use context

    let [isContactUsOpen, setisContactUsOpen] = useState(false)
    const ref1 = useRef()
    useOnClickOutside(ref1, () => { setisContactUsOpen(false) })

    return (
        <div className="header">
            <div className="header-left">
                <h4 className="websitelogo">
                    <span><img src="../../public/logo.jpg" alt="Logo" /></span>
                    <Link to='/' className="linktohome"><span>MoveMorocco</span> </Link>
                </h4>
            </div>

            <nav className="header-center">
                <Link to='/' className="nav-item" onClick={scrollToSearchForm}>🔍︎ {t('header.search')}</Link>
                <Link to='/aboutus' className="nav-item">
                    <i className="icon">👤</i> {t('header.about')}
                </Link>
                <div className="contactuselement" ref={ref1} >
                    <Link className="nav-item" onClick={() => setisContactUsOpen((i) => !i)}>✉ {t('header.contact')}
                    </Link>
                    {isContactUsOpen && (<div className='contactusComponent'> <Contactus />   </div>)}
                </div>

                {/* My Deliveries Link - Only for Clients */}
                {user && user.role === 'client' && (
                    <Link to='/my-deliveries' className="nav-item">📦 {t('my_deliveries.title', 'My Deliveries')}</Link>
                )}

                <div>
                    {user && <Link to='/' className="nav-item">▥ {t('header.dashboard')}</Link>}
                </div>
            </nav>

            <div className="header-right">
                <LanguageSwitcher />
                {user && <div className="not-bell">🔔︎</div>}

                {user ? (
                    <Link to='/clientprofile' className="prf">
                        {/* Fallback image logic can be improved */}
                        <img alt="Profile picture" className="user-avatar" src={user.imgUrl || user.pic || '../../../public/alt_img.webp'} />
                        <span className="user-name">{user.prenom} {user.nom}</span>
                    </Link>
                ) : (
                    <Link to='/login' className="login-btn">{t('header.login_signup')}</Link>
                )}
            </div>
        </div>
    );
}
