import React, { useState } from 'react'

import { useTranslation } from 'react-i18next'
import { ETHEREUM_NETWORKS } from 'lib/constants'
import { Modal } from 'lib/components/Modal'
import { NetworkIcon } from 'lib/components/NetworkIcon'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { useAddNetworkToMetamask } from 'lib/hooks/useAddNetworkToMetamask'
import { useEnvChainIds } from 'lib/hooks/chainId/useEnvChainIds'
import {
  APP_ENVIRONMENT,
  useAppEnv,
  useIsWalletOnSupportedNetwork,
  useOnboard
} from '@pooltogether/hooks'

export function WrongNetworkModal(props) {
  const { t } = useTranslation()

  const [bypassed, setBypassed] = useState(false)

  const { appEnv, setAppEnv } = useAppEnv()
  const chainIds = useEnvChainIds()
  const { network: walletChainId, walletName, networkName } = useOnboard()
  const isMetaMask = walletName === 'MetaMask'

  const handleClose = (e) => {
    e.preventDefault()

    setBypassed(true)
  }

  const supportedNetwork = useIsWalletOnSupportedNetwork(chainIds)

  if (!walletChainId || !supportedNetwork) {
    return null
  }

  return (
    <>
      {bypassed && (
        <>
          <div
            className='r-0 l-0 fixed w-10/12 sm:w-1/4 bg-red px-4 py-2 font-bold mx-auto text-center rounded-lg z-50 text-white capitalize'
            style={{
              bottom: '10vh'
            }}
          >
            {t('unsupportedNetwork')} {networkName}
          </div>
        </>
      )}

      <Modal
        handleClose={handleClose}
        visible={!supportedNetwork && !bypassed}
        header={t('ethereumNetworkMismatch')}
      >
        {t('yourEthereumNetworkIsUnsupported')}{' '}
        <div className='flex flex-col items-start justify-start text-center mt-2'>
          {chainIds.map((chainId) => {
            const changingToEthereum = ETHEREUM_NETWORKS.includes(chainId)

            return (
              <div
                key={`network-${getNetworkNiceNameByChainId(chainId)}`}
                className={`flex items-center text-${networkTextColorClassname(chainId)} mt-2`}
              >
                <span className='flex items-center capitalize font-bold'>
                  <NetworkIcon
                    className='inline-block mr-2'
                    sizeClasses='w-4 h-4'
                    chainId={chainId}
                  />{' '}
                  {getNetworkNiceNameByChainId(chainId)}
                </span>
                <span className='opacity-20 text-inverse mx-2'> (chainId: {chainId})</span>
                {isMetaMask && !changingToEthereum && (
                  <span>
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        const switchNetworkFxn = useAddNetworkToMetamask(chainId)
                        switchNetworkFxn()
                      }}
                    >
                      {t('switch')}
                    </button>
                  </span>
                )}
              </div>
            )
          })}
        </div>
        {appEnv === APP_ENVIRONMENT.testnets && (
          <div className='mt-20'>
            The app settings are set to testnets.{' '}
            <button
              onClick={(e) => {
                e.preventDefault()
                setAppEnv(APP_ENVIRONMENT.mainnets)
              }}
            >
              Switch to mainnets
            </button>
          </div>
        )}
      </Modal>
    </>
  )
}
