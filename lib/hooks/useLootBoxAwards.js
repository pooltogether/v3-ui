import { orderBy } from 'lodash'

import { useUniswapTokensQuery } from 'lib/hooks/useUniswapTokensQuery'
import { compileLootBoxErc20s } from 'lib/services/compileLootBoxErc20s'
import { getLootBoxAwards } from 'lib/services/getLootBoxAwards'
import { uniswapTokensToQuery } from 'lib/services/uniswapTokensToQuery'

export const useLootBoxAwards = function (lootBox, pool, blockNumber) {
  const { erc20Awards, erc721Awards } = getLootBoxAwards(lootBox, pool)

  const { addresses } = uniswapTokensToQuery(erc20Awards)

  const { data: uniswapPriceData } = useUniswapTokensQuery(
    addresses,
    blockNumber
  )

  // const { awards } = compileLootBoxAwards(allLootBoxAwards, uniswapPriceData)
  const compiledErc20s = compileLootBoxErc20s(erc20Awards, uniswapPriceData)

  // top level:
  // const compiledErc20s = compileLootBoxErc20s(allLootBoxAwards, uniswapPriceData)
  // mash the top-level 721s, 20s and anything in the lootbox together:
  // expand this for all types of awards:
  const awards = orderBy(compiledErc20s, ({ value }) => value || '', ['desc'])

  return { awards }
}
