import React, { useContext, useState } from 'react'
import ClipLoader from 'react-spinners/ClipLoader'
import classnames from 'classnames'
import { useAtom } from 'jotai'
import { ethers } from 'ethers'
import { isEmpty, map, find, defaultTo, sum } from 'lodash'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { useTranslation } from 'lib/../i18n'
import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { transactionsAtom } from 'lib/atoms/transactionsAtom'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { PTCopyToClipboard } from 'lib/components/PTCopyToClipboard'
import { usePlayerDrips } from 'lib/hooks/usePlayerDrips'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { extractPoolRewardsFromUserDrips } from 'lib/utils/extractPoolRewardsFromUserDrips'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

import PrizeIllustration from 'assets/images/prize-illustration-new@2x.png'

export const AccountRewards = () => {
  const { t } = useTranslation()

  const [transactions, setTransactions] = useAtom(transactionsAtom)
 
  const { pools, graphDripData } = usePools()
  const { pool } = usePool()
  const { usersChainData } = useUsersChainData(pool)

  const { usersAddress, provider } = useContext(AuthControllerContext)

  // fill this in with a watched address or an address from router params
  const playerAddress = ''
  const address = playerAddress || usersAddress

  const { playerDrips } = usePlayerDrips(address)

  const poolAddresses = map(pools, 'poolAddress')
  const playerRewards = extractPoolRewardsFromUserDrips({ poolAddresses, playerDrips })

  let domain = ''
  if (window && window.location) {
    domain = `${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
  }
  const referralAddress = `https://${domain}/?referrer=${usersAddress ? usersAddress : ''}`
  const shortReferralAddress = `${domain}/?referrer=${usersAddress ? shorten(usersAddress) : ''}`

  const { usersDripTokenData } = usersChainData || {}

  const [activeTxDripIds, setActiveTxDripIds] = useState([])

  const [txId, setTxId] = useState(0)

  const txName = t(`claimRewards`)
  const method = 'updateAndClaimDrips'

  const [sendTx] = useSendTransaction(txName, transactions, setTransactions)

  
  
  const txInFlight = transactions?.find((tx) => tx.id === txId)

  // const txsNotCompleted = transactions
  //   ?.filter(t => !t.completed && !t.cancelled)
  // useEffect(() => {
  //   // this is a heavy-handed reset of active tx rows and should be improved but will require 
  //   // putting params/identifying data into the tx object
  //   console.log(txsNotCompleted)
  //   if (activeTxDripIds.length > 0 && txsNotCompleted && txsNotCompleted.length === 0) {
  //     console.log('resetting!')
  //     setActiveTxDripIds([])
  //   }
  // }, [txsNotCompleted])

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
    console.log([...updatePairs, oldDaiContractPair])
    const params = [
      [...updatePairs, oldDaiContractPair],
      usersAddress,
      dripTokens,
    ]

    const id = await sendTx(
      t,
      provider,
      usersAddress,
      ComptrollerAbi,
      comptroller,
      method,
      params,
    )
    setTxId(id)
  }

  const getParamsForClaim = (drips = []) => {
    const updatePairs = []
    const dripTokens = []
    let comptroller

    for (let i = 0; i < drips.length; i++) {
      let drip = graphDripData.balanceDrips.find(drip => drip.dripToken.toLowerCase() === drips[i].toLowerCase())
      if (!drip) {
        drip = graphDripData.volumeDrips.find(drip => drip.dripToken.toLowerCase() === drips[i].toLowerCase())
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
        measure: measureTokenAddress,
      })
      dripTokens.push(dripTokenAddress)
      comptroller = comptroller || comptrollerAddress
    }

    return {comptroller, updatePairs, dripTokens}
  }

  const getFormattedNumber = (value, decimals) => {
    const formatted = ethers.utils.formatUnits(
      value,
      decimals || DEFAULT_TOKEN_PRECISION
    )

    return <>
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
  }

  const getDripDataByAddress = (dripTokenAddress, dripTokenData) => {
    const { usersDripTokenData } = usersChainData
    const dripTokens = playerRewards?.allDrips || []

    const zero = ethers.utils.parseEther('0')

    const dripData = defaultTo(find(dripTokens, d => d.dripToken.address === dripTokenAddress), {
      id: dripTokenAddress,
      dripToken: {
        address: dripTokenAddress,
        ...dripTokenData
      },
      claimable: zero,
      balance: zero
    })

    dripData.claimable = usersDripTokenData ? usersDripTokenData[dripTokenAddress].claimable : zero
    dripData.balance = usersDripTokenData ? usersDripTokenData[dripTokenAddress].balance : zero

    return dripData
  }

  const getClaimButton = (dripData) => {
    let disabled

    if (!dripData.claimable.gt(0)) {
      disabled = true
    }

    // TODO: Handle multiple claims at once
    if (txInFlight && !txInFlight.completed && activeTxDripIds.includes(dripData.id)) {
      return <>
        <div
          className='flex flex-col sm:flex-row items-center justify-end'
        >
          <span
            className='order-1 sm:order-2'
          >
            <ClipLoader
              size={14}
              color={'#049c9c'}
            />
            <span className='text-teal font-bold ml-2 mt-1'>{t('claiming')}</span>
          </span>

          <span
            className='order-2 sm:order-1'
          >
            {!isEmpty(txInFlight.hash) && <>
              <EtherscanTxLink
                chainId={txInFlight.ethersTx.chainId}
                hash={txInFlight.hash}
                className='text-xxxs text-teal sm:mr-3'
              >
                Etherscan
              </EtherscanTxLink>
            </>}
          </span>
        </div>
      </>
    }

    return <>
      <a
        className={classnames(
          'underline cursor-pointer stroke-current font-bold',
          {
            'cursor-not-allowed opacity-20': disabled
          }
        )}
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
  }

  const getRewardsDripRows = () => {
    return map(usersDripTokenData, (dripTokenData, dripTokenAddress) => {
      const dripData = getDripDataByAddress(dripTokenAddress, dripTokenData)

      const isPoolDaiTickets = dripTokenData.name === 'PoolTogether Dai Ticket (Compound)'
        || dripTokenData.name === 'DAI Ticket'

      const pool = pools?.[0]

      // this is using the only pool in the array, but if we wanted to do this properly
      // we would first iterate by pool and use the current rewards for that pool to do the calculation
      let daiPoolTickets,
        apr
      if (pool) {
        daiPoolTickets = pool &&
          parseFloat(
            ethers.utils.formatUnits(
              pool.ticketSupply,
              pool.underlyingCollateralDecimals
            )
          )
        apr = numberWithCommas(((1000 * 52) / daiPoolTickets) * 100)
      }

      return <tr key={dripData.id}>
        <td className='px-2 sm:px-3 py-2 text-left font-bold'>
          {isPoolDaiTickets && <>
            <PoolCurrencyIcon
              sm
              pool={{ underlyingCollateralSymbol: 'dai' }}
            />
          </>} {isPoolDaiTickets ? t('daiTickets') : dripData.dripToken.name}
        </td>
        <td className='px-2 sm:px-3 py-2 text-left opacity-60'>
          {apr}% APR
        </td>
        <td className='px-2 sm:px-3 py-2 text-left'>
          {getFormattedNumber(dripData.claimable, dripData.dripToken.decimals)}
        </td>
        <td className='px-2 sm:px-3 py-2 text-right'>
          {getClaimButton(dripData)}
        </td>
      </tr>
    })
  }
 
  const getTotalRewards = () => {
    // console.log(usersDripTokenData)
    const amounts = map(usersDripTokenData, (dripTokenData, dripTokenAddress) => {
      const dripData = getDripDataByAddress(dripTokenAddress, dripTokenData)

      return parseFloat(
        ethers.utils.formatUnits(
          dripData.claimable,
          dripData.dripToken.decimals
        )
      )
    })

    return sum(amounts)
  }

  return <>
    <h5
      className='font-normal text-accent-2 mt-12 mb-4'
    >
      {t('myRewards')}
    </h5>

    <div
      className='xs:mt-3 bg-accent-grey-4 rounded-lg xs:mx-0 px-2 sm:px-6 py-3'
    >
      <div className='flex justify-between flex-col xs:flex-row xs:pt-4 pb-0 px-2 xs:px-4'>

        <div className='flex-col order-2 xs:order-1'>
          <h6
            className='flex items-center font-normal'
          >
            {t('totalRewards')}
          </h6>

          <h3>
            <PoolNumber>
              {numberWithCommas(getTotalRewards(), { precision: 0 })}
            </PoolNumber>
          </h3>
          <div
            className='opacity-60'
          >
            ${numberWithCommas(getTotalRewards(), { precision: 6 })}
          </div>
        </div>

        <div
          className='order-1 xs:order-2 ml-auto'
        >
          <img
            src={PrizeIllustration}
            className='w-32 mx-auto'
          />
        </div>
      </div>

      <div
        className='text-inverse flex flex-col justify-between xs:px-2'
      >
        <table
          className='table-fixed w-full text-xxs xs:text-base mt-6'
        >
          <tbody>
            {getRewardsDripRows()}
          </tbody>
        </table>
      </div>
    </div>

    <div
      className='flex flex-col sm:flex-row items-center justify-between bg-accent-grey-4 px-4 sm:px-10 py-4 text-inverse rounded-lg mt-4'
    >
      <div className='flex-grow sm:w-4/12 lg:w-1/2 sm:mr-3 text-xxs sm:text-xs pb-2 sm:pb-0'>
        {t('inviteFriendsAndEarnReferralRewards')}
      </div>

      <PTCopyToClipboard
        text={referralAddress}
        textShort={shortReferralAddress}
      />
    </div>
  </>
}
