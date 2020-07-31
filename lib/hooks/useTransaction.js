import { useState } from 'react'

export const useTransaction = (value, delay) => {
  const [tx, setTx] = useState({})

  const txInWallet = tx.inWallet && !tx.sent
  const txSent = tx.sent && !tx.completed
  const txCompleted = tx.completed
  const txError = tx.error

  const ready = txCompleted && !txError

  return [tx, setTx, txInWallet, txSent, txCompleted, ready]
}
