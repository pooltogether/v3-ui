import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'

import { Button } from 'lib/components/Button'
import { DepositSponsorshipModal } from 'lib/components/DepositSponsorshipModal'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const SponsorshipPane = (
  props,
) => {
  const { tickerUpcased } = props

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  
  // const authControllerContext = useContext(AuthControllerContext)
  // const { usersAddress } = authControllerContext
  
  const poolDataContext = useContext(PoolDataContext)
  const {
    pool,
    sponsor
  } = poolDataContext

  let sponsorBalance = 0
  if (sponsor && sponsor.balance && !isNaN(decimals)) {
    sponsorBalance = Number(ethers.utils.formatUnits(
      sponsor.balance,
      Number(decimals)
    ))
  }

  const handleDepositSponsorshipClick = (e) => {
    e.preventDefault()

    setDepositVisible(true)
  }
  
  const handleWithdrawSponsorshipClick = (e) => {
    e.preventDefault()

    setWithdrawVisible(true)
  }

  const handleClose = (e) => {
    e.preventDefault()

    setDepositVisible(false)
    setWithdrawVisible(false)
  }

  return <>
    <DepositSponsorshipModal
      handleClose={handleClose}
      tickerUpcased={tickerUpcased}
      visible={depositVisible}
    />


    <div
      className='bg-highlight-3 rounded-lg px-10 pt-8 pb-10 text-white mt-10 mb-10 sm:mb-0 flex flex-col justify-center'
    >
      <h4>
        Manage your sponsorship
      </h4>
      <div className='uppercase text-caption mb-4 font-bold'>
        Balance: {numberWithCommas(sponsorBalance)} {tickerUpcased}
      </div>

      <div className='flex'>
        <Button
          textSize='lg'
          bg='highlight-4'
          className='w-1/2 sm:w-1/3 mr-2'
          onClick={handleDepositSponsorshipClick}
        >
          Deposit
        </Button>

        <Button
          secondary
          textSize='lg'
          onClick={handleWithdrawSponsorshipClick}
          className='w-1/2 sm:w-1/3 ml-2'
        >
          Withdraw
        </Button>
      </div>
    </div>
  </>
}
