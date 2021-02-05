import { useContext, useEffect } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import TokenFaucetABI from '@pooltogether/pooltogether-contracts/abis/TokenFaucet'
import { useQuery } from 'react-query'
import { ethers } from 'ethers'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { QUERY_KEYS } from 'lib/constants'
import { useAccount } from 'lib/hooks/useAccount'
import { usePlayerTickets } from 'lib/hooks/usePlayerTickets'
import { usePool } from 'lib/hooks/usePool'
import { testAddress } from 'lib/utils/testAddress'
import ERC20Abi from 'abis/ERC20Abi'
import { atom, useAtom } from 'jotai'
import { useReadProvider } from 'lib/hooks/useReadProvider'

export const claimablePoolRefetchFnsAtom = atom({})

export const useClaimablePool = poolSymbol => {
  const { pool } = usePool(poolSymbol)
  const { id: poolAddress, tokenListener: tokenFaucetAddress } = pool
  const [claimablePoolRefetchFns, setClaimablePoolRefetchFns] = useAtom(
    claimablePoolRefetchFnsAtom
  )

  const {
    refetch,
    data,
    isFetching,
    isFetched,
    error
  } = useFetchClaimablePoolData(tokenFaucetAddress, poolAddress)

  useEffect(() => {
    if (refetch) {
      setClaimablePoolRefetchFns({
        ...claimablePoolRefetchFns,
        [poolSymbol]: refetch
      })
    }
  }, [refetch])

  return {
    refetch,
    data,
    isFetching,
    isFetched: isFetched,
    error
  }
}

function useFetchClaimablePoolData (tokenFaucetAddress, poolAddress) {
  const { usersAddress, chainId, pauseQueries } = useContext(
    AuthControllerContext
  )
  const { readProvider, isLoaded: readProviderIsLoaded } = useReadProvider()
  const { accountData } = useAccount(usersAddress)
  const { playerTickets } = usePlayerTickets(accountData)
  const ticketData = playerTickets.find(
    ticket => ticket.poolAddress === poolAddress
  )
  const balance = ticketData?.balance
  const addressError = testAddress(usersAddress)

  const enabled =
    balance &&
    !balance.isZero() &&
    !pauseQueries &&
    chainId &&
    usersAddress &&
    !addressError &&
    tokenFaucetAddress &&
    tokenFaucetAddress !== ethers.constants.AddressZero &&
    readProviderIsLoaded

  return useQuery(
    [QUERY_KEYS.claimablePoolQuery, chainId, tokenFaucetAddress, usersAddress],
    async () => {
      return getClaimablePoolData(
        readProvider,
        usersAddress,
        tokenFaucetAddress,
        chainId
      )
    },
    {
      enabled,
      refetchInterval: 1000
    }
  )
}

async function getClaimablePoolData (
  provider,
  usersAddress,
  tokenFaucetAddress,
  chainId
) {
  const tokenFaucetContract = contract(
    'tokenFaucet',
    TokenFaucetABI,
    tokenFaucetAddress
  )

  const { tokenFaucet } = await batch(
    provider,
    tokenFaucetContract
      .dripRatePerSecond()
      .exchangeRateMantissa()
      .lastDripTimestamp()
      .measure()
      .asset()
      .userStates(usersAddress)
      .claim(usersAddress)
  )

  const assetAddress = tokenFaucet.asset[0]
  const assetContract = contract('asset', ERC20Abi, assetAddress)

  const { asset } = await batch(
    provider,
    assetContract.balanceOf(tokenFaucetAddress)
  )

  return {
    dripRatePerSecond: tokenFaucet.dripRatePerSecond[0],
    exchangeRateMantissa: tokenFaucet.exchangeRateMantissa[0],
    lastDripTimestamp: tokenFaucet.lastDripTimestamp[0],
    measureTokenAddress: tokenFaucet.measure[0].toString().toLowerCase(),
    amountClaimable: tokenFaucet.claim[0],
    totalSupply: asset.balanceOf[0],
    user: {
      lastExchangeRateMantissa: tokenFaucet.userStates[0],
      balance: tokenFaucet.userStates[1]
    }
  }
}
