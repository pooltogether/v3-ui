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
        className='sm:px-8 lg:px-0 nav-min-height flex items-center h-full justify-between flex-wrap'
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
              className='pool-logo border-0 mr-auto trans block'
              style={{
                height: 60,
                width: 151
              }}
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
          <ThemeSwitcher />

          <div
            className='mt-0 sm:mt-0 text-xxs sm:text-sm tracking-wide text-right spinner-hidden'
          >
            {usersAddress ?
              <WalletInfo
                {...props}
              /> :
              <button
                className='rounded-full text-green-300 border-2 border-green-300 hover:text-white hover:bg-lightPurple-1000 text-xxs sm:text-base pt-2 pb-2 px-3 sm:px-6 trans'
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
