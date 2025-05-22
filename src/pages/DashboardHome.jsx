import { useState, useEffect } from 'react';
import { useAppSelector } from '../redux/hooks/useRedux';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import NavigationButtons from '../components/NavigationButtons';
import DashboardCharts from '../components/DashboardCharts';
import styles from './Dashboard.module.css';

const DashboardHome = () => {
    const expenses = useAppSelector(state => state.transaction.expenses);
    const income = useAppSelector(state => state.transaction.income);

    const [filteredExpenses, setFilteredExpenses] = useState([]);
    const [filteredIncome, setFilteredIncome] = useState([]);
    const [filters, setFilters] = useState({
        period: 'always', // 'always' | 'year' | 'month'
        account: 'All',
        category: 'All',
    });

    useEffect(() => {
        const filterData = (data) => {
            return data.filter((item) => {
                const date = new Date(item.date);
                const now = new Date();

                let matchesPeriod = true;
                if (filters.period === 'month') {
                    matchesPeriod =
                        date.getMonth() === now.getMonth() &&
                        date.getFullYear() === now.getFullYear();
                } else if (filters.period === 'year') {
                    matchesPeriod = date.getFullYear() === now.getFullYear();
                }

                const matchesAccount =
                    filters.account === 'All' ||
                    item.account === filters.account ||
                    item.fromAccount === filters.account ||
                    item.toAccount === filters.account;

                const matchesCategory =
                    filters.category === 'All' || item.category === filters.category;

                return matchesPeriod && matchesAccount && matchesCategory;
            });
        };

        setFilteredExpenses(filterData(expenses));
        setFilteredIncome(filterData(income));
    }, [expenses, income, filters]);

    const totalExpenses = filteredExpenses.reduce(
        (sum, e) => sum + e.amountBaseCurrency,
        0
    );
    const totalIncome = filteredIncome.reduce(
        (sum, i) => sum + i.amountBaseCurrency,
        0
    );
    const netBalance = totalIncome - totalExpenses;

    const groupByCategory = (data) =>
        data.reduce((acc, item) => {
            const key = item.category || 'Sconosciuto';
            acc[key] = (acc[key] || 0) + item.amountBaseCurrency;
            return acc;
        }, {});

    const expensesByCategory = groupByCategory(filteredExpenses);
    const incomeByCategory = groupByCategory(filteredIncome);

    const expensesData = {
        labels: Object.keys(expensesByCategory),
        values: Object.values(expensesByCategory),
        raw: filteredExpenses,
    };

    const incomeData = {
        labels: Object.keys(incomeByCategory),
        values: Object.values(incomeByCategory),
        raw: filteredIncome,
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📊 Riepilogo Finanziario</h1>
            <FilterBar filters={filters} setFilters={setFilters} />

            <div className={styles.statGrid}>
                <StatCard
                    title="💸 Spese Totali"
                    value={`€${totalExpenses.toFixed(2)}`}
                    bgColor="bg-red-500"
                    type="expenses"
                    currentFilters={filters}
                />
                <StatCard
                    title="💰 Entrate Totali"
                    value={`€${totalIncome.toFixed(2)}`}
                    bgColor="bg-green-500"
                    type="income"
                    currentFilters={filters}
                />
                <StatCard
                    title="💼 Saldo Netto"
                    value={`€${netBalance.toFixed(2)}`}
                    bgColor="bg-blue-500"
                    currentFilters={filters}
                />
            </div>

            <DashboardCharts
                expensesData={expensesData}
                incomeData={incomeData}
                transfersData={{ labels: [], values: [] }}
            />

            <NavigationButtons />
        </div>
    );
};

export default DashboardHome;
