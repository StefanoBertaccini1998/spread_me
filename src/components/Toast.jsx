import { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 1000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const toastTypeClass = styles[`toast-${type}`];

    return (
        <div className={`${styles.toast} ${toastTypeClass}`}>
            {message}
        </div>
    );
};

export default Toast;