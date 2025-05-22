import styles from './Landing.module.css';

const Landing = () => {
    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Welcome to Finance Tracker</h1>
            <p className={styles.subtitle}>
                Manage your expenses, assets, and personal finances easily.
            </p>
        </div>
    );
};

export default Landing;
