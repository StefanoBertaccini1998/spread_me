import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { createAccount, updateAccount, deleteAccount } from '../redux/asyncThunks/accountThunks';
import { createCategory, updateCategory, deleteCategory } from '../redux/asyncThunks/categoryThunks';
import styles from './ProfilePage.module.css';
import AccountCategoryEditor from '../components/AccountCategoryEditor';
import AccountCategoryCard from '../components/AccountCategoryCard';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const accounts = useAppSelector((state) => state.accounts.data);
    const categories = useAppSelector((state) => state.categories.data);

    const [editing, setEditing] = useState(null);
    const [mode, setMode] = useState(null); // 'account' | 'category'
    const modalRef = useRef();

    const handleSave = async (data) => {
        console.log("ID: ", data.id, "Mode: ", mode)
        console.log("Data", data)
        const action = data.id
            ? mode === 'account'
                ? updateAccount({ id: data.id, updates: data })
                : updateCategory({ id: data.id, updates: data })
            : mode === 'account'
                ? createAccount(data)
                : createCategory(data);

        await dispatch(action);
        setEditing(null);
    };

    const handleDelete = (id, type) => {
        const action = type === 'account' ? deleteAccount(id) : deleteCategory(id);
        dispatch(action);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                setEditing(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>⚙️ Impostazioni Utente</h1>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>🏦 Conti Bancari</h2>
                <div className={styles.list}>
                    {accounts.map((acc) => (
                        <AccountCategoryCard
                            key={acc.id}
                            name={acc.name}
                            icon={acc.icon}
                            color={acc.color}
                            balance={acc.balance}
                            onEdit={() => {
                                setEditing(acc);
                                setMode('account');
                            }}
                            onDelete={() => handleDelete(acc.id, 'account')}
                        />
                    ))}
                </div>

                <button
                    className={styles.buttonAdd}
                    onClick={() => {
                        setEditing({ name: '', color: '#60a5fa', icon: '🏦', balance: 0 });
                        setMode('account');
                    }}
                >
                    Aggiungi Conto
                </button>
            </section>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>🛒 Categorie di Spesa</h2>
                <div className={styles.list}>
                    {categories.map((cat) => (
                        <AccountCategoryCard
                            key={cat.id}
                            name={cat.name}
                            icon={cat.icon}
                            color={cat.color}
                            onEdit={() => {
                                setEditing(cat);
                                setMode('category');
                            }}
                            onDelete={() => handleDelete(cat.id, 'category')}
                        />
                    ))}
                </div>

                <button
                    className={styles.buttonAdd}
                    onClick={() => {
                        setEditing({ name: '', color: '#e5e7eb', icon: '🛒' });
                        setMode('category');
                    }}
                >
                    Aggiungi Categoria
                </button>
            </section>

            {editing && (
                <div className={styles.modalOverlay}>
                    <div ref={modalRef} className={styles.modalContent}>
                        <AccountCategoryEditor
                            initialData={editing}
                            mode={mode}
                            onSave={handleSave}
                            onCancel={() => setEditing(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
