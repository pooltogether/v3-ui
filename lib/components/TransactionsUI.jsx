import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import VisuallyHidden from '@reach/visually-hidden'
import { Dialog } from '@reach/dialog'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { TransactionStatusChecker } from 'lib/components/TransactionStatusChecker'
import { LoadingDots } from 'lib/components/LoadingDots'
import { TransactionsUIListItem } from 'lib/components/TransactionsUIListItem'
import { transactionsVar } from 'lib/apollo/cache'
import { clearPreviousTransactionsFactory } from 'lib/apollo/clearPreviousTransactionsFactory'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { shorten } from 'lib/utils/shorten'

// import EthereumIcon from 'assets/images/ethereum-white.svg'

const clearPreviousTransactions = clearPreviousTransactionsFactory(transactionsVar)

export const TransactionsUI = (props) => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext


  const [showDialog, setShowDialog] = useState(false)
  const openTransactions = () => setShowDialog(true)
  const closeTransactions = () => setShowDialog(false)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions

  const notCancelledTransactions = transactions
    .filter(t => !t.cancelled)
    .reverse()

  const pendingCount = transactions
    .filter(t => !t.completed)
    .length
  // const pendingCount = 33
  
  const pastTransactionsCount = transactions
    .filter(t => t.completed)
    .length

  const clearPrevious = (e) => {
    e.preventDefault()
    clearPreviousTransactions()
  }


  if (!usersAddress) {
    return null
  }

  return <>
    <TransactionStatusChecker
      transactions={transactions}
    />

    <button
      onClick={openTransactions}
      className='nav--account-transactions-button flex text-primary bg-body inline-block trans rounded-full mr-2 sm:mr-4 text-xs sm:text-xs lg:text-sm shadow-sm'
    >
      {pendingCount > 0 && <>
        <span
          // className='sm:px-0 lg:px-0'
        >
          <div
            className='nav--account-transactions-button__loader relative inline-block ml-2 mr-1'
          >
            <LoadingDots />
          </div> {pendingCount} <span className='hidden sm:inline-block'>pending</span><span className='sm:hidden'></span>
        </span>
      </>}
      <span
        className={classnames(
          'bg-default text-inverse nav--account-transactions-button__address rounded-full lg:px-4 hidden sm:block border-2 border-highlight-2',
          {
            'px-4': pendingCount === 0,
            'px-3 ml-2': pendingCount > 0,
          }
        )}
      >
        {shorten(usersAddress)}
      </span>

      {/* <span
        className={classnames(
          // 'sm:hidden',
          'rounded-full py-2 px-3',
          // 'rounded-full py-2 px-3 opacity-40 hover:opacity-100',
        )}
      >
        <div className='ethereum-icon'></div>
      </span> */}

      {/* <span
        className={classnames(
          // 'sm:hidden',
          'rounded-full py-2 px-3',
          // 'rounded-full py-2 px-3 opacity-40 hover:opacity-100',
        )}
      >
        <div
          alt='ethereum icon'
          src={EthereumIcon}
          className='ethereum-icon relative'
        />
      </span> */}
    </button>

    <Dialog
      aria-label='List of your transactions'
      isOpen={showDialog}
      onDismiss={closeTransactions}
    >
      <motion.div
        id='transactions-ui'
        className={'relative text-sm sm:text-base lg:text-lg h-full'}
        key='sign-in-scaled-bg'
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, transition: { duration: 0.2 } }}
        exit={{ opacity: 0, transition: { duration: 0.1 } }}
      >
        

        <div
          className='flex flex-col items-center justify-center h-full w-full '
        >
          <div
            className='dialog-inner relative message bg-primary text-inverse flex flex-col w-full border-default border-2 shadow-4xl'
          >


            <div
              className='flex px-10 pt-6 pb-5 border-b-2 border-default'
            >
              <div
                className='flex flex-col w-full text-lg uppercase'
              >
                Recent transactions <div className='block sm:inline-block text-xxs'>
                  {pendingCount > 0 && <>
                    ({pendingCount} pending)
                  </>}
                </div>

                {pastTransactionsCount > 0 && <>
                  <button
                    className='text-xxs text-left underline text-blue hover:text-secondary trans mt-1'
                    onClick={clearPrevious}
                  >
                    Clear previous
                  </button>
                </>}
              </div>

              <button
                onClick={closeTransactions}
                className='close-button text-primary hover:text-secondary trans outline-none focus:outline-none active:outline-none pr-2'
              >
                <VisuallyHidden>
                  Close
                </VisuallyHidden>
                <span
                  aria-hidden
                >
                  <FeatherIcon
                    icon='x-circle'
                    className='w-6 h-6'
                  />
                </span>
              </button>
            </div>

            <div
              className='dialog-inner-content flex-grow relative flex flex-col w-full px-0 pt-0 pb-2 text-sm text-xs sm:text-sm lg:text-base'
            >
              {notCancelledTransactions.length === 0 ? <>
                <div
                  className='text-primary pb-2 pr-4'
                >
                  Currently no active transactions...
                </div>
              </> : <>
                  <ul
                    className='transactions-ui-list overflow-x-hidden overflow-y-auto px-10 py-4'
                  >
                    {notCancelledTransactions.map(tx => {
                      return <TransactionsUIListItem
                        key={tx.id}
                        tx={tx}
                      />
                    })}
                  </ul>
                </>}
            </div>
          </div>
        </div>

      </motion.div>  
    </Dialog>
    
  </>
}