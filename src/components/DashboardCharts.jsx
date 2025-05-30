// DashboardCharts.js
import { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';
import styles from './DashboardCharts.module.css';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Tooltip,
    Legend
);

const chartTypes = {
    bar: Bar,
    line: Line,
    pie: Pie
};

const DashboardCharts = ({ expensesData, incomesData }) => {
    const [chartType, setChartType] = useState('bar');
    const ChartComponent = chartTypes[chartType];

    const totalIncomes = incomesData.values.reduce((a, b) => a + b, 0);
    const totalExpenses = expensesData.values.reduce((a, b) => a + b, 0);
    const saldoNetto = totalIncomes - totalExpenses;
    const netLabel = saldoNetto >= 0 ? 'Risparmio' : 'Deficit';
    const netColor = saldoNetto >= 0 ? '#4ade80' : '#f87171';

    const formatCurrency = (value) => `€${value.toFixed(2)}`;

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: €${context.parsed}`
                }
            }
        }
    };

    const barLineOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: '#374151' } },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: €${context.raw}`
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: (value) => formatCurrency(value),
                    color: '#6b7280'
                },
                grid: {
                    color: '#e5e7eb'
                }
            },
            x: {
                ticks: {
                    color: '#6b7280'
                },
                grid: {
                    color: '#f3f4f6'
                }
            }
        }
    };

    const incomesExpenseComparison = {
        labels: ['Entrate', 'Spese'],
        datasets: [
            {
                label: 'Totale',
                data: [totalIncomes, totalExpenses],
                backgroundColor: ['#34d399', '#f87171']
            }
        ]
    };

    const expensesByCategory = {
        labels: expensesData.labels,
        datasets: [
            {
                label: 'Spese per Categoria',
                data: expensesData.values,
                backgroundColor: expensesData.labels.map((_, index) => {
                    const colors = ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#c084fc'];
                    return colors[index % colors.length];
                })
            }
        ]
    };

    const buildTimeSeriesData = (data, type) => {
        const grouped = {};

        data.forEach((item) => {
            const category = item.category || 'Sconosciuto';
            const date = new Date(item.date).toISOString().slice(0, 10);

            if (!grouped[category]) grouped[category] = {};
            if (!grouped[category][date]) grouped[category][date] = 0;

            grouped[category][date] += item.amountBaseCurrency;
        });

        const allDatesSet = new Set();
        Object.values(grouped).forEach((catData) =>
            Object.keys(catData).forEach((date) => allDatesSet.add(date))
        );
        const allDates = Array.from(allDatesSet).sort();

        const datasets = Object.entries(grouped).map(([category, values]) => ({
            label: category,
            data: allDates.map((date) => values[date] || 0),
            backgroundColor: type === 'expense' ? 'rgba(239,68,68,0.6)' : 'rgba(34,197,94,0.6)',
            borderColor: type === 'expense' ? 'rgba(239,68,68,1)' : 'rgba(34,197,94,1)',
            fill: chartType === 'line' ? false : true,
            tension: 0.3
        }));

        if (allDates.length === 1) {
            allDates.push(allDates[0]);
            datasets.forEach(ds => ds.data.push(ds.data[0]));
        }

        return { labels: allDates, datasets };
    };

    const timeSeriesExpenses = buildTimeSeriesData(expensesData.raw || [], 'expense');
    const timeSeriesIncomes = buildTimeSeriesData(incomesData.raw || [], 'incomes');

    return (
        <div className={styles.container}>
            <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className={styles.select}
            >
                <option value="bar">📊 Grafico Barre</option>
                <option value="line">📈 Grafico Linea</option>
                <option value="pie">🥧 Grafico a Torta</option>
            </select>

            {chartType === 'pie' ? (
                <div className={styles.chartGroup}>
                    <div className={styles.chartWrapper}>
                        <h3 className={styles.chartLabel}>Spese</h3>
                        <Pie
                            data={{
                                labels: expensesData.labels,
                                datasets: [
                                    {
                                        data: expensesData.values,
                                        backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#c084fc']
                                    }
                                ]
                            }}
                            options={pieOptions}
                        />
                    </div>
                    <div className={styles.chartWrapper}>
                        <h3 className={styles.chartLabel}>Entrate</h3>
                        <Pie
                            data={{
                                labels: incomesData.labels,
                                datasets: [
                                    {
                                        data: incomesData.values,
                                        backgroundColor: ['#34d399', '#60a5fa', '#facc15']
                                    }
                                ]
                            }}
                            options={pieOptions}
                        />
                    </div>
                    <div className={styles.chartWrapper}>
                        <h3 className={styles.chartLabel}>Saldo Netto</h3>
                        <Pie
                            data={{
                                labels: [netLabel],
                                datasets: [
                                    {
                                        data: [Math.abs(saldoNetto)],
                                        backgroundColor: [netColor]
                                    }
                                ]
                            }}
                            options={pieOptions}
                        />
                    </div>
                </div>
            ) : chartType === 'line' ? (
                <>
                    <h3 className={styles.chartTitle}>Andamento Spese</h3>
                    <ChartComponent data={timeSeriesExpenses} options={barLineOptions} />

                    <h3 className={`${styles.chartTitle} mt-10`}>Andamento Entrate</h3>
                    <ChartComponent data={timeSeriesIncomes} options={barLineOptions} />
                </>
            ) : (
                <>
                    <h3 className={styles.chartTitle}>Entrate vs Spese</h3>
                    <ChartComponent data={incomesExpenseComparison} options={barLineOptions} />

                    <h3 className={`${styles.chartTitle} mt-10`}>Spese per Categoria</h3>
                    <ChartComponent data={expensesByCategory} options={barLineOptions} />
                </>
            )}
        </div>
    );
};

export default DashboardCharts;
