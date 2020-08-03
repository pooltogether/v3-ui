import React, { useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import VisuallyHidden from '@reach/visually-hidden'
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'

import { LoadingDots } from 'lib/components/LoadingDots'
import { TransactionsUIListItem } from 'lib/components/TransactionsUIListItem'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { shorten } from 'lib/utils/shorten'

export const TransactionsUI = (props) => {
  const { usersAddress } = props

  const [showDialog, setShowDialog] = useState(false)
  const openTransactions = () => setShowDialog(true)
  const closeTransactions = () => setShowDialog(false)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const notCancelledTransactions = transactionsQueryResult?.data?.transactions
    .filter(t => !t.cancelled)
    .reverse()

  const pendingCount = transactionsQueryResult?.data?.transactions
    .filter(t => !t.completed)
    .length

  return <>
    <button
      onClick={openTransactions}
      className='nav--account-transactions-button flex text-primary bg-secondary inline-block trans rounded-full mr-2 sm:mr-4 text-xxs sm:text-xs lg:text-base shadow-sm'
    >
      {pendingCount > 0 && <>
        <span
          className='pr-3 sm:px-0 sm:py-1 lg:px-0 lg:py-1'
        >
          <div
            className='relative inline-block ml-2'
            style={{
              top: 3,
              transform: 'scale3d(0.75, 0.75, 1)'
            }}
          >
            <LoadingDots />
          </div> {pendingCount} <span className='hidden sm:inline-block'>pending</span><span className='sm:hidden'>txs</span>
        </span>
      </>}
      <span
        className={classnames(
          'nav--account-transactions-button__address rounded-full hidden sm:block sm:px-3 sm:py-1 lg:px-4 lg:py-1',
          {
            'ml-2': pendingCount > 0,
          }
        )}
      >
        {shorten(usersAddress)}
      </span>
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
        animate={{ opacity: 1, transition: { duration: 0.4 } }}
        exit={{ opacity: 0, transition: { duration: 0.5 } }}
      >
        <button
          onClick={closeTransactions}
          className='close-button text-primary hover:text-secondary trans outline-none focus:outline-none active:outline-none'
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

        <div
          className='flex flex-col items-center justify-center h-full w-full '
        >
          <div
            className='dialog-inner relative message bg-primary text-inverse flex flex-col w-full border-default border-2 shadow-4xl'
          >
            <div
              className='relative flex flex-col w-full border-b-2 border-default px-10 pt-6 pb-5 text-lg uppercase'
            >
              Recent transactions <div className='block sm:inline-block text-xxs'>
                {pendingCount > 0 && <>
                  ({pendingCount} pending)
                </>}
              </div>

              {notCancelledTransactions?.length > 0 && <>
                <button
                  className='text-xxs text-left underline text-blue hover:text-secondary trans mt-1'
                >
                  Clear recent
                </button>
              </>}
            </div>
            <div
              className='dialog-inner-content flex-grow relative flex flex-col w-full px-10 pt-6 pb-4 text-sm text-xs sm:text-sm lg:text-base'
            >
              {notCancelledTransactions.length === 0 ? <>
                <div
                  className='text-primary mb-2'
                >
                  Currently no active transactions...
                </div>
              </> : <>
                  <ul>
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