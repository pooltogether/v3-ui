import React, { useContext } from 'react'
import classnames from 'classnames'
import Link from 'next/link'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { networkColorClassname } from 'lib/utils/networkColorClassname'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { shorten } from 'lib/utils/shorten'

export const WalletInfo = (props) => {
  const { closeTransactions } = props

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, chainId, walletName } = authControllerContext

  let content = null
  let networkName = null

  if (chainId) {
    networkName = <span
      className={classnames(
        networkColorClassname(chainId),
        'inline-block'
      )}
    >
      {chainIdToName(chainId)}
    </span>
  }

  if (usersAddress && walletName) {
    content = <>
      <div
        className='flex flex-col w-full justify-between'
      > 
        <div className='flex flex-col text-xxs sm:text-lg lg:text-xl leading-snug trans'>
          <div
            className='sm:mr-10 lg:mr-20'
          >
            <h6>
              Address:
            </h6>
            <div
              className='overflow-ellipsis w-full no-underline sm:text-xs lg:text-sm text-default-soft mb-2 sm:mb-4'
            >
              <div className='block lg:hidden'>
                {shorten(usersAddress)}
              </div>
              <div className='hidden lg:block'>
                {usersAddress}
              </div>
              <div
              >
                <Link
                  href='/account'
                  as='/account'
                  shallow
                >
                  <a
                    onClick={(e) => {
                      closeTransactions()
                    }}
                    className='inline-block text-highlight-1 hover:text-green underline trans'
                  >
                    View your holdings
                  </a>
                </Link>
              </div>
            </div>
          </div>

          <div
            className='sm:mr-10 lg:mr-20 my-2'
          >
            <h6>
              Connected to
            </h6>
            <div
              className='rounded-lg capitalize sm:text-xs lg:text-sm text-default-soft mb-2 sm:mb-4'
            >
              {walletName} - <button
                onClick={(e) => {
                  e.preventDefault()

                  closeTransactions()
                  authControllerContext.signOut()
                }}
                className='inline-block text-highlight-1 hover:text-green underline trans trans-faster'
              >
                Change account
              </button>
            </div>
          </div>

          <div
            className='sm:mr-10 lg:mr-20 mb-2'
          >
            <h6>
              Network
            </h6>
            <div
              className='rounded-lg capitalize sm:text-xs lg:text-sm text-default-soft'
            >
              {networkName}
            </div>
          </div>
        </div>
      </div>
    </>
  }

  return content

}
