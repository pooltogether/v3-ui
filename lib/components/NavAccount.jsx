import React, { useContext, useState } from 'react'
import VisuallyHidden from '@reach/visually-hidden'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'
import { Dialog } from '@reach/dialog'

import { AccountButton } from 'lib/components/AccountButton'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { TransactionsList } from 'lib/components/TransactionsList'
import { WalletInfo } from 'lib/components/WalletInfo'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const NavAccount = (props) => {
  const router = useRouter()

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const [showDialog, setShowDialog] = useState(false)
  const openTransactions = () => setShowDialog(true)
  const closeTransactions = () => setShowDialog(false)

  const handleShowSignIn = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { signIn: 1 })
  }

  return <>
    {usersAddress ?
      <AccountButton
        openTransactions={openTransactions}
        usersAddress={usersAddress}
      /> :
      <Button
        outline
        onClick={handleShowSignIn}
      >
        Sign in
      </Button>
    }

    {usersAddress && <>

      <Dialog
        aria-label='List of your transactions'
        isOpen={showDialog}
        onDismiss={closeTransactions}
      >
        <motion.div
          id='transactions-ui'
          className={'relative text-sm sm:text-base lg:text-lg h-full'}
          key='sign-in-scaled-bg'
          initial={{ scale: 0 }}
          animate={{ scale: 1, transition: { duration: 0.1 } }}
          exit={{ scale: 0, transition: { duration: 0.1 } }}
        >
          <div
            className='flex flex-col items-center justify-center h-full w-full '
          >
            <div
              className='dialog-inner relative message bg-primary text-inverse flex flex-col w-full border-default border-2 shadow-4xl'
            >
              <div
                className='flex justify-between items-start px-10 pt-6 pb-5 bg-default rounded-xl rounded-b-none'
              >
                <WalletInfo />

                <button
                  onClick={closeTransactions}
                  className='relative close-button text-primary hover:text-secondary trans outline-none focus:outline-none active:outline-none'
                  style={{
                    right: -10
                  }}
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

              <TransactionsList
                closeTransactions={closeTransactions}
                showDialog={showDialog}
              />
            </div>
          </div>

        </motion.div>
      </Dialog>
    </>}
  </>
    
}
