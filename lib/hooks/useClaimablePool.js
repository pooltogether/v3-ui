import { useContext, useEffect } from 'react'
import { batch, contract } from '@pooltogether/etherplex'
import ComptrollerV2ABI from '@pooltogether/pooltogether-contracts/abis/ComptrollerV2'
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

export const claimablePoolRefetchFnsAtom = atom({})

export const useClaimablePool = poolSymbol => {
  const { pool } = usePool(poolSymbol)
  const { id: poolAddress, tokenListener: comptrollerAddress } = pool
  const [claimablePoolRefetchFns, setClaimablePoolRefetchFns] = useAtom(
    claimablePoolRefetchFnsAtom
  )

  const {
    refetch,
    data,
    isFetching,
    isFetched,
    error
  } = useFetchClaimablePoolData(comptrollerAddress, poolAddress)

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

function useFetchClaimablePoolData (comptrollerAddress, poolAddress) {
  const { usersAddress, chainId, pauseQueries, provider } = useContext(
    AuthControllerContext
  )
  const { accountData } = useAccount(usersAddress)
  const { playerTickets } = usePlayerTickets(accountData)
  const ticketData = playerTickets.find(
    ticket => ticket.poolAddress === poolAddress
  )
  const balance = ticketData?.balance
  const addressError = testAddress(usersAddress)

  // TODO: ensure that the comptroller is v2?
  const enabled =
    balance &&
    !balance.isZero() &&
    !pauseQueries &&
    chainId &&
    usersAddress &&
    !addressError &&
    comptrollerAddress &&
    comptrollerAddress !== ethers.constants.AddressZero

  return useQuery(
    [QUERY_KEYS.claimablePoolQuery, chainId, comptrollerAddress],
    async () => {
      return getClaimablePoolData(
        provider,
        usersAddress,
        comptrollerAddress,
        chainId
      )
    },
    {
      enabled
    }
  )
}

async function getClaimablePoolData (
  provider,
  usersAddress,
  comptrollerAddress,
  chainId
) {
  const comptrollerContract = contract(
    'comptroller',
    ComptrollerV2ABI,
    comptrollerAddress
  )

  const { comptroller } = await batch(
    provider,
    comptrollerContract
      .dripRatePerSecond()
      .exchangeRateMantissa()
      .lastDripTimestamp()
      .measure()
      .asset()
      .userStates(usersAddress)
      .claim(usersAddress)
  )

  const assetAddress = comptroller.asset[0]
  const assetContract = contract('asset', ERC20Abi, assetAddress)

  const { asset } = await batch(
    provider,
    assetContract.balanceOf(comptrollerAddress)
  )

  return {
    dripRatePerSecond: comptroller.dripRatePerSecond[0],
    exchangeRateMantissa: comptroller.exchangeRateMantissa[0],
    lastDripTimestamp: comptroller.lastDripTimestamp[0],
    measureTokenAddress: comptroller.measure[0].toString().toLowerCase(),
    amountClaimable: comptroller.claim[0],
    totalSupply: asset.balanceOf[0],
    user: {
      lastExchangeRateMantissa: comptroller.userStates[0],
      balance: comptroller.userStates[1]
    }
  }
}
