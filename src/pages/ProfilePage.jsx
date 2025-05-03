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
    Legend,
} from 'chart.js';

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
    pie: Pie,
};

const DashboardCharts = ({ expensesData, incomeData, transfersData }) => {
    const [chartType, setChartType] = useState('bar');
    const ChartComponent = chartTypes[chartType];

    const formatCurrency = (value) => `€${value}`;

    const pieOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'bottom' },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.label}: €${context.parsed}`,
                },
            },
        },
    };


    const barLineOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: 'black' } },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: €${context.raw}`,
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    callback: formatCurrency,
                },
            },
        },
    };

    const totalIncome = incomeData.values.reduce((a, b) => a + b, 0);
    const totalExpenses = expensesData.values.reduce((a, b) => a + b, 0);
    const saldoNetto = totalIncome - totalExpenses;
    const netLabel = saldoNetto >= 0 ? 'Risparmio' : 'Deficit';

    const incomeExpenseComparison = {
        labels: ['Income', 'Expenses'],
        datasets: [
            {
                label: 'Amount',
                data: [totalIncome, totalExpenses],
                backgroundColor: ['#34d399', '#f87171'],
            },
        ],
    };

    const expensesByCategory = {
        labels: expensesData.labels,
        datasets: [
            {
                label: 'Expenses',
                data: expensesData.values,
                backgroundColor: expensesData.labels.map((_, index) => {
                    const colors = ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#c084fc'];
                    return colors[index % colors.length];
                }),
            },
        ],
    };

    const buildTimeSeriesData = (data, label, color) => {
        const grouped = {};

        data.forEach((item) => {
            const date = new Date(item.date).toISOString().slice(0, 10);
            if (!grouped[date]) grouped[date] = 0;
            grouped[date] += item.amountBaseCurrency;
        });

        let dates = Object.keys(grouped).sort();
        let values = dates.map((date) => grouped[date]);

        // If only one data point, duplicate it to create a horizontal line
        if (dates.length === 1) {
            const originalDate = new Date(dates[0]);
            const nextDate = new Date(originalDate);
            nextDate.setDate(originalDate.getDate() + 1);

            dates = [dates[0], nextDate.toISOString().slice(0, 10)];
            values = [values[0], values[0]];
        }

        return {
            label,
            data: values,
            borderColor: color,
            backgroundColor: color,
            tension: 0.4,
            fill: false,
        };
    };

    const incomeTimeSeries = buildTimeSeriesData(incomeData.raw || [], 'Income', '#34d399');
    const expensesTimeSeries = buildTimeSeriesData(expensesData.raw || [], 'Expenses', '#f87171');

    const combinedTimeSeries = {
        labels: incomeTimeSeries.data.length > expensesTimeSeries.data.length ? incomeTimeSeries.labels : expensesTimeSeries.labels,
        datasets: [incomeTimeSeries, expensesTimeSeries],
    };

    const netWealth = {
        labels: [netLabel],
        datasets: [
            {
                data: [Math.abs(saldoNetto)],
                backgroundColor: ['#3b82f6'], // Blue color
            },
        ],
    };


    return (
        <div className="dashboard-charts">
            <select
                value={chartType}
                onChange={(e) => setChartType(e.target.value)}
                className="filter-select mb-6"
            >
                <option value="bar">📊 Grafico Barre</option>
                <option value="line">📈 Grafico Linea</option>
                <option value="pie">🥧 Grafici Torta</option>
            </select>

            {chartType === 'pie' ? (
                <div className="flex flex-wrap gap-6 justify-center">
                    <div className="w-64">
                        <h3 className="text-center font-semibold mb-2">Spese</h3>
                        <Pie
                            data={{
                                labels: expensesData.labels,
                                datasets: [
                                    {
                                        data: expensesData.values,
                                        backgroundColor: expensesData.labels.map((_, index) => {
                                            const colors = ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#c084fc'];
                                            return colors[index % colors.length];
                                        }),
                                    },
                                ],
                            }}
                            options={pieOptions}
                        />
                    </div>
                    <div className="flex flex-wrap gap-6 justify-center">
                        <div className="w-64">
                            <h3 className="text-center font-semibold mb-2">Spese per Categoria</h3>
                            <Pie
                                data={{
                                    labels: expensesData.labels,
                                    datasets: [
                                        {
                                            data: expensesData.values,
                                            backgroundColor: expensesData.labels.map((_, index) => {
                                                const colors = ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#c084fc'];
                                                return colors[index % colors.length];
                                            }),
                                        },
                                    ],
                                }}
                                options={pieOptions}
                            />
                        </div>
                        <div className="w-64">
                            <h3 className="text-center font-semibold mb-2">Saldo Netto</h3>
                            <Pie
                                data={{
                                    labels: [netLabel],
                                    datasets: [
                                        {
                                            data: [Math.abs(saldoNetto)],
                                            backgroundColor: ['#3b82f6'],
                                        },
                                    ],
                                }}
                                options={pieOptions}
                            />
                        </div>
                    </div>
                    <div className="w-64">
                        <h3 className="text-center font-semibold mb-2">Saldo Netto</h3>
                        <Pie data={netWealth} options={pieOptions} />
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-2">Entrate vs Spese</h3>
                    <ChartComponent data={incomeExpenseComparison} options={barLineOptions} />

                    <h3 className="text-lg font-semibold mt-10 mb-2">Spese per Categoria</h3>
                    <ChartComponent data={expensesByCategory} options={barLineOptions} />

                    <h3 className="text-lg font-semibold mt-10 mb-2">Andamento Entrate e Spese</h3>
                    <Line data={combinedTimeSeries} options={barLineOptions} />
                </>
            )}
        </div>
    );
};

export default DashboardCharts;
