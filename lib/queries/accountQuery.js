import gql from 'graphql-tag'
import { accountFragment } from 'lib/fragments/accountFragment'

export const accountQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query accountzQuery($accountAddress: String!) {
      accounts(where: { id: $accountAddress } ${blockFilter}) {
        ...accountFragment
      },
    }
    ${accountFragment}
  `
}
