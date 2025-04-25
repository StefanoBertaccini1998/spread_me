import { createPortal } from 'react-dom';
import './Modal.css';

const Modal = ({ isOpen, onClose, children, type }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className="modal-overlay">
            <div className={`modal-content modal-${type}`}>
                <button onClick={onClose} className="modal-close">X</button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;
