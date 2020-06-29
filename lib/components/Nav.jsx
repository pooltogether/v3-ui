import React, { useContext } from 'react'
import Link from 'next/link'

import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { ThemeSwitcher } from 'lib/components/ThemeSwitcher'
import { WalletInfo } from 'lib/components/WalletInfo'

// import PoolLogo from 'assets/images/pooltogether-white-wordmark.svg'

import PoolLogoDark from 'assets/images/pooltogether-logo-black.svg'
import PoolLogo from 'assets/images/pooltogether-logo.svg'

// import PoolLogo from 'assets/images/trophy-outline-white.svg'
// import PoolLogo from 'assets/images/trophy.svg'

export const Nav = (props) => {
  const walletContext = useContext(WalletContext)
  const usersAddress = walletContext._onboard.getState().address

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }
  
  return <>
    <div className='nav-and-footer-container'>
      <nav
        className='sm:px-4 lg:px-0 nav-min-height flex items-center h-full justify-between flex-wrap'
      >
        <div
          className='w-3/5 lg:w-2/5 justify-start h-full flex items-center truncate'
        >
          <Link
            href='/'
            as='/'
          >
            <a
              title={'Back to home'}
              className='pool-logo border-0 trans block w-full'
            >
              {/* <img
                alt={`PoolTogether Logo`}
                src={PoolLogoDark}
                className='pool-logo-dark mr-auto w-32 trans'
              />
              <img
                alt={`PoolTogether Logo`}
                src={PoolLogo}
                className='pool-logo mr-auto w-32 trans'
              /> */}
            </a>
          </Link>
        </div>

        <div
          className='w-2/5 lg:w-3/5 flex justify-end h-full items-center text-right'
        >
          <div className='mr-4'>
            <ThemeSwitcher />
          </div>

          <div
            className='mt-0 sm:mt-0 text-xxs sm:text-sm text-right spinner-hidden'
            style={{
              minWidth: 70
            }}
          >
            {usersAddress ?
              <WalletInfo
                {...props}
              /> :
              <button
                className='rounded-full text-secondary border-2 border-secondary hover:text-inverse hover:bg-primary text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider'
                onClick={handleConnect}
              >
                Sign in
              </button>
            }
          </div>
        </div>
      </nav>
    </div>
  </>
    
}
