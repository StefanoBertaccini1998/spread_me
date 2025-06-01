import { useAppSelector } from '../redux/hooks/useRedux';
import styles from './FilterBar.module.css';

const FilterBar = ({ filters, setFilters }) => {
    const userId = useAppSelector((state) => state.user.user?.id);
    const allAccounts = useAppSelector((state) => state.accounts.data);
    const allCategories = useAppSelector((state) => state.categories.data);

    const accounts = allAccounts.filter((acc) => acc.userId === userId);
    const categories = allCategories.filter((cat) => cat.userId === userId);
    const handleChange = (field) => (e) =>
        setFilters((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                <div className={styles.filterGroup}>
                    <label className={styles.label}>Periodo</label>
                    <select value={filters.period} onChange={handleChange('period')} className={styles.select}>
                        <option value="month">Mese Corrente</option>
                        <option value="year">Anno Corrente</option>
                        <option value="always">Sempre</option>
                        <option value="custom">Personalizzato</option>
                    </select>
                </div>

                {filters.period === 'custom' && (
                    <div className={styles.customDateGroup}>
                        <div className={styles.filterGroup}>
                            <label className={styles.label}>Da</label>
                            <input
                                type="date"
                                value={filters.startDate || ''}
                                onChange={handleChange('startDate')}
                                className={styles.select}
                            />
                        </div>
                        <div className={styles.filterGroup}>
                            <label className={styles.label}>A</label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={handleChange('endDate')}
                                className={styles.select}
                            />
                        </div>
                    </div>
                )}

                <div className={styles.filterGroup}>
                    <label className={styles.label}>Conto</label>
                    <select value={filters.account} onChange={handleChange('account')} className={styles.select}>
                        <option value="All">Tutti i Conti</option>
                        {accounts.map((acc) => (
                            <option key={acc.name} value={acc.name}>{acc.icon} {acc.name}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.filterGroup}>
                    <label className={styles.label}>Categoria</label>
                    <select value={filters.category} onChange={handleChange('category')} className={styles.select}>
                        <option value="All">Tutte le Categorie</option>
                        {categories.map((cat) => (
                            <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
