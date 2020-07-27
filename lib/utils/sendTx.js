import { ethers } from 'ethers'

import { poolToast } from 'lib/utils/poolToast'
import { getRevertReason } from 'lib/utils/getRevertReason'

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

  let newTx
  let hash = ''
  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    )

    newTx = await contract[method].apply(null, params)
    console.log(newTx)
    hash = newTx.hash
    console.log(hash)

    setTx(tx => ({
      ...tx,
      hash: newTx.hash,
      sent: true,
    }))

    await newTx.wait()

    setTx(tx => ({
      ...tx,
      completed: true,
    }))

    poolToast.success(`"${txDescription}" transaction successful!`)
  } catch (e) {
    console.error(e)

    let reason
    if (hash) {
      const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME
      reason = await getRevertReason(hash, networkName)
      console.log({ reason })
    }
    
    setTx(tx => ({
      ...tx,
      hash: '',
      inWallet: true,
      sent: true,
      completed: true,
      error: true,
      reason
    }))

    if (e.message.match('User denied transaction signature')) {
      poolToast.error(`You rejected the transaction - please try again.`)
    } else {
      poolToast.error(`"${txDescription}" transaction failed to go through${reason && ('. Reason: ', reason)}`)
      console.log(e)
      console.error(e.message)
    }

    console.error(e.message)
  }
}
