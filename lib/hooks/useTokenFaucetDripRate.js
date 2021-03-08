import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import { batch, contract } from '@pooltogether/etherplex'
import { useQuery } from 'react-query'
import { useContext } from 'react'

import { QUERY_KEYS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { testAddress } from 'lib/utils/testAddress'

export const useTokenFaucetDripRate = (tokenFaucetAddress) => {
  const { pauseQueries, chainId } = useContext(AuthControllerContext)
  const { readProvider, isLoaded: readProviderIsLoaded } = useReadProvider()

  const addressError = testAddress(tokenFaucetAddress)
  const isZeroAddress = tokenFaucetAddress === '0x0000000000000000000000000000000000000000'

  const enabled =
    tokenFaucetAddress &&
    !pauseQueries &&
    !addressError &&
    !isZeroAddress &&
    readProviderIsLoaded

  return useQuery(
    [QUERY_KEYS.tokenFaucetDripRateQuery, tokenFaucetAddress, chainId],
    async () => {
      return getTokenFaucetDripRate(readProvider, tokenFaucetAddress)
    },
    {
      enabled,
      refetchInterval: 10000
    }
  )
}

async function getTokenFaucetDripRate (provider, tokenFaucetAddress) {
  const values = {}

  try {
    const tokenFaucetContract = contract('tokenFaucet', TokenFaucetABI, tokenFaucetAddress)
    const { tokenFaucet } = await batch(
      provider,
      tokenFaucetContract
        .dripRatePerSecond()
    )

    values.dripRatePerSecond = tokenFaucet.dripRatePerSecond[0]
  } catch (e) {
    console.warn(e.message)
  }

  return values
}
