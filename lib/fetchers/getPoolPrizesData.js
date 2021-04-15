import { CONTRACT_ADDRESSES } from 'lib/constants/contracts'
import { getGraphLootBoxData, getGraphLootBoxesData } from 'lib/fetchers/getGraphLootBoxData'
import { combineLootBoxDataWithPool, formatLootBox } from 'lib/fetchers/getPools'
import { getSubgraphClientByVersionFromContract } from 'lib/hooks/useSubgraphClients'
import { getLootBoxQueryAlias } from 'lib/queries/lootBoxQuery'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'
import { poolPrizeQuery } from 'lib/queries/poolPrizesQuery'

/**
 * Multiple prizes from a single pool, paginated
 * @param {*} chainId
 * @param {*} poolContract
 * @param {*} page
 * @param {*} pageSize
 * @returns
 */
export const getPoolPrizesData = async (chainId, poolContract, page, pageSize) => {
  const variables = {
    poolAddress: poolContract.prizePool.address,
    first: pageSize,
    skip: (page - 1) * pageSize
  }

  const graphQLClient = getSubgraphClientByVersionFromContract(poolContract, chainId)

  const query = poolPrizesQuery()

  try {
    const data = await graphQLClient.request(query, variables)
    const prizes = data.prizePool.prizes.map((prize) => {
      prize.lootBox = {
        id: extractLootBoxId(chainId, prize)
      }
      return prize
    })

    const lootBoxIds = prizes.map((prize) => prize.lootBox.id).filter(Boolean)
    if (lootBoxIds.length > 0) {
      const lootBoxesData = await getGraphLootBoxesData(chainId, prizes, data.awardedBlock - 1)

      prizes.forEach((prize) => {
        if (prize.lootBox.id) {
          const lootBoxAlias = getLootBoxQueryAlias(prize.lootBox.id)
          const graphLootBox = lootBoxesData[lootBoxAlias][0]
          const formattedLootBox = formatLootBox(graphLootBox)
          prize.lootBox = {
            ...prize.lootBox,
            ...formattedLootBox
          }
        }
      })
    }

    return prizes
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Single pool prize query
 * @param {*} chainId
 * @param {*} poolContract
 * @param {*} prizeNumber
 * @returns
 */
export const getPoolPrizeData = async (chainId, poolContract, prizeNumber) => {
  const variables = {
    poolAddress: poolContract.prizePool.address,
    prizeId: `${poolContract.prizePool.address}-${prizeNumber}`
  }

  const graphQLClient = getSubgraphClientByVersionFromContract(poolContract, chainId)

  const query = poolPrizeQuery()

  try {
    const data = await graphQLClient.request(query, variables)
    const prize = data.prize
    prize.lootBox = {
      id: extractLootBoxId(chainId, prize)
    }

    if (prize.lootBox.id) {
      const lootBoxData = await getGraphLootBoxData(
        chainId,
        [prize.lootBox.id],
        data.awardedBlock - 1
      )
      const graphLootBox = lootBoxData.lootBoxes[0]
      const formattedLootBox = formatLootBox(graphLootBox)
      prize.lootBox = {
        ...prize.lootBox,
        ...formattedLootBox
      }
    }

    return prize
  } catch (error) {
    console.error(error)
    return null
  }
}

/**
 * Pulls the loot box token id from the awardedExternalErc721Nfts from a prize if there is one
 * @param {*} chainId
 * @param {*} prize
 * @returns
 */
const extractLootBoxId = (chainId, prize) => {
  const lootBoxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
  const externalErc721s = prize.awardedExternalErc721Nfts
  return externalErc721s?.find((erc721) => erc721.address === lootBoxAddress)?.tokenIds?.[0]
}
