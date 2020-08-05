import { ethers } from 'ethers'

import { transactionsVar } from 'lib/apollo/cache'
import { poolToast } from 'lib/utils/poolToast'
import { updateTransactionFactory } from 'lib/apollo/updateTransactionFactory'

// import { getRevertReason } from 'lib/utils/getRevertReason'
const getRevertReason = require('eth-revert-reason')

export const callTransaction = (
  tx,
  provider,
  contractAddress,
  contractAbi,
  method,
  params = [],
) => {
  runAsyncTx(
    tx,
    provider,
    contractAddress,
    contractAbi,
    method,
    params
  )
}

// this could be smart enough to know which ABI to use based on 
// the contract address
export const runAsyncTx = async (
  tx,
  provider,
  contractAddress,
  contractAbi,
  method,
  params,
) => {
  const updateTransaction = updateTransactionFactory(transactionsVar)

  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    )

    const usersAddress = provider.provider.selectedAddress
    const nextNonce = await provider.getTransactionCount(
      usersAddress,
      'pending'
    )
    console.log({ nextNonce})


    const fxn = contract.interface.functions[method]
    const { gasLimit } = params.pop()
    const data = fxn.encode(params)
    console.log({ data})


    console.log({ gasLimit})
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
    const ethersTx = await signer.sendTransaction(transactionRequest)



    updateTransaction(tx.id, {
      ethersTx,
      sent: true,
      inWallet: false,
      hash: ethersTx.hash
    })

    poolToast.success(<>{tx.name} sent!<br /> Awaiting confirmations...</>)

    await ethersTx.wait()

    updateTransaction(tx.id, {
      ethersTx,
      completed: true,
    })

    poolToast.success(<>{tx.name}<br/> Transaction successful!</>)
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
        console.log({tx})
          console.log({provider})
          console.log({contractAddress})
          console.log({contractAbi})
          
        console.log({ method})
        console.log({params})
        console.error(e)
        // debugger
      }

      if (reason?.match('rng-in-flight')) {
        reason = 'prize being awarded! Please try again soon'
      }

      let reasonDescription = reason ? reason : e.message

      if (e.message.match('transaction failed')) {
        reasonDescription = 'Transaction failed: unknown error'
      }

      updateTransaction(tx.id, {
        error: true,
        completed: true,
        reason: reasonDescription
      })

      poolToast.error(`${tx.name} - Failed to complete. Reason: ${reasonDescription}`)
      console.error(e.message)
    }
  }
}
