import React, { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Button, NetworkIcon } from '@pooltogether/react-components'
import { useIsWalletMetamask } from '@pooltogether/hooks'

import { Banner } from 'lib/components/Banner'
import { ButtonDrawer } from 'lib/components/ButtonDrawer'
import { WithdrawAndDepositPaneTitle } from 'lib/components/WithdrawAndDepositPaneTitle'
import { WithdrawAndDepositBanner } from 'lib/components/WithdrawAndDepositBanner'
import { useAddNetworkToMetamask } from 'lib/hooks/useAddNetworkToMetamask'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

import IconNetwork from 'assets/images/icon-network@2x.png'

export function WizardSwitchNetwork(props) {
  const { t } = useTranslation()

  const { bannerLabel, paneTitleLocizeKey, quantity, nextStep, networkMismatch, pool } = props

  const isMetaMask = useIsWalletMetamask()

  const poolChainId = pool.chainId
  const tickerUpcased = pool.tokens?.underlyingToken.symbol
  const addNetwork = useAddNetworkToMetamask(poolChainId)

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
        symbol={pool.tokens.underlyingToken.symbol}
        address={pool.tokens.underlyingToken.address}
        chainId={pool.chainId}
      />
      <WithdrawAndDepositBanner
        label={bannerLabel}
        quantity={quantity}
        tickerUpcased={tickerUpcased}
      />
      <div className='my-4'></div>

      {isMetaMask && (
        <ButtonDrawer>
          <Button onClick={() => addNetwork()} textSize='lg' className='w-full'>
            <span className='inline-flex items-center justify-center'>
              <NetworkIcon className='mr-2' sizeClassName='w-6 h-6' chainId={poolChainId} />{' '}
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
