import gql from 'graphql-tag'
import { useQuery } from '@apollo/client'

export const GET_TRANSACTIONS = gql`
  query Transactions {
    transactions @client
  }
`

export const TransactionsUI = () => {
  const { data, loading, error } = useQuery(GET_TRANSACTIONS)

  if (loading) return 'loading'
  if (error) return <p>ERROR: {error.message}</p>

  return <>
    <div className='fixed r-0 t-0 m-4 bg-blue text-white'>
      Txs
      {data && data.transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
          <>
            {data && data.transactions.map(tx => {
              console.log({tx})
              return <div key={tx.hash}>
                {tx.hash}
              </div>
            })}
          </>
        )}
    </div>
  </>
}