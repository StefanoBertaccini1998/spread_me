import { useState, useEffect, useMemo } from 'react';
import { Bar, Line, PolarArea } from 'react-chartjs-2';
import useDarkMode from '../hooks/useDarkMode';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    LineElement,
    PointElement,
    RadialLinearScale,
    Filler,
    Tooltip,
    Legend
} from 'chart.js';
import styles from './DashboardCharts.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, RadialLinearScale, Filler, Tooltip, Legend);

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
    polar: PolarArea,
};

const colorPalette = ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#c084fc'];

const DashboardCharts = ({ expensesData, incomesData, balanceData }) => {
    const [chartType, setChartType] = useState('bar');
    const ChartComponent = chartTypes[chartType];
    const [maxCategories, setMaxCategories] = useState(expensesData.labels.length);
    useEffect(() => {
        setMaxCategories(expensesData.labels.length);
    }, [expensesData.labels.length]);

    const totalIncomes = incomesData.values.reduce((a, b) => a + b, 0);
    const totalExpenses = expensesData.values.reduce((a, b) => a + b, 0);

    const { isDark } = useDarkMode();           // si aggiorna da solo

    const baseColor = isDark ? '#F3F4F6' : '#374151';

    const barColours = useMemo(() => [tw.success, tw.danger], []);
    const barLineOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: baseColor } },
            tooltip: {
                callbacks: {
                    label: (ctx) => {
                        const lbl = ctx.dataset?.label;
                        return `${lbl ? `${lbl}: ` : ''}€${ctx.raw.toFixed(2)}`;
                    },
                },
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

    const allCategories = useMemo(
        () => Array.from(new Set([...expensesData.labels, ...incomesData.labels])),
        [expensesData.labels, incomesData.labels]
    );

    const polarData = useMemo(() => {
        const incomeMap = {};
        incomesData.labels.forEach((l, i) => { incomeMap[l] = incomesData.values[i]; });
        const expenseMap = {};
        expensesData.labels.forEach((l, i) => { expenseMap[l] = expensesData.values[i]; });
        return {
            labels: allCategories,
            datasets: [
                {
                    label: 'Entrate',
                    data: allCategories.map((c) => incomeMap[c] || 0),
                    backgroundColor: tw.success + '33',
                    borderColor: tw.success,
                },
                {
                    label: 'Spese',
                    data: allCategories.map((c) => expenseMap[c] || 0),
                    backgroundColor: tw.danger + '33',
                    borderColor: tw.danger,
                },
            ],
        };
    }, [allCategories, incomesData, expensesData]);

    const polarOptions = {
        responsive: true,
        plugins: { legend: { labels: { color: baseColor } } },
        scales: {
            r: {
                ticks: { color: baseColor },
                pointLabels: { color: baseColor },
                grid: { color: '#e5e7eb' },
                angleLines: { color: '#e5e7eb' },
            },
        },
    };


    const buildTimeSeriesData = (data) => {
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

        const datasets = Object.entries(grouped)
            .map(([category, values], idx) => {
                const daily = allDates.map((date) => values[date] || 0);
                const cumulative = [];
                daily.reduce((sum, val, i) => {
                    const total = sum + val;
                    cumulative[i] = total;
                    return total;
                }, 0);
                if (cumulative.every((v) => v === 0)) return null;
                const color = colorPalette[idx % colorPalette.length];
                return {
                    label: category,
                    data: cumulative,
                    backgroundColor: color + '80',
                    borderColor: color,
                    fill: false,
                    tension: 0.3,
                };
            })
            .filter(Boolean);

        if (allDates.length === 1) {
            allDates.push(allDates[0]);
            datasets.forEach((ds) => ds.data.push(ds.data[0]));
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
                <option value="polar">🌐 Grafico Polare</option>
            </select>

            {chartType === 'polar' ? (
                <>
                    <h3 className={styles.chartTitle}>Entrate vs Spese per Categoria</h3>
                    <ChartComponent data={polarData} options={polarOptions} />
                </>
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