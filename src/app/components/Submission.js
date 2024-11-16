'use client'

import Link from 'next/link'
import '../stylesheets/Submission.css'

function Submission({ name, imageUrl, description, userName, createdAt }) {
    const divStyle = {
        backgroundImage: `url(${imageUrl})`,
    };

    return (
        <div className="submission-whole">
            <div className='image' style={divStyle}></div>
            <div className="submission-preview">
                <div className="submission-name">
                    <h2>{name}</h2>
                </div>
                <p>{description}</p>
                {userName && <i id='source'>Created by {userName}</i>}
                {createdAt && (
                    <p>
                        Posted on: {new Date(createdAt.seconds * 1000).toLocaleDateString()} at {new Date(createdAt.seconds * 1000).toLocaleTimeString()}
                    </p>
                )}
            </div>
        </div>
    );
}

export default Submission;