// ConfirmationModal.js
import React from 'react';
import './ConfirmationModal.css';

function ConfirmationModal({ isOpen, onClose, onConfirm }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Confirm Deletion</h2>
                <p>Are you sure you want to delete this post?</p>
                <div className="modal-buttons">
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                    <button onClick={onConfirm} className="confirm-button">Delete</button>
                </div>
            </div>
        </div>
    );
}

export default ConfirmationModal;