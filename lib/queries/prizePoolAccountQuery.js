import gql from 'graphql-tag'

import { controlledTokenFragment } from 'lib/fragments/controlledTokenFragment'
import { prizePoolAccountFragment } from 'lib/fragments/prizePoolAccountFragment'

export const prizePoolAccountQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query accountQuery($id: String!) {
      prizePoolAccount(id: $id ${blockFilter}) {
        ...prizePoolAccountFragment

        account {
         id
         controlledTokenBalances {
            id
            balance
            controlledToken {
              ...controlledTokenFragment
            }
          } 
        }
      },
    }
    ${controlledTokenFragment}
    ${prizePoolAccountFragment}
  `
}
