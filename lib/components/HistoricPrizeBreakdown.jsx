import React from 'react'
import Link from 'next/link'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useTranslation } from 'react-i18next'

import { useContractAddresses } from 'lib/hooks/useContractAddresses'
import { useAccountQuery } from 'lib/hooks/useAccountQuery'
import { PlayerLabel } from 'lib/components/PlayerLabel'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PodsCTA } from 'lib/components/PodsCTA'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { formatDate } from 'lib/utils/formatDate'
import { numberWithCommas } from 'lib/utils/numberWithCommas'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'
import LootBoxIllustration from 'assets/images/lootbox-closed-halo@2x.png'
import GiftIcon from 'assets/images/icon-gift@2x.png'

const ETHEREUM_MAINNET_SOHM_POOL_ADDRESS = '0xeab695a8f5a44f583003a8bc97d677880d528248'

export const HistoricPrizeBreakdown = (props) => {
  const { prize, prizeNumber, preAwardPool, pool } = props

  const { t } = useTranslation()
  const { contractAddresses } = useContractAddresses(pool.chainId)

  if (!contractAddresses) {
    return null
  }

  const externalPrizeUsd = prize.external.totalValueUsd
  const hasLootBox = Boolean(externalPrizeUsd) && Number(externalPrizeUsd) > 0

  const lootBoxWon = prize?.awardedExternalErc721Nfts.find(
    (_awardedNft) => _awardedNft.address === contractAddresses.lootBox
  )
  const grandPrizeWinnersAddress = lootBoxWon?.winner

  let awardedControlledTokens = prize?.awardedControlledTokens
    ? [...prize.awardedControlledTokens]
    : []
  if (grandPrizeWinnersAddress) {
    const grandPrizeWinner = awardedControlledTokens.find(
      (awardedControlledToken) => awardedControlledToken.winner === grandPrizeWinnersAddress
    )
    const indexToRemove = awardedControlledTokens.indexOf(grandPrizeWinner)
    if (indexToRemove > -1) {
      awardedControlledTokens.splice(indexToRemove, 1)
    }
    if (grandPrizeWinner) {
      awardedControlledTokens.unshift(grandPrizeWinner)
    }
  }

  // TODO: Make this better when refactoring usePool & usePools
  // This will display the first user in the list of unique addresses that won external erc20s as the grand prize winner.
  // Which can be wrong be false if erc20 external awards are split between all winners.
  if (awardedControlledTokens.length === 0 && prize?.awardedExternalErc20Tokens?.length > 0) {
    const uniqueWinners = [
      ...new Set(prize.awardedExternalErc20Tokens.map((token) => token.winner))
    ]
    awardedControlledTokens = uniqueWinners.map((address) => ({
      winner: address,
      id: address
    }))
  }

  return (
    <>
      <div className='non-interactable-card mt-4 mb-6 py-4 sm:py-6 px-4 xs:px-4 sm:px-10 bg-card rounded-lg card-min-height-desktop'>
        <div className='text-caption uppercase'>
          <img src={GiftIcon} className='inline-block mr-2 card-icon' /> {t('prizeAndWinners')}
        </div>

        <h4>
          {t('prize')} #{prizeNumber}
        </h4>

        {prize?.awardedTimestamp && (
          <div className='-mt-1'>
            <span className='text-accent-1'>{t('awardedOn')}:</span>{' '}
            {formatDate(prize?.awardedTimestamp)}
          </div>
        )}

        <div className='flex flex-col xs:flex-row'>
          {hasLootBox && <div className='hidden sm:block sm:w-2/12'>&nbsp;</div>}

          <div
            className={classnames(
              'flex flex-col items-center justify-center text-center w-full h-56 xs:h-64',
              {
                'xs:w-5/12': hasLootBox
              }
            )}
          >
            <img src={PrizeIllustration} className='w-40 mx-auto' />
            <DisplayYieldPrizeUsd pool={pool} prize={prize} />
          </div>

          {hasLootBox && (
            <>
              <div className='w-full xs:w-2/12 text-center -mt-2 xs:mt-24 mb-2 xs:mb-0 xs:pt-3 text-5xl font-bold leading-none'>
                +
              </div>

              <div className='flex flex-col items-center justify-center text-center w-full xs:w-5/12 h-56 xs:h-64'>
                <img src={LootBoxIllustration} className='w-40 mx-auto -mt-8' />
                <div
                  className='relative'
                  style={{
                    top: 3
                  }}
                >
                  <h3>{`$${numberWithCommas(externalPrizeUsd)}`}</h3>
                  <span className='text-sm xs:text-base sm:text-xl'>{t('lootBox')}</span>
                </div>
              </div>

              <div className='hidden sm:block sm:w-2/12'>&nbsp;</div>
            </>
          )}
        </div>

        <PodsCTA pool={pool} />

        <div className='mt-1 xs:mt-0 py-2 rounded-lg'>
          <table className='w-full text-xxxs xs:text-xxs sm:text-sm align-top'>
            <thead>
              <tr style={{ background: 'none' }} className='text-left'>
                {hasLootBox && <th>{t('prize')}</th>}
                <th>{t('player')}</th>
                <th>{t('deposit')}</th>
              </tr>
            </thead>
            <tbody>
              {prize?.awardedTimestamp ? (
                <>
                  {awardedControlledTokens?.map((awardedControlledToken, index) => {
                    return (
                      <PrizeWinner
                        key={`prize-winner-row-${awardedControlledToken.id}`}
                        awardedControlledToken={awardedControlledToken}
                        hasLootBox={hasLootBox}
                        isGrandPrizeWinner={index === 0}
                        prize={prize}
                        preAwardPool={preAwardPool}
                        winnersAddress={awardedControlledToken.winner}
                        poolContract={pool.contract}
                        chainId={pool.chainId}
                      />
                    )
                  })}
                </>
              ) : (
                <tr>
                  <td
                    colSpan='4'
                    className='text-center'
                    style={{
                      paddingTop: '0.5rem'
                    }}
                  >
                    {t('prizeNotAwardedYet')}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}

const PrizeWinner = (props) => {
  const { t } = useTranslation()

  const {
    awardedControlledToken,
    isGrandPrizeWinner,
    hasLootBox,
    prize,
    winnersAddress,
    preAwardPool,
    poolContract,
    chainId
  } = props

  const underlyingToken = preAwardPool.tokens.underlyingToken
  const ticketToken = preAwardPool.tokens.ticket
  const ticketAddress = ticketToken.address
  const decimals = ticketToken.decimals
  const blockNumber = prize.awardedBlock

  const { data: accountData } = useAccountQuery(
    chainId,
    winnersAddress,
    poolContract.subgraphVersion,
    blockNumber - 1
  )
  const ctBalance = accountData?.controlledTokenBalances.find(
    (ct) => ct.controlledToken.id === ticketAddress
  )

  const usersTicketBalance = ctBalance?.balance
    ? Number(ethers.utils.formatUnits(ctBalance.balance, Number(decimals)))
    : ''

  if (!ctBalance) {
    return null
  }

  return (
    <tr>
      {hasLootBox && (
        <td className='py-2'>{isGrandPrizeWinner ? t('grandPrize') : t('runnerUp')}</td>
      )}
      <td>
        <Link href='/players/[playerAddress]' as={`/players/${winnersAddress}`}>
          <a className='text-accent-1'>
            <PlayerLabel
              id={`tooltip-playerLabel-${winnersAddress}-historicPrizeBreakdown`}
              playerAddress={winnersAddress}
            />{' '}
          </a>
        </Link>
      </td>
      <td>
        <PoolNumber>{numberWithCommas(usersTicketBalance, { precision: 0 })}</PoolNumber>{' '}
        {underlyingToken.symbol}
      </td>
    </tr>
  )
}

const DisplayYieldPrizeUsd = (props) => {
  const { prize, pool } = props

  const yieldPrizeUsd = prize.yield.totalValueUsd
  const amount = prize.yield.amount

  const isSohm =
    pool.prizePool.address.toLowerCase() === ETHEREUM_MAINNET_SOHM_POOL_ADDRESS.toLowerCase()

  return (
    <div>
      <h3>{isSohm ? `${numberWithCommas(amount)} sOHM` : `$${numberWithCommas(yieldPrizeUsd)}`}</h3>
    </div>
  )
}
