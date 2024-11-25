'use client'

import Header from "../components/Header"
import '../stylesheets/About.css'

export default function App() {
    return (
        <div className="about-container">
            <Header/>
            <div className="about-content">
                <h1 className="about-title">About Us and This Project</h1>
                <p className="about-body">
                    Hello! This project was created as part of a group project for UGA&#39;s Software Engineering
                    course. We chose to design a pet blog as we all share a passion for pets, and wanted a
                    place for students and friends to share their favorite photos.
                </p>
                <p className="about-body">
                    This site supports account creation, the ability to post and delete to the main
                    dashboard, and the ability to show love to the posts you enjoy with a &#39;like&#39; button.
                </p>
                <p className="about-body">Possible upcoming features for this site (but not guaranteed):</p>
                <ul className="about-features">
                    {/*<li>Comments on posts with likes</li>*/}
                    <li>Post editing</li>
                    <li>Sorting function</li>
                    <li>Search bar</li>
                </ul>
                <div className="about-disclaimer">
                    <i>
                        Disclaimer: although we made best efforts to guarantee security and smoothness on this
                        site, performance is not guaranteed. You may encounter unexpected glitches. If you have a
                        serious issue, please contact us at:
                    </i>
                    <i className="about-email">wheremydawgsathelp@gmail.com</i>
                </div>
            </div>
        </div>
    )
}
