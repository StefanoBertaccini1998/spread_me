import { useState } from 'react';
import PropTypes from 'prop-types';
import EmojiPicker from 'emoji-picker-react';
import { FiCheck, FiX } from 'react-icons/fi';
import styles from './AccountCategoryEditor.module.css';

const AccountCategoryEditor = ({ initialData, onSave, onCancel }) => {
    const isEdit = !!initialData.id;
    const isAccount = initialData.hasOwnProperty('balance');
    const [formData, setFormData] = useState({
        ...initialData,
        balance: isAccount ? initialData.balance ?? 0 : undefined,
    });

    console.log("Intial data", initialData)
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
        console.log("Form data", formData)
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
                    className={`${styles.inputField} ${errors.name ? styles.inputError : ''}`}
                />
                {errors.name && <p className={styles.errorText}>{errors.name}</p>}
            </div>

            {isAccount && (
                <div className={styles.formGroup}>
                    <label className={styles.editorTitle}>Saldo Iniziale</label>
                    <input
                        type="number"
                        value={formData.balance}
                        onChange={(e) => setFormData({ ...formData, balance: parseFloat(e.target.value) })}
                        className={`${styles.inputField} ${errors.name ? styles.inputError : ''}`}
                    />
                    {errors.balance && <p className={styles.errorText}>{errors.balance}</p>}
                </div>
            )}

            <div className={styles.flexGroup}>
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
                    {errors.icon && <p className={styles.errorText}>{errors.icon}</p>}
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
                    <FiCheck /> {isEdit ? 'Salva modifiche' : 'Aggiungi'}
                </button>
            </div>
        </div>
    );
};

AccountCategoryEditor.propTypes = {
    initialData: PropTypes.shape({
        id: PropTypes.string,
        name: PropTypes.string,
        color: PropTypes.string,
        icon: PropTypes.string,
        balance: PropTypes.number
    }).isRequired,
    onSave: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired
};

export default AccountCategoryEditor;