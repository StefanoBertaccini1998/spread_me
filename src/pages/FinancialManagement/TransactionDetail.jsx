import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/useRedux';
import { deleteTransaction, updateTransaction } from '../../redux/asyncThunks/transactionThunks';
import DynamicForm from '../../components/DynamicForm';
import styles from './TransactionDetail.module.css';
import { useState } from 'react';

const TransactionDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const fromSection = location.state?.from || 'expenses'; // fallback se diretto
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [editMode, setEditMode] = useState(false); // 👈 nuovo stato

    const labels = {
        expenses: 'Spese',
        incomes: 'Entrate',
        transfers: 'Trasferimenti'
    };

    const transaction = useAppSelector((state) =>
        [...state.transaction.expenses, ...state.transaction.incomes, ...state.transaction.transfers].find(
            (t) => String(t.id) === String(id)
        )
    );

    const handleDelete = async () => {
        await dispatch(deleteTransaction(id));
        setToast({ message: 'Transazione eliminata con successo', type: 'success' });
        setTimeout(() => navigate(`/finance/${fromSection}`), 1200);
    };

    const handleUpdate = async (updatedData) => {
        await dispatch(updateTransaction({ id, updates: updatedData }));
        setToast({ message: 'Transazione aggiornata con successo', type: 'success' });
        setEditMode(false);
    };

    if (!transaction) return <p className="text-center mt-8 text-gray-500">Transazione non trovata.</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>🧾 Dettaglio Transazione</h1>

            <DynamicForm
                type={transaction.type}
                editData={transaction}
                disabled={!editMode}
                onClose={() => navigate(-1)}
                onSave={handleUpdate}
                setToastMessage={(msg) => setToast({ message: msg, type: 'success' })}
                setToastType={() => { }}
            />

            <div className={styles.buttonGroup}>
                <button className={styles.backButton} onClick={() => navigate(`/finance/${fromSection}`)}>
                    🔙 Torna a {labels[fromSection]}
                </button>
                {!editMode ? (
                    <button className={styles.updateButton} onClick={() => setEditMode(true)}>
                        ✏️ Modifica
                    </button>
                ) : (
                    <button className={styles.saveButton} onClick={() => document.querySelector('form').requestSubmit()}>
                        💾 Salva
                    </button>
                )}

                <button className={styles.deleteButton} onClick={handleDelete}>
                    🗑️ Elimina
                </button>

            </div>

            {toast.message && (
                <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.message}</div>
            )}
        </div>
    );
};

export default TransactionDetail;
