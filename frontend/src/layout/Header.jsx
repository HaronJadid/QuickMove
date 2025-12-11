
import { useState } from "react";
import '../assets/header.css'; 




export default function Header() {
    return (
        <div className="header">
            <div className="header-left">
                <h4 className="websitelogo">
                    <span><img src="../../public/logo.jpg"/></span> 
                    <span>MoveMorocco</span>
                </h4>            </div>

            <nav className="header-center">
                <a className="nav-item">🔍︎ Search Transport</a>
                <a className="nav-item">
                    <i className="icon">👤</i> About us
                </a>
                <a className="nav-item">✉ Contact us</a>
            </nav>

            <div className="header-right">
                <a className="login-btn">Login | Sign up</a>
            </div>
        </div>
    );
}