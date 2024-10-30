'use client'

import '../stylesheets/Body.css'
import SubmissionGrid from "./SubmissionGrid";
import { submissions } from '../data';
import Link from 'next/link';

function Body() {
    
    return (
        <div className="body">
            <SubmissionGrid submissions ={submissions}></SubmissionGrid>
            <Link href="/create-post">
                <button className="create-post-button">+</button>
            </Link>
        </div>
        
    )
}

export default Body;