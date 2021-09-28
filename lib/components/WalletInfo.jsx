import React from 'react'
import Link from 'next/link'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { NetworkIcon } from '@pooltogether/react-components'

import { useTranslation } from 'react-i18next'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'

export function WalletInfo (props) {
  const { t } = useTranslation()
  const { closeTransactions } = props

  const { address: usersAddress, network: chainId, disconnectWallet, walletName } = useOnboard()
  const { network: walletChainId } = useOnboard()

  let content = null
  let networkName = null

  if (chainId) {
    networkName = <span className={'inline-block'}>{getNetworkNiceNameByChainId(chainId)}</span>
  }

  if (usersAddress && walletName) {
    content = (
      <>
        <div className='flex flex-col w-full justify-between'>
          <div className='flex flex-col w-full text-xxs sm:text-lg lg:text-xl leading-snug trans'>
            <div className='text-xxs xs:text-xs uppercase font-bold text-accent-3'>
              {t('accountAddress')}
            </div>
            <div className='flex justify-between items-center sm:text-xs lg:text-sm text-default mt-1 mb-2 sm:mb-4'>
              <BlockExplorerLink chainId={walletChainId} address={usersAddress} shorten />
              <Link href='/account' as='/account' shallow>
                <a
                  onClick={(e) => {
                    closeTransactions()
                  }}
                  className='inline-block text-xxs bg-body rounded-full border-2 border-accent-4 px-2 trans trans-fastest font-bold'
                >
                  {t('yourTicketsAndRewards')}
                </a>
              </Link>
            </div>

            <div className='my-2'>
              <div className='text-xxs xs:text-xs uppercase font-bold text-accent-3'>
                {t('connectedTo')}
              </div>
              <div className='flex justify-between items-center sm:text-xs lg:text-sm text-default mt-1 mb-2 sm:mb-4'>
                <div className='flex items-center'>
                  <NetworkIcon sizeClassName='h-5 w-5' chainId={chainId} />
                  <span className={`capitalize mx-1 text-${networkTextColorClassname(chainId)}`}>
                    {networkName}
                  </span>
                  {walletName}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()

                    closeTransactions()
                    disconnectWallet()
                  }}
                  className='inline-block text-xxs bg-body rounded-full border-2 border-accent-4 px-2 trans trans-fastest font-bold'
                >
                  {t('changeAccount')}
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }

  return content
}
