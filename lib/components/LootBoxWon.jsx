import React, { Fragment } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { EtherscanAddressLink } from 'lib/components/EtherscanAddressLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Erc20Image } from 'lib/components/Erc20Image'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { LootBoxValue } from 'lib/components/LootBoxValue'
import { PlunderLootBoxTxButton } from 'lib/components/PlunderLootBoxTxButton'
import { TimeTravelPool } from 'lib/components/TimeTravelPool'
import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { usePools } from 'lib/hooks/usePools'
import { useReadProvider } from 'lib/hooks/useReadProvider'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'

const LootBoxWonTable = (props) => {
  const { t } = useTranslation()
  
  const { prizeNumber, pool, prize } = props
  
  const {
    awards,
    lootBoxAwards,
    computedLootBoxAddress,
  } = pool.lootBox

  const lootBoxErc20s = lootBoxAwards.erc20s
    .map(award => ({ address: award.erc20Entity.id }))

  const lootBoxErc721s = lootBoxAwards.erc721s
    .map(award => ({ address: award.erc721Entity.id }))
  console.log(lootBoxErc721s)

  // const lootBoxErc1155s = lootBoxAwards.erc1155s
  //   .map(award => ({ address: award.address }))
  // console.log(lootBoxErc1155s)

  const { readProvider } = useReadProvider()

  const {
    data: erc20Balances,
    error: erc20Error,
    isFetching: erc20IsFetching,
    isFetched: erc20IsFetched
  } = useEthereumErc20Query(
    {
      provider: readProvider,
      graphErc20Awards: lootBoxErc20s,
      balanceOfAddress: computedLootBoxAddress
    }
  )

  const {
    data: erc721Balances,
    error: erc721Error,
    isFetching: erc721IsFetching,
    isFetched: erc721IsFetched
  } = useEthereumErc721Query({
    provider: readProvider,
    graphErc721Awards: lootBoxErc721s,
    balanceOfAddress: computedLootBoxAddress
  })

  // const { data: awardBalances, error, isFetching, isFetched } = useEthereumAwardBalances(
  //   awards,
  //   pool?.computedLootBoxAddress
  // )
  // console.log(erc721Balances)


  if (erc20Error) {
    console.warn(erc20Error)
  }
  if (erc721Error) {
    console.warn(erc721Error)
  }
  // if (error) {
  //   console.warn(error)
  // }
  

  const isFetching = erc20IsFetching || erc721IsFetching
  const isFetched = erc20IsFetched || erc721IsFetched
  
  let lootBoxBalanceTotal = ethers.utils.bigNumberify(0)
  
  // this is what the proxy hook will return:
  // const awardBalances = []
  console.log(erc20Balances)
  erc20Balances?.forEach(award => {
    lootBoxBalanceTotal = lootBoxBalanceTotal.add(award.balance)
  })
  const alreadyClaimed = lootBoxBalanceTotal?.eq(0)

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

    <div className='xs:w-2/4 sm:w-5/12 lg:w-1/4 mt-3 mb-2'>
      {isFetching && !isFetched ?
        <BeatLoader
          size={10}
          color='rgba(255,255,255,0.3)'
        /> :
        <PlunderLootBoxTxButton
          pool={pool}
          alreadyClaimed={alreadyClaimed}
          prizeNumber={prizeNumber}
        />
      }
    </div>
    
    {awards.length > 0 && <>
      <div
        className='text-inverse rounded-lg p-0 xs:pb-3 mb-4'
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
                style={{ paddingBottom: 0 }}
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

        <hr />
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
      blockNumber={blockNumber}
      poolAddress={poolAddress}
      querySymbol={pool.symbol}
      prize={prize}
    >
      {({ preAwardTimeTravelPool }) => <LootBoxWonTable
        historical
        pool={preAwardTimeTravelPool}
        prizeNumber={prizeNumber}
        prize={prize}
      />}
    </TimeTravelPool>
  )
}
