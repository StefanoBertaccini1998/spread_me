import { useUser } from '../context/UserContext';
import { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';
import './ProfilePage.css';

const ProfilePage = () => {
    const { userSettings, addAccount, addCategory } = useUser();
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
            addAccount({
                name: newAccountName,
                color: newAccountColor,
                icon: newAccountIcon,
                balance: parseFloat(newAccountBalance)
            });
            setNewAccountName('');
            setNewAccountColor('#60a5fa');
            setNewAccountIcon('🏦');
            setNewAccountBalance(0);
            setEmojiPickerVisible(false);
        }
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim() !== '') {
            addCategory({
                name: newCategoryName,
                color: newCategoryColor,
                icon: newCategoryIcon
            });
            setNewCategoryName('');
            setNewCategoryColor('#e5e7eb');
            setNewCategoryIcon('🛒');
            setEmojiCategoryPickerVisible(false);
        }
    };

    return (
        <div className="profile-container">
            <h1 className="profile-title">⚙️ Impostazioni Utente</h1>

            {/* BANK ACCOUNTS */}
            <section className="profile-section">
                <h2 className="profile-subtitle">🏦 Conti Bancari</h2>
                <div className="profile-list">
                    {userSettings.accounts.map((acc, idx) => (
                        <div key={idx} className="profile-account-item" style={{ backgroundColor: acc.color }}>
                            <div className="profile-account-top">
                                <span className="text-2xl">{acc.icon}</span>
                                <span className="profile-account-name">{acc.name}</span>
                            </div>
                            <div className="profile-account-balance">
                                €{acc.balance?.toFixed(2) || '0.00'}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form to Add New Account */}
                <div className="profile-form">
                    <div className="profile-form-row">
                        <input type="text" value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} placeholder="Nome Conto" className="profile-input" />
                        <input type="number" value={newAccountBalance} onChange={(e) => setNewAccountBalance(e.target.value)} placeholder="Saldo Iniziale (€)" className="profile-input" />
                        <input type="color" value={newAccountColor} onChange={(e) => setNewAccountColor(e.target.value)} className="profile-color-picker" />
                    </div>
                    <div className="profile-form-row">
                        <button type="button" onClick={() => setEmojiPickerVisible(!emojiPickerVisible)} className="profile-button">
                            {newAccountIcon} Scegli Emoji
                        </button>
                        <button onClick={handleAddAccount} className="profile-button bg-green-600 hover:bg-green-700">
                            ➕ Aggiungi Conto
                        </button>
                    </div>
                    {emojiPickerVisible && (
                        <div className="emoji-picker-container">
                            <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                    setNewAccountIcon(emojiData.emoji);
                                    setEmojiPickerVisible(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </section>

            {/* EXPENSE CATEGORIES */}
            <section className="profile-section">
                <h2 className="profile-subtitle">🛒 Categorie di Spesa</h2>
                <div className="profile-list">
                    {userSettings.categories.map((cat, idx) => (
                        <div key={idx} className="profile-category-item" style={{ backgroundColor: cat.color }}>
                            <div className="profile-category-top">
                                <span className="text-2xl">{cat.icon}</span>
                                <span className="profile-category-name">{cat.name}</span>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Form to Add New Category */}
                <div className="profile-form">
                    <div className="profile-form-row">
                        <input type="text" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder="Nome Categoria" className="profile-input" />
                        <input type="color" value={newCategoryColor} onChange={(e) => setNewCategoryColor(e.target.value)} className="profile-color-picker" />
                    </div>
                    <div className="profile-form-row">
                        <button type="button" onClick={() => setEmojiCategoryPickerVisible(!emojiCategoryPickerVisible)} className="profile-button">
                            {newCategoryIcon} Scegli Emoji
                        </button>
                        <button onClick={handleAddCategory} className="profile-button bg-green-600 hover:bg-green-700">
                            ➕ Aggiungi Categoria
                        </button>
                    </div>
                    {emojiCategoryPickerVisible && (
                        <div className="emoji-picker-container">
                            <EmojiPicker
                                onEmojiClick={(emojiData) => {
                                    setNewCategoryIcon(emojiData.emoji);
                                    setEmojiCategoryPickerVisible(false);
                                }}
                            />
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
};

export default ProfilePage;
