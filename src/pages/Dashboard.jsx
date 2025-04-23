import { Link } from 'react-router-dom';
import { useState } from 'react';
import './Dashboard.css';

const Dashboard = () => {
    const [openDropdown, setOpenDropdown] = useState(false);

    const toggleDropdown = () => setOpenDropdown(!openDropdown);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">Dashboard</h1>

            <div className="dropdown-container">
                <button onClick={toggleDropdown} className="dropdown-button">
                    Gestione Finanze ⬇️
                </button>

                {openDropdown && (
                    <div className="dropdown-menu">
                        <Link to="/finance/expenses" className="dropdown-item">Spese</Link>
                        <Link to="/finance/income" className="dropdown-item">Entrate</Link>
                        <Link to="/finance/transfers" className="dropdown-item">Trasferimenti</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
