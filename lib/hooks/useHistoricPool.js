import gql from 'graphql-tag'
import { CONTRACT_ADDRESSES } from 'lib/constants/contracts'
import { QUERY_KEYS } from 'lib/constants/queryKeys'
import { getGraphLootBoxData } from 'lib/fetchers/getGraphLootBoxData'
import { formatPoolGraphData } from 'lib/fetchers/getPoolGraphData'
import {
  combineLootBoxDataWithPool,
  combineTokenPricesData,
  getAllErc20Addresses
} from 'lib/fetchers/getPools'
import { getTokenPriceData } from 'lib/fetchers/getTokenPriceData'
import { prizePoolFragment } from 'lib/fragments/prizePoolFragment'
import { useChainId } from 'lib/hooks/useChainId'
import { getSubgraphClientByVersionFromContract } from 'lib/hooks/useSubgraphClients'
import { useQuery } from 'react-query'

export const useHistoricPool = (poolContract, blockNumber) => {
  const chainId = useChainId()
  const enabled = Boolean(chainId && blockNumber && poolContract)
  return useQuery(
    [QUERY_KEYS.historicPoolsQuery, poolContract?.prizePool?.address, blockNumber, chainId],
    async () => await getHistoricPoolData(chainId, poolContract, blockNumber),
    { enabled }
  )
}

const getHistoricPoolData = async (chainId, poolContract, blockNumber) => {
  let pools = await getHistoricPoolGraphData(chainId, poolContract, blockNumber)
  return pools
}

const getHistoricPoolGraphData = async (chainId, poolContract, blockNumber) => {
  const subgraphClient = getSubgraphClientByVersionFromContract(poolContract, chainId)
  const poolAddress = poolContract.prizePool.address
  const query = historicPrizePoolsQuery(blockNumber)
  try {
    const data = await subgraphClient.request(query, { poolAddress }).catch((e) => {
      console.warn(e.message)
      return null
    })

    const pools = {
      preAward: formatPoolGraphData(data.preAward, chainId),
      postAward: formatPoolGraphData(data.postAward, chainId)
    }
    pools.preAward.contract = poolContract
    pools.postAward.contract = poolContract

    return pools
  } catch (e) {
    console.error(e.message)
    return null
  }
}

const historicPrizePoolsQuery = (blockNumber) => {
  const preAwardBlockFilter = `, block: { number: ${blockNumber - 1} }`
  const postAwardBlockFilter = `, block: { number: ${blockNumber} }`

  return gql`
    query prizePoolsQuery($poolAddress: String!) {
      preAward: prizePool(id: $poolAddress ${preAwardBlockFilter}) {
        ...prizePoolFragment
      },
      postAward: prizePool(id: $poolAddress ${postAwardBlockFilter} ) {
        ...prizePoolFragment
      }
    }
    ${prizePoolFragment}
  `
}
