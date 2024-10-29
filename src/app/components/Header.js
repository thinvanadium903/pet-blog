'use client'

import '../stylesheets/Header.css'
import Link from "next/link";

function Header() {
    return (
        <div id='grand'>
            <div className="header">
                <Link href='/about'>
                    <div id="about">About</div>
                </Link>
                <div id="title">
                    <p><Link href='/'>Where My Dawgs At?</Link></p>
                </div>
                <div id="auth-buttons">
                    <Link href='/dashboard'>
                        <div id="dashboard">Profile</div>
                    </Link>
                    <Link href='/signup'>
                        <div>Sign Up</div>
                    </Link>
                    <Link href='/login'>
                        <div>Log In</div>
                    </Link>
                </div>
            </div>
        </div>
    );    
}

export default Header;
