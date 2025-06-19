import { useState, useMemo } from 'react';
import { useAppSelector } from '../redux/hooks/useRedux';
import StatCard from '../components/StatCard';
import FilterBar from '../components/FilterBar';
import NavigationButtons from '../components/NavigationButtons';
import DashboardCharts from '../components/DashboardCharts';
import styles from './DashboardHome.module.css';

const DashboardHome = () => {

    const expenses = useAppSelector((state) => state.transaction.expenses);
    const incomes = useAppSelector((state) => state.transaction.incomes);

    const [filters, setFilters] = useState({
        period: 'always',
        account: 'All',
        category: 'All',
        startDate: '',
        endDate: '',
    });

    const filterData = (data) => {
        const now = new Date();
        return data.filter((item) => {
            const date = new Date(item.date);

            let matchesPeriod = true;
            if (filters.period === 'month') {
                matchesPeriod = date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
            } else if (filters.period === 'year') {
                matchesPeriod = date.getFullYear() === now.getFullYear();
            } else if (filters.period === 'custom') {
                const start = filters.startDate ? new Date(filters.startDate) : null;
                const end = filters.endDate ? new Date(filters.endDate) : null;
                matchesPeriod = (!start || date >= start) && (!end || date <= end);
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

    const filteredExpenses = useMemo(() => filterData(expenses), [expenses, filters]);
    const filteredIncomes = useMemo(() => filterData(incomes), [incomes, filters]);

    const totalExpenses = filteredExpenses.reduce((sum, e) => sum + e.amountBaseCurrency, 0);
    const totalIncomes = filteredIncomes.reduce((sum, i) => sum + i.amountBaseCurrency, 0);
    const netBalance = totalIncomes - totalExpenses;

    const groupByCategory = (data) =>
        data.reduce((acc, item) => {
            const key = item.category || 'Sconosciuto';
            acc[key] = (acc[key] || 0) + item.amountBaseCurrency;
            return acc;
        }, {});

    const expensesByCategory = groupByCategory(filteredExpenses);
    const incomesByCategory = groupByCategory(filteredIncomes);

    const expensesData = {
        labels: Object.keys(expensesByCategory),
        values: Object.values(expensesByCategory),
        raw: filteredExpenses,
    };

    const incomesData = {
        labels: Object.keys(incomesByCategory),
        values: Object.values(incomesByCategory),
        raw: filteredIncomes,
    };

    const balanceData = useMemo(() => {
        const monthly = {};

        filteredIncomes.forEach((tx) => {
            const key = new Date(tx.date).toISOString().slice(0, 7);
            if (!monthly[key]) monthly[key] = { incomes: 0, expenses: 0 };
            monthly[key].incomes += tx.amountBaseCurrency;
        });
        filteredExpenses.forEach((tx) => {
            const key = new Date(tx.date).toISOString().slice(0, 7);
            if (!monthly[key]) monthly[key] = { incomes: 0, expenses: 0 };
            monthly[key].expenses += tx.amountBaseCurrency;
        });

        const months = Object.keys(monthly).sort();
        const labels = [];
        const values = [];
        let running = 0;

        months.forEach((m) => {
            const { incomes = 0, expenses = 0 } = monthly[m];
            running += incomes - expenses;
            labels.push(m);
            values.push(running);
        });

        if (labels.length === 1) {
            labels.push(labels[0]);
            values.push(values[0]);
        }
        return { labels, values };
    }, [filteredExpenses, filteredIncomes]);


    return (
        <div className={styles.container}>
            <h1 className={styles.title}>📊 Riepilogo Finanziario</h1>

            <FilterBar filters={filters} setFilters={setFilters} />

            <div className={styles.cardsGrid}>
                <StatCard
                    title="💸 Spese Totali"
                    value={`€${totalExpenses.toFixed(2)}`}
                    bgColor="bg-danger"
                    type="expenses"
                    currentFilters={filters}
                />
                <StatCard
                    title="💰 Entrate Totali"
                    value={`€${totalIncomes.toFixed(2)}`}
                    bgColor="bg-success"
                    type="incomes"
                    currentFilters={filters}
                />
                <StatCard
                    title="💼 Saldo Netto"
                    value={`€${netBalance.toFixed(2)}`}
                    bgColor="bg-secondary"
                    currentFilters={filters}
                />
            </div>

            <DashboardCharts
                expensesData={expensesData}
                incomesData={incomesData}
                balanceData={balanceData}
            />

            <NavigationButtons />
        </div>
    );
};

export default DashboardHome;
