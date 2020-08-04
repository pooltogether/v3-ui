export const updateStorage = (transactions) => {
  const sentTransactions = transactions.filter(tx => {
    return tx.sent && !tx.cancelled
  })
  const txsToStore = JSON.stringify(sentTransactions)

  try {
    localStorage.setItem('pt-transactions', txsToStore)
  } catch (e) {
    console.warn(e)
  }
}
