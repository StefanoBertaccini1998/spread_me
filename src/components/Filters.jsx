

const Filters = ({ onFilterChange }) => {
    const handleMonthChange = (e) => {
        onFilterChange({ month: e.target.value });
    };

    const handleYearChange = (e) => {
        onFilterChange({ year: e.target.value });
    };

    return (
        <div>
            <select onChange={handleMonthChange}>
                {/* Opzioni per i mesi */}
            </select>
            <select onChange={handleYearChange}>
                {/* Opzioni per gli anni */}
            </select>
        </div>
    );
};

export default Filters;
