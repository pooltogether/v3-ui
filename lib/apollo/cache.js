import { makeVar } from '@apollo/client'

export const transactionsVar = makeVar([])

export const transactions = {
  read() {
    return transactionsVar()
  }
}
