import { useState } from 'react';
import { useTransfers } from '../../context/TransferContext';
import Modal from '../../components/Modal';
import DynamicForm from './DynamicForm';
import './TransfersSection.css';

const TransfersSection = () => {
    const { transfers } = useTransfers();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page-container">
            <div className="transfer-header">
                <h1 className="transfer-title">Trasferimenti</h1>
                <button className="transfer-button" onClick={() => setIsModalOpen(true)}>➕ Aggiungi Trasferimento</button>
            </div>

            <ul className="transfer-list">
                {transfers.length > 0 ? (
                    transfers.map((transfer, index) => (
                        <li key={index} className="list-item">
                            {transfer.datetime} - Da {transfer.fromAccount} ➡️ A {transfer.toAccount} - {transfer.amountFromCurrency} {transfer.fromCurrency}
                        </li>
                    ))
                ) : (
                    <li>Nessun trasferimento registrato.</li>
                )}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DynamicForm type="transfer" onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div>
    );
};

export default TransfersSection;
