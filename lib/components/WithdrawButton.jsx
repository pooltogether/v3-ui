import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  COOKIE_OPTIONS,
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'

export const WithdrawButton = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { poolIsLocked, poolSymbol } = props

  const handleWithdrawClick = (e) => {
    e.preventDefault()

    Cookies.set(
      WIZARD_REFERRER_HREF,
      '/account/pools/[symbol]',
      COOKIE_OPTIONS
    )
    Cookies.set(
      WIZARD_REFERRER_AS_PATH,
      `/account/pools/${poolSymbol}`,
      COOKIE_OPTIONS
    )

    router.push(
      `/account/pools/[symbol]/withdraw`,
      `/account/pools/${poolSymbol}/withdraw`,
      {
        shallow: true
      }
    )
  }

  const withdrawButton = <>
    <Button
      secondary
      disabled={poolIsLocked}
      onClick={handleWithdrawClick}  
    >
      {t('withdraw')}
    </Button>
  </>

  return <>
    {poolIsLocked ? <>
      <PTHint
        title={t('poolIsLocked')}
        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            {t('poolCurrentlyBeingAwarded')}
          </div>
          <div
            className='text-xs sm:text-sm'
          >
            {t('youWontNeedToRefreshThePage')}
          </div>
        </>}
        className='w-full'
      >
        {withdrawButton}
      </PTHint>
    </> : withdrawButton}
  </>
}
