import { ethers } from 'ethers'

import { transactionsVar } from 'lib/apollo/cache'
import { poolToast } from 'lib/utils/poolToast'
import { createUpdateTransaction } from 'lib/apollo/createUpdateTransaction'

// import { getRevertReason } from 'lib/utils/getRevertReason'
const getRevertReason = require('eth-revert-reason')

// this could be smart enough to know which ABI to use based on 
// the contract address
export const callTransaction = async (
  tx,
  provider,
  contractAddress,
  contractAbi,
  method,
  params = [],
) => {
  const updateTransaction = createUpdateTransaction(transactionsVar)

  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    )

    const ethersTx = await contract[method].apply(null, params)
    
    console.log('go update')
    updateTransaction(tx.id, {
      ethersTx,
      sent: true,
      inWallet: false,
      hash: ethersTx.hash
    })

    poolToast.success(`"${tx.name}" has been sent! Awaiting confirmations...`)

    await ethersTx.wait()

    updateTransaction(tx.id, {
      ethersTx,
      completed: true,
    })

    poolToast.success(`"${tx.name}" transaction successful!`)
  } catch (e) {
    let reason

    if (tx.hash) {
      // TODO: use provider's network!
      const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
      reason = await getRevertReason(tx.hash, networkName)
    }

    if (e.message.match('User denied transaction signature')) {
      updateTransaction(tx.id, {
        cancelled: true,
      })
      
      poolToast.warn(`You cancelled the transaction.`)
    } else {
      console.log({ reason})
      if (
        reason?.match('Cannot read property') ||
        e.message.match('Cannot read property')
      ) {
        console.error(e)
      }

      if (reason?.match('rng-in-flight')) {
        reason = 'prize being awarded! Please try again soon'
      }

      const reasonDescription = reason ? reason : e.message

      updateTransaction(tx.id, {
        error: true,
        completed: true,
        reason: reasonDescription
      })

      poolToast.error(`"${tx.name}" transaction did not go through. Reason: ${reasonDescription}`)
      console.error(e.message)
    }
  }
}
