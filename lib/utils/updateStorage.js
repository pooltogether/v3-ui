import { TRANSACTIONS_KEY } from 'lib/constants'

export const updateStorage = (
  transactions,
  usersAddress,
  chainId
) => {
  const sentTransactions = transactions.filter(tx => {
    return tx.sent && !tx.cancelled
  })

  chainId = chainId || sentTransactions?.[0]?.ethersTx?.chainId
  usersAddress = usersAddress || sentTransactions?.[0]?.ethersTx?.from

  if (chainId && usersAddress) {
    const txsData = JSON.stringify(sentTransactions)
  
    try {
      console.log(`Storing ${sentTransactions.length} txs:`)
      const storageKey = `${chainId}-${usersAddress.toLowerCase()}-${TRANSACTIONS_KEY}`
      // console.log({storageKey})
  
      localStorage.setItem(storageKey, txsData)
    } catch (e) {
      console.error(e)
    }
  }
}
