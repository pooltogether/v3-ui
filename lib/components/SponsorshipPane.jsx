import React, { useContext, useState } from 'react'

import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { DepositOrWithdrawSponsorshipModal } from 'lib/components/DepositOrWithdrawSponsorshipModal'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

export const SponsorshipPane = (
  props,
) => {
  const { t } = useTranslation()
  const { tickerUpcased, usersAddress } = props

  const [depositVisible, setDepositVisible] = useState(false)
  const [withdrawVisible, setWithdrawVisible] = useState(false)
  
  const poolData = useContext(PoolDataContext)
  const { usersSponsorshipBalance } = poolData
  
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
      className='bg-highlight-3 rounded-lg px-10 pt-8 pb-10 text-white my-4 flex flex-col justify-center'
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
            { precision: 4 }
          )} {tickerUpcased}
        </div>

        <div className='flex'>
          <Button
            textSize='lg'
            bg='highlight-4'
            className='w-1/2 sm:w-1/3 mr-2'
            onClick={handleDepositSponsorshipClick}
          >
            {t('deposit')}
          </Button>

          <Button
            secondary
            textSize='lg'
            onClick={handleWithdrawSponsorshipClick}
            className='w-1/2 sm:w-1/3 ml-2'
          >
            {t('withdraw')}
          </Button>
        </div>
      </>}

    </div>
  </>
}
