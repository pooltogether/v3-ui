import { poolTokenSupportsPermitSign } from 'lib/utils/poolTokenSupportsPermitSign'
import { ethers } from 'ethers'

import DaiAbi from '@pooltogether/pooltogether-contracts/abis/Dai'
import PermitAndDepositDaiAbi from '@pooltogether/pooltogether-contracts/abis/PermitAndDepositDai'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'

import { CONTRACT_ADDRESSES } from 'lib/constants'
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
) => {
  let contractAbi = PrizePoolAbi
  let contractAddress = poolAddress
  let method = 'depositTo'
  let permitParams = []


  if (poolTokenSupportsPermitSign(tokenAddress)) {
    const signer = await provider.getSigner()
    const permitAddress = CONTRACT_ADDRESSES[chainId].PermitAndDepositDai
    const daiContract = new ethers.Contract(tokenAddress, DaiAbi, provider)
    const nonce = await daiContract.nonces(usersAddress)
    const expiry = (new Date()).getTime() + 1200000 // 20 minutes into future

    const holder = await signer.getAddress()

    let permit = await signPermit(
      signer,
      {
        name: "Dai Stablecoin",
        version: "1",
        chainId,
        verifyingContract: tokenAddress,
      },
      {
        holder,
        spender: permitAddress,
        nonce: nonce.toString(),
        expiry,
        allowed: true
      }
    )
    let { v, r, s } = ethers.utils.splitSignature(permit.sig)

    permitParams = [
      tokenAddress,
      usersAddress,
      nonce,
      expiry,
      true,
      v,
      r,
      s,
    ]

    contractAddress = permitAddress
    contractAbi = PermitAndDepositDaiAbi
    method = 'permitAndDepositTo'
  }

  const params = [
    ...permitParams,
    ...sharedParams
  ]

  const id = sendTx(
    t,
    provider,
    usersAddress,
    contractAbi,
    contractAddress,
    method,
    params
  )

  return id
}