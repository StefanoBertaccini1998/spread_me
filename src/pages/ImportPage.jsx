import { useState } from 'react';
import * as XLSX from 'xlsx';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../redux/hooks/useRedux';
import { createTransaction } from '../redux/asyncThunks/transactionThunks';
import { createAccount, fetchAccounts, updateAccountsBulk } from '../redux/asyncThunks/accountThunks';
import { createCategory } from '../redux/asyncThunks/categoryThunks';
import Modal from '../components/Modal';
import { HelpCircle } from 'lucide-react';
import styles from './ImportPage.module.css';

const getRandomColor = () => {
  const colors = ['#f87171', '#60a5fa', '#3b82f6', '#10b981', '#facc15', '#c084fc', '#34d399', '#38bdf8'];
  return colors[Math.floor(Math.random() * colors.length)];
};

const ImportPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const accounts = useAppSelector((state) => state.accounts.data);
  const categories = useAppSelector((state) => state.categories.data);
  const userId = useAppSelector((state) => state.user.user?.id);

  const [filename, setFilename] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [incomes, setIncomes] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [unknownAccounts, setUnknownAccounts] = useState([]);
  const [unknownCategories, setUnknownCategories] = useState([]);
  const [accountsToCreate, setAccountsToCreate] = useState([]);
  const [categoriesToCreate, setCategoriesToCreate] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [balanceError, setBalanceError] = useState('');
  const [showHelp, setShowHelp] = useState(false);
  const [transactionAccounts, setTransactionAccounts] = useState([]);
  const [accountBalances, setAccountBalances] = useState({});

  const knownExpenseKeys = ['Data e ora', 'Categoria', 'Conto', 'Importo in valuta predefinita', 'Valuta predefinita', 'Importo in valuta del conto', 'Valuta conto', 'Tag', 'Commento'];
  const knownIncomeKeys = [...knownExpenseKeys];
  const knownTransferKeys = ['Data e ora', 'In uscita', 'In entrata', 'Importo nella valuta in uscita', 'Valuta in uscita', 'Commento'];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    setFilename(file.name);
    const reader = new FileReader();
    reader.onerror = () => {
      setLoading(false);
      setError('Errore di lettura del file');
    };

    reader.onload = (evt) => {
      try {
        const data = new Uint8Array(evt.target.result);
        const workbook = XLSX.read(data, { type: 'array', cellDates: true });
        const expensesRaw = workbook.Sheets['Spese'] ? cleanData(workbook.Sheets['Spese'], knownExpenseKeys) : [];
        const incomesRaw = workbook.Sheets['Entrate'] ? cleanData(workbook.Sheets['Entrate'], knownIncomeKeys) : [];
        const transfersRaw = workbook.Sheets['Bonifici'] ? cleanData(workbook.Sheets['Bonifici'], knownTransferKeys) : [];
        setExpenses(expensesRaw);
        setIncomes(incomesRaw);
        setTransfers(transfersRaw);
        detectNewItems(expensesRaw, incomesRaw, transfersRaw);
        setToast('✅ File caricato con successo');
        setTimeout(() => setToast(''), 3000);
      } catch (err) {
        console.error('Errore parsing file:', err);
        setError('File non valido');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsArrayBuffer(file);
  };


  const cleanData = (sheet, knownKeys) => {
    const allRows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });
    const headerIdx = allRows.findIndex(row => row.some(cell => knownKeys.includes(cell?.toString().trim())));
    if (headerIdx === -1) return [];
    const parsed = XLSX.utils.sheet_to_json(sheet, { defval: '', range: headerIdx });
    return parsed.map(row => {
      const cleaned = {};
      knownKeys.forEach(k => cleaned[k] = row[k] ?? '');
      if (cleaned['Data e ora']) cleaned['Data e ora'] = parseDate(cleaned['Data e ora']);
      return cleaned;
    }).filter(row => Object.values(row).some(val => val !== ''));
  };

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

  const detectNewItems = (expenses, incomes, transfers) => {
    const accs = new Set([
      ...expenses.map(e => e['Conto']),
      ...incomes.map(i => i['Conto']),
      ...transfers.map(t => t['In uscita']),
      ...transfers.map(t => t['In entrata'])
    ].filter(Boolean));
    setTransactionAccounts([...accs]);

    const balances = {};
    [...accs].forEach(name => {
      const found = accounts.find(a => a.name === name);
      balances[name] = found ? found.balance : 0;
    });
    setAccountBalances(balances);

    const cats = new Set([
      ...expenses.map(e => e['Categoria']),
      ...incomes.map(i => i['Categoria'])
    ].filter(Boolean));

    const existingAccountNames = accounts.map(acc => acc.name);
    const existingCategoryNames = categories.map(cat => cat.name);

    const newAccounts = [...accs].filter(a => !existingAccountNames.includes(a));
    const newCategories = [...cats].filter(c => !existingCategoryNames.includes(c));
    setUnknownAccounts(newAccounts);
    setAccountsToCreate(newAccounts);
    setUnknownCategories(newCategories);
    setCategoriesToCreate(newCategories);
  };

  const validateAccountBalances = () => {
    for (const name of transactionAccounts) {
      const val = accountBalances[name];
      if (val === '' || val === null || val === undefined) {
        setBalanceError(`Saldo mancante per l'account "${name}"`);
        return false;
      }
      if (parseFloat(val) < 0) {
        setBalanceError(`Il saldo di "${name}" non può essere negativo`);
        return false;
      }
    }
    setBalanceError('');
    return true;
  };


  const handleImport = async () => {
    if (!userId) {
      alert('⚠️ Utente non autenticato!');
      return;
    }

    setImporting(true);
    setError('');
    setBalanceError('');

    try {
      if (!validateAccountBalances()) {
        return;
      }
      for (const acc of accountsToCreate) {
        const res = await dispatch(createAccount({
          name: acc,
          color: getRandomColor(),
          icon: '🏦',
          balance: 0
        }));
        if (res.error) throw new Error(`Errore creazione account "${acc}"`);
      }

      for (const cat of categoriesToCreate) {
        const res = await dispatch(createCategory({
          name: cat,
          color: getRandomColor(),
          icon: '📂'
        }));
        if (res.error) throw new Error(`Errore creazione categoria "${cat}"`);
      }

      for (const row of expenses) {
        const res = await dispatch(createTransaction({
          transaction: {
            type: 'expense',
            date: row['Data e ora'],
            category: row['Categoria'],
            account: row['Conto'],
            amountBaseCurrency: parseFloat(row['Importo in valuta predefinita']) || 0,
            baseCurrency: row['Valuta predefinita'],
            amountAccountCurrency: parseFloat(row['Importo in valuta del conto']) || 0,
            accountCurrency: row['Valuta conto'],
            comment: row['Commento']
          },
          skipBalanceUpdate: true
        }));
        if (res.error) throw new Error(`Errore su spesa: ${row['Commento'] || row['Categoria']}`);
      }

      for (const row of incomes) {
        const res = await dispatch(createTransaction({
          transaction: {
            type: 'income',
            date: row['Data e ora'],
            category: row['Categoria'],
            account: row['Conto'],
            amountBaseCurrency: parseFloat(row['Importo in valuta predefinita']) || 0,
            baseCurrency: row['Valuta predefinita'],
            amountAccountCurrency: parseFloat(row['Importo in valuta del conto']) || 0,
            accountCurrency: row['Valuta conto'],
            comment: row['Commento']
          },
          skipBalanceUpdate: true
        }));
        if (res.error) throw new Error(`Errore su entrata: ${row['Commento'] || row['Categoria']}`);
      }

      for (const row of transfers) {
        const res = await dispatch(createTransaction({
          transaction: {
            type: 'transfer',
            date: row['Data e ora'],
            fromAccount: row['In uscita'],
            toAccount: row['In entrata'],
            amountFromCurrency: parseFloat(row['Importo nella valuta in uscita']) || 0,
            fromCurrency: row['Valuta in uscita'],
            comment: row['Commento']
          },
          skipBalanceUpdate: true
        }));
        if (res.error) throw new Error(`Errore su trasferimento: ${row['Commento']}`);
      }

      const allAccounts = await dispatch(fetchAccounts()).unwrap();
      const updates = transactionAccounts.map(name => {
        const acc = allAccounts.find(a => a.name === name);
        return acc ? { id: acc.id, balance: parseFloat(accountBalances[name]) || 0 } : null;
      }).filter(Boolean);
      if (updates.length > 0) {
        const updRes = await dispatch(updateAccountsBulk(updates));
        if (updRes.error) throw new Error('Errore aggiornamento saldi account');
      }

      setExpenses([]); setIncomes([]); setTransfers([]);
      setFilename('');
      alert('📥 Dati importati con successo!');
      navigate('/dashboard');
    } catch (err) {
      console.error('❌ Import failed:', err);
      setError(err.message || 'Errore durante l\'importazione');
    } finally {
      setImporting(false);
    }
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

  const renderUnknownSection = (items, label, selected, setSelected) => (
    <div className={styles.section}>
      <div className={styles.sectionTitleWrapper}>
        <h3 className={styles.sectionTitle}>{label}</h3>
        <button type="button" className={styles.selectAllButton} onClick={() => setSelected(selected.length === items.length ? [] : [...items])}>
          {selected.length === items.length ? 'Deseleziona tutto' : 'Seleziona tutto'}
        </button>
      </div>
      <ul className={styles.checkboxList}>
        {items.map(item => (
          <li key={item} className={styles.checkboxItem}>
            <label>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={selected.includes(item)}
                onChange={() =>
                  setSelected(prev =>
                    prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
                  )
                }
              />
              <span>{item}</span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
  const renderAccountsTable = () => (
    <div className={styles.tableWrapper}>
      <h2 className={styles.title}>Saldo finale account</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={styles.th}>Account</th>
            <th className={styles.th}>Saldo</th>
          </tr>
        </thead>
        <tbody>
          {transactionAccounts.map((name) => (
            <tr key={name}>
              <td className={styles.td}>{name}</td>
              <td className={styles.td}>
                <input
                  type="number"
                  min="0"
                  className={styles.balanceInput}
                  value={accountBalances[name] ?? ''}
                  onChange={(e) =>
                    setAccountBalances((prev) => ({
                      ...prev,
                      [name]: e.target.value,
                    }))
                  }
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className={styles.container}>

      <button
        type="button"
        onClick={() => setShowHelp(true)}
        className={styles.helpButton}
        aria-label="Guida"
      >
        <HelpCircle size={20} />
      </button>
      {error && <p className={styles.error}>{error}</p>}
      {importing && (
        <p className={styles.importingToast}>
          <span className={styles.spinner}></span>
          Importazione in corso, attendi...
        </p>
      )}
      <h1 className={styles.title}>Importa Dati Finanziari da Excel</h1>
      <div className={styles.fileRow}>
        <input
          id="import-file"
          type="file"
          accept=".csv, .xlsx, .xls"
          onChange={handleFileUpload}
          className={styles.file}
        />
      </div>
      <Modal isOpen={showHelp} onClose={() => setShowHelp(false)} type="info">
        <div className={styles.helpSection}>
          <p>
            Il file Excel pu&ograve; contenere i fogli <strong>Spese</strong>,
            <strong>Entrate</strong> e <strong>Bonifici</strong> (opzionali).
            Le colonne riconosciute sono:
          </p>
          <ul className={styles.helpList}>
            <li>
              <strong>Spese/Entrate</strong>: Data e ora, Categoria, Conto,
              Importo in valuta predefinita, Valuta predefinita, Importo in
              valuta del conto, Valuta conto, Tag, Commento
            </li>
            <li>
              <strong>Bonifici</strong>: Data e ora, In uscita, In entrata,
              Importo nella valuta in uscita, Valuta in uscita, Commento
            </li>
          </ul>
          <p>Altre colonne o righe vuote verranno ignorate.</p>
        </div>
      </Modal>
      {loading && <p className={styles.loading}>⏳ Parsing in corso...</p>}
      {toast && <p className={styles.toast}>{toast}</p>}
      {filename && <p className={styles.filename}>📁 File: <strong>{filename}</strong></p>}
      {unknownAccounts.length > 0 && renderUnknownSection(unknownAccounts, 'Account da creare', accountsToCreate, setAccountsToCreate)}
      {unknownCategories.length > 0 && renderUnknownSection(unknownCategories, 'Categorie da creare', categoriesToCreate, setCategoriesToCreate)}
      {expenses.length > 0 && renderTable('📊 Spese', expenses)}
      {incomes.length > 0 && renderTable('💰 Entrate', incomes)}
      {transfers.length > 0 && renderTable('🔁 Trasferimenti', transfers)}
      {transactionAccounts.length > 0 && renderAccountsTable()}
      {balanceError && <p className={styles.error}>{balanceError}</p>}
      {(expenses.length || incomes.length || transfers.length) > 0 && (
        <button
          onClick={handleImport}
          className={styles.importButton}
          disabled={importing}
        >
          {importing ? 'Importazione in corso...' : 'Importa Tutto'}
        </button>
      )}
    </div>
  );
};

export default ImportPage;
