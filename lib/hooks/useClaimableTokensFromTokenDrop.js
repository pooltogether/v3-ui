import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import { useReadProvider } from '@pooltogether/hooks'
import { formatUnits } from '@ethersproject/units'

import ERC20Abi from 'abis/ERC20Abi'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { testAddress } from 'lib/utils/testAddress'
import { useAllUsersPodTickets } from 'lib/hooks/useAllUsersPodTickets'
import { usePodsByChainId } from 'lib/hooks/usePodsByChainId'
import TokenDropAbi from 'abis/TokenDropAbi'

export const useClaimableTokenFromTokenDrops = (chainId, usersAddress) => {
  const { data: pods, isFetched: isPodsFetched } = usePodsByChainId(chainId)
  // const { data: usersPodTickets, isFetched: isUsersPodTicketsFetched } =
  //   useAllUsersPodTickets(usersAddress)
  const { readProvider, isReadProviderReady } = useReadProvider(chainId)

  const addressError = testAddress(usersAddress)

  const tokenDropAddresses = pods?.map((pod) => pod.tokenDrop.address)

  const enabled = Boolean(usersAddress) && !addressError && isReadProviderReady && isPodsFetched
  // && isUsersPodTicketsFetched

  return useQuery(
    [QUERY_KEYS.claimablePoolFromTokenDrops, chainId, usersAddress, tokenDropAddresses],
    async () => {
      return getClaimableTokensFromTokenDrops(readProvider, pods, usersAddress)
    },
    {
      enabled,
      refetchInterval: 10000
    }
  )
}

async function getClaimableTokensFromTokenDrops(provider, pods, usersAddress) {
  const claimableAmountsByTokenDropAddress = {}

  console.log('Pods', pods)

  let batchedCalls = []
  pods.forEach((pod) => {
    const tokenDropAddress = pod.tokenDrop.address
    const dripTokenAddress = pod.tokenDrop.dripToken.address

    // Fetch claimable amounts & drip token address
    const tokenDropContract = contract(tokenDropAddress, TokenDropAbi, tokenDropAddress)
    batchedCalls.push(tokenDropContract.claim(usersAddress).asset())

    // Fetch drip token details
    const dripTokenContract = contract(dripTokenAddress, ERC20Abi, dripTokenAddress)
    batchedCalls.push(dripTokenContract.decimals().symbol().name())
  })

  const response = await batch(provider, ...batchedCalls)

  pods.forEach((pod) => {
    const tokenDropAddress = pod.tokenDrop.address
    const dripTokenAddress = pod.tokenDrop.dripToken.address

    // Update claimable amounts
    const amountUnformatted = response[tokenDropAddress].claim[0]
    const decimals = response[dripTokenAddress].decimals[0]
    const symbol = response[dripTokenAddress].symbol[0]
    const name = response[dripTokenAddress].name[0]

    const amount = formatUnits(amountUnformatted, decimals)

    claimableAmountsByTokenDropAddress[tokenDropAddress] = {
      amount,
      amountUnformatted,
      decimals,
      symbol,
      name
    }
  })

  console.log(claimableAmountsByTokenDropAddress)
  return claimableAmountsByTokenDropAddress
}
