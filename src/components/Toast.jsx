import { useEffect } from 'react';
import styles from './Toast.module.css';

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 1000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className={`${styles.toast} ${styles[`toast-${type}`]}`}>
            {message}
        </div>
    );
};

export default Toast;