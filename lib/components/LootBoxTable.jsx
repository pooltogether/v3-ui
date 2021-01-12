import React, { Fragment, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'

import { useTranslation } from 'lib/../i18n'
import { ContributeToLootBoxDropdown } from 'lib/components/ContributeToLootBoxDropdown'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Erc20Image } from 'lib/components/Erc20Image'
import { LootBoxValue } from 'lib/components/LootBoxValue'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import GiftIcon from 'assets/images/icon-gift@2x.png'

export const LootBoxTable = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { basePath, historical, pool } = props
  
  const [moreVisible, setMoreVisible] = useState(false)

  const {
    awards: lootBoxAwards,
    lootBoxIsFetching,
    lootBoxIsFetched,
  } = pool.lootBox

  const originalAwardsCount = lootBoxAwards?.length
  let awards = []
  if (originalAwardsCount > 0) {
    awards = moreVisible ? lootBoxAwards : lootBoxAwards?.slice(0, 10)
  }

  const handleShowMore = (e) => {
    e.preventDefault()

    setMoreVisible(true)

    router.push(
      `${basePath}#loot-box-table`,
    )
  }

  if (!awards) {
    return null
  }

  return <>
    <div
      id='loot-box-table'
      className='non-interactable-card my-6 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div
        className='text-caption uppercase mb-3'
      >
        <img
          src={GiftIcon}
          className='inline-block mr-2 card-icon'
        /> {t('lootBox')}
      </div>

      <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
        <div>
          {awards.length === 0 && !lootBoxIsFetching ? <>
            {/* {historical ? t('noOtherPrizesAwarded') : t('currentlyNoOtherPrizes')} */}
          </> : <>
            <LootBoxValue
              awards={awards}
            />
          </>}
        </div>

        {!historical && <>
          <ContributeToLootBoxDropdown
            pool={pool}
          />
        </>}
      </div>
      
      {awards.length > 0 && <>
        <div
          className='xs:bg-primary theme-light--no-gutter text-inverse rounded-lg p-0 xs:p-3 sm:pl-4 sm:pr-12 lg:pr-4 mt-4'
        >
          <table
            className='table-fixed w-full text-xxxs xs:text-xxs sm:text-sm align-top'
          >
            <thead>
              <tr
                style={{ background: 'none' }}
              >
                <th
                  className='w-6/12'
                >
                  <h6
                    className='text-green text-left'
                  >
                    {t('amountTokens', {
                      amount: originalAwardsCount
                    })}
                  </h6>
                </th>
                <th
                  className='w-4/12'
                ></th>
                <th
                  className='w-2/12 sm:w-1/12'
                ></th>
              </tr>
            </thead>
            <tbody>
              {awards.map((award, index) => {
                const name = award.name

                if (!name) {
                  return
                }

                return <Fragment
                  key={`${award.address}-${index}`}
                >
                  <tr>
                    <td
                      className='flex items-center text-left font-bold'
                    >
                      <Erc20Image
                        address={award.address}
                      /> <EtherscanAddressLink
                        address={award.address}
                        className='text-inverse truncate'
                      >
                        {name}
                      </EtherscanAddressLink>
                    </td>
                    <td
                      className='text-left text-accent-1 truncate'
                    >
                      <PoolNumber>
                        {numberWithCommas(award.balanceFormatted, { precision: 2 })}
                      </PoolNumber> {award.symbol}
                    </td>
                    <td
                      className='font-bold text-right'
                    >
                      {award.value && `$${numberWithCommas(award.value, { precision: 2 })}`}
                    </td>
                  </tr>
                </Fragment>
              })}
            </tbody>
          </table>

          {originalAwardsCount > 10 && <>
            <div className='text-center'>
              <motion.button
                border='none'
                onClick={handleShowMore}
                className='mt-6 mb-3 underline font-bold text-xxs xs:text-base sm:text-lg text-center'
                animate={moreVisible ? 'exit' : 'enter'}
                initial='enter'
                variants={{
                  enter: {
                    opacity: 1,
                    y: 0,
                  },
                  exit: {
                    y: -10,
                    opacity: 0,
                  }
                }}
              >
                {t('showMore')}
              </motion.button>
            </div>
          </>}
        </div>


      </>}

    </div>
  </>
}
