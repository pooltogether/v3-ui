import gql from 'graphql-tag'

export const sponsorQuery = (number) => {
  const blockFilter = number > 0 ? `, block: { number: ${number} }` : ''

  return gql`
    query sponsorQuery($sponsorAddress: String!) {
      sponsor: sponsors(where: { address: $sponsorAddress } ${blockFilter}) {
        id
        balance
        address
        prizePool {
          id
        }
      },
    }
  `
}
