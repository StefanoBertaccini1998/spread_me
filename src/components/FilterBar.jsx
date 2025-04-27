import './FilterBar.css';
import { useUser } from '../context/UserContext';

const months = [
    'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
    'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

const FilterBar = ({ filters, setFilters }) => {
    const handleMonthChange = (e) => {
        setFilters({ ...filters, month: parseInt(e.target.value) });
    };

    const handleYearChange = (e) => {
        setFilters({ ...filters, year: parseInt(e.target.value) });
    };

    const handleCategoryChange = (e) => {
        setFilters({ ...filters, category: e.target.value });
    };

    const handleAccountChange = (e) => {
        setFilters({ ...filters, account: e.target.value });
    };

    const { userSettings } = useUser();

    return (
        <div className="filter-bar">
            <select value={filters.month} onChange={handleMonthChange}>
                {months.map((month, index) => (
                    <option key={index} value={index}>{month}</option>
                ))}
            </select>
            <select value={filters.year} onChange={handleYearChange}>
                {/* Generate a range of years */}
                {Array.from({ length: 5 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return <option key={year} value={year}>{year}</option>;
                })}
            </select>
            <select name="account" value={filters.account} onChange={handleAccountChange}>
                <option value="All">Tutti</option>
                {userSettings.accounts.map(acc => (
                    <option key={acc.name} value={acc.name}>{acc.icon} {acc.name}</option>
                ))}
            </select>
            <select name="category" value={filters.category} onChange={handleCategoryChange}>
                <option value="All">Tutte</option>
                {userSettings.categories.map(cat => (
                    <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))}
            </select>
        </div>
    );
};

export default FilterBar;
