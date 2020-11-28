import { ethers } from 'ethers'

import { V2_CONTRACT_ADDRESSES } from 'lib/constants'
// import { transactionsVar } from 'lib/apollo/cache'
import { updateTransactionFactory } from 'lib/apollo/updateTransactionFactory'
// import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { poolToast } from 'lib/utils/poolToast'

const debug = require('debug')('pool-app:callTransaction')

const getRevertReason = require('eth-revert-reason')
const bn = ethers.utils.bigNumberify

// this could be smart enough to know which ABI to use based on 
// the contract address
export const callTransaction = async (
  t,
  transactions,
  setTransactions,
  tx,
  provider,
  usersAddress,
  contractAbi,
  contractAddress,
  method,
  params = [],
) => {
  const updateTransaction = updateTransactionFactory(transactions, setTransactions)
  let ethersTx

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

  const data = fxn.encode(params)

  const chainId = provider.network.chainId
  let transactionRequest = {
    to: contractAddress,
    nonce: nextNonce,
    data,
    chainId,
    // gasLimit: bn(50000) // false number, could be a red herring, ignore this!
  }
  
  let gasEstimate
  try {
    gasEstimate = await contract.estimate[method](...params)
  } catch (e) {
    console.log(`error while estimating gas: `, e)
  }

  let gasLimit
  const lastParam = params[params.length - 1]
  if (typeof lastParam === 'object' && lastParam.hasOwnProperty('gasLimit')) {
    transactionRequest.gasLimit = params.pop().gasLimit
  } else if (gasEstimate) {
    const isV2Method = V2_CONTRACT_ADDRESSES.includes(contractAddress)
    const gasMultiplier = isV2Method ? 1.2 : 1.1
    
    transactionRequest.gasLimit = parseInt(gasEstimate.toNumber() * gasMultiplier, 10)
  }



  try {
    // using the lower level `Signer#sendTransaction` API here
    // since the basic 'contract.method()' (ie.
    // const ethersTx = await contract[method].apply(null, params))
    // one was intermittently
    // failing to get the nonce on Kovan w/ MetaMask
    debug('sending tx', transactionRequest)
    ethersTx = await signer.sendTransaction(transactionRequest)

    updateTransaction(tx.id, {
      ethersTx,
      sent: true,
      inWallet: false,
      hash: ethersTx.hash
    })
    // debug(tx)

    poolToast.success(<>{tx.name}<br /> {t('transactionSentConfirming')}</>)
    // Transaction sent! Confirming...

    await ethersTx.wait()

    updateTransaction(tx.id, {
      ethersTx,
      completed: true,
    })

    poolToast.rainbow(<>{tx.name}<br /> {t('transactionSuccessful')}</>)
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
