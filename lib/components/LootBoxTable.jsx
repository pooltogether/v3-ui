import React, { useState } from 'react'
import FeatherIcon from 'feather-icons-react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { NFTE } from '@nfte/react'
import { shorten } from '@pooltogether/utilities'
import { Tooltip } from '@pooltogether/react-components'
import { useTranslation } from 'react-i18next'

import { ContributeToLootBoxDropdown } from 'lib/components/ContributeToLootBoxDropdown'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Erc20Image } from 'lib/components/Erc20Image'
import { Modal } from 'lib/components/Modal'
import { Card, CardDetailsList } from 'lib/components/Card'
import { BlockExplorerLink, LinkIcon } from 'lib/components/BlockExplorerLink'
import { useReducedMotion } from 'lib/hooks/useReducedMotion'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { useAllErc20Awards } from 'lib/hooks/useAllErc20Awards'
import { useAllErc721Awards } from 'lib/hooks/useAllErc721Awards'
import { useAllErc1155Awards } from 'lib/hooks/useAllErc1155Awards'
import { useCurrentPool } from 'lib/hooks/usePools'

/**
 * Table use in PoolShow
 * @param {*} props
 * @returns
 */
export const PoolShowLootBoxTable = (props) => {
  const { pool } = props
  const allErc20Awards = useAllErc20Awards(pool.prize).sort(
    (a, b) => Number(b.totalValueUsd) - Number(a.totalValueUsd)
  )
  const allErc721Awards = useAllErc721Awards(pool.prize)
  const allErc1155Awards = useAllErc1155Awards(pool.prize)

  return (
    <LootBoxTable
      allErc20Awards={allErc20Awards}
      allErc721Awards={allErc721Awards}
      allErc1155Awards={allErc1155Awards}
      basePath={`/pools/${pool.networkName}/${pool.symbol}`}
      totalExternalAwardsValueUsd={pool.prize.totalExternalAwardsValueUsd}
      lootBoxAddress={pool.prize.lootBox?.address}
    />
  )
}

/**
 * Table use in PrizeShow
 * @param {*} props
 * @returns
 */
export const PrizeShowLootBoxTable = (props) => {
  const { prize, poolSymbol, poolNetworkName } = props
  const allErc20Awards = useAllErc20Awards(prize).sort(
    (a, b) => Number(b.totalValueUsd) - Number(a.totalValueUsd)
  )
  const allErc721Awards = useAllErc721Awards(prize)
  const allErc1155Awards = useAllErc1155Awards(prize)

  return (
    <LootBoxTable
      historical
      allErc20Awards={allErc20Awards}
      allErc721Awards={allErc721Awards}
      allErc1155Awards={allErc1155Awards}
      totalExternalAwardsValueUsd={prize.external.totalValueUsd}
      basePath={`/prizes/${poolNetworkName}/${poolSymbol}/${prize.id}`}
    />
  )
}

/**
 * Base component for the table
 * @param {*} props
 * @returns
 */
export const LootBoxTable = (props) => {
  const {
    basePath,
    historical,
    allErc20Awards,
    allErc721Awards,
    allErc1155Awards,
    totalExternalAwardsValueUsd,
    lootBoxAddress
  } = props

  const { t } = useTranslation()
  const router = useRouter()
  const [moreVisible, setMoreVisible] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const allErc20AwardsSorted = allErc20Awards.sort(
    (a, b) => Number(b.totalValueUsd) - Number(a.totalValueUsd)
  )

  const originalErc20AwardsCount = allErc20AwardsSorted.length

  let erc20Awards = []
  if (originalErc20AwardsCount > 0) {
    erc20Awards = moreVisible ? allErc20AwardsSorted : allErc20AwardsSorted.slice(0, 10)
  }

  const handleShowMore = (e) => {
    e.preventDefault()

    setMoreVisible(true)

    router.push(`${basePath}#loot-box-table`)
  }

  const allAwards = [...erc20Awards, ...allErc721Awards, ...allErc1155Awards]

  if (!allAwards || (allAwards.length === 0 && !lootBoxAddress)) {
    return null
  }

  return (
    <Card>
      <div className='text-accent-2 opacity-90 font-inter uppercase xs:text-sm'>{t('lootBox')}</div>

      <div className='flex flex-col sm:flex-row justify-between sm:items-center mb-4'>
        <div className='flex'>
          <h3>
            $
            <PoolNumber>
              {numberWithCommas(totalExternalAwardsValueUsd || '0', { precision: 2 })}
            </PoolNumber>
          </h3>
          <Tooltip
            id={`lootbox-extra-info-tooltip`}
            className='ml-2 my-auto text-inverse hover:opacity-70'
            tip={t('lootboxValueExtraInfo')}
          />
        </div>

        {!historical && lootBoxAddress && <ContributeToLootBoxDropdown address={lootBoxAddress} />}
      </div>

      {allAwards.length === 0 && (
        <CardDetailsList>
          <span className='text-accent-1 text-xs xs:text-base'>
            {t('beTheFirstToAddToLootbox')}
          </span>
        </CardDetailsList>
      )}

      {erc20Awards.length > 0 && (
        <CardDetailsList>
          <h6 className='text-green mb-4'>
            {t('amountTokens', {
              amount: originalErc20AwardsCount
            })}
          </h6>
          {erc20Awards.map((award) => (
            <AwardRowErc20 key={award?.address} award={award} />
          ))}
          {originalErc20AwardsCount > 10 && (
            <div className='text-right'>
              <motion.button
                border='none'
                onClick={handleShowMore}
                className='mt-6 mb-3 underline text-xxs xs:text-base sm:text-lg text-accent-1'
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
          )}
        </CardDetailsList>
      )}

      {allErc721Awards.length > 0 && (
        <CardDetailsList>
          <h6 className='text-green mb-4'>
            {t('amountNfts', {
              amount: allErc721Awards.length
            })}
          </h6>
          {allErc721Awards.map((award) => (
            <AwardRowErc721 key={award?.address} award={award} />
          ))}
        </CardDetailsList>
      )}

      {allErc1155Awards.length > 0 && (
        <CardDetailsList>
          <h6 className='text-green mb-4'>
            {t('amountNfts', {
              amount: allErc1155Awards.length
            })}
          </h6>
          {allErc1155Awards.map((award) => (
            <AwardRowErc1155 key={award?.address} award={award} />
          ))}
        </CardDetailsList>
      )}
    </Card>
  )
}

