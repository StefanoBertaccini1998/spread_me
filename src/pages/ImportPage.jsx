import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../redux/hooks/useRedux';
import { addExpense, addIncome, addTransfer } from '../redux/slices/transactionSlice';
import styles from './ImportPage.module.css';

const ImportPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

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
      const workbook = XLSX.read(data, { type: 'array', cellDates: true });

      const expenseSheet = workbook.Sheets['Spese'];
      const incomeSheet = workbook.Sheets['Entrate'];
      const transferSheet = workbook.Sheets['Bonifici'];

      const expenseData = expenseSheet ? filterKnownColumns(extractFromSheet(expenseSheet, knownExpenseKeys), knownExpenseKeys) : [];
      const incomeData = incomeSheet ? filterKnownColumns(extractFromSheet(incomeSheet, knownIncomeKeys), knownIncomeKeys) : [];
      const transferData = transferSheet ? filterKnownColumns(extractFromSheet(transferSheet, knownTransferKeys), knownTransferKeys) : [];

      setExpenses(expenseData.map(parseDateField));
      setIncomes(incomeData.map(parseDateField));
      setTransfers(transferData.map(parseDateField));
    };

    reader.readAsArrayBuffer(file);
  };

  const parseDateField = (row) => ({
    ...row,
    'Data e ora': parseDate(row['Data e ora'])
  });

  const parseDate = (value) => {
    if (value instanceof Date) return value.toISOString().slice(0, 10);
    if (typeof value === 'number') return new Date((value - 25569) * 86400000).toISOString().slice(0, 10);
    if (typeof value === 'string') {
      const [d, m, y] = value.split('/');
      if (d && m && y) {
        const date = new Date(`${y}-${m}-${d}`);
        return !isNaN(date) ? date.toISOString().slice(0, 10) : '';
      }
    }
    return '';
  };

  const extractFromSheet = (sheet, knownKeys) => {
    const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const headerIdx = allRows.findIndex(row => row.some(cell => knownKeys.includes(cell?.toString().trim())));
    if (headerIdx === -1) return [];
    return XLSX.utils.sheet_to_json(sheet, { defval: '', range: headerIdx });
  };

  const filterKnownColumns = (rows, keys) => rows.map(row => {
    const cleaned = {};
    keys.forEach(k => cleaned[k] = row[k] ?? '');
    return cleaned;
  }).filter(row => Object.values(row).some(val => val !== ''));

  const mapExpense = (r) => ({
    date: r['Data e ora'], category: r['Categoria'], account: r['Conto'],
    amountBaseCurrency: parseFloat(r['Importo in valuta predefinita']) || 0,
    baseCurrency: r['Valuta predefinita'], amountAccountCurrency: parseFloat(r['Importo in valuta del conto']) || 0,
    accountCurrency: r['Valuta conto'], amountTransactionCurrency: null,
    transactionCurrency: null, tag: r['Tag'], comment: r['Commento']
  });

  const mapIncome = (r) => ({
    date: r['Data e ora'], category: r['Categoria'], account: r['Conto'],
    amountBaseCurrency: parseFloat(r['Importo in valuta predefinita']) || 0,
    baseCurrency: r['Valuta predefinita'], amountAccountCurrency: parseFloat(r['Importo in valuta del conto']) || 0,
    accountCurrency: r['Valuta conto'], amountTransactionCurrency: null,
    transactionCurrency: null, tag: r['Tag'], comment: r['Commento']
  });

  const mapTransfer = (r) => ({
    date: r['Data e ora'], fromAccount: r['In uscita'], toAccount: r['In entrata'],
    amountFromCurrency: parseFloat(r['Importo nella valuta in uscita']) || 0,
    fromCurrency: r['Valuta in uscita'], amountToCurrency: null,
    toCurrency: null, comment: r['Commento']
  });

  const handleImport = () => {
    expenses.forEach(row => dispatch(addExpense(mapExpense(row))));
    incomes.forEach(row => dispatch(addIncome(mapIncome(row))));
    transfers.forEach(row => dispatch(addTransfer(mapTransfer(row))));
    setExpenses([]); setIncomes([]); setTransfers([]); setFilename('');
    alert('📥 Dati importati con successo!');
    navigate('/dashboard');
  };

  const renderTable = (title, data) => (
    <div className={styles.tableWrapper}>
      <h2 className={styles.title}>{title}</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            {Object.keys(data[0]).map((key) => <th key={key} className={styles.th}>{key}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((val, idx) => <td key={idx} className={styles.td}>{val}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const hasData = expenses.length || incomes.length || transfers.length;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Importa Dati Finanziari da Excel</h1>
      <input type="file" accept=".csv, .xlsx, .xls" onChange={handleFileUpload} className={styles.file} />
      {filename && <p className={styles.filename}>📁 File: <strong>{filename}</strong></p>}
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