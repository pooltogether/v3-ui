import React, { useContext } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import { AccountButton } from 'lib/components/AccountButton'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { ThemeSwitcher } from 'lib/components/ThemeSwitcher'
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
        className='sm:px-4 lg:px-0 nav-min-height flex items-center h-full justify-between flex-wrap'
      >
        <div
          className='w-2/5 justify-start h-full flex items-center truncate'
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
          className='w-3/5 flex justify-end h-full items-center text-right'
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
