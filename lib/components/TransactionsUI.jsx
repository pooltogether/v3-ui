import { useQuery } from '@apollo/client'
import classnames from 'classnames'

import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PTHint } from 'lib/components/PTHint'
import { LoadingDots } from 'lib/components/LoadingDots'
import { transactionsQuery } from 'lib/queries/transactionQueries'

export const TransactionsUI = () => {
  const transactionsQueryResult = useQuery(transactionsQuery)
  const notCancelledTransactions = transactionsQueryResult?.data?.transactions
    .filter(t => !t.cancelled)

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
          className='relative message bg-default text-inverse flex flex-col w-full rounded-lg border-default border-2 shadow-4xl'
          style={{
            maxWidth: '36rem'
          }}
        >
          <div
            className='relative flex flex-col w-full border-b-2 border-default px-10 py-6 text-lg'
          >
            TRANSACTIONS
          </div>
          <div
            className='relative flex flex-col w-full px-10 py-6 text-sm text-xs sm:text-sm lg:text-base'
          >
            {notCancelledTransactions.length === 0 ? <>
              <span className='font-bold uppercase'>Currently no active transactions ...</span>
            </> : <>
                <ul>
                  {notCancelledTransactions.map(tx => {
                    // console.log({ tx})
                    if (tx.cancelled) {
                      return
                    }

                    return <li
                      key={tx.hash || Date.now()}
                      className='relative mb-2'
                    >
                      <div
                        className='absolute '
                        style={{ left: -26, top: 5 }}
                      >
                        {!tx.completed && <LoadingDots /> }
                      </div>

                      <div className='flex'>
                        <div
                          className='font-bold uppercase'
                          style={{
                            minWidth: 300
                          }}
                        >
                          {tx.hash ? <>
                            <EtherscanTxLink
                              chainId={tx.ethersTx.chainId}
                              hash={tx.hash}
                            >
                              {tx.name}
                            </EtherscanTxLink>
                          </> : tx.name
                          }
                        </div>

                        {tx.reason && <>
                          <PTHint
                            tip={tx.reason}
                          >
                            <>
                              <span
                                className='inline-flex items-center justify-center text-white bg-red font-bold capitalize rounded-full ml-4 w-6 h-6'
                              >
                                ?
                              </span>
                            </>
                          </PTHint>
                        </>}
                      </div>

                      {tx.inWallet || (tx.sent && !tx.completed) && <>
                        <br />
                        <span
                          className='text-primary'
                        >
                          {tx.inWallet && <>
                            Please confirm in your wallet...
                          </>}

                          {tx.sent && !tx.completed && <>In progress ...</>}
                        </span>
                      </>}
                    </li>
                  })}
                </ul>
              </>}
          </div>
        </div>
      </div>
      
    </div>
  </>
}