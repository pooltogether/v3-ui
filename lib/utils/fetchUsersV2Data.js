import { batch, contract } from '@pooltogether/etherplex'

import PoolV21Abi from 'lib/../abis/PoolV21Abi'
import PodAbi from 'lib/../abis/PodAbi'

export const fetchUsersV2Data = async (chainId, provider, usersAddress, contractAddresses) => {
  if (chainId !== 1) {
    return
  }

  const etherplexV2DaiPoolContract = contract(
    'v2DaiPool',
    PoolV21Abi,
    contractAddresses.v2DAIPool
  )
  
  const etherplexV2UsdcPoolContract = contract(
    'v2UsdcPool',
    PoolV21Abi,
    contractAddresses.v2USDCPool
  )

  const etherplexV2DaiPodContract = contract(
    'v2DaiPod',
    PodAbi,
    contractAddresses.v2DAIPod
  )

  const etherplexV2UsdcPodContract = contract(
    'v2UsdcPod',
    PodAbi,
    contractAddresses.v2USDCPod
  )

  const values = await batch(
    provider,
    etherplexV2DaiPoolContract
      .committedBalanceOf(usersAddress)
      .openBalanceOf(usersAddress),
    etherplexV2UsdcPoolContract
      .committedBalanceOf(usersAddress)
      .openBalanceOf(usersAddress),
    etherplexV2DaiPodContract
      .balanceOfUnderlying(usersAddress)
      .pendingDeposit(usersAddress)
      .balanceOf(usersAddress),
    etherplexV2UsdcPodContract
      .balanceOfUnderlying(usersAddress)
      .pendingDeposit(usersAddress)
      .balanceOf(usersAddress),
  )

  return {
    v2DaiPoolCommittedBalance: values.v2DaiPool.committedBalanceOf[0],
    v2DaiPoolOpenBalance: values.v2DaiPool.openBalanceOf[0],
    v2UsdcPoolCommittedBalance: values.v2UsdcPool.committedBalanceOf[0],
    v2UsdcPoolOpenBalance: values.v2UsdcPool.openBalanceOf[0],
    v2DaiPodCommittedBalance: values.v2DaiPod.balanceOfUnderlying[0],
    v2DaiPodOpenBalance: values.v2DaiPod.pendingDeposit[0],
    v2DaiPodSharesBalance: values.v2DaiPod.balanceOf[0],
    v2UsdcPodCommittedBalance: values.v2UsdcPod.balanceOfUnderlying[0],
    v2UsdcPodOpenBalance: values.v2UsdcPod.pendingDeposit[0],
    v2UsdcPodSharesBalance: values.v2UsdcPod.balanceOf[0],
  }
}
