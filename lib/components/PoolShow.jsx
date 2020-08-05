import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import FeatherIcon from 'feather-icons-react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { SHOW_AWARD_FEATURES } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { PoolStats } from 'lib/components/PoolStats'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { PrizePoolCountdown } from 'lib/components/PrizePoolCountdown'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

// const renderErrorMessage = (
//   address,
//   type,
//   message
// ) => {
//   const errorMsg = `Error fetching ${type} for prize pool with address: ${address}: ${message}. (maybe wrong Ethereum network?)`

//   console.error(errorMsg)
//   poolToast.error(errorMsg)
// }

export const PoolShow = (
  props,
) => {
  const router = useRouter()
  const { pool } = props

  const symbol = pool?.symbol

  const authControllerContext = useContext(AuthControllerContext)
  const { ethBalance, usersAddress } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { poolAddresses } = poolDataContext
  
  let error
  
  try {
    ethers.utils.getAddress(pool.poolAddress)
  } catch (e) {
    error = 'Incorrectly formatted Ethereum address!'
  }
  
  if (!pool) {
    // console.warn("don't do this!")
    return null
  }

  const cookieShowAward = Cookies.get(SHOW_AWARD_FEATURES)

  const handleShowDeposit = (e) => {
    e.preventDefault()

    let pathname = router.pathname
    let asPath = router.asPath

    if (!/deposit/.test(asPath)) {
      // console.log('not on deposit so adding deposit to url')
      queryParamUpdater.removeAll(router)
      pathname = `${router.pathname}/deposit`
      asPath = `${router.asPath}/deposit`
    }

    router.push(
      pathname,
      asPath,
      {
        shallow: true
      }
    )
  }

  return <>
    <motion.div
      // layoutId={`pool-container-${poolId}`}
      initial='initial'
      animate='enter'
      exit='exit'
      variants={{
        exit: {
          scale: 0.9,
          y: 10,
          opacity: 0,
          transition: {
            duration: 0.5,
            staggerChildren: 0.1
          }
        },
        enter: {
          transition: {
            duration: 0.5,
            staggerChildren: 0.1
          }
        },
        initial: {
          y: 0,
          opacity: 1,
          transition: {
            duration: 0.2
          }
        }
      }}
    >
      {error}
      
        <>
          <div
            className='flex flex-col sm:flex-row justify-between items-center'
          >
            <div
              className='flex items-center w-full sm:w-1/2'
            >
              <div
                className='inline-block text-left text-xl sm:text-2xl lg:text-3xl font-bold'
              >
                {pool.name}
              </div>

              <div
                className='inline-flex items-center ml-4'
              >
                <CurrencyAndYieldSource
                  {...props}
                />
              </div>
            </div>

            <div
              className='flex w-full sm:w-1/2 sm:justify-end items-center mt-4 sm:mt-0'
            >
              {cookieShowAward && <>
                <div className='flex flex-col'>
                  <Button
                    outline
                    href='/pools/[symbol]/manage'
                    as={`/pools/${symbol}/manage`}
                    className='mr-3 flex-grow'
                  >
                    <FeatherIcon
                      icon='settings'
                      className='w-8 h-8'
                      strokeWidth='2'
                    />
                  </Button>
                </div>
              </>}

              <Button
                wide
                size='lg'
                onClick={handleShowDeposit}
              >
                Get tickets
              </Button>
            </div>
          </div>


          <div className='text-left mt-10'>
            <PrizeAmount
              {...props}
              big
            />
            <div
              className='flex items-center my-1'
            >
              <PrizePoolCountdown
                pool={pool}
              />
            </div>
          </div>

          <PoolStats
            {...props}
          />

          <div
            className='relative py-4 sm:py-2 text-center rounded-lg'
          >
            {/* {ethBalance && ethBalance.eq(0) && <>
              <FormLockedOverlay
                flexColJustifyClass='justify-start'
                title={`Deposit & Withdraw`}
                zLayerClass='z-30'
              >
                <>
                  Your ETH balance is 0.
                  <br />To interact with the contracts you will need ETH.
                </>
              </FormLockedOverlay>
            </>} */}
          </div>
        </>
        {/* } */}
      </motion.div>
  </>
}
