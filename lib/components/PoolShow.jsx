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
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { CommunityPoolDisclaimerModal } from 'lib/components/CommunityPoolDisclaimerModal'
import { PoolShowLootBoxTable } from 'lib/components/LootBoxTable'
import { PoolShowUILoader } from 'lib/components/loaders/PoolShowUILoader'
import { UpcomingPrizeBreakdownCard } from 'lib/components/UpcomingPrizeBreakdownCard'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Meta } from 'lib/components/Meta'
import { RevokePoolAllowanceTxButton } from 'lib/components/RevokePoolAllowanceTxButton'
import { Tagline } from 'lib/components/Tagline'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { translatedPoolName } from 'lib/utils/translatedPoolName'
import { SablierStreamCard } from 'lib/components/SablierStreamCard'
import { PoolPrizeCard } from 'lib/components/PoolPrizeCard'
import { PoolStats } from 'lib/components/PoolStats'
import { usePoolBySymbol } from 'lib/hooks/usePools'

import Bell from 'assets/images/bell-yellow@2x.png'
import { PoolChartsCard } from 'lib/components/PoolChartsCard'
import { PastWinnersCard } from 'lib/components/PastWinnersCard'
import { PrizePlayersQuery } from 'lib/components/PrizePlayersQuery'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { useRouterChainId } from 'lib/hooks/chainId/useRouterChainId'

export const PoolShow = (props) => {
  const { t } = useTranslation()
  const router = useRouter()
  const shouldReduceMotion = useReducedMotion()
  const chainId = useRouterChainId()

  const { data: pool, isFetched: poolIsFetched } = usePoolBySymbol(chainId, router?.query?.symbol)
  const { usersAddress, walletName } = useContext(AuthControllerContext)
  const [cookieShowAward, setCookieShowAward] = useState(false)

  useInterval(() => {
    setCookieShowAward(Cookies.get(SHOW_MANAGE_LINKS))
  }, 1000)

  if (!poolIsFetched) {
    return <PoolShowUILoader />
  }

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/pools/[networkName]/[symbol]', COOKIE_OPTIONS)
    Cookies.set(
      WIZARD_REFERRER_AS_PATH,
      `/pools/${pool.networkName}/${pool.symbol}`,
      COOKIE_OPTIONS
    )

    router.push(
      `/pools/[networkName]/[symbol]/deposit`,
      `/pools/${pool.networkName}/${pool.symbol}/deposit`,
      {
        shallow: true
      }
    )
  }

  return (
    <>
      <Meta title={pool.name} />

      {pool.contract.isCommunityPool && <CommunityPoolDisclaimerModal poolSymbol={pool.symbol} />}

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

        <PoolShowLootBoxTable pool={pool} />

        <SablierStreamCard pool={pool} />

        <PoolStats pool={pool} />

        <PoolChartsCard pool={pool} />

        <PastWinnersCard pool={pool} />

        <PrizePlayersQuery pool={pool} blockNumber={-1}>
          {({ data, isFetching, isFetched }) => {
            return (
              <PrizePlayerListing
                baseAsPath={`/pools/${pool.networkName}/${pool.symbol}`}
                baseHref='/pools/[networkName]/[symbol]'
                isFetching={isFetching}
                isFetched={isFetched}
                balances={data}
                pool={pool}
              />
            )
          }}
        </PrizePlayersQuery>

        <div className='flex flex-col  items-center justify-center mt-10'>
          {walletName === 'MetaMask' && (
            <div className='m-2'>
              <AddTokenToMetaMaskButton
                noAnim
                textSize='xxxs'
                tokenAddress={pool.tokens.ticket.address}
                tokenDecimals={pool.tokens.ticket.decimals}
                tokenSymbol={pool.tokens.ticket.symbol}
              />
            </div>
          )}

          <div className='m-2'>
            <BlockExplorerLink address={pool.prizePool.address} chainId={pool.chainId}>
              {t('viewPoolInEtherscan')}
            </BlockExplorerLink>
          </div>

          <div className='m-2'>
            <BlockExplorerLink address={pool.tokens.underlyingToken.address} chainId={pool.chainId}>
              {t('viewDepositTokenOnEtherscan')}
            </BlockExplorerLink>
          </div>

          {usersAddress && <RevokePoolAllowanceTxButton pool={pool} />}

          {cookieShowAward && (
            <>
              <div className='m-2 button-scale'>
                <ButtonLink
                  textSize='xxxs'
                  href='/pools/[networkName]/[symbol]/manage'
                  as={`/pools/${pool.networkName}/${pool.symbol}/manage`}
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
