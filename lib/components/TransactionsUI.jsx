import { useQuery } from '@apollo/client'
import classnames from 'classnames'

import { LoadingDots } from 'lib/components/LoadingDots'
import { transactionsQuery } from 'lib/queries/transactionsQuery'
import { shorten } from 'lib/utils/shorten'

export const TransactionsUI = () => {
  const { data, loading, error } = useQuery(transactionsQuery)

  if (loading) return 'loading'
  if (error) return <p>ERROR: {error.message}</p>

  console.log({data, loading, error})

  return <>
    <div
      id='transactions-ui'
      className={classnames(
        'text-sm sm:text-base lg:text-lg',
        'absolute block b-0 l-0 r-0 block pointer-events-none mb-20',
        {
          // 'hidden pointer-events-none': !visible,
          // 'absolute block t-0 b-0 l-0 r-0 block': visible,
        }
      )}
      style={{
        // backdropFilter: "blur(2px)",
        zIndex: 150000
      }}
    >
      <div
        className='flex flex-col items-center justify-center h-full w-full shadow-2xl'
      >
        <div
          className='relative message bg-inverse text-match flex flex-col w-full rounded-lg border-secondary border-2 shadow-4xl'
          style={{
            maxWidth: '36rem'
          }}
        >
          <div
            className='relative flex flex-col w-full border-b-2 border-secondary px-10 py-6 text-lg'
          >
            TRANSACTIONS
          </div>
          <div
            className='relative flex flex-col w-full px-10 py-6 text-sm text-xs sm:text-sm lg:text-base'
          >
            {data && data.transactions.length === 0 ? (
              <span className='font-bold uppercase'>Currently no ongoing transactions ...</span>
            ) : (
                <>
                  {data && data.transactions.map(tx => {
                    return <div
                      key={tx.id}
                      className='relative'
                    >
                      <div
                        className='absolute t-0'
                        style={{ left: -20 }}
                      >
                        {!tx.completed && <LoadingDots /> }
                      </div>

                      <span className='font-bold uppercase'>
                        {tx.name}
                      </span> {tx.hash ? <>
                        {shorten(tx.hash)} - 
                      </> : <>
                          - Please confirm in your wallet ...
                      </>} {tx.sent && !tx.completed && <>In progress ...</>}
                      {/* {tx.completed && <>Completed.</>}
                      {tx.error && <>Error.</>} */}
                      <span
                        className='text-red font-bold capitalize'
                      >
                        {tx.reason && <>{tx.reason}</>}
                      </span>
                    </div>
                  })}
                </>
              )}
          </div>
        </div>
      </div>
      
    </div>
  </>
}