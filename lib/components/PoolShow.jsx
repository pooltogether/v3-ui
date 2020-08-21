import React, { useContext } from 'react'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { ethers } from 'ethers'
import { motion } from 'framer-motion'

import { useTranslation } from 'lib/../i18n'
import { SHOW_MANAGE_LINKS } from 'lib/constants'
import { ButtonLink } from 'lib/components/ButtonLink'
import { CardGrid } from 'lib/components/CardGrid'
import { LastWinnersListing } from 'lib/components/LastWinnersListing'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

import CompoundFinanceIcon from 'assets/images/icon-compoundfinance.svg'
import PrizeStrategyIcon from 'assets/images/icon-prizestrategy@2x.png'
import TicketsIcon from 'assets/images/icon-ticket@2x.png'
import PlayersIcon from 'assets/images/players@2x.png'
import YieldSourceIcon from 'assets/images/icon-yieldsource@2x.png'
import TotalAwardedIcon from 'assets/images/icon-total@2x.png'
import PrizeIcon from 'assets/images/icon-prize@2x.png'

export const PoolShow = (
  props,
) => {
  const [t] = useTranslation()
  const { pool } = props

  const symbol = pool?.symbol

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

  // const handleShowDeposit = (e) => {
  //   e.preventDefault()

  //   let pathname = router.pathname
  //   let asPath = router.asPath

  //   if (!/deposit/.test(asPath)) {
  //     // console.log('not on deposit so adding deposit to url')
  //     queryParamUpdater.removeAll(router)
  //     pathname = `${router.pathname}/deposit`
  //     asPath = `${router.asPath}/deposit`
  //   }

  //   router.push(
  //     pathname,
  //     asPath,
  //     {
  //       shallow: true
  //     }
  //   )
  // }

  const player = 'a'
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
            className='flex flex-col xs:flex-row justify-between xs:items-center'
          >
            <div
              className='flex justify-between items-center xs:w-3/4 sm:w-3/4'
            >
              <PoolCurrencyIcon
                xl
                pool={pool}
              />
              
              <div
                className='flex flex-col items-start justify-between w-full ml-1 sm:ml-6 leading-none'
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
            </div>

            <div
              className='flex w-full xs:justify-end items-start mt-4 xs:mt-0'
            >
              <ButtonLink
                width='w-full xs:w-9/12 sm:w-8/12 lg:w-6/12'
                textSize='lg'
                href='/pools/[symbol]/deposit'
                as={`/pools/${symbol}/deposit`}
              >
                {t('getTickets')}
              </ButtonLink>
            </div>
          </div>

          <div
            className='bg-highlight-3 rounded-lg px-6 pt-4 pb-6 text-white my-8 sm:mt-20 sm:mb-12 border-flashy mx-auto'
          >
            <div
              className='flex items-center justify-between'
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
                className='flex flex-col items-end justify-center pt-4 w-4/12 sm:w-9/12 lg:w-9/12'
              >
                <NewPrizeCountdown
                  pool={pool}
                  flashy={false}
                />
              </div>
            </div>
          </div>

          <CardGrid
            cardGroupId='pool-cards'
            cards={[
              {
                icon: PlayersIcon,
                title: 'Players',
                content: <>
                  <h3>
                    {pool?.playerCount}
                  </h3>
                </>
              },
              {
                icon: TicketsIcon,
                title: 'Tickets sold',
                content: <>
                  <h3>
                    ${displayAmountInEther(pool.totalSupply, {
                      precision: 0,
                      decimals: pool.underlyingCollateralDecimals
                    })} {pool.underlyingCollateralSymbol}
                  </h3>
                </>
              },
              {
                icon: YieldSourceIcon,
                title: 'Yield source',
                content: <>
                  <h6
                    className='flex items-center'
                  >
                    <img
                      src={CompoundFinanceIcon}
                      className='inline-block mr-2 w-6 h-6 sm:w-10 sm:h-10'
                      alt={`compound finance's logo`}
                    /> Compound Finance
                  </h6>
                </>
              },
              {
                icon: PrizeStrategyIcon,
                title: 'Prize strategy',
                content: <>
                  <h6>
                    Each week, one randomly chosen winner wins that week's prize
                  </h6>
                </>
              },
              {
                icon: TotalAwardedIcon,
                title: 'Total awarded',
                content: <>
                  <h3>
                    ${displayAmountInEther(pool.totalSupply, {
                      precision: 0,
                      decimals: pool.underlyingCollateralDecimals
                    })} {pool.underlyingCollateralSymbol}
                  </h3>
                  
                  <br /> <Link
                    href='/prizes/[symbol]'
                    as={`/prizes/${pool?.symbol}`}
                  >
                    <a
                      className='-mt-4 block font-bold'
                    >
                      View previous winners
                    </a>
                  </Link>
                </>
              },
              {
                icon: PrizeIcon,
                title: 'Past 5 winners',
                content: <>
                  <LastWinnersListing
                    pool={pool}
                  />
                </>
              },
              
            ]}
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

        {cookieShowAward && <>
          <div
            className='text-center mt-20'
          >
            <ButtonLink
              secondary
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
