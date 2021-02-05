import { useClaimablePoolTokenFaucetAddresses } from 'lib/hooks/useClaimablePoolTokenFaucetAddresses'
import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import { useQuery } from 'react-query'
import { QUERY_KEYS } from 'lib/constants'
import { testAddress } from 'lib/utils/testAddress'
import { useCallback, useContext } from 'react'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'
import { useAtom } from 'jotai'
import { claimablePoolRefetchFnsAtom } from 'lib/hooks/useClaimablePool'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export const useTotalClaimablePool = () => {
  const { data: tokenFaucetAddresses } = useClaimablePoolTokenFaucetAddresses()
  const { usersAddress, pauseQueries, chainId } = useContext(
    AuthControllerContext
  )
  const { readProvider, isLoaded: readProviderIsLoaded } = useReadProvider()

  const addressError = testAddress(usersAddress)
  const [claimablePoolRefetchFns] = useAtom(
    claimablePoolRefetchFnsAtom
  )

  const enabled = tokenFaucetAddresses &&
    tokenFaucetAddresses.length > 0 &&
    !pauseQueries &&
    usersAddress &&
    !addressError && 
    readProviderIsLoaded

  const results = useQuery(
    [QUERY_KEYS.claimablePoolTotal, tokenFaucetAddresses, usersAddress, chainId],
    async () => {
      return getTotalClaimablePool(readProvider, usersAddress, tokenFaucetAddresses)
    },
    {
      enabled,
      refetchInterval: 1000
    }
  )

  const refetchAllClaimableBalances = useCallback(() => {
    Object.keys(claimablePoolRefetchFns).forEach(poolSymbol => {
      claimablePoolRefetchFns[poolSymbol]?.()
    })
  }, [claimablePoolRefetchFns])

  return {
    ...results,
    refetchAllClaimableBalances
  }
}

// TODO: Ideally this data is just shared from the other components
// but the way the hooks are structured it's tricky to get the full list vs
// the individual pools data
async function getTotalClaimablePool (
  provider,
  usersAddress,
  tokenFaucetAddresses
) {
  const batchCalls = []
  tokenFaucetAddresses.forEach(tokenFaucetAddress => {
    const tokenFaucetContract = contract(
      tokenFaucetAddress,
      TokenFaucetABI,
      tokenFaucetAddress
    )
    batchCalls.push(tokenFaucetContract.claim(usersAddress))
  })

  const tokenFaucetResponse = await batch(provider, ...batchCalls)

  let totalClaimable = 0
  Object.keys(tokenFaucetResponse).forEach(tokenFaucetAddress => {
    const response = tokenFaucetResponse[tokenFaucetAddress]
    totalClaimable += Number(ethers.utils.formatUnits(response.claim[0], 18))
  })

  return totalClaimable
}