const AwardRowErc20 = (props) => {
  const { award } = props

  const { data: pool } = useCurrentPool()

  const name = award.name

  if (!name) {
    return null
  }

  return (
    <li className='w-full flex text-xxs sm:text-base mb-2 last:mb-0'>
      <span className='flex w-1/3 text-left'>
        <BlockExplorerLink
          chainId={pool.chainId}
          address={award.address}
          className='truncate text-accent-1 flex items-center'
        >
          <Erc20Image address={award.address} /> {name} <LinkIcon className={'w-4 h-4'} />
        </BlockExplorerLink>
      </span>
      <span className='w-1/3 sm:pl-6 text-right text-accent-1 truncate'>
        <PoolNumber>{numberWithCommas(award.amount, { precision: 2 })}</PoolNumber> {award.symbol}
      </span>
      <span className='w-1/3 text-right'>
        {award.totalValueUsd ? (
          <span>
            $<PoolNumber>{numberWithCommas(award.totalValueUsd, { precision: 2 })}</PoolNumber>
          </span>
        ) : (
          <span className='text-accent-1 opacity-40'>$ --</span>
        )}
      </span>
    </li>
  )
}

const AwardRowErc721 = (props) => {
  const { award } = props

  const { t } = useTranslation()

  const [modalOpen, setModalOpen] = useState(false)

  const name = award.erc721Entity?.name
  const address = award.erc721Entity?.id
  const tokenId = award.tokenId

  if (!name) {
    return null
  }

  const handleClose = (e) => {
    e.preventDefault()
    setModalOpen(false)
  }

  const handleOpen = (e) => {
    e.preventDefault()
    setModalOpen(true)
  }

  return (
    <li className='w-full flex text-xxs sm:text-base mb-2 last:mb-0'>
      <span className='flex w-1/3 text-left'>
        <Modal handleClose={handleClose} visible={modalOpen} header={null}>
          <NFTE contract={address} tokenId={tokenId} className='mx-auto' />
        </Modal>
        <button
          onClick={handleOpen}
          className='truncate text-accent-1 hover:text-highlight-1 flex items-center'
        >
          <FeatherIcon icon='image' className='mr-1 w-5 h-5' /> {name}{' '}
        </button>
      </span>
      <span className='w-1/3 sm:pl-6 text-right text-accent-1 truncate'>
        <button
          onClick={handleOpen}
          className='flex items-center ml-auto capitalize text-accent-1 hover:text-highlight-1'
        >
          <FeatherIcon icon='zoom-in' className='mr-1 w-5 h-5' /> {t('view')}
        </button>
      </span>
      <span className='w-1/3 text-right'>
        <span className='text-accent-1 opacity-40'>$ --</span>
      </span>
    </li>
  )
}

const AwardRowErc1155 = (props) => {
  const { award } = props

  const { t } = useTranslation()

  const { data: pool } = useCurrentPool()

  const name = award.erc1155Entity?.name
  const address = award.erc1155Entity?.id
  // const tokenId = award.tokenId

  return (
    <li className='w-full flex text-xxs sm:text-base mb-2 last:mb-0'>
      <span className='flex w-1/3 text-left'>
        <BlockExplorerLink
          chainId={pool.chainId}
          address={address}
          className='text-accent-1 flex items-center'
        >
          {name ? name : shorten(address)}{' '}
          <FeatherIcon icon='arrow-up-right' className='mr-1 w-5 h-5' />{' '}
        </BlockExplorerLink>
      </span>
      <span className='w-1/3 sm:pl-6 text-right text-accent-1 truncate'></span>
      <span className='w-1/3 text-right'>
        <span className='text-accent-1 opacity-40'>$ --</span>
      </span>
    </li>
  )
}
