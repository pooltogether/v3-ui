import React, { useState } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { isEmpty, map, find, defaultTo, sum } from 'lodash'
import { useAtom } from 'jotai'
import { useAllPools, useTransaction } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import ComptrollerAbi from '@pooltogether/pooltogether-contracts_3_3/abis/Comptroller'

import { useTranslation } from 'react-i18next'
import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { BlockExplorerLink } from 'lib/components/BlockExplorerLink'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { ThemedClipSpinner } from 'lib/components/loaders/ThemedClipSpinner'
import { usePlayerDrips } from 'lib/hooks/usePlayerDrips'
import { useSendTransactionWrapper } from 'lib/hooks/useSendTransactionWrapper'
import { useUsersDripData } from 'lib/hooks/useUsersDripData'
import { extractPoolRewardsFromUserDrips } from 'lib/utils/extractPoolRewardsFromUserDrips'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { isSelfAtom } from 'lib/components/AccountUI'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'

// This has been removed from the app for most people, but if someone still has rewards/tickets to claim
// it will show up for them
export const DeprecatedRewards = () => {
  const [isSelf] = useAtom(isSelfAtom)

  if (!isSelf) {
    return null
  }

  return <AccountRewardsView />
}

export const AccountRewardsView = (props) => {
  const { t } = useTranslation()

  const { address } = useOnboard()

  const { data: pools } = useAllPools()

  const { playerDrips } = usePlayerDrips(address)
  const { usersDripData, graphDripData } = useUsersDripData()

  const poolAddresses = map(pools, 'poolAddress')
  const playerRewards = extractPoolRewardsFromUserDrips({ poolAddresses, playerDrips })

  const [activeTxDripIds, setActiveTxDripIds] = useState([])

  const txName = t(`claimRewards`)
  const method = 'updateAndClaimDrips'
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransactionWrapper()
  const tx = useTransaction(txId)

  const handleClaim = async (drip) => {
    const { comptroller, updatePairs, dripTokens } = getParamsForClaim([drip.id])
    // shim
    // 0x178969a87a78597d303c47198c66f68e8be67dc2 => 0x2f6e61d89d43b3ada4a909935ee05d8ca8db78de
    // old
    // 0xc7c406A867B324b9189b9a7503683eFC9BdCe5BA
    const oldDaiContractPair = {
      measure: updatePairs[0].measure,
      source: '0xc7c406a867b324b9189b9a7503683efc9bdce5ba'
    }
    const params = [[...updatePairs, oldDaiContractPair], usersAddress, dripTokens]

    const id = await sendTx({
      name: txName,
      contractAbi: ComptrollerAbi,
      contractAddress: comptroller,
      method,
      params
    })
    setTxId(id)
  }

  const getParamsForClaim = (drips = []) => {
    const updatePairs = []
    const dripTokens = []
    let comptroller

    for (let i = 0; i < drips.length; i++) {
      let drip = graphDripData.balanceDrips.find(
        (drip) => drip.dripToken.toLowerCase() === drips[i].toLowerCase()
      )
      if (!drip) {
        drip = graphDripData.volumeDrips.find(
          (drip) => drip.dripToken.toLowerCase() === drips[i].toLowerCase()
        )
      }

      let [
        comptrollerAddress,
        sourceAddress,
        measureTokenAddress,
        dripTokenAddress,
        isReferral,
        playerAddress
      ] = drip.id.split('-')

      isReferral = Boolean(parseInt(isReferral, 10))

      updatePairs.push({
        source: sourceAddress,
        measure: measureTokenAddress
      })
      dripTokens.push(dripTokenAddress)
      comptroller = comptroller || comptrollerAddress
    }

    return { comptroller, updatePairs, dripTokens }
  }

  const getFormattedNumber = (value, decimals) => {
    const formatted =
      value && decimals
        ? ethers.utils.formatUnits(value, decimals || DEFAULT_TOKEN_PRECISION)
        : '0.0'

    return (
      <>
        <div className='font-bold text-flashy'>
          <PoolCountUp
            duration={14}
            fontSansRegular
            end={Number.parseFloat(formatted)}
            decimals={8}
          />
          {/* <PoolNumber>
          {numberWithCommas(formatted, { precision: 6 })}
        </PoolNumber> */}
        </div>
      </>
    )
  }

  const getDripDataByAddress = (dripTokenAddress, dripTokenData) => {
    const dripTokens = playerRewards?.allDrips || []

    const zero = ethers.utils.parseEther('0')

    const dripData = defaultTo(
      find(dripTokens, (d) => d.dripToken.address === dripTokenAddress),
      {
        id: dripTokenAddress,
        dripToken: {
          address: dripTokenAddress,
          ...dripTokenData
        },
        claimable: zero,
        balance: zero
      }
    )

    dripData.claimable = usersDripData ? usersDripData[dripTokenAddress].claimable : zero
    dripData.balance = usersDripData ? usersDripData[dripTokenAddress].balance : zero

    return dripData
  }

  const getClaimButton = (dripData) => {
    let disabled

    if (!dripData?.claimable?.gt(0)) {
      disabled = true
    }

    if (tx && !tx.completed && activeTxDripIds.includes(dripData.id)) {
      return (
        <>
          <div className='flex flex-col sm:flex-row items-center justify-end'>
            <span className='order-1 sm:order-2'>
              <ThemedClipSpinner />
              <span className='text-teal font-bold ml-2 mt-1'>{t('claiming')}</span>
            </span>

            <span className='order-2 sm:order-1'>
              {!isEmpty(tx.hash) && (
                <>
                  <BlockExplorerLink
                    chainId={tx.ethersTx.chainId}
                    txHash={tx.hash}
                    className='text-xxxs text-teal sm:mr-3'
                  >
                    Etherscan
                  </BlockExplorerLink>
                </>
              )}
            </span>
          </div>
        </>
      )
    }

    return (
      <>
        <a
          className={classnames('underline cursor-pointer stroke-current font-bold', {
            'cursor-not-allowed opacity-20': disabled
          })}
          onClick={(e) => {
            e.preventDefault()

            if (disabled) {
              return
            }

            setActiveTxDripIds([...activeTxDripIds, dripData.id])

            handleClaim(dripData)
          }}
        >
          {t('claim')}
        </a>
      </>
    )
  }

  const getRewardsDripRows = () => {
    return map(usersDripData, (dripTokenData, dripTokenAddress) => {
      const dripData = getDripDataByAddress(dripTokenAddress, dripTokenData)

      const isPoolDaiTickets =
        dripTokenData.name === 'PoolTogether Dai Ticket (Compound)' ||
        dripTokenData.name === 'DAI Ticket'

      return (
        <tr key={dripData.id}>
          <td className='px-2 sm:px-3 py-2 text-left font-bold'>
            {isPoolDaiTickets && (
              <>
                <PoolCurrencyIcon sm symbol='DAI' />
              </>
            )}{' '}
            {isPoolDaiTickets ? t('daiTickets') : dripData.dripToken.name}
          </td>
          <td className='px-2 sm:px-3 py-2 text-left'>
            {getFormattedNumber(dripData.claimable, dripData.dripToken.decimals)}
          </td>
          <td className='px-2 sm:px-3 py-2 text-right'>{getClaimButton(dripData)}</td>
        </tr>
      )
    })
  }

  const getTotalRewards = () => {
    const amounts = map(usersDripData, (dripTokenData, dripTokenAddress) => {
      const dripData = getDripDataByAddress(dripTokenAddress, dripTokenData)

      return Boolean(dripData.claimable) && Boolean(dripData.dripToken.decimals)
        ? parseFloat(ethers.utils.formatUnits(dripData.claimable, dripData.dripToken.decimals))
        : 0.0
    })

    return sum(amounts)
  }

  if (getTotalRewards() < 1) {
    return null
  }

  return (
    <>
      <div className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3'>
        <div className='flex justify-between flex-col xs:flex-row xs:pt-4 pb-0 px-2 xs:px-4'>
          <div className='flex-col order-2 xs:order-1'>
            <h6 className='flex items-center font-normal'>{t('totalRewards')}</h6>

            <h3>
              $<PoolNumber>{numberWithCommas(getTotalRewards(), { precision: 2 })}</PoolNumber>
            </h3>
          </div>

          <div className='order-1 xs:order-2 ml-auto'>
            <img src={PrizeIllustration} className='w-32 mx-auto' />
          </div>
        </div>

        <div className='text-inverse flex flex-col justify-between xs:px-2'>
          <table className='table-fixed w-full text-xxs xs:text-base mt-6'>
            <tbody>{getRewardsDripRows()}</tbody>
          </table>
        </div>
      </div>
    </>
  )
}
