import { useAppSelector } from '../redux/hooks/useRedux';
import styles from './FilterBar.module.css';

export default function FilterBar({ filters, setFilters }) {
    const userId = useAppSelector((state) => state.user.user?.id);
    const accounts = useAppSelector((s) => s.accounts.data).filter((a) => a.userId === userId);
    const categories = useAppSelector((s) => s.categories.data).filter((c) => c.userId === userId);

    const handle = (field) => (e) => {
        const value = e.target.value;
        setFilters((prev) => {
            const next = { ...prev, [field]: value };
            const complete = value.length === 10;
            if (field === 'startDate' && prev.endDate && complete && value > prev.endDate) {
                next.endDate = value;
            }
            if (field === 'endDate' && prev.startDate && complete && value < prev.startDate) {
                next.endDate = prev.startDate;
            }
            return next;
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.inner}>
                {/* Period */}
                <div className={styles.group}>
                    <label className={styles.label}>Periodo</label>
                    <select value={filters.period} onChange={handle('period')} className={styles.select}>
                        <option value="month">Mese Corrente</option>
                        <option value="year">Anno Corrente</option>
                        <option value="always">Sempre</option>
                        <option value="custom">Personalizzato</option>
                    </select>
                </div>

                {/* Custom dates */}
                {filters.period === 'custom' && (
                    <div className={styles.custom}>
                        <div className={styles.group}>
                            <label className={styles.label}>Da</label>
                            <input type="date" value={filters.startDate || ''} onChange={handle('startDate')} className={styles.select} />
                        </div>
                        <div className={styles.group}>
                            <label className={styles.label}>A</label>
                            <input
                                type="date"
                                value={filters.endDate || ''}
                                onChange={handle('endDate')}
                                className={styles.select}
                                min={filters.startDate || undefined}
                            />
                        </div>
                    </div>
                )}

                {/* Account */}
                <div className={styles.group}>
                    <label className={styles.label}>Conto</label>
                    <select value={filters.account} onChange={handle('account')} className={styles.select}>
                        <option value="All">Tutti i Conti</option>
                        {accounts.map((a) => (
                            <option key={a.id} value={a.name}>{a.icon} {a.name}</option>
                        ))}
                    </select>
                </div>

                {/* Category */}
                <div className={styles.group}>
                    <label className={styles.label}>Categoria</label>
                    <select value={filters.category} onChange={handle('category')} className={styles.select}>
                        <option value="All">Tutte le Categorie</option>
                        {categories.map((c) => (
                            <option key={c.id} value={c.name}>{c.icon} {c.name}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );
}