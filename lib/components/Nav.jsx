import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { MagicContext } from 'lib/components/contextProviders/MagicContextProvider'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { Button } from 'lib/components/Button'
import { ThemeSwitcher } from 'lib/components/ThemeSwitcher'

// import PoolLogo from 'assets/images/pooltogether-white-wordmark.svg'

import PoolLogoDark from 'assets/images/pooltogether-logo-black.svg'
import PoolLogo from 'assets/images/pooltogether-logo.svg'

// import PoolLogo from 'assets/images/trophy-outline-white.svg'
// import PoolLogo from 'assets/images/trophy.svg'

export const Nav = (props) => {
  const router = useRouter()
  const walletContext = useContext(WalletContext)
  const usersAddress = walletContext._onboard.getState().address
  const magicContext = useContext(MagicContext)
  const { magic, signedIn } = magicContext

  const handleShowDashboard = (e) => {
    e.preventDefault()

    router.push('/dashboard')
  }

  const handleShowSignIn = (e) => {
    e.preventDefault()

    router.push(
      `${router.pathname}?signIn=1`,
      `${router.asPath}?signIn=1`, {
        shallow: true
      }
    )
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
            >&nbsp;</a>
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
            {(magic && signedIn) || usersAddress ?
              <Button
                outline
                onClick={handleShowDashboard}
              >
                Account
              </Button> :
              <Button
                outline
                onClick={handleShowSignIn}
              >
                Sign in
              </Button>
            }
            <Button
              outline
              onClick={handleShowSignIn}
            >
              Sign in
              </Button>
          </div>
        </div>
      </nav>
    </div>
  </>
    
}
