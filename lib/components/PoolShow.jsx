import React, { useContext, useState } from 'react'
import Cookies from 'js-cookie'
import BeatLoader from 'react-spinners/BeatLoader'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { useInterval } from 'beautiful-react-hooks'

import {
  COOKIE_OPTIONS,
  SHOW_MANAGE_LINKS,
  WIZARD_REFERRER_HREF,
  WIZARD_REFERRER_AS_PATH
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { ButtonLink } from 'lib/components/ButtonLink'
import { CommunityPoolDisclaimerModal } from 'lib/components/CommunityPoolDisclaimerModal'
import { LootBoxTable } from 'lib/components/LootBoxTable'
import { PoolShowLoader } from 'lib/components/PoolShowLoader'
import { PoolShowCards } from 'lib/components/PoolShowCards'
import { UpcomingPrizeBreakdownCard } from 'lib/components/UpcomingPrizeBreakdownCard'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { Meta } from 'lib/components/Meta'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PrizePlayersQuery } from 'lib/components/PrizePlayersQuery'
import { PrizePlayerListing } from 'lib/components/PrizePlayerListing'
import { NewPrizeCountdown } from 'lib/components/NewPrizeCountdown'
import { RevokePoolAllowanceTxButton } from 'lib/components/RevokePoolAllowanceTxButton'
import { Tagline } from 'lib/components/Tagline'
import { usePool } from 'lib/hooks/usePool'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { addTokenToMetaMask } from 'lib/services/addTokenToMetaMask'
import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { getSymbolForMetaMask } from 'lib/utils/getSymbolForMetaMask'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { translatedPoolName } from 'lib/utils/translatedPoolName'
import { SablierStreamCard } from 'lib/components/SablierStreamCard'

export const PoolShow = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const shouldReduceMotion = useReducedMotion()

  const { chainId, networkName, usersAddress, walletName } = useContext(AuthControllerContext)

  const poolSymbol = router?.query?.symbol
  const { pool } = usePool(poolSymbol)

  const symbolForMetaMask = getSymbolForMetaMask(networkName, pool)

  const [cookieShowAward, setCookieShowAward] = useState(false)

  useInterval(() => {
    setCookieShowAward(Cookies.get(SHOW_MANAGE_LINKS))
  }, 1000)

  if (!pool) {
    return <PoolShowLoader />
  }

  const handleGetTicketsClick = (e) => {
    e.preventDefault()

    Cookies.set(WIZARD_REFERRER_HREF, '/pools/[symbol]', COOKIE_OPTIONS)
    Cookies.set(WIZARD_REFERRER_AS_PATH, `/pools/${pool.symbol}`, COOKIE_OPTIONS)

    router.push(`/pools/[symbol]/deposit`, `/pools/${pool.symbol}/deposit`, {
      shallow: true
    })
  }

  const handleAddTokenToMetaMask = (e) => {
    e.preventDefault()

    const tokenAddress = pool?.ticketToken?.id
    addTokenToMetaMask(symbolForMetaMask, tokenAddress, pool?.underlyingCollateralDecimals)
  }

  const prizeEstimateFormatted = pool?.totalPrizeAmountUSD > 0 && pool.totalPrizeAmountUSD

  return (
    <>
      <Meta title={pool?.name} />

      {pool?.isCommunityPool && <CommunityPoolDisclaimerModal poolSymbol={pool?.symbol} />}

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
        <>
          <div className='flex flex-col xs:flex-row justify-between xs:items-center'>
            <div className='flex justify-between items-center xs:w-1/2'>
              <PageTitleAndBreadcrumbs
                title={translatedPoolName(t, pool?.name)}
                pool={pool}
                breadcrumbs={[
                  {
                    href: '/',
                    as: '/',
                    name: t('pools')
                  },
                  {
                    name: translatedPoolName(t, pool?.name)
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
                disabled={!Boolean(pool?.symbol)}
              >
                {t('deposit')}
              </Button>
            </div>
          </div>

          <div
            className='custom-prize-box-padding pink-purple-gradient rounded-lg px-4 xs:px-6 sm:px-16 py-8 sm:pt-12 sm:pb-10 text-white my-8 sm:my-12 mx-auto'
            style={{
              minHeight: 150
            }}
          >
            <div className='flex flex-col xs:flex-row xs:items-center justify-between'>
              <div className='w-1/2 sm:w-7/12'>
                <h6 className='font-normal text-inverse opacity-60'>
                  {t('prize')} #{pool?.currentPrizeId}
                </h6>

                <h1 className='text-6xl xs:text-4xl sm:text-5xl lg:text-6xl -mt-3 xs:mt-0 sm:-mt-3'>
                  {pool?.fetchingTotals ? (
                    <BeatLoader size={10} color='rgba(255,255,255,0.3)' />
                  ) : (
                    <>
                      {prizeEstimateFormatted && (
                        <>
                          $<PoolNumber>{numberWithCommas(prizeEstimateFormatted)}</PoolNumber>
                        </>
                      )}
                    </>
                  )}
                </h1>
              </div>

              <div className='flex flex-col justify-center pt-4 xs:pt-2 sm:pt-0 countdown-wrapper'>
                <h6 className='relative font-normal mb-1 xs:mb-2 sm:-mt-3 opacity-60 text-inverse'>
                  {t('willBeAwardedIn')}
                </h6>

                <NewPrizeCountdown textAlign='left' pool={pool} flashy={false} />
              </div>
            </div>
          </div>

          <UpcomingPrizeBreakdownCard />

          <LootBoxTable pool={pool} basePath={`/pools/${pool?.symbol}`} />

          <SablierStreamCard pool={pool} />

          <h6 className='text-accent-1 mt-8 mb-0 sm:t-4 relative'>{t('prizePoolStats')}</h6>

          <PoolShowCards pool={pool} />
        </>

        <PrizePlayersQuery pool={pool} blockNumber={-1}>
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
        </PrizePlayersQuery>

        <div className='flex flex-col items-center justify-center mt-20'>
          {walletName === 'MetaMask' && (
            <div className='m-2'>
              <Button textSize='xxs' noAnim onClick={handleAddTokenToMetaMask}>
                {t('addTicketTokenToMetamask', {
                  token: symbolForMetaMask
                })}
              </Button>
            </div>
          )}

          <div className='m-2'>
            <ButtonLink textSize='xxs' href={formatEtherscanAddressUrl(pool.poolAddress, chainId)}>
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
                  as={`/pools/${pool?.symbol}/manage`}
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
