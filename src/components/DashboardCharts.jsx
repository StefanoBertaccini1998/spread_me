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
                    label: (context) => `${context.label}: €${context.parsed}`
                }
            }
        }
    };

    const barLineOptions = {
        responsive: true,
        plugins: {
            legend: { labels: { color: 'black' } },
            tooltip: {
                callbacks: {
                    label: (context) => `${context.dataset.label}: €${context.raw}`
                }
            }
        },
        scales: {
            y: {
                ticks: {
                    callback: formatCurrency
                }
            }
        }
    };

    const buildTimeSeriesData = (data) => {
        const grouped = {};

        data.forEach((item, index) => {
            const category = item.category || 'Sconosciuto';
            const date = new Date(item.date).toISOString().slice(0, 10);

            if (!grouped[category]) grouped[category] = {};
            if (!grouped[category][date]) grouped[category][date] = 0;

            grouped[category][date] += item.amountBaseCurrency;
        });

        // Ottieni tutte le date uniche ordinate
        const allDatesSet = new Set();
        Object.values(grouped).forEach((catData) =>
            Object.keys(catData).forEach((date) => allDatesSet.add(date))
        );
        const allDates = Array.from(allDatesSet).sort();

        const datasets = Object.entries(grouped).map(([category, values]) => ({
            label: category,
            data: allDates.map((date) => values[date] || 0),
            backgroundColor: 'rgba(239,68,68,0.6)',
            borderColor: 'rgba(239,68,68,1)',
            fill: chartType === 'line' ? false : true,
            tension: 0.3
        }));

        return { labels: allDates, datasets };
    };

    const timeSeriesExpenses = buildTimeSeriesData(expensesData.raw || []);
    const timeSeriesIncome = buildTimeSeriesData(incomeData.raw || []);

    // 🧠 Calcolo Saldo Netto
    const totalIncome = incomeData.values.reduce((a, b) => a + b, 0);
    const totalExpenses = expensesData.values.reduce((a, b) => a + b, 0);
    const saldoNetto = totalIncome - totalExpenses;
    const netLabel = saldoNetto >= 0 ? 'Risparmio' : 'Deficit';
    const netColor = saldoNetto >= 0 ? '#34d399' : '#f87171';

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
                                        backgroundColor: ['#f87171', '#fbbf24', '#60a5fa', '#34d399', '#c084fc']
                                    }
                                ]
                            }}
                            options={pieOptions}
                        />
                    </div>
                    <div className="w-64">
                        <h3 className="text-center font-semibold mb-2">Entrate</h3>
                        <Pie
                            data={{
                                labels: incomeData.labels,
                                datasets: [
                                    {
                                        data: incomeData.values,
                                        backgroundColor: ['#34d399', '#60a5fa', '#facc15']
                                    }
                                ]
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
                                        backgroundColor: [netColor]
                                    }
                                ]
                            }}
                            options={pieOptions}
                        />
                    </div>
                </div>
            ) : (
                <>
                    <h3 className="text-lg font-semibold mb-2">Spese per Categoria</h3>
                    <ChartComponent data={timeSeriesExpenses} options={barLineOptions} />

                    <h3 className="text-lg font-semibold mt-10 mb-2">Entrate per Categoria</h3>
                    <ChartComponent data={timeSeriesIncome} options={barLineOptions} />
                </>
            )}
        </div>
    );
};

export default DashboardCharts;
