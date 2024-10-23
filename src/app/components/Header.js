'use client'

import '../stylesheets/Header.css'
import Link from "next/link";

function Header() {
    return (
        <div id='grand'>
            <div className="header">
                <div id="about"><Link href='/about'>About</Link></div>
                <div id="title">
                    <p><Link href='/'>Where My Dawgs At?</Link></p>
                </div>
                <div id="login"><Link href='/login'>Log In</Link></div>
                
            </div>
        </div>
    );    
}

export default Header;