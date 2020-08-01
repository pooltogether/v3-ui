import { useQuery } from '@apollo/client'
import classnames from 'classnames'

import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { LoadingDots } from 'lib/components/LoadingDots'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { shorten } from 'lib/utils/shorten'

export const TransactionsUI = () => {
  const { data, loading, error } = useQuery(transactionsQuery)

  if (loading) return 'loading'
  if (error) return <p>ERROR: {error.message}</p>

  return <>
    <div
      id='transactions-ui'
      className={classnames(
        'text-sm sm:text-base lg:text-lg',
        'absolute block b-0 l-0 r-0 block mb-20',
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
        // shadow-2xl
        className='flex flex-col items-center justify-center h-full w-full '
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
                  <ul>
                    {data && data.transactions.map(tx => {
                      return <li
                        key={tx.hash || Date.now()}
                        className='relative'
                      >
                        <div
                          className='absolute t-0'
                          style={{ left: -26 }}
                        >
                          {!tx.completed && <LoadingDots /> }
                        </div>

                        <span className='font-bold uppercase'>
                          {tx.name}
                        </span> - {tx.hash && <>
                          <EtherscanTxLink
                            chainId={tx.chainId}
                            hash={tx.hash}
                          >
                            {shorten(tx.hash)}
                          </EtherscanTxLink>
                        </>}

                        <br />
                          
                        {tx.inWallet && <>
                          Please confirm in your wallet ...
                        </>}

                        {tx.sent && !tx.completed && <>In progress ...</>}

                        <span
                          className='text-red font-bold capitalize'
                        >
                          {tx.reason && <>{tx.reason}</>}
                        </span>
                      </li>
                    })}
                  </ul>
                </>
              )}
          </div>
        </div>
      </div>
      
    </div>
  </>
}