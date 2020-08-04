import { transactionsVar } from 'lib/apollo/cache'
import { updateTransactionFactory } from 'lib/apollo/updateTransactionFactory'

// import { getRevertReason } from 'lib/utils/getRevertReason'
const getRevertReason = require('eth-revert-reason')

export const checkTransactionStatuses = (
  transactions,
  provider
) => {
  transactions = transactions.filter(tx => tx.sent && !tx.completed)
    .map(tx => runAsyncCheckTx(tx, provider))
}

export const runAsyncCheckTx = async (
  tx,
  provider,
) => {
  const updateTransaction = updateTransactionFactory(transactionsVar)

  let ethersTx
  try {
    ethersTx = await provider.getTransaction(tx.hash)

    await ethersTx.wait()

    // TODO: use provider's network!
    const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
    const reason = await getRevertReason(tx.hash, networkName)

    updateTransaction(tx.id, {
      ethersTx,
      reason,
      error: reason.length > 0,
      completed: true,
    })
  } catch (e) {
    if (!ethersTx) {
      updateTransaction(tx.id, {
        reason: 'Failed to send, could not find transaction on blockchain',
        error: true,
        completed: true,
      })
    }
    
    console.error(e.message)
  }
}
