import { useState, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import {
    addAccountSetting,
    addCategorySetting,
    removeAccountSetting,
    removeCategorySetting
} from '../redux/slices/userSlice';
import styles from './ProfilePage.module.css';
import AccountCategoryEditor from '../components/AccountCategoryEditor';
import AccountCategoryCard from '../components/AccountCategoryCard';
import { v4 as uuidv4 } from 'uuid';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { accounts, categories } = useAppSelector((state) => state.userSettings);

    const [editing, setEditing] = useState(null);
    const [mode, setMode] = useState(null); // 'account' | 'category'

    const handleAddAccount = (data) => {
        dispatch(addAccountSetting({ ...data, id: uuidv4() }));
        setEditing(null);
    };

    const handleAddCategory = (data) => {
        dispatch(addCategorySetting({ ...data, id: uuidv4() }));
        setEditing(null);
    };

    const handleDelete = (id, type) => {
        if (type === 'account') dispatch(removeAccountSetting(id));
        if (type === 'category') dispatch(removeCategorySetting(id));
    };

    const modalRef = useRef();

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
                    className={`${styles.button} bg-green-600 hover:bg-green-700`}
                    onClick={() => {
                        setEditing({ name: '', color: '#60a5fa', icon: '🏦', balance: 0 });
                        setMode('account');
                    }}
                >
                    ➕ Aggiungi Conto
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
                    className={`${styles.button} bg-green-600 hover:bg-green-700`}
                    onClick={() => {
                        setEditing({ name: '', color: '#e5e7eb', icon: '🛒' });
                        setMode('category');
                    }}
                >
                    ➕ Aggiungi Categoria
                </button>
            </section>

            {editing && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
                    <div ref={modalRef} className="bg-white p-6 rounded shadow-lg w-full max-w-md">
                        <AccountCategoryEditor
                            initialData={editing}
                            mode={mode}
                            onSave={mode === 'account' ? handleAddAccount : handleAddCategory}
                            onCancel={() => setEditing(null)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfilePage;
