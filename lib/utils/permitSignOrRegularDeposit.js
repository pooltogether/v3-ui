import { poolTokenSupportsPermitSign } from 'lib/utils/poolTokenSupportsPermitSign'
import { ethers } from 'ethers'

import DaiAbi from '@pooltogether/pooltogether-contracts_3_3/abis/Dai'
// import PermitAndDepositDaiAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PermitAndDepositDai'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts_3_3/abis/PrizePool'

import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
import { signPermit } from 'lib/utils/signPermit'

export const permitSignOrRegularDeposit = async (
  t,
  provider,
  chainId,
  usersAddress,
  poolAddress,
  tokenAddress,
  sendTx,
  sharedParams
  // needsPermit
) => {
  // let permitAddress

  // const supportsPermit = false
  // const supportsPermit = poolTokenSupportsPermitSign(chainId, tokenAddress)// && provider.isMetaMask
  // if (supportsPermit) {
  //   permitAddress = CUSTOM_CONTRACT_ADDRESSES[chainId].PermitAndDepositDai
  // }

  let contractAbi = PrizePoolAbi
  // let contractAbi = supportsPermit ? PermitAndDepositDaiAbi : PrizePoolAbi
  let contractAddress = poolAddress
  // let contractAddress = supportsPermit ? permitAddress : poolAddress
  let method = 'depositTo'
  // let permitParams = []
  // let additionalSubsequentParams = []

  // if (supportsPermit && needsPermit) {
  //   const signer = await provider.getSigner()
  //   const daiContract = new ethers.Contract(tokenAddress, DaiAbi, provider)
  //   const nonce = await daiContract.nonces(usersAddress)
  //   const expiry = (new Date()).getTime() + 1200000 // 20 minutes into future

  //   const holder = await signer.getAddress()

  //   let permit = await signPermit(
  //     signer,
  //     {
  //       name: "Dai Stablecoin",
  //       version: "1",
  //       chainId,
  //       verifyingContract: tokenAddress,
  //     },
  //     {
  //       holder,
  //       spender: permitAddress,
  //       nonce: nonce.toString(),
  //       expiry,
  //       allowed: true
  //     }
  //   )

  //   let { v, r, s } = ethers.utils.splitSignature(permit.sig)

  //   permitParams = [
  //     tokenAddress,
  //     usersAddress,
  //     nonce,
  //     expiry,
  //     true,
  //     v,
  //     r,
  //     s,
  //     poolAddress,
  //   ]

  //   method = 'permitAndDepositTo'
  // }

  // if (supportsPermit && !needsPermit) {
  //   additionalSubsequentParams = [
  //     tokenAddress,
  //     poolAddress,
  //   ]
  // }

  const params = [
    // ...permitParams,
    // ...additionalSubsequentParams,
    ...sharedParams
  ]

  const id = sendTx(t, provider, usersAddress, contractAbi, contractAddress, method, params)

  return id
}
