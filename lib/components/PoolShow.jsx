import React, { useContext } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Button } from 'lib/components/Button'
import { CurrencyAndYieldSource } from 'lib/components/CurrencyAndYieldSource'
import { PoolActionsUI } from 'lib/components/PoolActionsUI'
import { PrizeAmount } from 'lib/components/PrizeAmount'
import { poolToast } from 'lib/utils/poolToast'
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

  const authControllerContext = useContext(AuthControllerContext)
  const { ethBalance, usersAddress } = authControllerContext

  const poolDataContext = useContext(PoolDataContext)
  const { poolAddresses } = poolDataContext
  
  let error
  
  try {
    ethers.utils.getAddress(pool.id)
  } catch (e) {
    error = 'Incorrectly formatted Ethereum address!'
  }
  
  // const tokenSvg = genericChainData.underlyingCollateralSymbol === 'DAI' ?
  //   DaiSvg :
  //   genericChainData.underlyingCollateralSymbol === 'USDC' ?
  //     UsdcSvg :
  //     UsdtSvg

  if (!pool) {
    // console.warn("don't do this!")
    return null
  }

  const handleShowDeposit = (e) => {
    e.preventDefault()

    let pathname = router.pathname
    let asPath = router.asPath

    // console.log('******************************');
    
    // console.log({pathname})
    // console.log({asPath})

    if (!/deposit/.test(asPath)) {
      // console.log('not on deposit so adding deposit to url')

      queryParamUpdater.removeAll(router)
      pathname = `${router.pathname}/deposit`
      asPath = `${router.asPath}/deposit`
    }

    // console.log('pushing to')
    // console.log({ pathname});
    // console.log({ asPath});
    

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
            className='px-2 py-4 sm:py-2 text-center rounded-lg'
          >
            <div
              className='flex flex-col sm:flex-row justify-between items-center'
            >
              <div
                className='flex items-center w-full sm:w-1/2'
              >
                <div
                  className='inline-block text-left text-lg sm:text-xl font-bold'
                >
                  {pool.frequency} Pool
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
                className='flex sm:justify-end items-center w-full sm:w-1/2 mt-4 sm:mt-0'
              >
                <Button
                  onClick={handleShowDeposit}
                  wide
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
            </div>

            <PoolActionsUI
              poolAddresses={poolAddresses}
              usersAddress={usersAddress}
            />
          </div>

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
