'use client'

import '../stylesheets/Body.css'
import SubmissionGrid from "./SubmissionGrid";
import { submissions } from '../data';

function Body() {
    
    return (
        <div className="body">
            <SubmissionGrid submissions ={submissions}></SubmissionGrid>
        </div>
        
    )
}

export default Body;