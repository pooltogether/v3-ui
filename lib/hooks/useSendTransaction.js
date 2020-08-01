import { useState } from 'react'

import { callTransaction } from 'lib/utils/callTransaction'

export const useSendTransaction = function (txName) {
  const [tx, setTx] = useState({
    name: txName
  })

  const sendTx = (
    provider,
    contractAddress,
    contractAbi,
    method,
    params = []
  ) => {
    callTransaction(
      tx,
      setTx,
      provider,
      contractAddress,
      contractAbi,
      method,
      params,
    )
  }

  return [sendTx, tx]
}
