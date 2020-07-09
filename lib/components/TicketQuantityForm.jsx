import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'
import { motion, AnimatePresence } from 'framer-motion'
import { ethers } from 'ethers'

import CompoundPeriodicPrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/CompoundPeriodicPrizePool'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { DepositForm } from 'lib/components/DepositForm'
import { PaneTitle } from 'lib/components/PaneTitle'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { TxMessage } from 'lib/components/TxMessage'
import { poolToast } from 'lib/utils/poolToast'
import { sendTx } from 'lib/utils/sendTx'

export const TicketQuantityForm = (props) => {
  const { nextStep } = props

  const router = useRouter()

  const poolDataContext = useContext(PoolDataContext)

  const [depositAmount, setDepositAmount] = useState('')

  const disabled = depositAmount.length === 0 || parseInt(depositAmount, 10) <= 0

  const handleSubmit = (e) => {
    e.preventDefault()
    nextStep()
  }

  console.log('TicketQuantityForm')

  return <>
    <PaneTitle>
      Get Tickets
    </PaneTitle>

    <form
      onSubmit={handleSubmit}
    >
      <div className='w-full sm:w-2/3 mx-auto'>
        <TextInputGroup
          large
          id='depositAmount'
          label={<>
            Quantity <span className='text-purple-600 italic'></span>
          </>}
          required
          type='number'
          pattern='\d+'
          onChange={(e) => setDepositAmount(e.target.value)}
          value={depositAmount}
        />
      </div>

      {/* {overBalance && <>
              <div className='text-yellow-400'>
                You only have {displayAmountInEther(usersTokenBalance, { decimals: tokenDecimals })} {tokenSymbol}.
                <br />The maximum you can deposit is {displayAmountInEther(usersTokenBalance, { precision: 2, decimals: tokenDecimals })}.
              </div>
            </>} */}

      <div
        className='my-5'
      >
        <Button
          disabled={disabled}
          // disabled={overBalance}
          color='green'
        >
          Continue
        </Button>
      </div>
    </form>
  </>
}
