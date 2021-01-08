import React from 'react'

import { useTranslation } from 'lib/../i18n'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Erc20Image } from 'lib/components/Erc20Image'
import { LootBoxValue } from 'lib/components/LootBoxValue'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { LootBoxTable } from 'lib/components/LootBoxTable'
import { useLootBox } from 'lib/hooks/useLootBox'
import { usePools } from 'lib/hooks/usePools'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'

export const LootBoxWon = (props) => {
  const { awardedExternalErc721LootBox } = props
  console.log(awardedExternalErc721LootBox)

  const pools = usePools()

  const prize = awardedExternalErc721LootBox.prize
  const poolAddress = prize.prizePool.id
  const pool = pools.pools.find(_pool => _pool.id === poolAddress)

  const blockNumber = parseInt(prize.awardedBlock, 10)
  const prizeNumber = extractPrizeNumberFromPrize(prize)

  // const externalErcAwards = {
  //   compiledExternalErc20Awards,
  //   compiledExternalErc721Awards,
  // }
  const externalErcAwards = {}
  // console.log(pool, externalErcAwards, blockNumber)
  // let { awards, lootBoxIsFetching, lootBoxIsFetched } = useLootBox(pool, externalErcAwards, blockNumber)

  const awards = []
  // console.log(awards)

  return <>
    <TimeTravelPool
      blockNumber={blockNumber}
      poolAddress={poolAddress}
      querySymbol={pool.symbol}
      prize={prize}
    >
      {(timeTravelPool) => {
        
        // const lootBox = useLootBox(timeTravelPool, externalErcAwards, blockNumber)
        console.log(timeTravelPool.computedLootBoxAddress)

        return <LootBoxTable
          historical
          pool={timeTravelPool}
          basePath={`/prizes/${pool?.symbol}/${prizeNumber}`}
        />
      }}
    </TimeTravelPool>

    {/* <div
      className='my-6 py-4 xs:py-6 px-4 xs:px-6 sm:px-10 bg-card rounded-lg card-min-height-desktop'
    > */}
      <h6
        className='flex items-center font-normal'
      >
        {/* {t('lootBoxNumber', {
              number
            })} */}
        {/* {id} */}
      </h6>

      <h3>
        {/* $<PoolNumber>
            </PoolNumber> */}
      </h3>

      
      <div className='flex flex-col sm:flex-row justify-between sm:items-center'>
        <div>
          {awards.length === 0 ? <>
            {/* {historical ? t('noOtherPrizesAwarded') : t('currentlyNoOtherPrizes')} */}
          </> : <>
            <LootBoxValue
              awards={awards}
            />
          </>}
        </div>
      </div>
{/*       
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
                const name = award.name || award?.erc20Entity?.name || award?.erc721Entity?.name

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
                        {displayAmountInEther(
                          award.balance, {
                            precision: 6,
                            decimals: award.decimals
                          }
                        )}
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

        </div> 


      </>}
      */}

    {/* </div> */}
  </>
}
