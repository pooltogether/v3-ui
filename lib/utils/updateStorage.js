export const updateStorage = (transactions) => {
  const sentTransactions = transactions.filter(tx => tx.sent)
  const txsToStore = JSON.stringify(sentTransactions)

  try {
    localStorage.setItem('pt-transactions', txsToStore)
  } catch (e) {
    console.warn(e)
  }
}
