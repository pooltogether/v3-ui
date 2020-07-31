import { makeVar } from '@apollo/client'

const transactionsVar = makeVar([])

export const transactions = () => {
  return {
    transactions: {
      read() {
        return transactionsVar()
      }
    }
  }
}
