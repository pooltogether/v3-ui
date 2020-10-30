import React, { Fragment, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { orderBy } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { TableRowUILoader } from 'lib/components/TableRowUILoader'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import GiftIcon from 'assets/images/icon-gift@2x.png'

const debug = require('debug')('pool-app:Erc721AwardsTable')

const Erc721TokenImage = (props) => {
  const { token } = props
  let src = token.image || token.image_url

  if (src && !src.match('http://') && !src.match('https://')) {
    src = null
  }

  return src ? <img
    src={src}
    className='inline-block mr-2 w-4 h-4 xs:w-6 xs:h-6 rounded-full'
  /> : <div
    className='inline-block mr-2 bg-flashy w-4 h-4 xs:w-6 xs:h-6 rounded-full'
  />
}

export const Erc721AwardsTable = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const [moreVisible, setMoreVisible] = useState(false)
  
  const { dynamicExternalAwardsData, pool } = useContext(PoolDataContext)
  const awardsGraphData = dynamicExternalAwardsData
  const awardsChainData = pool?.external721ChainData?.dai

  const handleShowMore = (e) => {
    e.preventDefault()

    setMoreVisible(true)

    router.push(
      `/pools/[symbol]#awards-table`,
      `/pools/${pool?.symbol}#awards-table`,
    )
  }

  if (!pool || !awardsGraphData) {
    return null
  }

  const has721Awards = awardsGraphData?.daiPool?.externalErc721Awards?.length > 0

  let awards = []
  let sortedAwards = []
  if (awardsChainData) {
    const externalAwards = Object.keys(awardsChainData)
      .map(key => awardsChainData[key])
    sortedAwards = orderBy(externalAwards, ({ name }) => name || '', ['asc'])
    awards = moreVisible ? sortedAwards : sortedAwards?.slice(0, 8)
  }

  debug(awards)

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
      
      {awards.length === 0 && !has721Awards && <>
        {t('currentlyNoItemPrizes')}
      </>}

      {awards.length === 0 && has721Awards && <>
        <TableRowUILoader />
      </>}
      
      {awards.length > 0 && <>
        {pool?.externalItemAwardsEstimate && <>
          <h3
            className='mb-1'
          >
            ${numberWithCommas(pool?.externalItemAwardsEstimate)} Value
          </h3>
        </>} 

        <div
          className='xs:bg-primary theme-light--no-padding text-inverse flex flex-col justify-between rounded-lg p-0 xs:p-3 sm:px-8 mt-4'
        >

          <table
            className='table-fixed w-full text-xxxs xs:text-xxs sm:text-sm align-top'
          >
            <thead>
              <tr
                style={{ background: 'none' }}
              >
                <th
                  className='w-1/2'
                >
                  <h6
                    className='text-green text-left'
                  >
                    {t('amountItems', {
                      amount: sortedAwards.length
                    })}
                  </h6>
                </th>
                <th
                  className='w-1/2'
                ></th>
              </tr>
            </thead>
            <tbody>
              {awards.map(award => {
                return <Fragment
                  key={award.address}
                >
                  <tr>
                    <td
                      className='flex items-center py-2 text-left font-bold truncate'
                    >
                      {award?.name}
                      {/* <EtherscanAddressLink
                        address={award.address}
                        className='text-inverse'
                      >
                        {award?.name?.length > 30 ? <span className='truncate'>{award.name.substr(0, 30)}</span> : award?.name}
                      </EtherscanAddressLink> */}
                    </td>
                    <td
                      className='px-2 sm:px-3 py-2 text-left text-accent-1 truncate font-bold text-xxxs xs:text-xxs sm:text-xs'
                    >
                      {award?.balance?.eq(0) ? '1' : award?.balance?.toString()} {award?.symbol}
                    </td>
                    {/* <td
                      className='py-2 text-right w-2/12 font-bold'
                    >
                      {award.value ? `$${numberWithCommas(award.value, { precision: 2 })}` : ''}
                    </td> */}
                  </tr>

                  {award.tokenIds.map(tokenId => {
                    const token = award.tokens[tokenId]
                    const src = token.image || token.image_url

                    if (!src) {
                      debug(award.tokens[tokenId])
                      debug(token)
                    }

                    return <tr>
                      <td
                        className='flex items-center py-2 text-left font-bold text-accent-1 ml-4'
                      >
                        <Erc721TokenImage
                          token={token}
                        />
                      </td>
                      <td
                        className='px-2 sm:px-3 py-2 text-left text-default truncate text-xxxs xs:text-xxs sm:text-xs mr-4'
                      >
                        {token?.name}
                      </td>
                    </tr>
                  })}
                </Fragment>
              })}
            </tbody>
          </table>

          {sortedAwards.length > 8 && <>
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
