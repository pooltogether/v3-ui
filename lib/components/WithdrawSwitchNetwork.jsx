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
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'

import IconNetwork from 'assets/images/icon-network@2x.png'

export function WithdrawSwitchNetwork(props) {
  const { t } = useTranslation()

  const { quantity, nextStep, totalWizardSteps, setTotalWizardSteps, pool } = props

  const { walletName, walletChainId } = useWalletNetwork()

  const poolChainId = pool.chainId
  const tickerUpcased = pool.tokens?.underlyingToken.symbol
  const addNetwork = useAddNetworkToMetamask(poolChainId)
  const networkMismatch = walletChainId !== poolChainId
  const isMetaMask = walletName === 'MetaMask'

  const changingToEthereum = ETHEREUM_NETWORKS.includes(poolChainId)
  console.log({ changingToEthereum })

  const pleaseChangeWalletTranslationKey = isMetaMask
    ? 'openMetaMaskAndSelectEthereumToContinue'
    : 'openYourWalletAndSelectNetworkToContinue'

  console.log(isMetaMask)
  useEffect(() => {
    if (networkMismatch) {
      setTotalWizardSteps(totalWizardSteps + 1)
    }
  }, [])

  useEffect(() => {
    if (!networkMismatch) {
      nextStep()
    }
  }, [walletChainId])

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
        label={t('withdrawTicker', {
          ticker: tickerUpcased
        })}
        pool={pool}
      />
      <WithdrawAndDepositBanner
        label={t('youreWithdrawing')}
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
