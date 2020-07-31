import { ethers } from 'ethers'

import { poolToast } from 'lib/utils/poolToast'
import { transactionsVar } from 'lib/apollo/cache'

// import { getRevertReason } from 'lib/utils/getRevertReason'
const getRevertReason = require('eth-revert-reason')

// this could be smart enough to know which ABI to use based on 
// the contract address
export const sendTx = async (
  setTx,
  provider,
  contractAddress,
  contractAbi,
  method,
  params = [],
  txDescription,
) => {
  setTx(tx => ({
    ...tx,
    inWallet: true
  }))

  let newTx = {
    method,
    hash: '',
    inWallet: true,
    name: 'Withdraw X tickets'
  }
  const transactions = transactionsVar()
  transactionsVar([...transactions, newTx])
  console.log({ txs: transactionsVar() })

  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    )

    const ethersTx = await contract[method].apply(null, params)
    console.log({ ethersTx})
    newTx = {
      ...newTx,
      ...ethersTx,
      sent: true,
      inWallet: false,
    }
    transactionsVar([...transactions, newTx])

    console.log({ ethersTx })
    await ethersTx.wait()
    console.log({ ethersTx })
    newTx = {
      ...newTx,
      ...ethersTx,
      inWallet: false,
      completed: true,
    }
    transactionsVar([...transactions, newTx])

    poolToast.success(`"${txDescription}" transaction successful!`)
  } catch (e) {
    let reason

    if (newTx.hash) {
      const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
      reason = await getRevertReason(newTx.hash, networkName)
    }

    if (e.message.match('User denied transaction signature')) {
      transactionsVar(transactionsVar().filter(tx => !tx.inWallet))
      
      poolToast.error(`You rejected the transaction - please try again.`)
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
        inWallet: false,
        completed: true,
        error: true,
        reason,
      }
      transactionsVar([...transactions, newTx])
      console.log({ txs: transactionsVar() })
      
      poolToast.error(`"${txDescription}" transaction did not go through. Reason: ${reasonDescription}`)
      console.error(e.message)
    }
  }
}
