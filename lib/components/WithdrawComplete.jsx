import React from 'react'
import { useRouter } from 'next/router'
import { useTranslation, Trans } from 'react-i18next'
import { useCurrentPool } from '@pooltogether/hooks'

import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PaneTitle } from 'lib/components/PaneTitle'
import { PoolNumber } from 'lib/components/PoolNumber'

export function WithdrawComplete(props) {
  const { t } = useTranslation()

  const router = useRouter()
  const { data: pool } = useCurrentPool(router)

  const { quantity } = props

  const tickerUpcased = pool?.tokens.underlyingToken.symbol.toUpperCase()

  return (
    <>
      <PaneTitle>
        <span className={`mx-auto`} role='img' aria-label='confetti emoji'>
          🎉
        </span>
      </PaneTitle>
      <PaneTitle>{t('successfullyWithdrew')}</PaneTitle>

      <div
        className='w-full text-center mx-auto rounded-xl text-orange bg-orange-darkened border-2 border-orange py-8 px-2 xs:px-8 mt-6 sm:mt-0 sm:my-10'
        style={{
          maxWidth: 600
        }}
      >
        <h4 className='text-orange'>
          <Trans
            i18nKey='youReceivedAmountTicker'
            defaults='You received <number>{{amount}}</number> {{ticker}}'
            components={{
              number: <PoolNumber />
            }}
            values={{
              amount: quantity,
              ticker: tickerUpcased
            }}
          />
        </h4>
      </div>

      <ButtonDrawer>
        <ButtonLink href='/account' as={`/account`} textSize='lg' className='mx-auto'>
          {t('backToMyAccount')}
        </ButtonLink>
      </ButtonDrawer>
    </>
  )
}
