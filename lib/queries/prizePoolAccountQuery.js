import gql from 'graphql-tag'
import { prizePoolAccountFragment } from 'lib/fragments/prizePoolAccountFragment'

export const prizePoolAccountQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query accountQuery($id: String!) {
      prizePoolAccounts(where: { id: $id } ${blockFilter}) {
        ...prizePoolAccountFragment

        account {
         id
         controlledTokenBalances {
            id
            balance
            controlledToken {
              id
              name
              symbol
              decimals
            }
          } 
        }
      },
    }
    ${prizePoolAccountFragment}
  `
}
