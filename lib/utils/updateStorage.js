import { TRANSACTIONS_KEY } from 'lib/constants'

export const updateStorage = (transactions) => {
  const sentTransactions = transactions.filter(tx => {
    return tx.sent && !tx.cancelled
  })

  if (sentTransactions.length > 0) {
    const chainId = sentTransactions[0].ethersTx.chainId
    const usersAddress = sentTransactions[0].ethersTx.from

    const txsData = JSON.stringify(sentTransactions)

    try {
      console.log(`Storing ${sendTransactions.length} txs:`)

      const storageKey = `${chainId}-${usersAddress.toLowerCase()}-${TRANSACTIONS_KEY}`
      // console.log({storageKey})

      localStorage.setItem(storageKey, txsData)
    } catch (e) {
      console.error(e)
    }
  }
}
