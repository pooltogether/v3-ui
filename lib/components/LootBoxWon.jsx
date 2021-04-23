import React, { Fragment } from 'react'
import BeatLoader from 'react-spinners/BeatLoader'
import { ethers } from 'ethers'

import { useTranslation } from 'lib/../i18n'
import { PoolNumber } from 'lib/components/PoolNumber'
import { Erc20Image } from 'lib/components/Erc20Image'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PlunderLootBoxTxButton } from 'lib/components/PlunderLootBoxTxButton'
import { useEthereumErc20Query } from 'lib/hooks/useEthereumErc20Query'
import { useEthereumErc721Query } from 'lib/hooks/useEthereumErc721Query'
import { useEthereumErc1155Query } from 'lib/hooks/useEthereumErc1155Query'
import { usePoolByAddress } from 'lib/hooks/usePools'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { extractPrizeNumberFromPrize } from 'lib/utils/extractPrizeNumberFromPrize'
import { usePastPrize } from 'lib/hooks/usePastPrizes'
import { V3LoadingDots } from 'lib/components/V3LoadingDots'
import { useReadProvider } from 'lib/hooks/providers/useReadProvider'
import { usePoolTokenChainId } from 'lib/hooks/chainId/usePoolTokenChainId'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'

export const LootBoxWon = (props) => {
  const { lootBox } = props

  const prizeNumber = extractPrizeNumberFromPrize(lootBox.prize)
  const prizePooladdress = lootBox.prize.prizePool.id

  const chainId = usePoolTokenChainId()
  const { data: pool, isFetched: poolIsFetched } = usePoolByAddress(chainId, prizePooladdress)
  const { data: prize, isFetched: prizeIsFetched } = usePastPrize(pool, prizeNumber)

  // console.log(poolIsFetched, pool, prizeIsFetched, prize)

  if (!poolIsFetched || !prizeIsFetched) {
    return (
      <div className='flex w-ful justify-center'>
        <V3LoadingDots />
      </div>
    )
  }

  return (
    <LootBoxWonTable lootBox={prize?.lootBox} pool={pool} prizeNumber={prizeNumber} prize={prize} />
  )
}

