import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { createAccount, updateAccount, deleteAccount } from '../redux/asyncThunks/accountThunks';
import { createCategory, updateCategory, deleteCategory } from '../redux/asyncThunks/categoryThunks';
import styles from './ProfilePage.module.css';
import AccountCategoryEditor from '../components/AccountCategoryEditor';
import AccountCategoryCard from '../components/AccountCategoryCard';
import { Plus } from 'lucide-react';
import Modal from '../components/Modal';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const accounts = useAppSelector((state) => state.accounts.data);
    const categories = useAppSelector((state) => state.categories.data);

    const [editing, setEditing] = useState(null);
    const [mode, setMode] = useState(null); // 'account' | 'category'

    const handleSave = async (data) => {
        let action;

        if (data.id) {
            if (mode === 'account') {
                action = updateAccount({ id: data.id, updates: data });
            } else {
                action = updateCategory({ id: data.id, updates: data });
            }
        } else if (mode === 'account') {
            action = createAccount(data);
        } else {
            action = createCategory(data);
        }

        dispatch(action);
        setEditing(null);
    };

    const handleDelete = (id, type) => {
        const action = type === 'account' ? deleteAccount(id) : deleteCategory(id);
        dispatch(action);
    };

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
                    <Plus size={18} aria-hidden="true" />Aggiungi Conto
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
                    <Plus size={18} aria-hidden="true" />Aggiungi Categoria
                </button>
            </section>

            <Modal
                isOpen={!!editing}
                onClose={() => setEditing(null)}
                type={mode === 'account' ? 'account' : 'category'}
            >
                {editing && (
                    <AccountCategoryEditor
                        initialData={editing}
                        mode={mode}
                        onSave={handleSave}
                        onCancel={() => setEditing(null)}
                    />
                )}
            </Modal>
        </div>
    );
};

export default ProfilePage;
