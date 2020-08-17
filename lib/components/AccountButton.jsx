import React, { useContext, useState, useEffect } from 'react'
import classnames from 'classnames'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useQuery } from '@apollo/client'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { LoadingSpinner } from 'lib/components/LoadingSpinner'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { displayAmountInEther } from 'lib/utils/displayAmountInEther'
import { shorten } from 'lib/utils/shorten'
import { PoolCountUp } from './PoolCountUp'

const { getProfile } = require('3box/lib/api')

const isValidImage = (image) => {
  if (image && image[0] && image[0].contentUrl) {
    return true
  }

  return false
}

export const AccountButton = (props) => {
  const { openTransactions } = props
  const [profile, setProfile] = useState()

  const authControllerContext = useContext(AuthControllerContext)
  const { ethBalance, usersAddress } = authControllerContext

  const transactionsQueryResult = useQuery(transactionsQuery)
  const transactions = transactionsQueryResult?.data?.transactions

  const pendingTransactionsCount = transactions
    .filter(t => !t.completed)
    .length

  useEffect(() => {
    const get3BoxProfile = async () => {
      const boxProfile = await getProfile(usersAddress)
      setProfile(boxProfile)
    }

    if (usersAddress) {
      get3BoxProfile()
    }
  }, [usersAddress])

  const image = (profile && isValidImage(profile.image)) ?
    <img
      alt='profile avatar'
      src={`https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`}
      className='profile-img relative inline-block rounded-full w-6 h-6 mr-1'
    /> :
    <div
      className='profile-img profile-img--jazzicon relative inline-block mr-2'
    >
      <Jazzicon
        diameter={20}
        seed={jsNumberForAddress(usersAddress)}
      />
    </div>

  const name = (profile && profile.name) ?
    profile.name :
    shorten(usersAddress)

  const pendingTxJsx = <>
      <div
        className='relative inline-block mr-1'
        style={{
          top: 3,
          transform: 'scale(0.7)'
        }}
      >
        <LoadingSpinner />
      </div> {pendingTransactionsCount} pending
  </>

  const profileNameAndImage = <>
    {image} {name}
  </>

  const ethBalanceNumber = ethBalance && Number(displayAmountInEther(
    ethBalance,
    { precision: 2 }
  ))

  return <>
    <button
      onClick={openTransactions}
      className='text-inverse hover:text-green text-xxs sm:text-sm trans trans-fastest tracking-wider outline-none focus:outline-none active:outline-none'
    >
      <div
        className='flex items-center leading-none'
      > 
        {(ethBalance || pendingTransactionsCount > 0) && <>
          <div
            className='hidden xs:block relative block mr-2 bg-default rounded-l-full py-2 pl-4 pr-5 z-10'
            style={{
              right: -20
            }}
          >
            {pendingTransactionsCount > 0 ? <>
              <span className='text-inverse hover:text-green'>
                {pendingTxJsx}
              </span>
            </> : <>
              <span className='text-default-soft hover:text-green text-xxxs sm:text-xxs'>
                <PoolCountUp
                  start={0}
                  end={ethBalanceNumber}
                  decimals={2}
                /> ETH
              </span>
            </>}
          </div>
        </>}
      </div>
    </button>

    <button
      onClick={openTransactions}
      className='text-green hover:text-inverse text-xxs sm:text-sm trans trans-fastest tracking-wider outline-none focus:outline-none active:outline-none z-20'
    >
      <div
        className={classnames(
          'flex items-center leading-none bg-default hover:bg-card rounded-full border-2 border-highlight-2 px-2 py-1 trans trans-fastest leading-none z-20',
        )}
      >
        {pendingTransactionsCount > 0 && <>
          <div className='block xs:hidden text-green hover:text-inverse'>
            {pendingTxJsx}
          </div>
        </>}
        
        {profileNameAndImage}
      </div>
    </button>
  </>
}
