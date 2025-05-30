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

    if (balance !== updatedBalance) {
      console.log(
        `✅ Updating balance for ${acc.name}: ${balance} → ${updatedBalance}`
      );
    }

    return {
      ...acc,
      balance: updatedBalance,
    };
  });
};
