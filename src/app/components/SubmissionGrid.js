'use client'

import '../stylesheets/SubmissionGrid.css';
import Submission from './Submission';

function SubmissionGrid({ submissions }) {
    return (
        <div className="submission-grid">
            {submissions.map((submission, index) => (
                <Submission
                    key={index}
                    name={submission.name}
                    imageUrl={submission.imageUrl}
                    description={submission.description}
                    link={submission.link}
                    source={submission.source}
                />
            ))}
        </div>
    );
}

export default SubmissionGrid;