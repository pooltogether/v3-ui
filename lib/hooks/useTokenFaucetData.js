import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import { batch, contract } from '@pooltogether/etherplex'
import { useQuery } from 'react-query'
import { useContext } from 'react'

import Erc20ABI from 'abis/ERC20Abi'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { testAddress } from 'lib/utils/testAddress'
import { usePoolTokenChainId } from 'lib/hooks/chainId/usePoolTokenChainId'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'

export const useTokenFaucetData = (tokenFaucetAddress) => {
  const { pauseQueries } = useContext(AuthControllerContext)
  const chainId = usePoolTokenChainId()
  const { data: readProvider, isFetched: readProviderIsLoaded } = useReadProvider(chainId)

  const addressError = testAddress(tokenFaucetAddress)
  const isZeroAddress = tokenFaucetAddress === '0x0000000000000000000000000000000000000000'

  const enabled =
    tokenFaucetAddress && !pauseQueries && !addressError && !isZeroAddress && readProviderIsLoaded

  return useQuery(
    [QUERY_KEYS.tokenFaucetDripData, tokenFaucetAddress, chainId],
    async () => {
      return _getTokenFaucetData(readProvider, tokenFaucetAddress)
    },
    {
      enabled,
      refetchInterval: 10000
    }
  )
}

async function _getTokenFaucetData(provider, tokenFaucetAddress) {
  const values = {}

  try {
    const tokenFaucetContract = contract('tokenFaucet', TokenFaucetABI, tokenFaucetAddress)
    const { tokenFaucet } = await batch(provider, tokenFaucetContract.dripRatePerSecond().asset())
    const assetAddress = tokenFaucet.asset[0]

    const assetContract = contract('asset', Erc20ABI, assetAddress)
    const { asset } = await batch(provider, assetContract.balanceOf(tokenFaucetAddress))

    values.dripRatePerSecond = tokenFaucet.dripRatePerSecond[0]
    values.asset = assetAddress
    values.balanceOf = asset.balanceOf[0]
  } catch (e) {
    console.warn(e.message)
  }

  return values
}
