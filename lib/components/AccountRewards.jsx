import React, { useContext, useState } from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { isEmpty, map, find, defaultTo, sum } from 'lodash'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { useTranslation } from 'lib/../i18n'
import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { ThemedClipLoader } from 'lib/components/loaders/ThemedClipLoader'
import { usePlayerDrips } from 'lib/hooks/usePlayerDrips'
import { useCurrentPool } from 'lib/hooks/usePools'
import { useUsersDripData } from 'lib/hooks/useUsersDripData'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { extractPoolRewardsFromUserDrips } from 'lib/utils/extractPoolRewardsFromUserDrips'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'
import { useTransaction } from 'lib/hooks/useTransaction'
import { useAllPools, usePoolBySymbol } from 'lib/hooks/usePools'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'

export const AccountRewards = () => {
  const { t } = useTranslation()

  const { usersAddress, provider } = useContext(AuthControllerContext)

  const { data: pools } = useAllPools()

  // rewards are only supported by the cDAI pool atm
  const { data: pool } = usePoolBySymbol('PT-cDAI')

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const { playerDrips } = usePlayerDrips(address)

  const { usersDripData, graphDripData } = useUsersDripData()

  const poolAddresses = map(pools, 'poolAddress')
  const playerRewards = extractPoolRewardsFromUserDrips({ poolAddresses, playerDrips })

  let domain = ''
  if (window && window.location) {
    domain = `${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
  }
  const referralAddress = `https://${domain}/?referrer=${usersAddress ? usersAddress : ''}`
  const shortReferralAddress = `${domain}/?referrer=${usersAddress ? shorten(usersAddress) : ''}`

  const [activeTxDripIds, setActiveTxDripIds] = useState([])

  const txName = t(`claimRewards`)
  const method = 'updateAndClaimDrips'
  const [txId, setTxId] = useState(0)
  const sendTx = useSendTransaction()
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

    const id = await sendTx(txName, ComptrollerAbi, comptroller, method, params)
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

    // TODO: Handle multiple claims at once
    if (tx && !tx.completed && activeTxDripIds.includes(dripData.id)) {
      return (
        <>
          <div className='flex flex-col sm:flex-row items-center justify-end'>
            <span className='order-1 sm:order-2'>
              <ThemedClipLoader />
              <span className='text-teal font-bold ml-2 mt-1'>{t('claiming')}</span>
            </span>

            <span className='order-2 sm:order-1'>
              {!isEmpty(tx.hash) && (
                <>
                  <EtherscanTxLink
                    chainId={tx.ethersTx.chainId}
                    hash={tx.hash}
                    className='text-xxxs text-teal sm:mr-3'
                  >
                    Etherscan
                  </EtherscanTxLink>
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
                <PoolCurrencyIcon sm pool={{ underlyingCollateralSymbol: 'dai' }} />
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
      <h5 className='font-normal text-accent-2 mt-12 mb-4'>{t('myRewards')}</h5>

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

      {/* <div
      className='flex flex-col sm:flex-row items-center justify-between bg-accent-grey-4 px-4 sm:px-10 py-4 text-inverse rounded-lg mt-4'
    >
      <div className='flex-grow sm:w-4/12 lg:w-1/2 sm:mr-3 text-xxs sm:text-xs pb-2 sm:pb-0'>
        {t('inviteFriendsAndEarnReferralRewards')}
      </div>

      <PTCopyToClipboard
        text={referralAddress}
        textShort={shortReferralAddress}
      />
    </div> */}
    </>
  )
}
