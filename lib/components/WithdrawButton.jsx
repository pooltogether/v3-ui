import React from 'react'

import { ButtonLink } from 'lib/components/ButtonLink'
import { PTHint } from 'lib/components/PTHint'

export const WithdrawButton = (props) => {
  const { poolIsLocked, poolSymbol } = props

  const button = <>
    <ButtonLink
      secondary
      disabled={poolIsLocked}
      href='/account/pools/[symbol]/withdraw'
      as={`/account/pools/${poolSymbol}/withdraw`}
    >
      Withdraw
    </ButtonLink>
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
        className='w-full w-49-percent'
      >
        {button}
      </PTHint>
    </> : button}
  </>
}
