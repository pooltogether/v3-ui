import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { ethers } from 'ethers'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { DepositForm } from 'lib/components/DepositForm'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TxMessage } from 'lib/components/TxMessage'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

const handleDepositSubmit = async (
  setTx,
  provider,
  usersAddress,
  contractAddress,
  depositAmount,
  decimals
) => {
  if (
    !depositAmount
  ) {
    poolToast.error(`Deposit Amount needs to be filled in`)
    return
  }

  const params = [
    usersAddress,
    ethers.utils.parseUnits(depositAmount, decimals),
    [], // bytes calldata
    {
      gasLimit: 700000
    }
  ]

  await sendTx(
    setTx,
    provider,
    contractAddress,
    CompoundPeriodicPrizePoolAbi,
    'mintTickets',
    params,
    'Deposit',
  )
}

export const DepositWizard = (props) => {
  const router = useRouter()

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, provider } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { genericChainValues, usersChainValues, poolAddresses } = poolDataContext

  const [depositAmount, setDepositAmount] = useState('')

  const [tx, setTx] = useState({})


  const txInFlight = tx.inWallet || tx.sent

  const resetState = (e) => {
    e.preventDefault()
    setDepositAmount('')
    setTx({})
  }

  const handleCloseDeposit = () => {
    const pathname = router.pathname.split('/deposit').shift()
    const asPath = router.asPath.split('/deposit').shift()

    router.push(
      `${pathname}`,
      `${asPath}`,
      {
        shallow: true
      }
    )
  }

  const disabled = true

  return <>
    <AnimatePresence>
      <motion.div
        key='deposit-scaled-bg'
        className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40 bg-darkened'
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ duration: 0.1 }}
      >
        &nbsp;
      </motion.div>
      <motion.div
        key='deposit-pane'
        className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40'
      >
        <nav
          className='fixed t-0 l-0 r-0 w-full px-4 pt-4 flex items-start justify-between flex-wrap h-20'
        >
          <button
            disabled={disabled}
            type='button'
            onClick={handleCloseDeposit}
            className={classnames(
              'text-primary trans',
              {
                'hover:text-secondary': !disabled
              }
            )}
          >
            <FeatherIcon
              icon='arrow-left-circle'
              className='w-8 h-8 sm:w-16 sm:h-16'
            />
          </button>
          <button
            type='button'
            onClick={handleCloseDeposit}
            className='text-primary hover:text-secondary trans'
          >
            <FeatherIcon
              icon='x-circle'
              className='w-8 h-8 sm:w-16 sm:h-16'
            />
          </button>
        </nav>

        {/* {props.usersChainValues.usersTokenAllowance.gt(0) ?
          <DepositUI
            {...props}
          /> :
          <UnlockDepositUI
            {...props}
          />
        }
        */}
        <div className='h-full flex flex-col justify-center px-4 sm:px-32 lg:px-64 text-center'>
          <PaneTitle>
            Get Tickets
          </PaneTitle>
          
          {!txInFlight ? <>
            <DepositForm
              {...props}
              handleSubmit={(e) => {
                e.preventDefault()
                handleDepositSubmit(
                  setTx,
                  provider,
                  usersAddress,
                  props.poolAddresses.prizePool,
                  depositAmount,
                  props.genericChainValues.tokenDecimals
                )
              }}
              vars={{
                depositAmount,
              }}
              stateSetters={{
                setDepositAmount,
              }}
            />
          </> : <>
            <TxMessage
              txType='Deposit to Pool'
              tx={tx}
              handleReset={resetState}
            />
          </>}
        </div>
      </motion.div>
    </AnimatePresence>
  </>
}
