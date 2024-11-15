'use client'

import Header from "../components/Header"
import '../stylesheets/About.css'

export default function App() {
  return (
    <div>
      <Header></Header>
      <h1 id='about-title'>About Us and This Project</h1>
      <p id='about-body'>
        Hello! This project was created as part of a group project for UGA's Software Engineering 
        course. We chose to design a pet blog as we all share a passion for pets and wanted a 
        place for students and friends to share pet photos.
      </p>
      <p id='about-body'>
        This site supports account creation, the ability to post and delete to the main 
        dashboard, and the ability to show love to the posts you enjoy with a 'like' button. 
      </p>
      <i id='about-disc'>
        Disclaimer: although we made best efforts to guarantee security and smoothness on this 
        site, performance is not guaranteed. You may encounter unexpected glitches. If you have a 
        serious issue please contact us at </i> <a href='ppb93083@uga.edu' id='email'>ppb93083@uga.edu</a><i className='line'>.</i>

    </div>
  )
}