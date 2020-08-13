import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useQuery } from '@apollo/client'

import { LoadingSpinner } from 'lib/components/LoadingSpinner'
import { transactionsQuery } from 'lib/queries/transactionQueries'
import { shorten } from 'lib/utils/shorten'

const { getProfile } = require('3box/lib/api')

const isValidImage = (image) => {
  if (image && image[0] && image[0].contentUrl) {
    return true
  }

  return false
}

export const AccountButton = (props) => {
  const { openTransactions, usersAddress } = props
  const [profile, setProfile] = useState()

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

  return <button
    onClick={openTransactions}
    className='text-inverse hover:text-green text-xxs sm:text-sm trans tracking-wider outline-none focus:outline-none active:outline-none mr-2'
  >
    <div
      className='flex items-center leading-none'
    >
      {pendingTransactionsCount > 0 && <>
        <div
          className='relative hidden sm:block mr-2 bg-card rounded-l-full py-2 px-3 pr-5 z-10'
          style={{
            right: -20
          }}
        >
          {pendingTxJsx}
        </div>
      </>}

      <span
        className={classnames(
          'flex items-center leading-none bg-default hover:bg-card rounded-full border-2 border-highlight-2 px-3 sm:px-5 py-1 trans leading-none z-20',
        )}
      >
        {pendingTransactionsCount > 0 ? <>
          <div className='block sm:hidden py-1'>
            {pendingTxJsx}
          </div>
          <div className='hidden sm:block'>
            {profileNameAndImage}
          </div>
        </> : <>
          {profileNameAndImage}
        </>}
      </span>
    </div>
  </button>
}
