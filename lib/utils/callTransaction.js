import { ethers } from 'ethers'

import { updateTransaction } from 'lib/services/updateTransaction'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { poolToast } from 'lib/utils/poolToast'

const debug = require('debug')('pool-app:callTransaction')

const getRevertReason = require('eth-revert-reason')

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
  params = []
) => {
  let ethersTx

  let updatedTransactions = transactions

  const signer = provider.getSigner()

  const contract = new ethers.Contract(contractAddress, contractAbi, signer)

  let gasEstimate
  try {
    gasEstimate = await contract.estimateGas[method](...params)
  } catch (e) {
    console.warn(`error while estimating gas: `, e)
  }

  try {
    // Increase the gas limit by 1.15x as many tx's fail when gas estimate is left at 1x
    const gasLimit = gasEstimate ? gasEstimate.mul(115).div(100) : undefined
    const ethersTx = await contract[method](...params, { gasLimit })

    updatedTransactions = updateTransaction(
      tx.id,
      {
        ethersTx,
        sent: true,
        inWallet: false,
        hash: ethersTx.hash
      },
      updatedTransactions,
      setTransactions
    )

    // Transaction sent! Confirming...
    poolToast.success(
      <>
        {tx.name}
        <br /> {t('transactionSentConfirming')}
      </>
    )
    await ethersTx.wait()

    updatedTransactions = updateTransaction(
      tx.id,
      {
        ethersTx,
        completed: true
      },
      updatedTransactions,
      setTransactions
    )

    poolToast.rainbow(
      <>
        {tx.name}
        <br /> {t('transactionSuccessful')}
      </>
    )
  } catch (e) {
    console.error(e.message)

    if (e?.message?.match('User denied transaction signature')) {
      updatedTransactions = updateTransaction(
        tx.id,
        {
          cancelled: true,
          completed: true
        },
        updatedTransactions,
        setTransactions
      )

      poolToast.warn(t('youCancelledTheTransaction'))
      // You cancelled the transaction
    } else {
      let reason, errorMsg

      try {
        if (ethersTx?.hash) {
          const networkName = chainIdToNetworkName(ethersTx.chainId)
          reason = await getRevertReason(ethersTx.hash, networkName)
        }
      } catch (error2) {
        console.error('Error getting revert reason')
        console.error(error2)
      }

      if (reason?.match('rng-in-flight')) {
        reason = t('prizeBeingAwardedPleaseTryAgainSoon')
        // 'Prize being awarded! Please try again soon'
      }

      errorMsg = reason ? reason : e.data?.message ? e.data.message : e.message

      if (!reason && e?.message?.match('transaction failed')) {
        errorMsg = t('transactionFailedUnknownError')
        // 'Transaction failed: unknown error'
      }

      updatedTransactions = updateTransaction(
        tx.id,
        {
          error: true,
          completed: true,
          reason: errorMsg,
          hash: ethersTx?.hash
        },
        updatedTransactions,
        setTransactions
      )

      // Failed to complete. Reason:
      poolToast.error(`${tx.name} - ${t('txFailedToCompleteWithReason')} ${errorMsg}`)
    }
  }
}
