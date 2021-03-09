import React, { useContext, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useRouter } from 'next/router'
import { motion } from 'framer-motion'

import { useTranslation } from 'lib/../i18n'
import { usePools } from 'lib/hooks/usePools'
import { AccountPoolRow } from 'lib/components/AccountPoolRow'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { ButtonLink } from 'lib/components/ButtonLink'
import { ErrorMessage } from 'lib/components/ErrorMessage'
import { Meta } from 'lib/components/Meta'
import { PageTitleAndBreadcrumbs } from 'lib/components/PageTitleAndBreadcrumbs'
import { IndexUILoader } from 'lib/components/IndexUILoader'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { shorten } from 'lib/utils/shorten'
import { useAccountQuery } from 'lib/hooks/useAccountQuery'

export function PlayerPageUI(props) {
  const { t } = useTranslation()
  const router = useRouter()

  const shouldReduceMotion = useReducedMotion()

  const { pools, poolsGraphData } = usePools()

  const playerAddress = router?.query?.playerAddress

  const [error, setError] = useState('')

  useEffect(() => {
    if (playerAddress) {
      try {
        ethers.utils.getAddress(playerAddress)
        setError(false)
      } catch (e) {
        setError('Incorrectly formatted Ethereum address!')
      }
    }
  }, [playerAddress])

  let playerAddressError
  if (playerAddress) {
    try {
      ethers.utils.getAddress(playerAddress)
    } catch (e) {
      console.error(e)

      if (e.message.match('invalid address')) {
        playerAddressError = true
      }
    }
  }

  // let playerDripTokenData
  // let playerBalanceDripData
  // let playerVolumeDripData

  const blockNumber = -1

  const { data: playerData, error: playerQueryError } = useAccountQuery(
    playerAddress,
    blockNumber,
    playerAddressError
  )

  // playerDripTokenData = data?.playerDripToken
  // playerBalanceDripData = data?.playerBalanceDrip
  // playerVolumeDripData = data?.playerVolumeDrip

  return (
    <>
      <Meta title={playerAddress && `${t('player')} ${playerAddress}`} />

      <PageTitleAndBreadcrumbs
        title={`${t('player')} ${playerAddress ? shorten(playerAddress) : ''}`}
        breadcrumbs={[
          {
            name: t('players')
          },
          {
            href: '/players/[playerAddress]',
            as: `/players/${playerAddress}`,
            name: `${t('player')} ${playerAddress ? playerAddress : ''}`
          }
        ]}
      />

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
        <div className='mt-8'>
          {error ? (
            <>
              <ErrorMessage>Incorrectly formatted Ethereum address!</ErrorMessage>
            </>
          ) : (
            <>
              {!playerData ? (
                <>
                  <IndexUILoader />
                </>
              ) : playerData.length === 0 ? (
                <>
                  <BlankStateMessage>
                    <div className='mb-4'>{t('thisPlayerCurrentlyHasNoTickets')}</div>
                    <ButtonLink href='/' as='/'>
                      {t('viewPools')}
                    </ButtonLink>
                  </BlankStateMessage>
                </>
              ) : (
                <>
                  <ul className='mt-8'>
                    {playerData?.prizePoolAccounts.map((prizePoolAccount) => {
                      const poolAddress = prizePoolAccount?.prizePool?.id
                      const pool = pools?.find((pool) => pool.id === poolAddress)
                      if (!pool) return null
                      const poolGraphData = poolsGraphData[pool.symbol]
                      if (!poolGraphData) return null

                      const ticketAddress = poolGraphData?.ticketToken?.id
                      let balance = playerData?.controlledTokenBalances.find(
                        (ct) => ct.controlledToken.id === ticketAddress
                      )?.balance

                      if (!balance) return null

                      return (
                        <AccountPoolRow
                          noLinks
                          href='/players/[playerAddress]'
                          as={`/players/${playerAddress}`}
                          key={`account-pool-row-${pool.id}`}
                          poolSymbol={pool.symbol}
                          pool={pool}
                          playerBalance={balance}
                        />
                      )
                    })}
                  </ul>
                </>
              )}
            </>
          )}
        </div>
      </motion.div>
    </>
  )
}
