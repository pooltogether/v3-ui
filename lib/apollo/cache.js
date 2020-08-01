import { makeVar } from '@apollo/client'

export const transactionsVar = makeVar([])

export const typePolicies = {
  Query: {
    fields: {
      transactions: {
        read(existing) {
          console.log({ existing })
          //   return localStorage.getItem('CART').includes(
          //     variables.productId
          //   );

          return transactionsVar()
        },
  // write(ew) {
  //   console.log({ ew })
  //   //   return localStorage.getItem('CART').includes(
  //   //     variables.productId
  //   //   );

  //   // return transactionsVar()
  // }
      }
    }
  }
}
