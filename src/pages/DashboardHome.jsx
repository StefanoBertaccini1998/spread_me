import { useState, useEffect } from 'react';
import { useExpenses } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import NavigationButtons from '../components/NavigationButtons';
import './DashboardHome.css';
import DashboardCharts from '../components/DashboardCharts';

const DashboardHome = () => {
    const { expenses } = useExpenses();
    const { income } = useIncome();
    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filteredIncome, setFilteredIncome] = useState([]);
    const [filters, setFilters] = useState({
        month: new Date().getMonth(),
        year: new Date().getFullYear(),
        category: 'All',
        account: 'All',
    });

    useEffect(() => {
        // Filter expenses based on selected filters
        const exp = expenses.filter((e) => {
            const date = new Date(e.date);
            const matchesMonth = date.getMonth() === filters.month;
            const matchesYear = date.getFullYear() === filters.year;
            const matchesCategory = filters.category === 'All' || e.category === filters.category;
            const matchesAccount = filters.account === 'All' || e.account === filters.account;
            return matchesMonth && matchesYear && matchesCategory && matchesAccount;
        });

        // Filter income based on selected filters
        const inc = income.filter((i) => {
            const date = new Date(i.date);
            const matchesMonth = date.getMonth() === filters.month;
            const matchesYear = date.getFullYear() === filters.year;
            const matchesCategory = filters.category === 'All' || i.category === filters.category;
            const matchesAccount = filters.account === 'All' || i.account === filters.account;
            return matchesMonth && matchesYear && matchesCategory && matchesAccount;
        });

        setFilteredExpenses(exp);
        setFilteredIncome(inc);
    }, [expenses, income, filters]);

    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amountBaseCurrency, 0);
    const totalIncome = filteredIncome.reduce((sum, i) => sum + i.amountBaseCurrency, 0);
    const netBalance = totalIncome - totalExpenses;

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">📊 Riepilogo Finanziario</h1>
            <FilterBar filters={filters} setFilters={setFilters} />
            <div className="stat-grid">
                <StatCard title="💸 Spese Totali" value={`€${totalExpenses.toFixed(2)}`} bgColor="bg-red-500" type="expenses" currentFilters={filters} />
                <StatCard title="💰 Entrate Totali" value={`€${totalIncome.toFixed(2)}`} bgColor="bg-green-500" type="income" currentFilters={filters} />
                <StatCard title="💼 Saldo Netto" value={`€${netBalance.toFixed(2)}`} bgColor="bg-blue-500" currentFilters={filters} />
            </div>
            <DashboardCharts data={{
                labels: ['Spese', 'Entrate', 'Saldo'],
                values: [totalExpenses, totalIncome, netBalance]
            }} />
            <NavigationButtons />
        </div>
    );
};

export default DashboardHome;
