import React from 'react';
import styles from './ProfileCardItem.module.css';

const ProfileCardItem = ({ icon, name, color, balance }) => {
    return (
        <div className={styles.item} style={{ '--bg-color': color }}>
            <div className={styles.top}>
                <span className={styles.icon}>{icon}</span>
                <span className={styles.name} title={name}>{name}</span>
            </div>
            {balance !== undefined && (
                <div className={styles.balance}>
                    €{parseFloat(balance).toFixed(2)}
                </div>
            )}
        </div>
    );
};

export default React.memo(ProfileCardItem);
