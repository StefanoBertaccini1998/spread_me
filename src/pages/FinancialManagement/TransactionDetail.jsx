import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../redux/hooks/useRedux';
import { deleteTransaction, updateTransaction } from '../../redux/asyncThunks/transactionThunks';
import DynamicForm from '../../components/DynamicForm';
import styles from './TransactionDetail.module.css';
import { useState } from 'react';
import { ArrowLeft, Pencil, Save, Trash2, FileText } from 'lucide-react';

const TransactionDetail = () => {
    const { id } = useParams();
    const location = useLocation();
    const fromSection = location.state?.from || 'expenses'; // fallback se diretto
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const [toast, setToast] = useState({ message: '', type: '' });
    const [editMode, setEditMode] = useState(false); // nuovo stato

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
        dispatch(deleteTransaction(id));
        setToast({ message: 'Transazione eliminata con successo', type: 'success' });
        setTimeout(() => navigate(`/finance/${fromSection}`), 1200);
    };

    const handleUpdate = async (updatedData) => {
        dispatch(updateTransaction({ id, updates: updatedData }));
        setToast({ message: 'Transazione aggiornata con successo', type: 'success' });
        setEditMode(false);
    };

    if (!transaction) return <p className="text-center mt-8 text-gray-500">Transazione non trovata.</p>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <FileText size={24} aria-hidden="true" />
                <h1 className={styles.title}>Dettaglio Transazione</h1>
            </div>
            <div className={styles.section}>


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
                        <ArrowLeft size={16} aria-hidden="true" /> Torna a {labels[fromSection]}
                    </button>
                    {!editMode ? (
                        <button className={styles.updateButton} onClick={() => setEditMode(true)}>
                            <Pencil size={16} aria-hidden="true" /> Modifica
                        </button>
                    ) : (
                        <button className={styles.saveButton} onClick={() => document.querySelector('form').requestSubmit()}>
                            <Save size={16} aria-hidden="true" /> Salva
                        </button>
                    )}

                    <button className={styles.deleteButton} onClick={handleDelete}>
                        <Trash2 size={16} aria-hidden="true" /> Elimina
                    </button>

                </div>

                {
                    toast.message && (
                        <div className={`${styles.toast} ${styles[toast.type]}`}>{toast.message}</div>
                    )
                }
            </div >
        </div>
    );
};

export default TransactionDetail;
