// components/NavigationButtons.jsx
import { useNavigate } from 'react-router-dom';
import { Plus, Import } from 'lucide-react';          // lucide icons: no colour issues
import styles from './NavigationButtons.module.css';

export default function NavigationButtons() {
    const navigate = useNavigate();
    const go = (type) => navigate(`/finance/${type}?openModal=true`);

    return (
        <div className={styles.container}>
            <button className={styles.danger} onClick={() => go('expenses')}>
                <Plus size={18} aria-hidden="true" /> Aggiungi Spesa
            </button>
            <button className={styles.success} onClick={() => go('incomes')}>
                <Plus size={18} aria-hidden="true" /> Aggiungi Entrata
            </button>
            <button className={styles.secondary} onClick={() => go('transfers')}>
                <Plus size={18} aria-hidden="true" /> Aggiungi Trasferimento
            </button>
            <button className={styles.primary} onClick={() => navigate('/import')}>
                <Import size={18} aria-hidden="true" /> Importa Dati
            </button>
        </div>
    );
}