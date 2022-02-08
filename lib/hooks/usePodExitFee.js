import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import { useReadProvider } from '@pooltogether/hooks'

import ERC20Abi from 'abis/ERC20Abi'
import PodAbi from 'abis/PodAbi'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { ethers } from 'ethers'

export const usePodExitFee = (
  chainId,
  podAddress,
  underlyingTokenAddress,
  amountToWithdrawUnformatted,
  decimals
) => {
  const readProvider = useReadProvider(chainId)

  const enabled = !!readProvider

  return useQuery(
    [QUERY_KEYS.getPodExitFee, chainId, podAddress, amountToWithdrawUnformatted.toString()],
    () =>
      getPodExitFee(
        readProvider,
        podAddress,
        underlyingTokenAddress,
        amountToWithdrawUnformatted,
        decimals
      ),
    { enabled }
  )
}

const getPodExitFee = async (
  readProvider,
  podAddress,
  underlyingTokenAddress,
  amountToWithdrawUnformatted,
  decimals
) => {
  const batchCalls = []
  const podContract = contract(podAddress, PodAbi, podAddress)
  const underlyingTokenContract = contract(underlyingTokenAddress, ERC20Abi, underlyingTokenAddress)

  batchCalls.push(
    podContract.getEarlyExitFee(amountToWithdrawUnformatted),
    underlyingTokenContract.balanceOf(podAddress)
  )

  const response = await batch(readProvider, ...batchCalls)

  return formatPodExitFeeResponse(response, podAddress, underlyingTokenAddress, decimals)
}

const formatPodExitFeeResponse = (response, podAddress, underlyingTokenAddress, decimals) => {
  const amountUnformatted = response[underlyingTokenAddress].balanceOf[0]
  const amount = ethers.utils.formatUnits(amountUnformatted, decimals)
  const fee = response[podAddress].getEarlyExitFee[0]

  return {
    float: { amount, amountUnformatted, decimals },
    fee
  }
}
