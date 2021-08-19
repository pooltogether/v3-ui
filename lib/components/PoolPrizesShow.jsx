import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Button } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'
import { useCurrentPool } from '@pooltogether/hooks'

import { COOKIE_OPTIONS, WIZARD_REFERRER_HREF, WIZARD_REFERRER_AS_PATH } from 'lib/constants'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { Meta } from 'lib/components/Meta'
import { PoolPrizesTable } from 'lib/components/PoolPrizesTable'
import { PrizesPageHeader } from 'lib/components/PrizesPageHeader'

export const PoolPrizesShow = (props) => {
  const { t } = useTranslation()

  const router = useRouter()
  const { data: pool, isFetched } = useCurrentPool(router)

  if (!isFetched) {
    return null
  }

  const querySymbol = router.query?.symbol

  if (pool === null) {
    return <BlankStateMessage>Could not find pool with symbol: ${querySymbol}</BlankStateMessage>
  }

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/prizes/[networkName]/[symbol]', COOKIE_OPTIONS)
    Cookies.set(
      WIZARD_REFERRER_AS_PATH,
      `/prizes/${pool.networkName}/${pool.symbol}`,
      COOKIE_OPTIONS
    )

    router.push(
      `/pools/[networkName]/[symbol]/deposit`,
      `/pools/${pool.networkName}/${pool.symbol}/deposit`,
      {
        shallow: true
      }
    )
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
