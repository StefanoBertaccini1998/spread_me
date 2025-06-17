import { useState, useMemo } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import useDarkMode from '../hooks/useDarkMode';
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

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

// Tailwind theme → hex map (extend as needed)
const tw = {
    primary: '#0D6EFD',
    success: '#198754',
    danger: '#DC3545',
    warning: '#FFC107',
    info: '#0DCAF0',
};

const chartTypes = {
    bar: Bar,
    line: Line,
    pie: Pie
};

const colorPalette = ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#c084fc'];

const DashboardCharts = ({ expensesData, incomesData, balanceData }) => {
    const [chartType, setChartType] = useState('bar');
    const ChartComponent = chartTypes[chartType];
    const [maxCategories, setMaxCategories] = useState(expensesData.labels.length);

    const totalIncomes = incomesData.values.reduce((a, b) => a + b, 0);
    const totalExpenses = expensesData.values.reduce((a, b) => a + b, 0);
    const saldoNetto = totalIncomes - totalExpenses;
    const netLabel = saldoNetto >= 0 ? 'Risparmio' : 'Deficit';
    const netColor = saldoNetto >= 0 ? '#4ade80' : '#f87171';

    const formatCurrency = (value) => `€${value.toFixed(2)}`;

    const { isDark } = useDarkMode();           // si aggiorna da solo

    const baseColor = isDark ? '#F3F4F6' : '#374151';
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

    const barColours = useMemo(() => [tw.success, tw.danger], []);
    const barLineOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: baseColor } },
            tooltip: {
                callbacks: { label: (ctx) => `€${ctx.raw.toFixed(2)}` },
            },
        },
        scales: {
            y: { ticks: { color: baseColor }, grid: { color: '#e5e7eb' } },
            x: { ticks: { color: baseColor }, grid: { color: '#f3f4f6' } },
        },
    };

    const incomesExpenseComparison = {
        labels: ['Entrate', 'Spese'],
        datasets: [{ label: 'Totale', data: [totalIncomes, totalExpenses], backgroundColor: barColours }],
    };

    const sortedExpenses = useMemo(() => {
        return expensesData.labels.map((label, idx) => ({ label, value: expensesData.values[idx] }))
            .sort((a, b) => b.value - a.value);
    }, [expensesData]);

    const slicedExpenses = useMemo(() => sortedExpenses.slice(0, maxCategories), [sortedExpenses, maxCategories]);

    const expensesByCategory = {
        labels: slicedExpenses.map((e) => e.label),
        datasets: [
            {
                label: 'Spese per Categoria',
                data: slicedExpenses.map((e) => e.value),
                backgroundColor: slicedExpenses.map((_, index) => colorPalette[index % colorPalette.length])
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

        const datasets = Object.entries(grouped).map(([category, values], idx) => {
            const dataArr = allDates.map((date) => values[date] || 0);
            if (dataArr.every((v) => v === 0)) return null;
            const color = colorPalette[idx % colorPalette.length];
            return {
                label: category,
                data: dataArr,
                backgroundColor: color + '80',
                borderColor: color,
                fill: false,
                tension: 0.3
            };
        }).filter(Boolean);

        if (allDates.length === 1) {
            allDates.push(allDates[0]);
            datasets.forEach(ds => ds.data.push(ds.data[0]));
        }

        return { labels: allDates, datasets };
    };

    const timeSeriesExpenses = buildTimeSeriesData(expensesData.raw || [], 'expense');
    const balanceSeries = {
        labels: balanceData.labels,
        datasets: [
            {
                label: 'Saldo Conti',
                data: balanceData.values,
                borderColor: tw.primary,
                backgroundColor: tw.primary + '33',
                fill: false,
                tension: 0.3,
            },
        ],
    };


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
                                        backgroundColor: expensesData.labels.map((_, i) => colorPalette[i % colorPalette.length])
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
                                        backgroundColor: incomesData.labels.map((_, i) => colorPalette[i % colorPalette.length])
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

                    <h3 className={`${styles.chartTitle} mt-10`}>Saldo Complessivo</h3>
                    <ChartComponent data={balanceSeries} options={barLineOptions} />
                </>
            ) : (
                <>
                    <h3 className={styles.chartTitle}>Entrate vs Spese</h3>
                    <ChartComponent data={incomesExpenseComparison} options={barLineOptions} />

                    <h3 className={`${styles.chartTitle} mt-10`}>Spese per Categoria</h3>
                    <ChartComponent data={expensesByCategory} options={barLineOptions} />
                    {sortedExpenses.length > 5 && (
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="range"
                                min="1"
                                max={sortedExpenses.length}
                                value={maxCategories}
                                onChange={(e) => setMaxCategories(parseInt(e.target.value))}
                            />
                            <span className={styles.sliderLabel}>Top {maxCategories}</span>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DashboardCharts;