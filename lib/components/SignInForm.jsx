import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'

import PoolTogetherTrophyDetailed from 'assets/images/pooltogether-trophy--detailed.svg'

export const SignInForm = (props) => {
  // const { handleSubmit, register, errors, formState } = useForm({ mode: 'onBlur' })

  const { postSignInCallback } = props

  const authControllerContext = useContext(AuthControllerContext)

  // const onSubmit = (values) => {
  //   if (formState.isValid) {
  //     authControllerContext.signInMagic(values.email, postSignInCallback)
  //   }
  // }

  return <>
    <div
      className='text-inverse'
    >
      <img
        src={PoolTogetherTrophyDetailed}
        className='mx-auto mb-6 w-16 xs:w-1/12'
      />
      <h4 className='mb-10 xs:w-2/3 sm:w-1/2 lg:w-7/12 mx-auto'>
        Connect an Ethereum wallet to manage your PoolTogether tickets &amp; rewards:
      </h4>

      <Button
        textSize='xl'
        onClick={(e) => {
          e.preventDefault()
          authControllerContext.connectWallet(postSignInCallback)
        }}
      >
        Connect Wallet
      </Button>


      <PTHint
        title='Ethereum'
        className='mt-4 block mx-auto'

        tip={<>
          <div className='my-2 text-xs sm:text-sm'>
            Ethereum is a global, open-source platform for decentralized applications.
          </div>
          <div
            className='text-xs sm:text-sm'
          >
            On Ethereum, you can write code that controls digital value, runs exactly as programmed, and is accessible anywhere in the world.
          </div>
        </>}
      >
        <span
          className='font-bold text-caption'
        >
          What's an Ethereum?
        </span>
      </PTHint>
    </div>

    {/* <div
      className='font-bold mb-2 py-2 text-xl sm:text-3xl lg:text-5xl text-inverse'
    >
      Enter your email address to continue.
    </div>

    <form
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className='w-full xs:w-10/12 sm:w-2/3 mx-auto'>
        <TextInputGroup
          id='email'
          name='email'
          type='email'
          register={register}
          label={'Email address:'}
          placeholder='Your email'
          required='Email address required'
        />
      </div>
      <div className='text-red'>
        {errors.email && errors.email.message}
      </div>

      <div
        className='my-5'
      >
        <Button
          textSize='xl'
          disabled={!formState.isValid}
          // type='submit'
        >
          Continue
        </Button>
      </div>
    </form> 

    <div>
      <button
        onClick={(e) => {
          e.preventDefault()
          authControllerContext.connectWallet(postSignInCallback)
        }}
        className='font-bold inline mb-2 py-2 text-sm sm:text-base text-primary-soft hover:text-primary trans border-b-2 border-transparent hover:border-secondary'
      >
        or connect to MetaMask, etc.
      </button>
    </div>
    */}
  </>
}
