import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import VisuallyHidden from '@reach/visually-hidden'
import { Dialog, DialogOverlay, DialogContent } from '@reach/dialog'
import { useQuery } from '@apollo/client'
import { motion } from 'framer-motion'

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

  return <>
    <button
      onClick={openTransactions}
      className='text-primary hover:text-inverse px-3 bg-secondary inline-block trans rounded-full mr-4 text-xs sm:text-sm lg:text-base'
    >
      {shorten(usersAddress)}
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
              className='w-8 h-8'
            />
          </span>
        </button>

        <div
          // shadow-2xl
          className='flex flex-col items-center justify-center h-full w-full '
        >
          <div
            className='dialog-inner relative message bg-primary text-inverse flex flex-col w-full border-default border-2 shadow-4xl'
          >
            <div
              className='relative flex flex-col w-full border-b-2 border-default px-10 py-6 text-lg uppercase'
            >
              Recent transactions
            </div>
            <div
              className='dialog-inner-content flex-grow relative flex flex-col w-full px-10 py-6 text-sm text-xs sm:text-sm lg:text-base'
            >
              {notCancelledTransactions.length === 0 ? <>
                <span className='text-primary'>Currently no active transactions ...</span>
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