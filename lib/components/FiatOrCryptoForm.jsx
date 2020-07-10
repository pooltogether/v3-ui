import React from 'react'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { PaneTitle } from 'lib/components/PaneTitle'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const FiatOrCryptoForm = (props) => {
  const { nextStep } = props

  const router = useRouter()

  const handleFiatClick = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { method: 'fiat' })

    nextStep()
  }

  const handleCryptoClick = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { method: 'crypto' })

    nextStep()
  }

  return <>
    <PaneTitle>
      How would you like to deposit?
    </PaneTitle>

    <Button
      onClick={handleFiatClick}
      color='green'
    >
      Fiat Currency
    </Button>

    <Button
      onClick={handleCryptoClick}
      color='white'
    >
      Crypto
    </Button>
  </>
}
