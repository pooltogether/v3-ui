import gql from 'graphql-tag'

import { externalErc20AwardFragment } from 'lib/fragments/externalErc20AwardFragment'
import { externalErc721AwardFragment } from 'lib/fragments/externalErc721AwardFragment'

export const timeTravelExternalAwardsQuery = (number) => {
  if (!number) {
    return gql`
      query noop {
        noops {
          id
        }
      }
    `
  }


  let blockFilter = ''

  if (number) {
    blockFilter = `block: { number: ${number} }`
  }

  return gql`
    query timeTravelExternalAwardsQuery {
      externalErc20Awards(${blockFilter}) {
        ...externalErc20AwardFragment
      }
      externalErc721Awards(${blockFilter}) {
        ...externalErc721AwardFragment
      }
    }
    ${externalErc20AwardFragment}
    ${externalErc721AwardFragment}
  `
}

    // # query externalAwardsQuery($prizeStrategyAddress: ID!) {
    //   # timeTravelPrizePool: singleRandomWinner(id: $prizeStrategyAddress ${blockFilter}) {
    //   #   id
    //   #   externalErc20Awards {
    //   #     ...externalErc20AwardFragment
    //   #   }
    //   #   externalErc721Awards {
    //   #     ...externalErc721AwardFragment
    //   #   }
    //   # }