import { useAccount } from '../context/AccountContext';
import { useExpenseCategory } from '../context/ExpenseCategoryContext';
import './FilterBar.css';

const FilterBar = ({ filters, setFilters }) => {
    const { accounts } = useAccount();
    const { expenseCategories } = useExpenseCategory();

    const handlePeriodChange = (e) => setFilters((prev) => ({ ...prev, period: e.target.value }));
    const handleAccountChange = (e) => setFilters((prev) => ({ ...prev, account: e.target.value }));
    const handleCategoryChange = (e) => setFilters((prev) => ({ ...prev, category: e.target.value }));

    return (
        <div className="filter-bar">
            <select value={filters.period} onChange={handlePeriodChange} className="filter-select">
                <option value="month">Mese Corrente</option>
                <option value="year">Anno Corrente</option>
                <option value="always">Sempre</option>
            </select>

            <select value={filters.account} onChange={handleAccountChange} className="filter-select">
                <option value="All">Tutti i Conti</option>
                {accounts.map((acc) => (
                    <option key={acc.name} value={acc.name}>{acc.emoji} {acc.name}</option>
                ))}
            </select>

            <select value={filters.category} onChange={handleCategoryChange} className="filter-select">
                <option value="All">Tutte le Categorie</option>
                {expenseCategories.map((cat) => (
                    <option key={cat.name} value={cat.name}>{cat.emoji} {cat.name}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterBar;
