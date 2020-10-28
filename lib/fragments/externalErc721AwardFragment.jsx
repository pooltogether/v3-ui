import gql from 'graphql-tag'

export const externalErc721AwardFragment = gql`
  fragment externalErc721AwardFragment on ExternalErc721Award {
    id
    address
    tokenIds
  }
`
