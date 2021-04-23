import React, { useEffect } from 'react'

import { useTranslation } from 'lib/../i18n'
import { Banner } from 'lib/components/Banner'
import { Button } from 'lib/components/Button'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

import IconNetwork from 'assets/images/icon-network@2x.png'

export function WithdrawSwitchNetwork(props) {
  const { t } = useTranslation()

  const { quantity, nextStep, totalWizardSteps, setTotalWizardSteps, pool } = props

  const walletChainId = useWalletNetwork()
  const poolChainId = pool.chainId

  let networkMismatch = walletChainId !== poolChainId

  useEffect(() => {
    if (networkMismatch) {
      setTotalWizardSteps(totalWizardSteps + 1)
    } else {
      nextStep()
    }
  }, [])

  return (
    <>
      <Banner gradient={null} className='mb-10 mx-auto text-lg text-highlight-2 bg-card'>
        <img src={IconNetwork} className='inline-block mr-2 w-8' />{' '}
        {t('youreOnTheWrongNetworkSwitchToNetworkName', {
          networkName: getNetworkNiceNameByChainId(poolChainId)
        })}
      </Banner>
      withdraw details
      <Button>
        {t('switchToNetworkName', {
          networkName: getNetworkNiceNameByChainId(poolChainId)
        })}
      </Button>
    </>
  )
}
