import React from 'react'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'

import {
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH
} from 'lib/constants'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'

export const WithdrawButton = (props) => {
  const { poolIsLocked, poolSymbol } = props
  const router = useRouter()

  const handleWithdrawClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/account/pools/[symbol]')
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/account/pools/${poolSymbol}`)

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
      Withdraw
    </Button>
  </>

  return <>
    {poolIsLocked ? <>
      <PTHint
        title='Pool is locked'
        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            The Pool is currently being awarded. No deposits or withdrawals can be processed until it's complete.
          </div>
          <div
            className='text-xs sm:text-sm'
          >
            You won't need to refresh the page.
          </div>
        </>}
        className='w-full'
      >
        {withdrawButton}
      </PTHint>
    </> : withdrawButton}
  </>
}
