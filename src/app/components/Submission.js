'use client'

import Link from 'next/link'
import '../stylesheets/Submission.css'

function Submission({ name, imageUrl, description, link, source }) {
    const divStyle = {
        backgroundImage: `url(${imageUrl})`, // Set the background image
      };
    
    return (
        <div className="submission-whole">
            <div className='image' style={divStyle}>

            </div>
            <div className="submission-preview">
                <div className="submission-name">
                        <Link href={link}><h2>{name}</h2></Link>
                </div>
                    <p>{description}</p> 
                    {source && source.length != 0 && <i id='source'>Posted by {source}</i>}
            </div>
        </div>
    );
}

export default Submission;