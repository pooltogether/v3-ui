import React, { useContext } from 'react'
import Link from 'next/link'

import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { NetworkIcon } from 'lib/components/NetworkIcon'
import { useWalletNetwork } from 'lib/hooks/useWalletNetwork'
import { getNetworkNiceNameByChainId } from 'lib/utils/networks'
import { shorten } from 'lib/utils/shorten'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'

export function WalletInfo(props) {
  const { t } = useTranslation()
  const { closeTransactions } = props

  const { usersAddress, chainId, signOut, walletName } = useContext(AuthControllerContext)
  const { walletChainId } = useWalletNetwork()

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
              <BlockExplorerLink chainId={walletChainId} address={usersAddress}>
                {shorten(usersAddress)}
              </BlockExplorerLink>
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
                  <NetworkIcon sizeClasses='h-5 w-5' chainId={chainId} />
                  <span className={`capitalize mx-1 text-${networkTextColorClassname(chainId)}`}>
                    {networkName}
                  </span>
                  {walletName}
                </div>
                <button
                  onClick={(e) => {
                    e.preventDefault()

                    closeTransactions()
                    signOut()
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
