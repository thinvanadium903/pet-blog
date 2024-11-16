'use client'

import '../stylesheets/SubmissionGrid.css';
import Submission from './Submission';

function SubmissionGrid({ submissions }) {
    return (
        <div className="submission-grid">
            {submissions.map((submission, index) => (
                <Submission
                    key={index}
                    name={submission.petName}
                    imageUrl={submission.photoURL}
                    description={submission.description}
                    userName={submission.userName}
                    createdAt={submission.createdAt}
                />
            ))}
        </div>
    );
}

export default SubmissionGrid;