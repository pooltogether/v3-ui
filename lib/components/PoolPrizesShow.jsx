import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { useCurrentPool } from 'lib/hooks/usePools'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { Button } from 'lib/components/Button'
import { Meta } from 'lib/components/Meta'
import { PoolPrizeListing } from 'lib/components/PoolPrizeListing'
import { PrizesPageHeader } from 'lib/components/PrizesPageHeader'

export const PoolPrizesShow = (props) => {
  const [t] = useTranslation()
  const router = useRouter()

  const { data: pool } = useCurrentPool()

  const querySymbol = router.query?.symbol

  if (pool === null) {
    return <BlankStateMessage>Could not find pool with symbol: ${querySymbol}</BlankStateMessage>
  }

  if (!pool?.version) {
    return null
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
      <Meta title={pool?.name && `${t('prizes')} - ${pool.name}`} />

      <PrizesPageHeader pool={pool} />
      <h6 className='text-accent-2 mb-0 mt-8'>{t('prizeHistory')}</h6>

      <PoolPrizeListing pool={pool} querySymbol={querySymbol} />

      <div className='mx-auto mt-10 text-center'>
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
      {/* <AllPoolsTotalAwarded /> */}
    </>
  )
}
