import { batch, contract } from "@pooltogether/etherplex"
import MerkleDistributorAbi from "abis/MerkleDistributor"
import { ethers } from "ethers"
import { axiosInstance } from "lib/axiosInstance"
import { AuthControllerContext } from "lib/components/contextProviders/AuthControllerContextProvider"
import { CONTRACT_ADDRESSES, QUERY_KEYS } from "lib/constants"
import { useContext } from "react"
import { useQuery } from "react-query"


export const useRetroactivePoolClaimData = () => {
  const { refetch, data, isFetching, isFetched, error } = useFetchRetroactivePoolClaimData()

  return {
    loading: !isFetched || (isFetching && !isFetched),
    refetch,
    data, 
    isFetching,
    isFetched,
    error
  }
}

const useFetchRetroactivePoolClaimData = () => {
  const { usersAddress, pauseQueries, provider, chainId } = useContext(AuthControllerContext)

  return useQuery(
    [QUERY_KEYS.retroactivePoolClaimDataQuery, usersAddress, chainId],
    async () => {
      return getRetroactivePoolClaimData(provider, chainId, usersAddress)
    },
    {
      enabled: usersAddress && !pauseQueries && provider,
      refetchInterval: false,
      refetchOnWindowFocus: false
    }
  )
}

const getRetroactivePoolClaimData =  async (provider, chainId, usersAddress) => {
  const checksummedAddress = ethers.utils.getAddress(usersAddress)
  let merkleDistributionData = {}

  try {
    const response = await getMerkleDistributionData(checksummedAddress, chainId)
    merkleDistributionData = response.data
  } catch(e) {
    console.log(e.message)
    return {
      isClaimed: true,
      formattedAmount: 0
    }
  }
  
  const formattedAmount = Number(
    ethers.utils.formatUnits(
      ethers.utils.bigNumberify(merkleDistributionData.amount)
        .toString(), 18))

  const isClaimed = await getIsClaimed(provider, chainId, merkleDistributionData.index)

  return {
    ...merkleDistributionData,
    formattedAmount,
    isClaimed
  }
}

const getMerkleDistributionData = async (usersAddress, chainId) => {
  return await axiosInstance.get(
    `https://objective-jang-89749c.netlify.app/.netlify/functions/merkleAddressData?address=${usersAddress}${chainId === 4 && '&chainId=4'}`
  )
}

const getIsClaimed = async (provider, chainId, index) => {

  // TODO: Add ChainID to the request so we can get still do this on rinkeby
  const merkleDistributorContract = contract('merkleDistributor', MerkleDistributorAbi, CONTRACT_ADDRESSES[chainId].MerkleDistributor)
  const { merkleDistributor } = await batch(
    provider,
    merkleDistributorContract
      .isClaimed(index)
  )

  return merkleDistributor.isClaimed[0]
}
