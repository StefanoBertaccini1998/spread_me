import { useState } from 'react';
import Modal from '../../components/Modal';
import DynamicForm from './DynamicForm';
import './TransfersSection.css';

const ModularsSection = ({ className, title, object, useContext, columns }) => {
    const { list } = useContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="page-container">
            <div className={`${className}-header`}>
                <h1 className={`${className}-title`}>{title}</h1>
                <button className={`${className}-button`} onClick={() => setIsModalOpen(true)}>➕ Aggiungi {object}</button>
            </div>

            <ul className={`${className}-list`}>
                {list.length > 0 ? (
                    list.map((item, index) => (
                        <li key={index} className="list-item">
                            {item.datetime} - Da {item.fromAccount} ➡️ A {item.toAccount} - {item.amountFromCurrency} {item.fromCurrency}
                        </li>
                    ))
                ) : (
                    <li>Nessun {object} registrato.</li>
                )}
            </ul>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <DynamicForm type="transfer" onClose={() => setIsModalOpen(false)} />
            </Modal>
        </div >
    );
};

export default ModularsSection;
