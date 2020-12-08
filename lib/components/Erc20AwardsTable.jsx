import React, { Fragment, useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { useRouter } from 'next/router'
import { orderBy } from 'lodash'

import { TOKEN_IMAGES } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { ContributeToLootBoxDropdown } from 'lib/components/ContributeToLootBoxDropdown'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { Erc20Image } from 'lib/components/Erc20Image'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import GiftIcon from 'assets/images/icon-gift@2x.png'

export const Erc20AwardsTable = (props) => {
  const { t } = useTranslation()
  const router = useRouter()

  const { basePath, externalErc20Awards, historical, pool } = props

  const [moreVisible, setMoreVisible] = useState(false)
  
  const handleShowMore = (e) => {
    e.preventDefault()

    setMoreVisible(true)

    router.push(
      `${basePath}#awards-table`,
    )
  }



  if (!externalErc20Awards) {
    return null
  }

  const balanceProperty = historical ? 'balanceAwardedBN' : 'balance'

  let externalAwards = Object.keys(externalErc20Awards)
    .map(key => externalErc20Awards[key])
    .filter(award => award?.[balanceProperty]?.gt(0))

  const sortedAwards = orderBy(externalAwards, ({ value }) => value || '', ['desc'])
  const awards = moreVisible ? sortedAwards : sortedAwards?.slice(0, 5)

  return <>
    <div
      id='awards-table'
      className='mt-2 sm:mt-10'
    >
      <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
        <div>

          <h6
            className='text-green text-left'
          >
            {t('amountTokens', {
              amount: sortedAwards.length
            })}
          </h6>

          {pool?.externalAwardsUSD && <>
            <h3
              className='mb-1'
            >
              ${numberWithCommas(pool?.externalAwardsUSD)} {t('value')}
            </h3>
          </>}
        </div>
      </div> 
      
        <div
          className='text-inverse flex flex-col justify-between rounded-lg p-0'
        >
          <table
            className='table--no-padding table--no-hover-states table-fixed w-full text-xxxs xs:text-xxs sm:text-sm align-top'
          >
            <tbody>
              {awards.length === 0 && <>
                <tr>
                  <td>
                    {historical && t('noOtherPrizesAwarded')}
                  </td>
                </tr>
              </>}

              {awards?.map(award => {
                if (!award.name) {
                  return
                }

                return <Fragment
                  key={award.address}
                >
                  <tr>
                    <td
                      className='flex items-center py-2 text-left font-bold'
                    >
                      <Erc20Image
                        address={award.address}
                      /> <EtherscanAddressLink
                        address={award.address}
                        className='text-inverse'
                      >
                        {award.name.length > 20 ? <span className='truncate'>{award.name.substr(0, 20)}</span> : award.name}
                      </EtherscanAddressLink>
                    </td>
                    <td
                      className='px-2 sm:px-3 py-2 text-left text-accent-1 truncate'
                    >
                      <PoolNumber>
                        {displayAmountInEther(
                          award[balanceProperty], {
                            precision: 6,
                            decimals: award.decimals
                          }
                        )}
                      </PoolNumber> {award.symbol.length > 20 ? <span className='truncate'>{award.symbol.substr(0, 20)}</span> : award.symbol}
                    </td>
                    <td
                      className='py-2 font-bold'
                    >
                      {award.value ? `$${numberWithCommas(award.value, { precision: 2 })}` : ''}
                    </td>
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



    </div>
  </>
}
