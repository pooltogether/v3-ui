import { ethers } from 'ethers'

import { poolToast } from 'lib/utils/poolToast'
import { transactionsVar } from 'lib/apollo/cache'

// import { getRevertReason } from 'lib/utils/getRevertReason'
const getRevertReason = require('eth-revert-reason')

// this could be smart enough to know which ABI to use based on 
// the contract address
export const callTransaction = async (
  tx,
  setTx,
  provider,
  contractAddress,
  contractAbi,
  method,
  params = [],
) => {
  setTx(tx => ({
    ...tx,
    inWallet: true
  }))

  let newTx = {
    method,
    hash: '',
    inWallet: true,
    name: tx.name,
  }
  const transactions = transactionsVar()
  transactionsVar([...transactions, newTx])
  // console.log({ txs: transactionsVar() })

  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    )

    const ethersTx = await contract[method].apply(null, params)
    // console.log({ ethersTx})
    newTx = {
      ...newTx,
      ...ethersTx,
      sent: true,
      inWallet: false,
    }
    setTx({
      ...tx,
      sent: true,
      inWallet: false,
    })
    transactionsVar([...transactions, newTx])
    poolToast.success(`"${tx.name}" has been sent! Awaiting confirmations ...`)

    console.log({ ethersTx })
    await ethersTx.wait()
    console.log({ ethersTx })
    newTx = {
      ...newTx,
      ...ethersTx,
      completed: true,
    }
    setTx({
      ...tx,
      completed: true,
    })
    transactionsVar([...transactions, newTx])

    poolToast.success(`"${tx.name}" transaction successful!`)
  } catch (e) {
    let reason

    if (newTx.hash) {
      const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
      reason = await getRevertReason(newTx.hash, networkName)
    }

    if (e.message.match('User denied transaction signature')) {
      setTx({
        ...tx,
        cancelled: true
      })
      transactionsVar(transactionsVar().filter(tx => !tx.inWallet))
      
      poolToast.warn(`You cancelled the transaction.`)
    } else {
      console.log({ reason})
      const ever = e
      if (
        reason?.match('Cannot read property') ||
        e.message.match('Cannot read property')
      ) {
        console.log({ ever})
        debugger
      }

      if (reason?.match('rng-in-flight')) {
        reason = 'prize being awarded! Please try again soon'
      }

      const reasonDescription = reason ? reason : e.message

      newTx = {
        ...newTx,
        completed: true,
        error: true,
        reason: reasonDescription,
      }
      transactionsVar([...transactions, newTx])
      console.log({ txs: transactionsVar() })

      setTx({
        ...tx,
        completed: true,
        error: true,
        reason: reasonDescription,
      })
      
      poolToast.error(`"${tx.name}" transaction did not go through. Reason: ${reasonDescription}`)
      console.error(e.message)
    }
  }
}
