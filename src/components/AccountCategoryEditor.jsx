import { useState } from 'react';
import PropTypes from 'prop-types';
import EmojiPicker from 'emoji-picker-react';
import { FiCheck, FiX } from 'react-icons/fi';
import styles from './AccountCategoryEditor.module.css';

const AccountCategoryEditor = ({ initialData, onSave, onCancel }) => {
    const isAccount = initialData.hasOwnProperty('balance');
    const [formData, setFormData] = useState({
        ...initialData,
        balance: isAccount ? initialData.balance ?? 0 : undefined,
    });

    const [emojiPickerVisible, setEmojiPickerVisible] = useState(false);
    const [errors, setErrors] = useState({});

    const validate = () => {
        const errs = {};
        if (!formData.name.trim()) errs.name = 'Nome richiesto';
        if (!formData.icon) errs.icon = 'Emoji richiesta';
        if (isAccount && formData.balance < 0) errs.balance = 'Il saldo non può essere negativo';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSave = () => {
        if (!validate()) return;
        onSave(formData);
    };

    return (
        <div className={styles.editorContainer}>
            <div className={styles.formGroup}>
                <label className={styles.editorTitle}>Nome</label>
                <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`${styles.inputField} ${errors.name ? 'border-red-500' : ''}`}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            {isAccount && (
                <div className={styles.formGroup}>
                    <label className={styles.editorTitle}>Saldo Iniziale</label>
                    <input
                        type="number"
                        value={formData.balance}
                        onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                        className={`${styles.inputField} ${errors.balance ? 'border-red-500' : ''}`}
                    />
                    {errors.balance && <p className="text-sm text-red-500">{errors.balance}</p>}
                </div>
            )}

            <div className="flex items-center gap-4">
                <div className={styles.formGroup}>
                    <label className={styles.editorTitle}>Colore</label>
                    <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className={styles.colorPicker}
                    />
                </div>

                <div className={styles.formGroup}>
                    <label className={styles.editorTitle}>Emoji</label>
                    <button
                        type="button"
                        onClick={() => setEmojiPickerVisible(!emojiPickerVisible)}
                        className={styles.emojiTrigger}
                    >
                        {formData.icon} Scegli
                    </button>
                    {errors.icon && <p className="text-sm text-red-500">{errors.icon}</p>}
                </div>
            </div>

            {emojiPickerVisible && (
                <div className={styles.emojiWrapper}>
                    <EmojiPicker
                        width="100%"
                        height={300}
                        lazyLoadEmojis={true}
                        searchDisabled={false}
                        skinTonesDisabled={false}
                        onEmojiClick={(emojiData) => {
                            setFormData({ ...formData, icon: emojiData.emoji });
                            setEmojiPickerVisible(false);
                        }}
                    />
                </div>
            )}

            <div className={styles.buttonGroup}>
                <button onClick={onCancel} className={styles.cancelButton}>
                    <FiX /> Annulla
                </button>
                <button
                    onClick={handleSave}
                    className={styles.saveButton}
                >
                    <FiCheck /> Salva
                </button>
            </div>
        </div>
    );
};

AccountCategoryEditor.propTypes = {
    initialData: PropTypes.shape({
        name: PropTypes.string,
        color: PropTypes.string,
        icon: PropTypes.string,
        balance: PropTypes.number,
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
};

export default AccountCategoryEditor;