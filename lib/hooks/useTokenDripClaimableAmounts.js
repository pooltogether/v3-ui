import { batch, contract } from '@pooltogether/etherplex'
import useReadProvider from '@pooltogether/hooks/dist/hooks/useReadProvider'
import { formatUnits } from '@ethersproject/units'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { useQuery } from 'react-query'

export const useTokenDripClaimableAmounts = (chainId, tokenFaucets, usersAddress) => {
  const { readProvider, isReadProviderReady } = useReadProvider(chainId)

  const enabled =
    Boolean(usersAddress) && isReadProviderReady && Boolean(tokenFaucets) && tokenFaucets.length > 0

  return useQuery(
    [
      QUERY_KEYS.claimableAmountFromTokenFaucets,
      usersAddress,
      tokenFaucets.map((tf) => tf.address)
    ],
    () => getTokenDripClaimableAmounts(readProvider, tokenFaucets, usersAddress),
    { enabled }
  )
}

const getTokenDripClaimableAmounts = async (provider, tokenFaucets, usersAddress) => {
  const batchCalls = []
  tokenFaucets.forEach((tokenFaucet) => {
    const { abi, addressToClaimFrom } = tokenFaucet

    console.log(`Address to claim from: ${addressToClaimFrom}\nUsers address: ${usersAddress}`)

    const tokenFaucetContract = contract(addressToClaimFrom, abi, addressToClaimFrom)
    batchCalls.push(tokenFaucetContract.claim(usersAddress))
  })

  const response = await batch(provider, ...batchCalls)

  const claimableAmountByClaimFromAddress = {}
  tokenFaucets.forEach((tokenFaucet) => {
    const { addressToClaimFrom, tokens } = tokenFaucet
    const { dripToken } = tokens
    const amountUnformatted = response[addressToClaimFrom].claim[0]
    const amount = formatUnits(amountUnformatted, dripToken.decimals)

    claimableAmountByClaimFromAddress[addressToClaimFrom] = {
      amountUnformatted,
      amount
    }
  })

  console.log('claimableAmountByClaimFromAddress', claimableAmountByClaimFromAddress)

  return claimableAmountByClaimFromAddress
}
