import { createContext, useContext, useState } from 'react';

const TransferContext = createContext();

export const useTransfers = () => useContext(TransferContext);

export const TransferProvider = ({ children }) => {
    const [transfers, setTransfers] = useState([
        {
            datetime: "2024-12-16T00:00",
            fromAccount: "BPER",
            toAccount: "Contanti",
            amountFromCurrency: 140.00,
            fromCurrency: "EUR",
            amountToCurrency: null,
            toCurrency: null,
            comment: ""
        }
    ]);

    const addTransfer = (transfer) => {
        setTransfers(prev => [...prev, transfer]);
    };

    return (
        <TransferContext.Provider value={{ transfers, addTransfer }}>
            {children}
        </TransferContext.Provider>
    );
};
