import { useClaimablePoolTokenFaucetAddresses } from 'lib/hooks/useClaimablePoolTokenFaucetAddresses'
import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import ERC20Abi from 'abis/ERC20Abi'
import { useQuery } from 'react-query'
import { DEFAULT_TOKEN_PRECISION, QUERY_KEYS } from 'lib/constants'
import { testAddress } from 'lib/utils/testAddress'
import { useContext } from 'react'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'
import { useReadProvider } from 'lib/hooks/useReadProvider'

// TODO: Update this to read from The Graph
// It'd be nice to copy the style of Sybil and have a large hook fetching as much as possible
// and smaller ones to filter the data
export const useClaimablePoolFromTokenFaucets = () => {
  const {
    data: tokenFaucetAddresses,
    isFetched: tokenFaucetAddressesIsFetched
  } = useClaimablePoolTokenFaucetAddresses()
  const { usersAddress, pauseQueries, chainId } = useContext(AuthControllerContext)
  const { readProvider, isLoaded: readProviderIsLoaded } = useReadProvider()

  const addressError = testAddress(usersAddress)

  const enabled =
    tokenFaucetAddresses &&
    tokenFaucetAddressesIsFetched &&
    !pauseQueries &&
    usersAddress &&
    !addressError &&
    readProviderIsLoaded

  return useQuery(
    [QUERY_KEYS.claimablePoolFromTokenFaucets, tokenFaucetAddresses, usersAddress, chainId],
    async () => {
      return getClaimablePoolFromTokenFaucets(readProvider, usersAddress, tokenFaucetAddresses)
    },
    {
      enabled,
      refetchInterval: 10000
    }
  )
}

// TODO: Ideally this data is just shared from the other components
// but the way the hooks are structured it's tricky to get the full list vs
// the individual pools data
async function getClaimablePoolFromTokenFaucets (provider, usersAddress, tokenFaucetAddresses) {
  const claimableAmounts = {
    total: 0
  }

  for (const tokenFaucetAddress of tokenFaucetAddresses) {
    try {
      const tokenFaucetContract = contract('tokenFaucet', TokenFaucetABI, tokenFaucetAddress)
      const { tokenFaucet } = await batch(
        provider,
        tokenFaucetContract
          .dripRatePerSecond()
          .asset()
          .measure()
          .claim(usersAddress)
      )
      const amountBN = tokenFaucet.claim[0]
      const amount = Number(ethers.utils.formatUnits(amountBN, DEFAULT_TOKEN_PRECISION))

      const assetAddress = tokenFaucet.asset[0]
      const assetContract = contract('asset', ERC20Abi, assetAddress)
      const { asset } = await batch(provider, assetContract.balanceOf(tokenFaucetAddress))

      const faucetPoolSupplyBN = asset.balanceOf[0]
      const faucetPoolSupply = Number(
        ethers.utils.formatUnits(faucetPoolSupplyBN, DEFAULT_TOKEN_PRECISION)
      )

      claimableAmounts[tokenFaucetAddress] = {
        dripRatePerSecond: tokenFaucet.dripRatePerSecond[0],
        measureTokenAddress: tokenFaucet.measure[0].toString().toLowerCase(),
        amountBN,
        amount,
        faucetPoolSupplyBN,
        faucetPoolSupply
      }

      claimableAmounts.total += amount
    } catch (e) {
      console.warn(e.message)
    }
  }

  return claimableAmounts
}
