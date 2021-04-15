import gql from 'graphql-tag'

import { lootBoxFragment } from 'lib/fragments/lootBoxFragment'

export const lootBoxQuery = (number) => {
  let blockFilter = ''

  if (number > 0) {
    blockFilter = `, block: { number: ${number} }`
  }

  return gql`
    query lootBoxQuery($lootBoxAddress: ID!, $tokenIds: [String]!) {
      lootBoxes(
        where: {
          erc721: $lootBoxAddress, # '0x2cb260f1313454386262373773124f6bc912cf28'
          tokenId_in: $tokenIds # '[1, 2] or [1]',
        } ${blockFilter}
      ) {
        ...lootBoxFragment
      }
    }
    ${lootBoxFragment}
  `
}

export const getLootBoxQueryAlias = (id) => `lootBox_${id}`

export const lootBoxesQuery = (lootBoxAddress, prizes) => {
  const querySelections = []

  prizes.forEach((prize) => {
    const lootBox = prize.lootBox
    if (lootBox.id) {
      let selection = QUERY_TEMPLATE
      selection = selection.replace('__alias__', getLootBoxQueryAlias(lootBox.id))
      selection = selection.replace('__address__', `"${lootBoxAddress}"`)
      selection = selection.replace('__tokenId__', `${lootBox.id}`)
      selection = selection.replace('__blockNumber__', `${prize.awardedBlock - 1}`)
      querySelections.push(selection)
    }
  })

  return gql`
    query {
      ${querySelections.join('\n')}
    }
  `
}

const QUERY_TEMPLATE = `__alias__: lootBoxes( where: { erc721: __address__, tokenId: __tokenId__ }, block: { number: __blockNumber__ }) {
  id
  erc721
  tokenId

  erc20Balances {
    id
    balance

    erc20Entity {
      id
      name
      symbol
      decimals
    }
  }

  erc721Tokens {
    id
    tokenId

    erc721Entity {
      id
      isLootBox
      name
      uri
    }
  }
  
  erc1155Balances {
    id
    balance
    tokenId

    erc1155Entity {
      id
    }
  }
}`
