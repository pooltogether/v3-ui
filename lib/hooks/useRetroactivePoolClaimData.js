import { useContext } from 'react'
import { useQuery } from 'react-query'
import { batch, contract } from '@pooltogether/etherplex'
import { ethers } from 'ethers'

import MerkleDistributorAbi from 'abis/MerkleDistributor'

import { CUSTOM_CONTRACT_ADDRESSES } from 'lib/constants'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { axiosInstance } from 'lib/axiosInstance'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { testAddress } from 'lib/utils/testAddress'
import { usePoolTokenChainId } from 'lib/hooks/chainId/usePoolTokenChainId'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'

export const useRetroactivePoolClaimData = (address) => {
  const { refetch, data, isFetching, isFetched, error } = useFetchRetroactivePoolClaimData(address)

  return {
    loading: !isFetched,
    refetch,
    data,
    isFetching,
    isFetched,
    error
  }
}

const useFetchRetroactivePoolClaimData = (address) => {
  const { usersAddress, pauseQueries } = useContext(AuthControllerContext)
  const chainId = usePoolTokenChainId()
  const { data: readProvider, isFetched: readProviderIsLoaded } = useReadProvider(chainId)

  if (!address) {
    address = usersAddress
  }

  const addressError = testAddress(address)

  return useQuery(
    [QUERY_KEYS.retroactivePoolClaimDataQuery, address, chainId],
    async () => {
      return getRetroactivePoolClaimData(readProvider, chainId, address)
    },
    {
      enabled: Boolean(address && !pauseQueries && readProviderIsLoaded && !addressError),
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}

const getRetroactivePoolClaimData = async (provider, chainId, usersAddress) => {
  const checksummedAddress = ethers.utils.getAddress(usersAddress)
  let merkleDistributionData = {}

  try {
    const response = await getMerkleDistributionData(checksummedAddress, chainId)
    merkleDistributionData = response.data
  } catch (e) {
    return {
      isMissing: true,
      isClaimed: false,
      formattedAmount: 0
    }
  }

  const formattedAmount = Number(
    ethers.utils.formatUnits(ethers.BigNumber.from(merkleDistributionData.amount).toString(), 18)
  )

  const isClaimed = await getIsClaimed(provider, chainId, merkleDistributionData.index)

  return {
    ...merkleDistributionData,
    formattedAmount,
    isClaimed
  }
}

const getMerkleDistributionData = async (usersAddress, chainId) => {
  return await axiosInstance.get(
    `https://merkle.pooltogether.com/.netlify/functions/merkleAddressData?address=${usersAddress}${
      chainId === 4 ? '&chainId=4&testVersion=v4' : ''
    }`
  )
}

const getIsClaimed = async (provider, chainId, index) => {
  // TODO: Add ChainID to the request so we can get still do this on rinkeby
  const merkleDistributorContract = contract(
    'merkleDistributor',
    MerkleDistributorAbi,
    CUSTOM_CONTRACT_ADDRESSES[chainId].MerkleDistributor
  )
  const { merkleDistributor } = await batch(provider, merkleDistributorContract.isClaimed(index))

  return merkleDistributor.isClaimed[0]
}
