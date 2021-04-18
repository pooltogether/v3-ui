import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { useCurrentPool } from 'lib/hooks/usePools'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { Button } from 'lib/components/Button'
import { Meta } from 'lib/components/Meta'
import { PoolPrizesTable } from 'lib/components/PoolPrizesTable'
import { PrizesPageHeader } from 'lib/components/PrizesPageHeader'

export const PoolPrizesShow = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { data: pool, isFetched } = useCurrentPool()

  if (!isFetched) {
    return null
  }

  const querySymbol = router.query?.symbol

  if (pool === null) {
    return <BlankStateMessage>Could not find pool with symbol: ${querySymbol}</BlankStateMessage>
  }

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/prizes/[symbol]', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/prizes/${pool.symbol}`, COOKIE_OPTIONS)

    router.push(`/pools/[symbol]/deposit`, `/pools/${pool.symbol}/deposit`, {
      shallow: true
    })
  }

  return (
    <>
      <Meta title={pool?.name && `${t('prizes')} - ${pool?.name}`} />

      <div className='flex justify-between'>
        <PrizesPageHeader pool={pool} />

        <div className='my-auto'>
          <Button
            border='green'
            text='green'
            hoverBorder='green'
            onClick={handleGetTicketsClick}
            disabled={!Boolean(pool?.symbol)}
          >
            {t('deposit')}
          </Button>
        </div>
      </div>

      <h6 className='text-accent-2 mb-0 mt-8'>{t('prizeHistory')}</h6>
      <PoolPrizesTable pool={pool} querySymbol={querySymbol} />

      {/* TODO: Add prize value graph */}

      {/* <AllPoolsTotalAwarded /> */}
    </>
  )
}
