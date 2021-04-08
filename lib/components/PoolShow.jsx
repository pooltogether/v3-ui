import React, { useContext, useState } from 'react'
import Cookies from 'js-cookie'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useInterval } from 'beautiful-react-hooks'

import {
  COOKIE_OPTIONS,
  SHOW_MANAGE_LINKS,
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH,
  PRIZE_POOL_TYPES
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { AddTokenToMetaMaskButton } from 'lib/components/AddTokenToMetaMaskButton'
import { Button } from 'lib/components/Button'
import { ButtonLink } from 'lib/components/ButtonLink'
import { CommunityPoolDisclaimerModal } from 'lib/components/CommunityPoolDisclaimerModal'
import { LootBoxTable } from 'lib/components/LootBoxTable'
import { PoolShowUILoader } from 'lib/components/loaders/PoolShowUILoader'
import { UpcomingPrizeBreakdownCard } from 'lib/components/UpcomingPrizeBreakdownCard'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Meta } from 'lib/components/Meta'
import { PrizePlayersQuery } from 'lib/components/PrizePlayersQuery'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { RevokePoolAllowanceTxButton } from 'lib/components/RevokePoolAllowanceTxButton'
import { Tagline } from 'lib/components/Tagline'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { getSymbolForMetaMask } from 'lib/utils/getSymbolForMetaMask'
import { translatedPoolName } from 'lib/utils/translatedPoolName'
import { SablierStreamCard } from 'lib/components/SablierStreamCard'
import { PoolCharts } from 'lib/components/PoolCharts'
import { PoolPrizeCard } from 'lib/components/PoolPrizeCard'
import { PoolStats } from 'lib/components/PoolStats'
import { PastWinnersCard } from 'lib/components/PastWinnersCard'
import { usePoolBySymbol } from 'lib/hooks/usePools'

import Bell from 'assets/images/bell-yellow@2x.png'
import { usePooltogetherTvl } from 'lib/hooks/usePooltogetherTvl'

export const PoolShow = (props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const { data: pool, isFetched: isPoolFetched } = usePoolBySymbol(router?.query?.symbol)
  const { chainId, networkName, usersAddress, walletName } = useContext(AuthControllerContext)
  const [cookieShowAward, setCookieShowAward] = useState(false)

  // const symbolForMetaMask = getSymbolForMetaMask(networkName, pool)

  useInterval(() => {
    setCookieShowAward(Cookies.get(SHOW_MANAGE_LINKS))
  }, 1000)

  if (!isPoolFetched) {
    return <PoolShowUILoader />
  }

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/pools/[symbol]', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/pools/${pool.prizePool.symbol}`, COOKIE_OPTIONS)

    router.push(`/pools/[symbol]/deposit`, `/pools/${pool.prizePool.symbol}/deposit`, {
      shallow: true
    })
  }

  console.log(pool)

  return (
    <>
      <Meta title={pool.name} />

      {pool.isCommunityPool && <CommunityPoolDisclaimerModal poolSymbol={pool.symbol} />}

      <motion.div
        initial='initial'
        animate='enter'
        exit='exit'
        variants={{
          exit: {
            scale: 0.9,
            y: 10,
            opacity: 0,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.5,
              staggerChildren: shouldReduceMotion ? 0 : 0.1
            }
          },
          enter: {
            transition: {
              duration: shouldReduceMotion ? 0 : 0.5,
              staggerChildren: shouldReduceMotion ? 0 : 0.1
            }
          },
          initial: {
            y: 0,
            opacity: 1,
            transition: {
              duration: shouldReduceMotion ? 0 : 0.2
            }
          }
        }}
      >
        <div className='flex flex-col xs:flex-row justify-between xs:items-center mb-4 xs:mb-10'>
          <div className='flex justify-between items-center xs:w-1/2'>
            <PageTitleAndBreadcrumbs
              title={translatedPoolName(t, pool.name)}
              pool={pool}
              breadcrumbs={[
                {
                  href: '/',
                  as: '/',
                  name: t('pools')
                },
                {
                  name: translatedPoolName(t, pool.name)
                }
              ]}
            />
          </div>

          <div className='flex xs:w-1/2 xs:justify-end items-start mt-4 xs:mt-0'>
            <Button
              id='_getTickets'
              width='w-full xs:w-9/12 sm:w-8/12 lg:w-6/12'
              textSize='lg'
              onClick={handleGetTicketsClick}
              disabled={!Boolean(pool.symbol)}
            >
              {t('deposit')}
            </Button>
          </div>
        </div>

        <UnauditedWarning pool={pool} />

        <PoolPrizeCard pool={pool} />

        <UpcomingPrizeBreakdownCard pool={pool} />

        <LootBoxTable pool={pool} basePath={`/pools/${pool?.symbol}`} />

        <SablierStreamCard pool={pool} />

        <PoolStats pool={pool} />

        <PoolCharts pool={pool} />

        {/* <PastWinnersCard pool={pool} /> */}

        {/* <PrizePlayersQuery pool={pool} blockNumber={-1}>
          {({ data, isFetching, isFetched }) => {
            return (
              <PrizePlayerListing
                baseAsPath={`/pools/${pool?.symbol}`}
                baseHref='/pools/[symbol]'
                isFetching={isFetching}
                isFetched={isFetched}
                balances={data}
                pool={pool}
              />
            )
          }}
        </PrizePlayersQuery> */}

        <div className='flex flex-col items-center justify-center mt-10'>
          {walletName === 'MetaMask' && (
            <div className='m-2'>
              <AddTokenToMetaMaskButton
                noAnim
                textSize='xxs'
                tokenAddress={pool.tokens.ticket.address}
                tokenDecimals={pool.tokens.ticket.decimals}
                tokenSymbol={pool.tokens.ticket.symbol}
              />
            </div>
          )}

          <div className='m-2'>
            <ButtonLink
              textSize='xxs'
              href={formatEtherscanAddressUrl(pool.prizePool.address, chainId)}
            >
              {t('viewPoolInEtherscan')}
            </ButtonLink>
          </div>

          {usersAddress && <RevokePoolAllowanceTxButton pool={pool} />}

          {cookieShowAward && (
            <>
              <div className='m-2 button-scale'>
                <ButtonLink
                  textSize='xxs'
                  href='/pools/[symbol]/manage'
                  as={`/pools/${pool.symbol}/manage`}
                >
                  {t('managePool')}
                </ButtonLink>
              </div>
            </>
          )}
        </div>
      </motion.div>

      <Tagline />
    </>
  )
}

const UnauditedWarning = (props) => {
  const { pool } = props

  if (pool.prizePool.type !== PRIZE_POOL_TYPES.genericYield) {
    return null
  }

  const { t } = useTranslation()

  return (
    <div className='flex flex-col xs:flex-row text-center items-center justify-center bg-default rounded-lg mt-4 pt-4 pb-2 xs:py-4 px-4 text-orange'>
      <div className='mb-2 xs:mb-0 xs:mr-4'>
        <img className='shake' src={Bell} style={{ maxWidth: 20 }} />
      </div>
      {t('unauditedYieldSource')}
    </div>
  )
}
