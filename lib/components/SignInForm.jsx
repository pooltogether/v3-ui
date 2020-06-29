import React, { useContext, useState } from 'react'
import Link from 'next/link'
import Cookies from 'js-cookie'
import { useRouter } from 'next/router'
import { Magic, RPCError, RPCErrorCode } from 'magic-sdk'

import {
  COOKIE_OPTIONS,
  MAGIC_EMAIL,
  MAGIC_IS_LOGGED_IN
} from 'lib/constants'
import { WalletContext } from 'lib/components/contextProviders/WalletContextProvider'
import { Button } from 'lib/components/Button'
import { TextInputGroup } from 'lib/components/TextInputGroup'
import { poolToast } from 'lib/utils/poolToast'

const validator = require('email-validator')

export const SignInForm = (props) => {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isValid, setIsValid] = useState(null)

  const walletContext = useContext(WalletContext)

  const handleConnect = (e) => {
    e.preventDefault()

    walletContext.handleConnectWallet()
  }

  const signIn = async (e) => {
    // const { elements } = event.target

    // const magic = new Magic('API_KEY', {
    //   network: { rpcUrl: 'https://...' }
    // });
    const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

    const magic = new Magic(
      process.env.NEXT_JS_MAGIC_PUB_KEY,
      { network: networkName === 'homestead' ? 'mainnet' : networkName }
    )

    console.log({ email})

    let did
    try {
      did = await magic
        .auth
        .loginWithMagicLink({ email })


      // magic.user.updateEmail({ email, showUI?= true })
      // console.log(magic.user)
      // console.log(await magic.user.getIdToken())
      // console.log(magic.user.generateIdToken)

      // const { email, publicAddress } = await magic.user.getMetadata()
      // console.log(email, publicAddress)

      console.log('isLoggedIn', await magic.user.isLoggedIn())
      // console.log(await magic.user.logout())

      
      const web3 = new Web3(magic.rpcProvider)
      console.log({ web3 })

      Cookies.set(
        MAGIC_EMAIL,
        email,
        COOKIE_OPTIONS
      )

      Cookies.set(
        MAGIC_IS_LOGGED_IN,
        true,
        COOKIE_OPTIONS
      )

      router.push(
        `${router.pathname}`,
        `${router.asPath}`, {
          shallow: true
        }
      )
    } catch (err) {
      console.error(err)
      poolToast.error(err.message)

      if (err instanceof RPCError) {
        switch (err.code) {
          case RPCErrorCode.MagicLinkFailedVerification:
            break
          case RPCErrorCode.MagicLinkExpired:
            break
          case RPCErrorCode.MagicLinkRateLimited:
            break
          case RPCErrorCode.UserAlreadyLoggedIn:
            break
        }
      }
    }

  }

  const testEmail = () => {
    setIsValid(validator.validate(email))
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    testEmail()

    if (isValid) {
      signIn()
    }
  }

  const handleEmailChange = (e) => {
    setEmail(e.target.value)

    testEmail()
  }

  return <>
    <div
      id='signin-container'
      className='fixed t-0 l-0 r-0 b-0 w-full h-full z-40 bg-primary'
    >
      <div className='nav-and-footer-container'>
        <nav
          className='sm:px-4 lg:px-0 pt-4 nav-min-height flex items-center h-full justify-between flex-wrap'
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
                
              </a>
            </Link>
          </div>
        </nav>
      </div>

      <div className='h-full flex flex-col justify-center p-4 sm:p-32 lg:p-64 text-center'>
        <form
          onSubmit={handleSubmit}
          className='-mt-48'
        >
          <div
            className='font-bold mb-2 py-2 text-xl sm:text-3xl lg:text-5xl text-inverse'
          >
            Sign in.
          </div>

          <div
            className='mb-2 py-2 text-sm sm:text-base text-default-soft'
          >
            Enter your email address to continue:
          </div>

          <TextInputGroup
            id='email'
            label={''}
            placeholder='Your email'
            required
            type='email'
            onChange={handleEmailChange}
            value={email}
            onBlur={testEmail}
          />

          <div
            className='my-5'
            disabled={!email}
          >
            <Button
              wide
              disabled={!isValid}
            >
              Sign in
            </Button>
          </div>
        </form>

        <div>
          <button
            onClick={handleConnect}
            className='font-bold inline mb-2 py-2 text-sm sm:text-base text-primary-soft hover:text-primary trans border-b-2 border-transparent hover:border-secondary'
          >
            or connect to MetaMask, etc.
          </button>
        </div>

      </div>
    </div>
  </>
}
