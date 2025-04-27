import { useState } from 'react';
import * as XLSX from 'xlsx';
import './ImportPage.css';

import { useExpenses } from '../context/ExpenseContext';
import { useIncome } from '../context/IncomeContext';
import { useTransfers } from '../context/TransferContext';

const ImportPage = () => {
  const { addExpense } = useExpenses();
  const { addIncome } = useIncome();
  const { addTransfer } = useTransfers();

  const [filename, setFilename] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [transfers, setTransfers] = useState([]);

  const knownExpenseKeys = ['Data e ora', 'Categoria', 'Conto', 'Importo in valuta predefinita', 'Valuta predefinita', 'Importo in valuta del conto', 'Valuta conto', 'Tag', 'Commento'];
  const knownIncomeKeys = ['Data e ora', 'Categoria', 'Conto', 'Importo in valuta predefinita', 'Valuta predefinita', 'Importo in valuta del conto', 'Valuta conto', 'Tag', 'Commento'];
  const knownTransferKeys = ['Data e ora', 'In uscita', 'In entrata', 'Importo nella valuta in uscita', 'Valuta in uscita', 'Commento'];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFilename(file.name);
    const reader = new FileReader();

    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const expenseSheet = workbook.Sheets['Spese'];
      const incomeSheet = workbook.Sheets['Entrate'];
      const transferSheet = workbook.Sheets['Bonifici'];

      const expenseData = expenseSheet
        ? filterKnownColumns(extractFromSheetWithHeaderDetection(expenseSheet, knownExpenseKeys), knownExpenseKeys)
        : [];

      const parsedExpenseData = expenseData.map(row => ({
        ...row,
        'Data e ora': parseDate(row['Data e ora']),
      }));

      const incomeData = incomeSheet
        ? filterKnownColumns(extractFromSheetWithHeaderDetection(incomeSheet, knownIncomeKeys), knownIncomeKeys)
        : [];

      const parsedIncomeData = incomeData.map(row => ({
        ...row,
        'Data e ora': parseDate(row['Data e ora']),
      }));

      const transferData = transferSheet
        ? filterKnownColumns(extractFromSheetWithHeaderDetection(transferSheet, knownTransferKeys), knownTransferKeys)
        : [];

      const parsedTransferData = transferData.map(row => ({
        ...row,
        'Data e ora': parseDate(row['Data e ora']),
      }));

      setExpenses(parsedExpenseData);
      setIncomes(parsedIncomeData);
      setTransfers(parsedTransferData);
    };

    reader.readAsArrayBuffer(file);
  };

  const parseDate = (rawDate) => {
    if (!rawDate) return '';

    if (typeof rawDate === 'number') {
      // Excel serialized date (number) handling
      const excelEpoch = new Date(1899, 11, 30);
      return new Date(excelEpoch.getTime() + rawDate * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
    }

    if (typeof rawDate === 'string') {
      const parts = rawDate.split('/');
      if (parts.length === 3) {
        // Expected format "dd/mm/yyyy"
        const [day, month, year] = parts;
        return new Date(`${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`).toISOString().slice(0, 10);
      }
    }

    return '';
  };


  const mapExpenseRow = (row) => ({
    date: parseDate(row['Data e ora']) || '',
    category: row['Categoria'] || '',
    account: row['Conto'] || '',
    amountBaseCurrency: parseFloat(row['Importo in valuta predefinita']) || 0,
    baseCurrency: row['Valuta predefinita'] || 'EUR',
    amountAccountCurrency: parseFloat(row['Importo in valuta del conto']) || 0,
    accountCurrency: row['Valuta conto'] || 'EUR',
    amountTransactionCurrency: null,
    transactionCurrency: null,
    tag: row['Tag'] || null,
    comment: row['Commento'] || '',
  });

  const mapIncomeRow = (row) => ({
    date: parseDate(row['Data e ora']) || '',
    category: row['Categoria'] || '',
    account: row['Conto'] || '',
    amountBaseCurrency: parseFloat(row['Importo in valuta predefinita']) || 0,
    baseCurrency: row['Valuta predefinita'] || 'EUR',
    amountAccountCurrency: parseFloat(row['Importo in valuta del conto']) || 0,
    accountCurrency: row['Valuta conto'] || 'EUR',
    amountTransactionCurrency: null,
    transactionCurrency: null,
    tag: row['Tag'] || null,
    comment: row['Commento'] || '',
  });

  const mapTransferRow = (row) => ({
    date: parseDate(row['Data e ora']) || '',
    fromAccount: row['In uscita'] || '',
    toAccount: row['In entrata'] || '',
    amountFromCurrency: parseFloat(row['Importo nella valuta in uscita']) || 0,
    fromCurrency: row['Valuta in uscita'] || 'EUR',
    amountToCurrency: null,
    toCurrency: null,
    comment: row['Commento'] || '',
  });

  const handleImport = () => {
    expenses.forEach(row => addExpense(mapExpenseRow(row)));
    incomes.forEach(row => addIncome(mapIncomeRow(row)));
    transfers.forEach(row => addTransfer(mapTransferRow(row)));

    setExpenses([]);
    setIncomes([]);
    setTransfers([]);
    setFilename('');
    alert('📥 Dati importati con successo!');
  };

  const renderTable = (title, data) => (
    <div className="sheet-preview">
      <h2 className="sheet-title">{title}</h2>
      <div className="import-table-wrapper">
        <table className="import-table">
          <thead>
            <tr>
              {Object.keys(data[0]).map((key) => (
                <th key={key} className="import-th">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, idx) => (
              <tr key={idx}>
                {Object.values(row).map((val, i) => (
                  <td key={i} className="import-td">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const hasData = expenses.length > 0 || incomes.length > 0 || transfers.length > 0;

  const extractFromSheetWithHeaderDetection = (sheet, knownHeaders) => {
    const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    const headerIndex = allRows.findIndex(row =>
      row.some(cell => knownHeaders.includes(cell?.toString().trim()))
    );

    if (headerIndex === -1) return [];

    return XLSX.utils.sheet_to_json(sheet, {
      defval: '',
      range: headerIndex
    });
  };

  const filterKnownColumns = (data, knownKeys) =>
    data
      .map(row => {
        const filtered = {};
        knownKeys.forEach(key => {
          if (row.hasOwnProperty(key)) {
            filtered[key] = row[key];
          }
        });
        return filtered;
      })
      .filter(row => Object.values(row).some(val => val !== ''));

  return (
    <div className="import-container">
      <h1 className="import-title">Importa Dati Finanziari da Excel</h1>

      <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} className="import-file" />

      {filename && <p className="import-filename">📁 File: <strong>{filename}</strong></p>}

      {expenses.length > 0 && renderTable('📊 Spese', expenses)}
      {incomes.length > 0 && renderTable('💰 Entrate', incomes)}
      {transfers.length > 0 && renderTable('🔁 Trasferimenti', transfers)}

      {hasData && (
        <button onClick={handleImport} className="mt-4 bg-blue-700 hover:bg-blue-800 text-white py-2 px-6 rounded shadow">
          Importa Tutto
        </button>
      )}
    </div>
  );
};

export default ImportPage;
