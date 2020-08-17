import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { SHOW_MANAGE_LINKS } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { ButtonLink } from 'lib/components/ButtonLink'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolStats } from 'lib/components/PoolStats'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { queryParamUpdater } from 'lib/utils/queryParamUpdater'

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
    console.error(e)
    if (e.message.match('invalid address')) {
      error = 'Incorrectly formatted Ethereum address!'
    }
  }
  
  if (!pool) {
    console.warn("don't do this!")
    return null
  }

  const cookieShowAward = Cookies.get(SHOW_MANAGE_LINKS)

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
            className='flex flex-col sm:flex-row justify-between sm:items-center'
          >
            <PoolCurrencyIcon
              xl
              pool={pool}
            />
            
            <div
              className='flex flex-col items-start justify-between w-full sm:w-full ml-6 leading-none'
            >
              <div
                className='inline-block text-left text-xl sm:text-3xl font-bold text-accent-2 relative'
                style={{
                  top: -6
                }}
              >
                {pool?.name}
              </div>
              <div
                className='inline-block text-left text-caption-2 relative'
                style={{
                  left: 2,
                  bottom: -4
                }}
              >
                <Link
                  href='/'
                  as='/'
                  shallow
                >
                  <a
                    className='underline uppercase'
                  >
                    Pools
                  </a>
                </Link> &gt; <span
                    className='uppercase'
                  >
                    {pool?.name}
                  </span>
              </div>
            </div>

            <div
              className='flex w-full sm:justify-end items-start mt-4 sm:mt-0'
            >
              <ButtonLink
                width='w-full xs:w-1/2 sm:w-10/12 lg:w-8/12'
                textSize='lg'
                border='highlight-1'
                text='secondary'
                bg='highlight-1'
                hoverBorder='highlight-1'
                hoverText='secondary'
                hoverBg='highlight-1'
                href='/pools/[symbol]/deposit'
                as={`/pools/${symbol}/deposit`}
                onClick={handleShowDeposit}
              >
                Get tickets
              </ButtonLink>
            </div>
          </div>

          <div
            className='bg-highlight-3 rounded-lg px-6 pt-4 pb-6 text-white my-8 sm:mt-20 sm:mb-12 border-flashy mx-auto'
          >
            <div
              className='flex justify-between'
            >
              <div
                className='w-full sm:w-1/2'
              >
                <h2>
                  Prize ${displayAmountInEther(
                    pool?.estimatePrize || 0,
                    { decimals: pool?.underlyingCollateralDecimals, precision: 0 }
                  )} {pool?.underlyingCollateralSymbol?.toUpperCase()}
                </h2>
              </div>

              <div
                className='flex flex-col items-end justify-center w-4/12 sm:w-9/12 lg:w-9/12'
              >
                <NewPrizeCountdown
                  pool={pool}
                />
              </div>
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

        {usersAddress && cookieShowAward && <>
          <div
            className='text-center'
          >
            <ButtonLink
              border='highlight-1'
              text='secondary'
              bg='highlight-1'
              hoverBorder='highlight-2'
              hoverText='green'
              hoverBg='purple'
              href='/pools/[symbol]/manage'
              as={`/pools/${symbol}/manage`}
            >
              Manage pool
            </ButtonLink>
          </div>
        </>}
      </motion.div>
  </>
}
