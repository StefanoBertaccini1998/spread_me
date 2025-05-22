import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const MonthlyExpensesChart = ({ data }) => (
    <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="expenses" fill="#8884d8" />
        </BarChart>
    </ResponsiveContainer>
);

export default MonthlyExpensesChart;
