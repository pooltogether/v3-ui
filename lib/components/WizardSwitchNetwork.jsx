import React, { useEffect } from 'react'

import { useTranslation } from 'lib/../i18n'
import { ETHEREUM_NETWORKS } from 'lib/constants'
import { Banner } from 'lib/components/Banner'
import { Button } from 'lib/components/Button'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { NetworkIcon } from 'lib/components/NetworkIcon'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { useAddNetworkToMetamask } from 'lib/hooks/useAddNetworkToMetamask'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

import IconNetwork from 'assets/images/icon-network@2x.png'
import { useIsWalletMetamask, useOnboard } from '@pooltogether/hooks'

export function WizardSwitchNetwork(props) {
  const { t } = useTranslation()

  const { bannerLabel, paneTitleLocizeKey, quantity, nextStep, networkMismatch, pool } = props

  const isMetaMask = useIsWalletMetamask()

  const poolChainId = pool.chainId
  const tickerUpcased = pool.tokens?.underlyingToken.symbol
  const addNetwork = useAddNetworkToMetamask(poolChainId)

  const changingToEthereum = ETHEREUM_NETWORKS.includes(poolChainId)

  const pleaseChangeWalletTranslationKey = isMetaMask
    ? 'openMetaMaskAndSelectEthereumToContinue'
    : 'openYourWalletAndSelectNetworkToContinue'

  useEffect(() => {
    if (!networkMismatch) {
      nextStep()
    }
  }, [networkMismatch])

  return (
    <>
      <div
        className='wizard-fixed-top-banner absolute l-0 r-0 mx-auto w-full'
        style={{
          height: 300,
          top: 100
        }}
      >
        <Banner
          gradient={null}
          className='w-full flex items-center justify-center mx-auto text-xs sm:text-lg text-highlight-2 bg-card mx-auto text-center'
        >
          <img src={IconNetwork} className='inline-block mr-2 w-8' />{' '}
          {t('youreOnTheWrongNetworkSwitchToNetworkName', {
            networkName: getNetworkNiceNameByChainId(poolChainId)
          })}
        </Banner>
      </div>
      <WithdrawAndDepositPaneTitle
        label={t(paneTitleLocizeKey, {
          ticker: tickerUpcased
        })}
        pool={pool}
      />
      <WithdrawAndDepositBanner
        label={bannerLabel}
        quantity={quantity}
        tickerUpcased={tickerUpcased}
      />
      <div className='my-4'></div>

      {changingToEthereum && (
        <div className='text-green font-bold text-xl w-96 mx-auto'>
          {t(pleaseChangeWalletTranslationKey, {
            networkName: getNetworkNiceNameByChainId(poolChainId)
          })}
        </div>
      )}

      {isMetaMask && !changingToEthereum && (
        <ButtonDrawer>
          <Button onClick={() => addNetwork()} textSize='lg' className='w-full'>
            <span className='inline-flex items-center justify-center'>
              <NetworkIcon className='mr-2' sizeClasses='w-6 h-6' chainId={poolChainId} />{' '}
              {t('switchToNetworkName', {
                networkName: getNetworkNiceNameByChainId(poolChainId)
              })}
            </span>
          </Button>
        </ButtonDrawer>
      )}
    </>
  )
}
