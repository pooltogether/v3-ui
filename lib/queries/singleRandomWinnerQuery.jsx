import gql from 'graphql-tag'

import { singleRandomWinnerFragment } from 'lib/fragments/singleRandomWinnerFragment'

export const singleRandomWinnerQuery = gql`
  query singleRandomWinnerQuery($owner: String!) {
    singleRandomWinners(where: { owner: $owner }) {
      ...singleRandomWinnerFragment
    }
  }
  ${singleRandomWinnerFragment}
`
