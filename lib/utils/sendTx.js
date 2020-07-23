import { ethers } from 'ethers'
import { poolToast } from 'lib/utils/poolToast'

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
  try {
    const signer = provider.getSigner()

    const contract = new ethers.Contract(
      contractAddress,
      contractAbi,
      signer
    )

    newTx = await contract[method].apply(null, params)

    setTx(tx => ({
      ...tx,
      hash: newTx.hash,
      sent: true,
    }))

    await newTx.wait()
    console.log({ newTx })

    setTx(tx => ({
      ...tx,
      completed: true,
    }))

    poolToast.success(`"${txDescription}" transaction successful!`)
  } catch (e) {
    console.error(e)
    setTx(tx => ({
      ...tx,
      hash: '',
      inWallet: true,
      sent: true,
      completed: true,
      error: true
    }))

    if (e.message.match('User denied transaction signature')) {
      poolToast.error(`You rejected the transaction - please try again.`)
    } else {
      poolToast.error(`"${txDescription}" transaction failed to go through`)
      console.log(e)
      console.error(e.message)
    }

    console.error(e.message)
  }
}
