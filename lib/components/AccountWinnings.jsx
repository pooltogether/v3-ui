import React, { useContext, useState } from 'react'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'
import ClipLoader from 'react-spinners/ClipLoader'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { useQuery } from '@apollo/client'
import { isEmpty, map, find, defaultTo, sum } from 'lodash'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { useTranslation, Trans } from 'lib/../i18n'
import { DEFAULT_TOKEN_PRECISION } from 'lib/constants'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'
import { EtherscanTxLink } from 'lib/components/EtherscanTxLink'
import { PoolCurrencyIcon } from 'lib/components/PoolCurrencyIcon'
import { PoolNumber } from 'lib/components/PoolNumber'
import { PoolCountUp } from 'lib/components/PoolCountUp'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { poolToast } from 'lib/utils/poolToast'
import { extractPoolRewardsFromUserDrips } from 'lib/utils/extractPoolRewardsFromUserDrips'
import { numberWithCommas } from 'lib/utils/numberWithCommas'
import { shorten } from 'lib/utils/shorten'

import IconTarget from 'assets/images/icon-target.svg'

export const AccountWinnings = () => {
  const { t } = useTranslation()
  
  const { pools, dynamicPlayerDrips, usersChainData, graphDripData } = useContext(PoolDataContext)
  const { usersAddress, provider } = useContext(AuthControllerContext)

  const poolAddresses = map(pools, 'poolAddress')
  const playerRewards = extractPoolRewardsFromUserDrips({poolAddresses, dynamicPlayerDrips})

  let domain = ''
  if (window && window.location) {
    domain = `${window.location.hostname}${window.location.port ? `:${window.location.port}` : ''}`
  }
  const referralAddress = `https://${domain}/?referrer=${usersAddress ? usersAddress : ''}`
  const shortReferralAddress = `${domain}/?referrer=${usersAddress ? shorten(usersAddress) : ''}`

  const { usersDripTokenData } = usersChainData

  const [activeTxDripIds, setActiveTxDripIds] = useState([])

  const [txId, setTxId] = useState(0)

  const txName = t(`claimRewards`)
  const method = 'updateAndClaimDrips'

  const [sendTx] = useSendTransaction(txName)

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions
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

  const handleCopy = () => {
    poolToast.success(t('copiedToClipboard'))
  }

  const handleClaim = (drip) => {
    const { comptroller, updatePairs, dripTokens } = getParamsForClaim([drip.id])

    const params = [
      updatePairs,
      usersAddress,
      dripTokens,
      // {
      //   gasLimit: 500000
      // }
    ]

    const id = sendTx(
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
    if (!(dripData.claimable.gt(0))) {
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

      return <>
        <tr key={dripData.id}>
          <td className='px-2 sm:px-3 py-2 text-left font-bold'>
            {isPoolDaiTickets ? t('daiTickets') : dripData.dripToken.name}
          </td>
          <td className='px-2 sm:px-3 py-2 text-left opacity-60'>
            5.04% APR
          </td>
          <td className='px-2 sm:px-3 py-2 text-left'>
            {getFormattedNumber(dripData.claimable, dripData.dripToken.decimals)}
          </td>
          <td className='px-2 sm:px-3 py-2 text-right'>
            {getClaimButton(dripData)}
          </td>
        </tr>
      </>
    })
  }
 
  const getTotalRewards = () => {
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
    <div
      className='xs:mt-3 bg-card rounded-lg xs:mx-0 px-2 sm:px-6 py-2 xs:py-3'
    >
      <div className='flex  justify-between xs:pt-4 pb-0 px-2 xs:px-4'>

        <div className='flex-col'>
          <h6
            className='flex items-center font-normal'
          >
            {t('totalRewards')}
          </h6>

          <h3>
            <PoolNumber>
              {numberWithCommas(getTotalRewards(), { precision: 6 })}
            </PoolNumber>
          </h3>
          <div
            className='opacity-60'
          >
            ${numberWithCommas(getTotalRewards(), { precision: 6 })}
          </div>
        </div>

        <div>
          <img
            src={IconTarget}
            className='w-32 mx-auto'
          />
        </div>
      </div>

      <div
        className='text-inverse flex flex-col justify-between xs:px-2'
      >
        <table
          className='table-fixed w-full text-xxs xs:text-base sm:text-xl mt-6'
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

      <CopyToClipboard
        text={referralAddress}
        onCopy={handleCopy}
      >
        <a
          className='flex w-full sm:w-8/12 lg:w-1/2 items-center cursor-pointer stroke-current text-inverse hover:text-white h-8 py-1 xs:mb-2 sm:mb-0 bg-primary hover:bg-highlight-2 rounded-sm trans'
          title='Copy to clipboard'
        >
          <span
            className='px-2 sm:px-6 flex-grow text-xxs xs:text-xs w-16 truncate'
          >{shortReferralAddress}</span>
          <FeatherIcon
            icon='copy'
            className='w-4 h-4 mx-1 sm:mx-6 my-1 justify-self-end'
          />
        </a>
      </CopyToClipboard>
    </div>
  </>
}
