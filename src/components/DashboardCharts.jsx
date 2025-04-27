// src/components/DashboardCharts.jsx
import { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend } from 'chart.js';
import "./DashboardCharts.css"

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Tooltip, Legend);

const chartTypes = {
    bar: Bar,
    line: Line,
    pie: Pie,
};

const options = {
    responsive: true,
    plugins: {
        legend: {
            display: true,
            position: 'top',
            labels: {
                color: '#374151', // Gray
                font: {
                    size: 14,
                    weight: 'bold',
                },
            },
        },
        tooltip: {
            callbacks: {
                label: (context) => {
                    const label = context.dataset.label || '';
                    return `${label}: €${context.raw.toFixed(2)}`;
                },
            },
        },
    },
};




const DashboardCharts = ({ data }) => {
    const [chartType, setChartType] = useState('bar');
    const ChartComponent = chartTypes[chartType];

    const chartData = {
        labels: data.labels,
        datasets: [
            {
                label: 'Spese',
                data: [data.values[0], 0, 0], // Only Spese value
                backgroundColor: 'rgba(239, 68, 68, 0.7)', // Red
                borderRadius: 6
            },
            {
                label: 'Entrate',
                data: [0, data.values[1], 0], // Only Entrate value
                backgroundColor: 'rgba(34, 197, 94, 0.7)', // Green
                borderRadius: 6
            },
            {
                label: 'Saldo Netto',
                data: [0, 0, data.values[2]], // Only Saldo value
                backgroundColor: 'rgba(59, 130, 246, 0.7)', // Blue
                borderRadius: 6
            },

        ],
    };


    return (
        <div className="dashboard-charts">
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                <option value="bar">Bar Chart</option>
                <option value="line">Line Chart</option>
                <option value="pie">Pie Chart</option>
            </select>
            <ChartComponent data={chartData} options={options} />
        </div>
    );
};

export default DashboardCharts;
