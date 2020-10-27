import React, { useContext, useState } from 'react'
import { motion } from 'framer-motion'
import { useQuery } from '@apollo/client'

import { useTranslation } from 'lib/../i18n'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { BlankStateMessage } from 'lib/components/BlankStateMessage'
import { PoolNumber } from 'lib/components/PoolNumber'
import { coingeckoQuery } from 'lib/queries/coingeckoQueries'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'

import GiftIcon from 'assets/images/icon-gift@2x.png'

export const Erc20AwardsTable = (props) => {
  const { t } = useTranslation()

  const [moreVisible, setMoreVisible] = useState(false)
  
  const { pool } = useContext(PoolDataContext)

  const handleShowMore = (e) => {
    e.preventDefault()

    setMoreVisible(true)
  }

  const coingeckoQueryResult = useQuery(coingeckoQuery)
  const coingecko = coingeckoQueryResult?.data?.coingeckoData
  console.log(coingecko)





  if (!pool || pool?.externalErc20Awards === null) {
    return null
  }

  const externalAwards = pool?.externalErc20Awards || []
  const sortedAwards = externalAwards || []
  const awards = moreVisible ? sortedAwards : sortedAwards?.slice(0, 5)

  return <>
    <div
      className=''
    >
    

      {awards.length === 0 && <>
        <BlankStateMessage>
          Currently no other awards, check back soon!
        </BlankStateMessage>
      </>}
      
      
      {awards.length > 0 && <>
        <div
          className='non-interactable-card mt-2 sm:mt-10 py-4 sm:py-6 px-4 xs:px-10 bg-card rounded-lg card-min-height-desktop'
        >
          <div
            className='text-caption uppercase'
          >
          </div>
          <div className='mt-1'>
            
            <div
              className='text-caption uppercase mb-3'
            >
              <img
                src={GiftIcon}
                className='inline-block mr-2 card-icon'
              /> Bonus Prizes
            </div>

            <h3
              className='mb-1'
            >
              Value $2,660.68
            </h3>

            <p
              className='mb-6 sm:text-sm'
            >
              The winner of each prize period will receive external rewards in additional to the main prize.
            </p>
            
            <div
              className='xs:bg-primary text-inverse flex flex-col justify-between rounded-lg p-3 sm:p-8 mt-2'
            >
              <h6
                className='text-green text-left ml-2 -mb-2'
              >
                Tokens
              </h6>

              <table
                className='table-fixed w-full text-xxxs xs:text-sm mt-6 align-top'
              >
                
                <tbody>
                  {awards.map(award => {
                    return <>
                      <tr
                        key={award.address}
                      >
                        <td
                          className='px-0 py-2 text-left font-bold w-1/2'
                        >
                          <EtherscanAddressLink
                            address={award.address}
                            className='text-white'
                          >
                            {award.name.length > 20 ? <span className='truncate'>{award.name.substr(0, 20)}</span> : award.name}
                          </EtherscanAddressLink>
                        </td>
                        <td
                          className='px-2 sm:px-3 py-2 text-left w-1/4 text-accent-1'
                        >
                          <PoolNumber>
                            {displayAmountInEther(
                              award.balance, {
                                precision: 6,
                                decimals: award.decimals
                              }
                            )}
                          </PoolNumber> {award.symbol.length > 20 ? <span className='truncate'>{award.symbol.substr(0, 20)}</span> : award.symbol}
                        </td>
                        <td
                          className='py-2 text-right w-1/4 font-bold'
                        >
                          $33.xx
                        </td>
                      </tr>
                    </>
                  })}
                </tbody>
              </table>

              <div className='text-center'>
                <motion.button
                  border='none'
                  onClick={handleShowMore}
                  className='mt-6 mb-3 underline font-bold text-base sm:text-lg text-center'
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
                  Show more
                </motion.button>
              </div>
            </div>


          </div>
        </div>
        

        
      </>}

    </div>
  </>
}