const LootBoxWonTable = (props) => {
  const { t } = useTranslation()

  const { lootBox, prizeNumber, pool, prize } = props
  const computedAddress = lootBox?.computedAddress

  if (!computedAddress) {
    return <div>Error resolving lootbox address!</div>
  }

  const lootBoxErc20s = lootBox.erc20Tokens.map((award) => ({ address: award.address }))
  const lootBoxErc721s = lootBox.erc721Tokens.map((award) => ({
    address: award.erc721Entity.id,
    tokenIds: [award.tokenId]
  }))
  const lootBoxErc1155s = lootBox.erc1155Tokens.map((award) => ({
    address: award.erc1155Entity.id,
    tokenIds: [award.tokenId]
  }))

  const { data: readProvider } = useReadProvider(pool.chainId)

  const {
    data: erc20Balances,
    error: erc20Error,
    isFetching: erc20IsFetching,
    isFetched: erc20IsFetched
  } = useEthereumErc20Query({
    chainId: pool.chainId,
    provider: readProvider,
    graphErc20Awards: lootBoxErc20s,
    balanceOfAddress: computedAddress
  })

  const {
    data: erc721Tokens,
    error: erc721Error,
    isFetching: erc721IsFetching,
    isFetched: erc721IsFetched
  } = useEthereumErc721Query({
    chainId: pool.chainId,
    provider: readProvider,
    graphErc721Awards: lootBoxErc721s,
    balanceOfAddress: computedAddress
  })

  const {
    data: erc1155Balances,
    error: erc1155Error,
    isFetching: erc1155IsFetching,
    isFetched: erc1155IsFetched
  } = useEthereumErc1155Query({
    chainId: pool.chainId,
    provider: readProvider,
    erc1155Awards: lootBoxErc1155s,
    balanceOfAddress: computedAddress
  })

  if (erc20Error) {
    console.warn(erc20Error)
  }
  if (erc721Error) {
    console.warn(erc721Error)
  }
  if (erc1155Error) {
    console.warn(erc1155Error)
  }

  const isFetching = erc20IsFetching || erc721IsFetching || erc1155IsFetching
  const isFetched = erc20IsFetched || erc721IsFetched || erc1155IsFetched

  if (lootBoxErc20s.length + lootBoxErc721s.length + lootBoxErc1155s.length === 0) return null

  if (!isFetched) {
    return (
      <div className='flex w-ful justify-center'>
        <V3LoadingDots />
      </div>
    )
  }

  let lootBoxBalanceTotal = ethers.BigNumber.from(0)
  let lootBoxErc1155BalanceTotal = ethers.BigNumber.from(0)

  erc20Balances?.forEach((award) => {
    lootBoxBalanceTotal = lootBoxBalanceTotal.add(award.balance)
  })
  let alreadyClaimed = lootBoxBalanceTotal?.eq(0)

  if (erc721Tokens) {
    lootBoxErc721s.forEach((erc721) => {
      const award = erc721Tokens[erc721.address]
      if (award?.ownerOf === computedAddress) {
        alreadyClaimed = false
      }
    })
  }

  erc1155Balances?.forEach((award) => {
    lootBoxErc1155BalanceTotal = lootBoxErc1155BalanceTotal.add(award.balance)
  })
  if (lootBoxErc1155BalanceTotal.gt(0)) {
    alreadyClaimed = false
  }

  return (
    <>
      <h6 className='flex items-center font-normal'>
        {t('lootBoxNumber', {
          number: prizeNumber
        })}
      </h6>

      <h3 className='mb-1'>
        $<PoolNumber>{numberWithCommas(lootBox.totalValueUsd, { precision: 2 })}</PoolNumber>{' '}
        {t('value')}
      </h3>

      <span className='text-caption'>
        {prize?.awardedTimestamp && (
          <>
            <span className='text-accent-1'>{t('awardedOn')}:</span>{' '}
            {formatDate(prize?.awardedTimestamp, {
              short: true
            })}
            ,{' '}
            <div className='inline-block ml-1 relative' style={{ top: -2 }}>
              <PoolCurrencyIcon xs symbol={pool.tokens.underlyingToken.symbol} />
            </div>{' '}
            {t('tickerPool', {
              ticker: pool?.underlyingCollateralSymbol?.toUpperCase()
            })}
          </>
        )}
      </span>

      <div className='xs:w-2/4 sm:w-5/12 lg:w-1/4 mt-3 mb-2'>
        {isFetching && !isFetched ? (
          <BeatLoader size={10} color='rgba(255,255,255,0.3)' />
        ) : (
          <PlunderLootBoxTxButton
            pool={pool}
            lootBox={lootBox}
            alreadyClaimed={alreadyClaimed}
            prizeNumber={prizeNumber}
          />
        )}
      </div>

      {lootBox.erc20Tokens.length > 0 && (
        <>
          <div className='text-inverse rounded-lg p-0 xs:pb-3 mb-4'>
            <table className='table-fixed text-xxxs xs:text-xxs sm:text-sm align-top'>
              <thead>
                <tr style={{ background: 'none' }}>
                  <th className='w-6/12' style={{ paddingBottom: 0 }}>
                    <h6 className='text-green text-left'>
                      {t('amountTokens', {
                        amount: lootBox.erc20Tokens.length
                      })}
                    </h6>
                  </th>
                  <th className='w-4/12'></th>
                  <th className='w-2/12 sm:w-1/12'></th>
                </tr>
              </thead>
              <tbody>
                {lootBox.erc20Tokens.map((erc20, index) => {
                  const name = erc20.name

                  if (!name) {
                    return
                  }

                  return (
                    <Fragment key={`${erc20.address}-${index}`}>
                      <tr>
                        <td className='flex items-center text-left font-bold'>
                          <Erc20Image address={erc20.address} />{' '}
                          <BlockExplorerLink
                            address={erc20.address}
                            className='text-inverse truncate'
                            chainId={pool.chainId}
                          >
                            {name}
                          </BlockExplorerLink>
                        </td>
                        <td className='text-left text-accent-1 truncate'>
                          <PoolNumber>
                            {numberWithCommas(erc20.amount, { precision: 2 })}
                          </PoolNumber>{' '}
                          {erc20.symbol}
                        </td>
                        <td className='font-bold text-right'>
                          {`$${numberWithCommas(erc20.totalValueUsd, { precision: 2 })}`}
                        </td>
                      </tr>
                    </Fragment>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  )
}
