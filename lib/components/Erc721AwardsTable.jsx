import React, { Fragment, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { orderBy } from 'lodash'

import { TOKEN_IMAGES } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import GiftIcon from 'assets/images/icon-gift@2x.png'

const Erc721Image = (props) => {
  const src = TOKEN_IMAGES[props.address]

  return src ? <img
    src={src}
    className='inline-block mr-2 w-4 h-4 xs:w-6 xs:h-6 rounded-full'
  /> : <div
    className='inline-block mr-2 bg-black w-4 h-4 xs:w-6 xs:h-6 rounded-full'
  />
}

export const Erc721AwardsTable = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [moreVisible, setMoreVisible] = useState(false)
  
  const { pool } = useContext(PoolDataContext)

  const handleShowMore = (e) => {
    e.preventDefault()

    setMoreVisible(true)

    router.push(
      `/pools/[symbol]#awards-table`,
      `/pools/${pool?.symbol}#awards-table`,
    )
  }



  if (!pool || pool.externalErc721AwardsChainData === null) {
    return null
  }

  const externalAwards = pool.externalErc721AwardsChainData || []
  // const sortedAwards = externalAwards ? sortBy(externalAwards, 'value').reverse() : []
  const sortedAwards = orderBy(externalAwards, ({ value }) => value || '', ['desc'])
  const awards = moreVisible ? sortedAwards : sortedAwards?.slice(0, 5)

  return <>
    <div
      id='item-awards-table'
      className='non-interactable-card mt-2 sm:mt-10 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    >
      <div
        className='text-caption uppercase mb-3'
      >
        <img
          src={GiftIcon}
          className='inline-block mr-2 card-icon'
        /> {t('itemPrizes')}
      </div>
      
      {awards.length === 0 && <>
        {t('currentlyNoItemPrizes')}
      </>}
      
      {awards.length > 0 && <>
        {pool?.externalItemAwardsEstimate && <>
          <h3
            className='mb-1'
          >
            ${numberWithCommas(pool?.externalItemAwardsEstimate)} Value
          </h3>
        </>} 

        <p
          className='mb-6 sm:text-sm'
        >
          {t('otherItemPrizesDescription')}
        </p>
        
        <div
          className='xs:bg-primary theme-light--no-padding text-inverse flex flex-col justify-between rounded-lg p-0 xs:p-3 sm:px-8'
        >

          <table
            className='table-fixed w-full text-xxxs xs:text-xxs sm:text-sm align-top'
          >
            <thead>
              <th
                className='w-1/2'
              >
                <h6
                  className='text-green text-left -mb-2'
                >
                  {t('amountItems', {
                    amount: sortedAwards.length
                  })}
                </h6>
              </th>
              <th
                className='w-1/2'
              >

              </th>
            </thead>
            <tbody>
              {awards.map(award => {
                return <Fragment
                  key={award.address}
                >
                  <tr>
                    <td
                      className='flex items-center py-2 text-left font-bold'
                    >
                      {/* <Erc20Image
                        address={award.address}
                      /> */}
                      <EtherscanAddressLink
                        address={award.address}
                        className='text-inverse'
                      >
                        {award.name.length > 30 ? <span className='truncate'>{award.name.substr(0, 30)}</span> : award.name}
                      </EtherscanAddressLink>
                    </td>
                    <td
                      className='px-2 sm:px-3 py-2 text-left text-accent-1 truncate'
                    >
                      {award.balance.eq(0) ? '1' : award.balance.toString()} {award.symbol.length > 30 ? <span className='truncate'>{award.symbol.substr(0, 30)}</span> : award.symbol}
                    </td>
                    {/* <td
                      className='py-2 text-right w-2/12 font-bold'
                    >
                      {award.value ? `$${numberWithCommas(award.value, { precision: 2 })}` : ''}
                    </td> */}
                  </tr>
                </Fragment>
              })}
            </tbody>
          </table>

          {externalAwards.length > 5 && <>
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
