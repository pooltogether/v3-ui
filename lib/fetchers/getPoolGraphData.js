import { PRIZE_POOL_TYPES } from 'lib/constants'
import { formatUnits } from '@ethersproject/units'

import {
  getPoolAddressesBySubgraphVersionFromContracts,
  getSubgraphClientsByVersionFromContracts,
  getSubgraphVersionsFromContracts
} from 'lib/hooks/useSubgraphClients'
import { prizePoolsQuery } from 'lib/queries/prizePoolsQuery'
import { CONTRACT_ADDRESSES } from 'lib/constants/contracts'
import { ethers } from 'ethers'

/**
 *
 * @param {*} chainId
 * @param {*} poolContracts
 * @param {*} blockNumber
 * @returns
 */
export const getPoolGraphData = async (chainId, poolContracts, blockNumber = -1) => {
  const subgraphVersions = getSubgraphVersionsFromContracts(poolContracts)
  const subgraphClients = getSubgraphClientsByVersionFromContracts(poolContracts, chainId)
  const addressesByVersion = getPoolAddressesBySubgraphVersionFromContracts(poolContracts)

  const query = prizePoolsQuery(blockNumber)
  const data = await Promise.all(
    subgraphVersions.map((version) => {
      const client = subgraphClients[version]
      const poolAddresses = addressesByVersion[version]
      return client.request(query, { poolAddresses }).catch((e) => {
        console.warn(e.message)
        return null
      })
    })
  )

  return data
    .filter(Boolean)
    .flatMap(({ prizePools }) =>
      prizePools.map((prizePool) => formatPoolGraphData(prizePool, chainId))
    )
}

const formatPoolGraphData = (prizePool, chainId) => {
  const prizeStrategy = prizePool.prizeStrategy.multipleWinners
    ? prizePool.prizeStrategy.multipleWinners
    : prizePool.prizeStrategy.singleRandomWinner
  const ticket = prizeStrategy.ticket
  const sponsorship = prizeStrategy.sponsorship

  // Filter out our PTLootBox erc721
  const externalErc20Awards = prizeStrategy.externalErc20Awards.filter((award) => {
    const lootboxAddress = CONTRACT_ADDRESSES[chainId]?.lootBox?.toLowerCase()
    if (lootboxAddress) {
      return award.address !== lootboxAddress
    }
    return true
  })

  const formattedData = {
    config: {
      liquidityCap: prizePool.liquidityCap,
      maxExitFeeMantissa: prizePool.maxExitFeeMantissa,
      maxTimelockDurationSeconds: prizePool.maxTimelockDuration,
      timelockTotalSupply: prizePool.timelockTotalSupply,
      numberOfWinners: prizeStrategy?.numberOfWinners || '1',
      prizePeriodSeconds: prizeStrategy.prizePeriodSeconds,
      tokenCreditRates: prizePool.tokenCreditRates
    },
    prizePool: {
      address: prizePool.id
    },
    prizeStrategy: {
      address: prizePool.prizeStrategy.id
    },
    tokens: {
      ticket: {
        address: ticket.id,
        decimals: ticket.decimals,
        name: ticket.name,
        symbol: ticket.symbol,
        totalSupply: formatUnits(ticket.totalSupply, ticket.decimals),
        totalSupplyUnformatted: ethers.BigNumber.from(ticket.totalSupply),
        numberOfHolders: ticket.numberOfHolders
      },
      sponsorship: {
        address: sponsorship.id,
        decimals: sponsorship.decimals,
        name: sponsorship.name,
        symbol: sponsorship.symbol,
        totalSupply: formatUnits(sponsorship.totalSupply, sponsorship.decimals),
        totalSupplyUnformatted: ethers.BigNumber.from(sponsorship.totalSupply),
        numberOfHolders: sponsorship.numberOfHolders
      },
      underlyingToken: {
        address: prizePool.underlyingCollateralToken,
        decimals: prizePool.underlyingCollateralDecimals,
        name: prizePool.underlyingCollateralName,
        symbol: prizePool.underlyingCollateralSymbol
      }
    },
    prize: {
      cumulativePrizeNet: prizePool.cumulativePrizeNet,
      currentPrizeId: prizePool.currentPrizeId,
      currentState: prizePool.currentState,
      externalErc20Awards,
      externalErc721Awards: prizeStrategy.externalErc721Awards,
      sablierStream: {
        id: prizePool.sablierStream?.id
      }
    },
    reserve: {
      registry: {
        address: prizePool.reserveRegistry
      }
    },
    tokenListener: {
      address: prizeStrategy.tokenListener
    }
  }

  if (prizePool.compoundPrizePool) {
    formatCompoundPrizePoolData(prizePool, formattedData)
  } else if (prizePool.yieldSourcePrizePool) {
    formatGenericYieldPrizePoolData(prizePool, formattedData)
  } else {
    formatStakePrizePoolData(prizePool, formattedData)
  }

  return formattedData
}

const formatCompoundPrizePoolData = (prizePool, formattedData) => {
  formattedData.prizePool.type = PRIZE_POOL_TYPES.compound
  formattedData.tokens.cToken = {
    address: prizePool.compoundPrizePool.cToken
  }
}

const formatGenericYieldPrizePoolData = (prizePool, formattedData) => {
  formattedData.prizePool.type = PRIZE_POOL_TYPES.genericYield
  formattedData.prizePool.yieldSource = { address: prizePool.yieldSourcePrizePool.yieldSource }
}

const formatStakePrizePoolData = (prizePool, formattedData) => {
  formattedData.prizePool.type = PRIZE_POOL_TYPES.stake
}