import { batch, contract } from "@pooltogether/etherplex"
import { AuthControllerContext } from "lib/components/contextProviders/AuthControllerContextProvider"
import { CONTRACT_ADDRESSES, QUERY_KEYS } from "lib/constants"
import { useAccount } from "lib/hooks/useAccount"
import { usePlayerTickets } from "lib/hooks/usePlayerTickets"
import { usePool } from "lib/hooks/usePool"
import { testAddress } from "lib/utils/testAddress"
import { useContext, useEffect } from "react"
import { useQuery } from "react-query"
import ComptrollerV2ABI from "@pooltogether/pooltogether-contracts/abis/ComptrollerV2"
import { ethers } from "ethers"
import ERC20Abi from "abis/ERC20Abi"

export const useClaimablePool = (poolSymbol) => {
  const { pool } = usePool(poolSymbol)
  const { id: poolAddress, tokenListener: comptrollerAddress } = pool

  const {
    refetch,
    data,
    isFetching,
    isFetched,
    error
  } = useFetchClaimablePoolData(
    comptrollerAddress,
    poolAddress
  )

  return {
    refetch,
    data,
    isFetching,
    isFetched: isFetched,
    error
  }
}

function useFetchClaimablePoolData (comptrollerAddress, poolAddress) {
  const { usersAddress, chainId, pauseQueries, provider } = useContext(AuthControllerContext)
  const { accountData } = useAccount(usersAddress)
  const { playerTickets } = usePlayerTickets(accountData)
  const ticketData = playerTickets.find(ticket => ticket.poolAddress === poolAddress)
  const balance = ticketData?.balance
  const addressError = testAddress(usersAddress)

  // TODO: ensure that the comptroller is v2.
  // Need to add the codeAt shit to current-pool-data

  return useQuery(
    [QUERY_KEYS.claimablePoolQuery, chainId, comptrollerAddress],
    async () => {
      return getClaimablePoolData(provider, usersAddress, comptrollerAddress, chainId)
    },
    {
      enabled: balance && !balance.isZero() && !pauseQueries && chainId && usersAddress && !addressError && comptrollerAddress && comptrollerAddress !== ethers.constants.AddressZero
    }
  )
}

async function getClaimablePoolData (provider, usersAddress, comptrollerAddress, chainId) {

  const comptrollerContract = contract('comptroller', ComptrollerV2ABI, comptrollerAddress)

  const { comptroller } = await batch(
    provider,
    comptrollerContract
      .dripRatePerSecond()
      .exchangeRateMantissa()
      .lastDripTimestamp()
      .measure()
      .totalUnclaimed()
      .userStates(usersAddress)
      .claim(usersAddress)
  )

  console.log(comptroller)


  return {
    dripRatePerSecond: comptroller.dripRatePerSecond[0],
    exchangeRateMantissa: comptroller.exchangeRateMantissa[0],
    lastDripTimestamp: comptroller.lastDripTimestamp[0],
    measureTokenAddress: comptroller.measure[0].toString().toLowerCase(),
    amountClaimable: comptroller.claim[0],
    totalUnclaimed: comptroller.totalUnclaimed[0],
    user: {
      lastExchangeRateMantissa: comptroller.userStates[0],
      balance: comptroller.userStates[1]
    }
  }
}
