import { ethers } from 'ethers'

import { transactionsVar } from 'lib/apollo/cache'
import { updateTransactionFactory } from 'lib/apollo/updateTransactionFactory'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { poolToast } from 'lib/utils/poolToast'

const getRevertReason = require('eth-revert-reason')

// this could be smart enough to know which ABI to use based on 
// the contract address
export const callTransaction = async (
  t,
  tx,
  provider,
  usersAddress,
  contractAbi,
  contractAddress,
  method,
  params = [],
) => {
  const updateTransaction = updateTransactionFactory(transactionsVar)
  let ethersTx

  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    )

    const nextNonce = await provider.getTransactionCount(
      usersAddress,
      'pending'
    )

    const fxn = contract.interface.functions[method]
    const { gasLimit } = params.pop()
    const data = fxn.encode(params)


    const transactionRequest = {
        to: contractAddress,
        nonce: nextNonce,
        gasLimit,
        // gasPrice: ethers.utils.bigNumberify('100000000'),

        data,
        // value: 0,
        // chainId: 3
    }

    // using the lower level `Signer#sendTransaction` API here
    // since the basic 'contract.method()' (ie.
    // const ethersTx = await contract[method].apply(null, params))
    // one was intermittently
    // failing to get the nonce on Kovan w/ MetaMask
    ethersTx = await signer.sendTransaction(transactionRequest)

    updateTransaction(tx.id, {
      ethersTx,
      sent: true,
      inWallet: false,
      hash: ethersTx.hash
    })

    poolToast.success(<>{tx.name}<br /> {t('transactionSentConfirming')}</>)
    // Transaction sent! Confirming...

    await ethersTx.wait()

    updateTransaction(tx.id, {
      ethersTx,
      completed: true,
    })

    poolToast.rainbow(<>{tx.name}<br /> Transaction successful!</>)
  } catch (e) {
    console.error(e.message)

    if (e.message.match('User denied transaction signature')) {
      updateTransaction(tx.id, {
        cancelled: true,
        completed: true,
      })
      
      poolToast.warn(t('youCancelledTheTransaction'))
      // You cancelled the transaction
    } else {
      let reason,
        errorMsg
        
      if (ethersTx?.hash) {
        const networkName = chainIdToNetworkName(ethersTx.chainId)
        reason = await getRevertReason(ethersTx.hash, networkName)
      }

      if (reason?.match('rng-in-flight')) {
        reason = t('prizeBeingAwardedPleaseTryAgainSoon')
        // 'Prize being awarded! Please try again soon'
      }

      errorMsg = reason ? reason : e.message

      if (!reason && e.message.match('transaction failed')) {
        errorMsg = t('transactionFailedUnknownError')
        // 'Transaction failed: unknown error'
      }

      updateTransaction(tx.id, {
        error: true,
        completed: true,
        reason: errorMsg
      })

      // Failed to complete. Reason:
      poolToast.error(`${tx.name} - ${t('txFailedToCompleteWithReason')} ${errorMsg}`)
    }
  }
}
