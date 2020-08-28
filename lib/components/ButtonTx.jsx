import React from 'react'
import { omit } from 'lodash'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PTHint } from 'lib/components/PTHint'

export const ButtonTx = (props) => {
  const { children, usersAddress } = props

  const router = useRouter()

  let newProps = omit(props, [
    'usersAddress'
  ])

  const button = <Button
    {...newProps}
    disabled={!usersAddress}
  >
    {children}
  </Button>

  return <>
    {!usersAddress ? <>
      <PTHint
        title='Connect a wallet'
        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            You are attempting to run a transaction without having a wallet connected.
          </div>
          <div className='my-2 text-xs sm:text-sm'>
            Please connect a wallet before submitting transactions.
          </div>

          <Button
            className='mt-4'
            textSize='lg'
            onClick={(e) => {
              e.preventDefault()
              router.push(
                '/account?signIn=1&showSelectMenu=1',
                '/account?signIn=1&showSelectMenu=1',
                { shallow: true }
              )
            }}
          >
            Connect wallet
          </Button>
        </>}
      >
        {button}
      </PTHint>
    </> : button}
  </>
}
