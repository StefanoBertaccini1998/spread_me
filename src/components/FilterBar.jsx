import { useAppSelector } from '../redux/hooks/useRedux';
import styles from './FilterBar.module.css';

const FilterBar = ({ filters, setFilters }) => {
    const accounts = useAppSelector((state) => state.accounts.data);
    console.log(accounts)
    const categories = useAppSelector((state) => state.categories.data);

    const handleChange = (field) => (e) =>
        setFilters((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <div className={styles.container}>
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
    );
};

export default FilterBar;
