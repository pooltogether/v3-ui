import React, { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { ContributeToLootBoxDropdown } from 'lib/components/ContributeToLootBoxDropdown'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Erc20Image } from 'lib/components/Erc20Image'
import { LootBoxValue } from 'lib/components/LootBoxValue'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import GiftIcon from 'assets/images/icon-gift@2x.png'

export const LootBoxTable = (props) => {
  const { basePath, historical, pool } = props

  const { t } = useTranslation()
  const router = useRouter()

  const shouldReduceMotion = useReducedMotion()

  const [moreVisible, setMoreVisible] = useState(false)

  const { awards: lootBoxAwards, lootBoxIsFetching, computedLootBoxAddress } = pool.lootBox

  const originalAwardsCount = lootBoxAwards?.length
  let awards = []
  if (originalAwardsCount > 0) {
    awards = moreVisible ? lootBoxAwards : lootBoxAwards?.slice(0, 10)
  }

  const handleShowMore = (e) => {
    e.preventDefault()

    setMoreVisible(true)

    router.push(`${basePath}#loot-box-table`)
  }

  if (!awards || (awards.length === 0 && !computedLootBoxAddress)) {
    return null
  }

  return (
    <Card>
      <h5 className='font-normal'>{t('lootBox')}</h5>

      <div className='flex flex-col sm:flex-row justify-between sm:items-center mb-4'>
        <div>
          {awards.length === 0 && !lootBoxIsFetching ? null : (
            <h3>
              $<PoolNumber>{numberWithCommas(pool.externalAwardsUSD, { precision: 2 })}</PoolNumber>
            </h3>
          )}
        </div>

        {!historical && <ContributeToLootBoxDropdown pool={pool} />}
      </div>

      {awards.length > 0 && (
        <CardDetails>
          <h6 className='text-green mb-4'>
            {t('amountTokens', {
              amount: originalAwardsCount
            })}
          </h6>
          {awards.map((award) => (
            <AwardRow award={award} />
          ))}
        </CardDetails>
      )}

      {originalAwardsCount > 10 && (
        <>
          <div className='text-center'>
            <motion.button
              border='none'
              onClick={handleShowMore}
              className='mt-6 mb-3 underline font-bold text-xxs xs:text-base sm:text-lg text-center'
              animate={moreVisible ? 'exit' : 'enter'}
              initial='enter'
              transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
              variants={{
                enter: {
                  opacity: 1,
                  y: 0
                },
                exit: {
                  y: -10,
                  opacity: 0
                }
              }}
            >
              {t('showMore')}
            </motion.button>
          </div>
        </>
      )}
    </Card>
  )
}

const AwardRow = (props) => {
  const { award } = props

  const name = award.name

  if (!name) {
    return
  }

  return (
    <li className='w-full flex text-xxs sm:text-base mb-2 last:mb-0'>
      <span className='flex w-1/3 items-center text-left font-bold'>
        <Erc20Image address={award.address} />{' '}
        <EtherscanAddressLink address={award.address} className='text-inverse truncate'>
          {name}
        </EtherscanAddressLink>
      </span>
      <span className='w-1/3 sm:pl-6 text-right text-accent-1 truncate'>
        <PoolNumber>{numberWithCommas(award.balanceFormatted, { precision: 2 })}</PoolNumber>{' '}
        {award.symbol}
      </span>
      <span className='w-1/3 text-right'>
        $<PoolNumber>{numberWithCommas(award.value || 0, { precision: 2 })}</PoolNumber>
      </span>
    </li>
  )
}

// Cards

const Card = (props) => (
  <div
    className='non-interactable-card my-6 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    id='loot-box-table'
  >
    {props.children}
  </div>
)

const CardDetails = (props) => (
  <ul className='xs:bg-primary theme-light--no-gutter text-inverse rounded-lg p-0 xs:px-4 xs:py-8 mt-4 flex flex-col text-sm xs:text-base sm:text-lg'>
    {props.children}
  </ul>
)
