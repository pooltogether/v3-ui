import React, { Fragment } from 'react'

import { useTranslation } from 'lib/../i18n'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Erc20Image } from 'lib/components/Erc20Image'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { LootBoxValue } from 'lib/components/LootBoxValue'
import { PlunderLootBoxTxButton } from 'lib/components/PlunderLootBoxTxButton'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { usePools } from 'lib/hooks/usePools'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'

const LootBoxWonTable = (props) => {
  const { t } = useTranslation()
  
  const { prizeNumber, pool, prize } = props
  const awards = pool.awards


  console.log(pool)
  // const awardBalances = useAwardBalances(pool.computedLootBoxAddress)
  let lootBoxBalanceTotal = null
  // console.log(pool.lootBoxAwards.erc20Balances)
  // console.log(pool.lootBoxAwards.erc721Tokens)
  // console.log(pool.lootBoxAwards.erc1155Balances)
  // const lootBoxAwards = [
  //   ...pool?.lootBoxAwards?.erc20Balances,
  //   ...pool?.lootBoxAwards?.erc721Tokens,
  //   ...pool?.lootBoxAwards?.erc1155Balances,
  // ]

  // lootBoxAwards.map(award => {
  //   console.log(award)
  //   // award.balance
  // })
  // const claimed = lootBoxBalanceTotal.eq(0)

  return <>
    <h6 className='flex items-center font-normal'>
      {t('lootBoxNumber', {
        number: prizeNumber
      })}
    </h6>

    <LootBoxValue
      awards={awards}
    />
    <span className='text-caption'>
      {prize?.awardedTimestamp && <>
        <span className='text-accent-1'>{t('awardedOn')}:</span> {formatDate(prize?.awardedTimestamp, {
          short: true
        })}, <div className='inline-block ml-1 relative' style={{ top: -2 }}><PoolCurrencyIcon
          xs
          pool={pool}
        /></div> {t('tickerPool', {
          ticker: pool?.underlyingCollateralSymbol?.toUpperCase()
        })}
      </>}
    </span>

    <div className='xs:w-2/4 sm:w-1/4 mt-4'>
      <PlunderLootBoxTxButton
        lootBoxAddress={pool.computedLootBoxAddress}
      />
    </div>
    

    
    {awards.length > 0 && <>
      <div
        className='text-inverse rounded-lg p-0 xs:py-3 mt-4'
      >
        <table
          className='table-fixed text-xxxs xs:text-xxs sm:text-sm align-top'
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
                    amount: awards.length
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

  </>
}

export const LootBoxWon = (props) => {
  const { awardedExternalErc721LootBox } = props

  const pools = usePools()

  const prize = awardedExternalErc721LootBox.prize
  const poolAddress = prize.prizePool.id
  const pool = pools.pools.find(_pool => _pool.id === poolAddress)

  const blockNumber = parseInt(prize.awardedBlock, 10)
  const prizeNumber = extractPrizeNumberFromPrize(prize)

  return (
    <TimeTravelPool
      blockNumber={blockNumber + 10}
      poolAddress={poolAddress}
      querySymbol={pool.symbol}
      prize={prize}
    >
      {(timeTravelPool) => <LootBoxWonTable
        historical
        pool={timeTravelPool}
        prizeNumber={prizeNumber}
        prize={prize}
      />}
    </TimeTravelPool>
  )
}
