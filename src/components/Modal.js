import React from 'react';

const Modal = ({ show, title, message, buttonText, onClose }) => {
  if (!show) {
    return null; 
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content">
        <div className="modal-icon">✅</div>
        <h2 className="modal-title">{title}</h2>
        <p className="modal-message">{message}</p>
        <button onClick={onClose} className="btn-primary">
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default Modal;