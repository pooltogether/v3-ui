import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { AccountButton } from 'lib/components/AccountButton'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { ThemeSwitcher } from 'lib/components/ThemeSwitcher'
import { TransactionsUI } from 'lib/components/TransactionsUI'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

export const Nav = (props) => {
  const router = useRouter()

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  const handleShowSignIn = (e) => {
    e.preventDefault()

    queryParamUpdater.add(router, { signIn: 1 })
  }

  return <>
    <div className='nav-and-footer-container'>
      <nav
        className='nav-min-height flex items-center h-full justify-between flex-wrap'
      >
        <div
          className='nav--pool-logo-container w-1/5 justify-start h-full flex items-center truncate'
        >
          <Link
            href='/'
            as='/'
            shallow
          >
            <a
              title={'Back to home'}
              className='pool-logo border-0 trans block w-full'
            />
          </Link>
        </div>

        <div
          className='nav--account-controls-container w-4/5 flex justify-end h-full items-center text-right'
        >

          <div className='mr-2 sm:mr-4'>
            <ThemeSwitcher />
          </div>

          {usersAddress && <TransactionsUI />}

          <Link
            href='/prizes/[symbol]'
            as='/prizes/PT-cDAI'
            shallow
          >
            <a
              className='font-bold text-secondary hover:text-blue text-xxs sm:text-base py-1 sm:py-2 px-3 sm:px-6 trans tracking-wider outline-none focus:outline-none active:outline-none'
            >Prizes</a>
          </Link>

          <div
            className='text-xxs sm:text-sm text-right'
          >
            {usersAddress ?
              <AccountButton
                usersAddress={usersAddress}
              /> :
              <Button
                outline
                onClick={handleShowSignIn}
              >
                Sign in
              </Button>
            }
          </div>
        </div>
      </nav>
    </div>
  </>
    
}
