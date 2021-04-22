import { getGraphLootBoxData, getGraphLootBoxesData } from 'lib/fetchers/getGraphLootBoxData'
import { formatLootBox, getLootBoxBatchName } from 'lib/utils/poolDataUtils'
import { getSubgraphClientFromVersion } from 'lib/utils/getSubgraphClients'
import { getLootBoxQueryAlias } from 'lib/queries/lootBoxQuery'
import { poolPrizesQuery } from 'lib/queries/poolPrizesQuery'
import { poolPrizeQuery } from 'lib/queries/poolPrizesQuery'

import { batch, contract } from '@pooltogether/etherplex'
import LootBoxControllerAbi from '@pooltogether/loot-box/abis/LootBoxController'
import { CONTRACT_ADDRESSES } from 'lib/constants/contracts'

/**
 * Multiple prizes from a single pool, paginated
 * @param {*} chainId
 * @param {*} provider
 * @param {*} poolContract
 * @param {*} page
 * @param {*} pageSize
 * @returns
 */
export const getPoolPrizesData = async (chainId, provider, poolContract, page, pageSize) => {
  const variables = {
    poolAddress: poolContract.prizePool.address,
    first: pageSize,
    skip: (page - 1) * pageSize
  }

  const graphQLClient = getSubgraphClientFromVersion(chainId, poolContract.subgraphVersion)

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

      const lootBoxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
      const lootBoxControllerAddress = CONTRACT_ADDRESSES[chainId]?.lootBoxController?.toLowerCase()
      const batchCalls = []
      lootBoxIds.forEach((tokenId) => {
        const lootBoxControllerContract = contract(
          getLootBoxBatchName(lootBoxAddress, tokenId),
          LootBoxControllerAbi,
          lootBoxControllerAddress
        )
        batchCalls.push(lootBoxControllerContract.computeAddress(lootBoxAddress, tokenId))
      })
      const computedAddressesResponse = await batch(provider, ...batchCalls)

      prizes.forEach((prize) => {
        if (prize.lootBox.id) {
          const lootBoxAlias = getLootBoxQueryAlias(prize.lootBox.id)
          const graphLootBox = lootBoxesData[lootBoxAlias][0]
          const formattedLootBox = formatLootBox(graphLootBox)
          const computedAddress =
            computedAddressesResponse[getLootBoxBatchName(lootBoxAddress, prize.lootBox.id)]
              .computeAddress[0]
          prize.lootBox = {
            ...prize.lootBox,
            ...formattedLootBox,
            computedAddress
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
export const getPoolPrizeData = async (chainId, provider, poolContract, prizeNumber) => {
  const variables = {
    poolAddress: poolContract.prizePool.address,
    prizeId: `${poolContract.prizePool.address}-${prizeNumber}`
  }

  const graphQLClient = getSubgraphClientFromVersion(chainId, poolContract.subgraphVersion)

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

      const lootBoxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
      const lootBoxControllerAddress = CONTRACT_ADDRESSES[chainId]?.lootBoxController?.toLowerCase()

      const lootBoxControllerContract = contract(
        getLootBoxBatchName(lootBoxAddress, prize.lootBox.id),
        LootBoxControllerAbi,
        lootBoxControllerAddress
      )
      const computedAddressesResponse = await batch(
        provider,
        lootBoxControllerContract.computeAddress(lootBoxAddress, prize.lootBox.id)
      )
      const computedAddress =
        computedAddressesResponse[getLootBoxBatchName(lootBoxAddress, prize.lootBox.id)]
          .computeAddress[0]

      const graphLootBox = lootBoxData.lootBoxes[0]
      const formattedLootBox = formatLootBox(graphLootBox)
      prize.lootBox = {
        ...prize.lootBox,
        ...formattedLootBox,
        computedAddress
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
