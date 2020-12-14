import React, { useContext, useState } from 'react'

import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { DepositOrWithdrawSponsorshipModal } from 'lib/components/DepositOrWithdrawSponsorshipModal'
import { usePlayerPoolBalances } from 'lib/hooks/usePlayerPoolBalances'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const SponsorshipPane = (
  props,
) => {
  const { t } = useTranslation()
  const { pool, tickerUpcased, usersAddress } = props

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  
  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress
  
  const { usersSponsorshipBalance } = usePlayerPoolBalances(address, pool)
  
  

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
    <DepositOrWithdrawSponsorshipModal
      {...props}
      handleClose={handleClose}
      visible={depositVisible}
    />

    <DepositOrWithdrawSponsorshipModal
      {...props}
      isWithdraw
      handleClose={handleClose}
      visible={withdrawVisible}
    />

    <div
      className='bg-highlight-3 rounded-lg px-4 pt-4 pb-5 py-4 xs:p-10 text-white my-4 flex flex-col justify-center'
    >
      <h4>
        {t('yourSponsorship')}
      </h4>

      {!usersAddress ? <>
        {t('connectAWalletToManageSponsorship')}
      </> : <>
        <div className='uppercase text-caption mb-4 font-bold'>
          {t('balance')} {numberWithCommas(
            usersSponsorshipBalance,
            { precision: 0 }
          )} {tickerUpcased}
        </div>

        <div className='flex'>
          <Button
            // secondary
            bg='highlight-3'
            hoverBg='green'
            text='accent-3'
            hoverText='primary'
            border='highlight-2'
            hoverBorder='transparent'
            onClick={handleDepositSponsorshipClick}
            className='w-1/2 sm:w-3/12 mr-2 border-2'
          >
            {t('deposit')}
          </Button>

          <Button
            // secondary
            bg='highlight-3'
            hoverBg='green'
            text='accent-3'
            hoverText='primary'
            border='highlight-2'
            hoverBorder='transparent'
            onClick={handleWithdrawSponsorshipClick}
            className='w-1/2 sm:w-3/12 ml-2 border-2'
          >
            {t('withdraw')}
          </Button>
        </div>
      </>}

    </div>
  </>
}
