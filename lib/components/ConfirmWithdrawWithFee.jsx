import React, { useContext, useState, useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'

import { Trans, useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { PaneTitle } from 'lib/components/PaneTitle'
import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

export function ConfirmWithdrawWithFee(props) {
  const { t } = useTranslation()

  const { nextStep, previousStep } = props

  const router = useRouter()

  const [txExecuted, setTxExecuted] = useState(false)

  const { usersAddress, provider } = useContext(AuthControllerContext)
  const { pool, refetchPlayerQuery } = useContext(PoolDataContext)

  const ticker = pool?.underlyingCollateralSymbol
  const decimals = pool?.underlyingCollateralDecimals
  const poolAddress = pool?.poolAddress
  const controlledTokenAddress = pool?.prizeStrategy?.singleRandomWinner?.ticket?.id

  const tickerUpcased = ticker?.toUpperCase()

  const gross = router.query.gross
  const net = router.query.net
  const fee = router.query.fee

  const netFormatted = displayAmountInEther(
    net,
    { decimals, precision: 8 }
  )
  const feeFormatted = displayAmountInEther(
    fee,
    { decimals, precision: 8 }
  )


  return <>
    <div
      className='mx-auto'
      style={{ 
        maxWidth: 500
      }}
    >
      <PaneTitle>
        {t('uhOhYoureWithdrawingYourFundsTooSoon')}
      </PaneTitle>
    </div>

    <PaneTitle small>
      <Trans
        i18nKey='toEnsureFairnessDescription'
        defaults='You are withdrawing <bold>{{amount}} {{ticker}}</bold> and paying a <bold>{{amountTwo}} {{ticker}}</bold> fee'
        components={{
          bold: <span className='font-bold' />,
        }}
      />
    </PaneTitle>

        <div className='text-inverse'>
      CHART
    </div>

    <ButtonDrawer>
      <Button
        onClick={nextStep}
        textSize='lg'
        className={'mx-auto sm:mt-16'}
      >
        {t('withdrawAnyway')}
      </Button>
    </ButtonDrawer>

    <a
      href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
      target='_blank'
      rel='noopener noreferrer'
      className='mt-6 underline text-xxs xs:text-xs sm:text-sm'
    >
      {t('readMoreAboutTheFairnessFee')} <FeatherIcon
        icon='external-link'
        className='is-etherscan-arrow inline-block'
      />
    </a>
    
  </>
}
