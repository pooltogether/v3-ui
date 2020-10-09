import React, { useContext, useState } from 'react'
import { ethers } from 'ethers'
import { map, find, defaultTo } from 'lodash'
import CopyToClipboard from 'react-copy-to-clipboard'
import FeatherIcon from 'feather-icons-react'

import ComptrollerAbi from '@pooltogether/pooltogether-contracts/abis/Comptroller'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { PoolDataContext } from 'lib/components/contextProviders/PoolDataContextProvider'

import { useTranslation } from 'lib/../i18n'
import { useSendTransaction } from 'lib/hooks/useSendTransaction'

import { Button } from 'lib/components/Button'
import { poolToast } from 'lib/utils/poolToast'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { extractPoolRewardsFromUserDrips } from 'lib/utils/extractPoolRewardsFromUserDrips'
import { shorten } from 'lib/utils/shorten'
import { DRIP_TOKENS } from 'lib/constants'


export const AccountRewardsUI = () => {
  const { t } = useTranslation()
  const { pools, dynamicPlayerDrips, usersChainData } = useContext(PoolDataContext)
  const { usersAddress, provider } = useContext(AuthControllerContext)

  const poolAddresses = map(pools, 'poolAddress')
  const playerRewards = extractPoolRewardsFromUserDrips({poolAddresses, dynamicPlayerDrips})
  console.log({playerRewards, usersChainData})

  const shortReferralAddress = `pooltogether.com/?referrer=${shorten(usersAddress)}`
  const referralAddress = `pooltogether.com/?referrer=${usersAddress}`

  // const [txId, setTxId] = useState()

  const txName = 'Update and Claim Rewards' // t(`updateAndClaimDrips`, { poolName: pool?.name })
  const method = 'updateAndClaimDrips'

  const [sendTx] = useSendTransaction(txName)


  const handleCopy = () => {
    poolToast.success(`Copied to clipboard!`)
  }

  const handleClaim = (dripId) => (e) => {
    e.preventDefault()

    const { comptroller, updatePairs, dripTokens } = getParamsForClaim([dripId])

    const params = [
      updatePairs,
      usersAddress,
      dripTokens,
      {
        gasLimit: 400000
      }
    ]

    console.log('sendTx', params)

    // const id = sendTx(
    sendTx(
      t,
      provider,
      usersAddress,
      ComptrollerAbi,
      comptroller,
      method,
      params,
    )

    // setTxId(id)
  }

  const getParamsForClaim = (drips = []) => {
    const updatePairs = []
    const dripTokens = []
    let comptroller

    for (let i = 0; i < drips.length; i++) {
      let [
        comptrollerAddress,
        sourceAddress,
        measureTokenAddress,
        dripTokenAddress,
        isReferral,
        playerAddress
      ] = drips[i].split('-')

      isReferral = Boolean(parseInt(isReferral, 10))
      console.log({comptrollerAddress, sourceAddress, measureTokenAddress, dripTokenAddress, isReferral, playerAddress})

      updatePairs.push({
        source: sourceAddress,
        measure: measureTokenAddress,
      })
      dripTokens.push(dripTokenAddress)
      comptroller = comptroller || comptrollerAddress
    }

    return {comptroller, updatePairs, dripTokens}
  }

  const getFormattedNumber = (value) => {
    const formatted = ethers.utils.formatEther(value)
    const [integer, fraction] = formatted.split('.')
    return (
      <div className='font-semibold'>
        {integer}.{fraction.slice(0, 3)}
        <span className='font-semibold text-accent-1'>{fraction.slice(3, 6)}</span>
      </div>
    )
  }

  const getDripDataByAddress = (dripTokenAddress, dripTokenData) => {
    const dripTokens = playerRewards?.allDrips || []
    const { usersDripBalance } = usersChainData
    const zero = ethers.utils.parseEther('0')

    const userDripTokenData = defaultTo(find(dripTokens, d => d.dripToken.address === dripTokenAddress), {
      id: dripTokenAddress,
      dripToken: {
        address: dripTokenAddress,
        ...dripTokenData
      },
      balance: zero
    })

    // Drip token balance is the claimable balance; let's rename it
    //   "claimable" will be the amount of tokens they can claim
    //   "balance" will be the amount of tokens in their wallet
    userDripTokenData.claimable = userDripTokenData.balance
    userDripTokenData.balance = usersDripBalance[dripTokenAddress].balance || zero

    return userDripTokenData
  }

  const getRewardsDripRows = () => {
    return map(DRIP_TOKENS, (dripTokenData, dripTokenAddress) => {

      const dripData = getDripDataByAddress(dripTokenAddress, dripTokenData)
      return (
        <tr key={dripData.id}>
          <td className='px-4 py-2 text-left font-bold'>{dripData.dripToken.name}</td>
          <td className='px-4 py-2 text-left'>
            {getFormattedNumber(dripData.balance)}
          </td>
          <td className='px-4 py-2 text-left'>
            {getFormattedNumber(dripData.claimable)}
          </td>
          <td className='px-4 py-2 text-right'>
            {
              dripData.claimable > 0 && (
                <a
                  className="underline cursor-pointer stroke-current text-xs font-bold"
                  onClick={handleClaim(dripData.id)}
                >
                  Claim
                </a>
              )
            }
          </td>
        </tr>
      )
    })
  }

  return <>
    <div
      className='non-interactable-card mt-2 py-3 px-3 bg-card rounded-lg card-min-height-desktop'
    >
      <div
        className='bg-primary px-4 py-2 text-inverse flex items-center justify-between rounded-lg'
      >
        <div className='flex-1 uppercase font-semibold text-xxs text-accent-1'>
          invite friends &amp; earn referral rewards
        </div>

        <div className='flex-1 rounded-sm bg-accent-grey-3'>
          <CopyToClipboard
            text={referralAddress}
            onCopy={handleCopy}
          >
            <a
              className='flex cursor-pointer stroke-current hover:text-secondary text-primary w-full h-8 py-1'
              title='Copy to clipboard'
            >
              <span className='mx-2 flex-grow font-bold'>{shortReferralAddress}</span>
              <FeatherIcon
                icon='copy'
                className='w-4 h-4 mx-2 my-1 justify-self-end'
              />
            </a>
          </CopyToClipboard>
        </div>
      </div>

{/*
      <div className='py-2 px-1'>
        <h2>Rewards wallet</h2>
      </div>

      <div className='bg-highlight-3 rounded-lg text-white pool-gradient-1 mt-2 mb-8 mx-auto px-5 py-5'>
        <div className='flex items-center justify-between'>
          <div className='w-8/12'>
            <div className='text-2xl font-bold text-white -mt-1'>
              123.456<span className='text-accent-1'>789</span>
            </div>
            <div className='text-caption -mt-1 uppercase font-bold'>
              Claimable Rewards
            </div>
          </div>

          <div className='flex flex-col items-end justify-center w-4/12'>
            <Button
              textSize='lg'
              className='rounded-full'
              onClick={handleClaim}
            >
              Claim
            </Button>
          </div>
        </div>
      </div>
*/}

      <div className='py-2 px-1'>
        <h3>Rewards</h3>
      </div>

      <div
        className='bg-primary text-inverse flex justify-between rounded-lg px-4 py-4 mt-2'
      >
        <table className="table-fixed w-full divide-y divide-indigo-300">
          <thead>
            <tr>
              <th className='w-1/4 px-4 py-2 text-left'>Token</th>
              <th className='w-1/4 px-4 py-2 text-left font-bold'>Balance</th>
              <th className='w-1/4 px-4 py-2 text-left'>Claimable</th>
              <th className='w-1/4 px-4 py-2'>&nbsp;</th>
            </tr>
          </thead>
          <tbody>
            {
              getRewardsDripRows()
            }
          </tbody>
        </table>
      </div>

    </div>
  </>
}
