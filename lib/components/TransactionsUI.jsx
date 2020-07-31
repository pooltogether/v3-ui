import { useQuery } from '@apollo/client'

import { transactionsQuery } from 'lib/queries/transactionsQuery'
import { shorten } from 'lib/utils/shorten'

export const TransactionsUI = () => {
  const { data, loading, error } = useQuery(transactionsQuery)

  if (loading) return 'loading'
  if (error) return <p>ERROR: {error.message}</p>

  return <>
    <div className='fixed r-0 t-0 m-10 bg-blue text-white z-50 p-6'>
      <div className='font-bold'> TRANSACTIONS
      </div>
      {data && data.transactions.length === 0 ? (
        <p>No transactions yet</p>
      ) : (
          <>
            {data && data.transactions.map(tx => {
              console.log({tx})
              return <div key={tx.hash}>
                {shorten(tx.hash)}
                <br />{tx?.sent?.toString()} {tx?.completed?.toString()}
              </div>
            })}
          </>
        )}
    </div>
  </>
}