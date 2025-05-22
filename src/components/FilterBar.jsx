import { useAppSelector } from '../redux/hooks/useRedux';
import styles from './FilterBar.module.css';

const FilterBar = ({ filters, setFilters }) => {
    const accounts = useAppSelector((state) => state.userSettings.accounts);
    const categories = useAppSelector((state) => state.userSettings.categories);

    const handleChange = (field) => (e) =>
        setFilters((prev) => ({ ...prev, [field]: e.target.value }));

    return (
        <div className={styles.container}>
            <select value={filters.period} onChange={handleChange('period')} className={styles.select}>
                <option value="month">Mese Corrente</option>
                <option value="year">Anno Corrente</option>
                <option value="always">Sempre</option>
            </select>

            <select value={filters.account} onChange={handleChange('account')} className={styles.select}>
                <option value="All">Tutti i Conti</option>
                {accounts.map((acc) => (
                    <option key={acc.name} value={acc.name}>{acc.icon} {acc.name}</option>
                ))}
            </select>

            <select value={filters.category} onChange={handleChange('category')} className={styles.select}>
                <option value="All">Tutte le Categorie</option>
                {categories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterBar;