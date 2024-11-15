'use client'

import { useAuth } from "../../context/AuthContext";
import '../stylesheets/Header.css'
import Link from "next/link";

function Header() {
    const { currentUser, loading } = useAuth();

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
                    {!loading && (
                        currentUser ? (
                            <Link href='/dashboard'>
                                <div id="dashboard" style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                                    <span style={{ marginRight: '8px' }}>{currentUser.name}'s Profile</span>
                                    <img src="https://firebasestorage.googleapis.com/v0/b/uga-pet-blog.appspot.com/o/Avatar.jpg?alt=media&token=46c8598c-d78b-424e-83ac-29017f4c3b9b" alt="Avatar" style={{ width: '32px', height: '32px' }} />
                                </div>
                            </Link>
                        ) : (
                            <>
                                <Link href='/signup'>
                                    <div>Sign Up</div>
                                </Link>
                                <Link href='/login'>
                                    <div>Log In</div>
                                </Link>
                            </>
                        )
                    )}
                </div>
            </div>
        </div>
    );    
}

export default Header;
