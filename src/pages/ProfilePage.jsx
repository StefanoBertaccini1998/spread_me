
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { addAccount, addCategory } from '../redux/slices/userSlice';
import EmojiPicker from 'emoji-picker-react';
import styles from './Profile.module.css';

const ProfilePage = () => {
    const dispatch = useAppDispatch();
    const { accounts, categories } = useAppSelector((state) => state.userSettings);

    const [newAccountName, setNewAccountName] = useState('');
    const [newAccountColor, setNewAccountColor] = useState('#60a5fa');
    const [newAccountIcon, setNewAccountIcon] = useState('🏦');
    const [newAccountBalance, setNewAccountBalance] = useState(0);
    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);

    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#e5e7eb');
    const [newCategoryIcon, setNewCategoryIcon] = useState('🛒');
    const [emojiCategoryPickerVisible, setEmojiCategoryPickerVisible] = useState(false);

    const handleAddAccount = () => {
        if (newAccountName.trim() !== '') {
            dispatch(addAccount({
                name: newAccountName,
                color: newAccountColor,
                icon: newAccountIcon,
                balance: parseFloat(newAccountBalance),
            }));
            setNewAccountName('');
            setNewAccountColor('#60a5fa');
            setNewAccountIcon('🏦');
            setNewAccountBalance(0);
            setEmojiPickerVisible(false);
        }
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim() !== '') {
            dispatch(addCategory({
                name: newCategoryName,
                color: newCategoryColor,
                icon: newCategoryIcon,
            }));
            setNewCategoryName('');
            setNewCategoryColor('#e5e7eb');
            setNewCategoryIcon('🛒');
            setEmojiCategoryPickerVisible(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>⚙️ Impostazioni Utente</h1>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>🏦 Conti Bancari</h2>
                <div className={styles.list}>
                    {accounts.map((acc, idx) => (
                        <div key={idx} className={styles.accountItem} style={{ backgroundColor: acc.color }}>
                            <div className={styles.accountTop}>
                                <span className="text-2xl">{acc.icon}</span>
                                <span className={styles.accountName}>{acc.name}</span>
                            </div>
                            <div className={styles.accountBalance}>
                                €{acc.balance?.toFixed(2) || '0.00'}
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.form}>
                    <div className={styles.formRow}>
                        <input type="text" value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} placeholder="Nome Conto" className={styles.input} />
                        <input type="number" value={newAccountBalance} onChange={(e) => setNewAccountBalance(e.target.value)} placeholder="Saldo Iniziale (€)" className={styles.input} />
                        <input type="color" value={newAccountColor} onChange={(e) => setNewAccountColor(e.target.value)} className={styles.colorPicker} />
                    </div>
                    <div className={styles.formRow}>
                        <button type="button" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)} className={styles.button}>
                            {newAccountIcon} Scegli Emoji
                        </button>
                        <button onClick={handleAddAccount} className={`${styles.button} bg-green-600 hover:bg-green-700`}>
                            ➕ Aggiungi Conto
                        </button>
                    </div>
                    {emojiPickerVisible && (
                        <div className={styles.emojiPicker}>
                            <EmojiPicker onEmojiClick={(emojiData) => {
                                setNewAccountIcon(emojiData.emoji);
                                setEmojiPickerVisible(false);
                            }} />
                        </div>
                    )}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>🛒 Categorie di Spesa</h2>
                <div className={styles.list}>
                    {categories.map((cat, idx) => (
                        <div key={idx} className={styles.categoryItem} style={{ backgroundColor: cat.color }}>
                            <div className={styles.categoryTop}>
                                <span className="text-2xl">{cat.icon}</span>
                                <span className={styles.categoryName}>{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className={styles.form}>
                    <div className={styles.formRow}>
                        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome Categoria" className={styles.input} />
                        <input type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className={styles.colorPicker} />
                    </div>
                    <div className={styles.formRow}>
                        <button type="button" onClick={() => setEmojiCategoryPickerVisible(!emojiCategoryPickerVisible)} className={styles.button}>
                            {newCategoryIcon} Scegli Emoji
                        </button>
                        <button onClick={handleAddCategory} className={`${styles.button} bg-green-600 hover:bg-green-700`}>
                            ➕ Aggiungi Categoria
                        </button>
                    </div>
                    {emojiCategoryPickerVisible && (
                        <div className={styles.emojiPicker}>
                            <EmojiPicker onEmojiClick={(emojiData) => {
                                setNewCategoryIcon(emojiData.emoji);
                                setEmojiCategoryPickerVisible(false);
                            }} />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
