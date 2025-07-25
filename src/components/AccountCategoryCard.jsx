import React from 'react';
import PropTypes from 'prop-types';
import styles from './AccountCategoryCard.module.css';
import { Trash2 } from 'lucide-react';

const AccountCategoryCard = ({ name, color, icon, balance, onEdit, onDelete }) => {
    return (
        <div
            className={styles.card}
            style={{ '--bg-color': color }}
            onClick={onEdit}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onEdit();
                }
            }}
        >
            <div className={styles.actions}>
                <button
                    onClick={(e) => {
                        // Previene il trigger di onEdit
                        e.stopPropagation();
                        onDelete();
                    }}
                    className={styles.delete}
                    aria-label="Cancella"
                >
                    <Trash2 size={16} />
                </button>
            </div>
            <div className={styles.cardTop}>
                <span>{icon}</span>
                <span className={styles.cardName}>{name}</span>
            </div>
            {balance !== undefined && (
                <div className={styles.cardBalance}>€{parseFloat(balance).toFixed(2)}</div>
            )}
        </div>
    );
};

AccountCategoryCard.propTypes = {
    name: PropTypes.string.isRequired,
    color: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    balance: PropTypes.number,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
};

export default React.memo(AccountCategoryCard);