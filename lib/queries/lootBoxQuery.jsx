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

export const lootBoxesQuery = (prizes) => {
  const querySelections = []
  prizes.forEach((prize) => {
    const lootBox = prize.lootBox
    if (lootBox.id) {
      const selection = QUERY_TEMPLATE
      selection.replace('__alias__', `${lootBox.id}`)
      selection.replace('__address__', `${lootBox.address}`)
      selection.replace('__tokenId__', `${lootBox.id}`)
      selection.replace('__blockNumber__', `${prize.awardedBlock - 1}`)
      querySelections.push(selection)
    }
  })

  return gql`
    query lootBoxQuery() {
      ${querySelections.join(',')}
    }
    ${lootBoxFragment}
  `
}

const QUERY_TEMPLATE = `__alias__: lootBoxes( where: { erc721: __address__, tokenId: __tokenId__ } , block: { number: __blockNumber__}) {
  ...lootBoxFragment
}`

const _getBlockFilter = (blockNumber) => {
  let blockFilter = ''

  if (Number(blockNumber) > 0) {
    blockFilter = `, block: { number: ${blockNumber} }`
  }

  return blockFilter
}
