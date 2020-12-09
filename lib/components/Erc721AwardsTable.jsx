import React, { Fragment, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { isEmpty, orderBy } from 'lodash'

import { useTranslation } from 'lib/../i18n'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
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
    className='inline-block mr-2 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full'
  /> : <div
    className='inline-block mr-2 bg-overlay-white w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full'
  />
}

export const Erc721AwardsTable = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { basePath, historical, externalErc721Awards, ethErc721Awards } = props

  const [moreVisible, setMoreVisible] = useState(false)
  
  const { pool } = useContext(PoolDataContext)

  const handleShowMore = (e) => {
    e.preventDefault()

    setMoreVisible(true)

    router.push(
      `${basePath}#erc721-awards-table`,
    )
  }

  if (!pool || !externalErc721Awards) {
    return null
  }

  const has721Awards = !isEmpty(ethErc721Awards)

  let awards = []
  let sortedAwards = []
  if (externalErc721Awards) {
    const externalAwards = Object.keys(externalErc721Awards)
      .map(key => externalErc721Awards[key])
    sortedAwards = orderBy(externalAwards, ({ name }) => name || '', ['asc'])
    awards = moreVisible ? sortedAwards : sortedAwards?.slice(0, 8)
  }

  debug(awards)

  return <>
    <div
      id='item-erc721-awards-table'
      className='mt-2'
    >
      <h6
        className='text-green text-left'
      >
        {t('amountItems', {
          amount: sortedAwards.length
        })}
      </h6>

      {awards.length === 0 && has721Awards && <>
        <TableRowUILoader />
      </>}
      
        {/* {pool?.externalItemAwardsEstimate && <>
          <h3
            className='mb-1'
          >
            ${numberWithCommas(pool?.externalItemAwardsEstimate)} Value
          </h3>
        </>}  */}

        <div
          className='table--no-hover-states text-inverse flex flex-col justify-between rounded-lg p-0'
        >

          <table
            className='table--no-padding table--no-hover-states table-fixed w-full text-xxxs xs:text-xxs sm:text-sm align-top'
          >
            <tbody>
              {awards.length === 0 && !has721Awards && <>
                <tr>
                  <td
                    className='flex items-center py-2 text-left truncate'
                  >
                    {historical && t('noItemPrizesAwarded')}
                  </td>
                </tr>
              </>}

              {awards?.map(award => {
                return <Fragment
                  key={award.address}
                >
                  <tr>
                    <td
                      className='flex items-center py-2 text-left font-bold truncate'
                    >
                      <EtherscanAddressLink
                        address={award.address}
                        className='text-inverse'
                      >
                        {award?.name}
                      </EtherscanAddressLink>
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

                  {award?.tokenIds?.map(tokenId => {
                    const token = award?.tokens?.[tokenId]
                    const src = token?.image || token?.image_url

                    if (!src) {
                      debug(award.tokens[tokenId])
                      debug(token)
                    }

                    return <tr
                      key={`${award.address}-${tokenId}`}
                    >
                      <td
                        className='flex items-center py-2 text-left font-bold text-accent-1 ml-4'
                      >
                        <Erc721TokenImage
                          token={token}
                        />
                      </td>
                      <td
                        className='text-left text-default truncate text-xxxs xs:text-xxs sm:text-xs mr-4'
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

    </div>
  </>
}
