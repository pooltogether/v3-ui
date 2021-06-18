import React from 'react'
import { omit } from 'lodash'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { Tooltip } from 'lib/components/Tooltip'

export function ButtonTx(props) {
  const { children, usersAddress } = props

  let newProps = omit(props, ['usersAddress'])

  return (
    <Tooltip
      isEnabled={!usersAddress}
      id={`button-tx-connect-wallet-tooltip`}
      title='Connect a wallet'
      tip={
        <>
          <div className='my-2 text-xs sm:text-sm'>You do not have a wallet connected.</div>
          <div className='my-2 text-xs sm:text-sm'>
            Please connect a wallet before submitting transactions.
          </div>
        </>
      }
    >
      <Button {...newProps} disabled={!usersAddress}>
        {children}
      </Button>
    </Tooltip>
  )
}
