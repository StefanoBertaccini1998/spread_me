/**
 * Update account balances when creating or editing a transaction.
 * @param {Array<Object>} accounts List of existing accounts
 * @param {Object} transaction Transaction being applied
 * @param {'add'|'remove'} operation Type of operation
 */
export const adjustAccountBalance = (accounts, transaction, operation) => {
  const getDelta = (amount) => (operation === "add" ? amount : -amount);

  return accounts.map((acc) => {
    let balance = parseFloat(acc.balance) || 0;
    let updatedBalance = balance;

    if (transaction.type === "expenses" && acc.name === transaction.account) {
      updatedBalance += getDelta(-transaction.amountBaseCurrency);
    }

    if (transaction.type === "incomes" && acc.name === transaction.account) {
      updatedBalance += getDelta(transaction.amountBaseCurrency);
    }

    if (transaction.type === "transfers") {
      if (acc.name === transaction.fromAccount) {
        updatedBalance += getDelta(-transaction.amountFromCurrency);
      }
      if (acc.name === transaction.toAccount) {
        updatedBalance += getDelta(transaction.amountFromCurrency);
      }
    }

    return {
      ...acc,
      balance: updatedBalance,
    };
  });
};
