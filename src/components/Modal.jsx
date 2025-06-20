import { createPortal } from 'react-dom';
import styles from './Modal.module.css';

const Modal = ({ isOpen, onClose, children, type }) => {
    if (!isOpen) return null;

    return createPortal(
        <div className={styles.overlay}>
            <div className={`${styles.content} ${styles['modal-' + type]}`}>
                <button onClick={onClose} className={styles.close}>X</button>
                {children}
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;