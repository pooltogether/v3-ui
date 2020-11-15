import gql from 'graphql-tag'

import { awardedExternalErc20TokenFragment } from 'lib/fragments/awardedExternalErc20TokenFragment'
import { awardedExternalErc721NftFragment } from 'lib/fragments/awardedExternalErc721NftFragment'

export const prizeFragment = gql`
  fragment prizeFragment on Prize {
    id

    awardedTimestamp
    awardedBlock
    amount

    totalTicketSupply
    prizePeriodStartedTimestamp

    lockBlock

    winners

    awardedExternalErc20Tokens {
      ...awardedExternalErc20TokenFragment
    }
    
    awardedExternalErc721Nfts {
      ...awardedExternalErc721NftFragment
    }
  }
  ${awardedExternalErc20TokenFragment}
  ${awardedExternalErc721NftFragment}
`
