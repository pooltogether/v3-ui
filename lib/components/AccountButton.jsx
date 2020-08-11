import React, { useState, useEffect } from 'react'
import classnames from 'classnames'
import Jazzicon, { jsNumberForAddress } from 'react-jazzicon'
import { useQuery } from '@apollo/client'
import { useRouter } from 'next/router'

import { LoadingDots } from 'lib/components/LoadingDots'
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
  const router = useRouter()

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
      className='profile-img profile-img--jazzicon relative inline-block mr-1'
    >
      <Jazzicon
        diameter={25}
        seed={jsNumberForAddress(usersAddress)}
      />
    </div>

  const name = (profile && profile.name) ?
    profile.name :
    shorten(usersAddress)

  return <button
    onClick={openTransactions}
    className='text-inverse hover:text-green text-xxs sm:text-sm trans tracking-wider outline-none focus:outline-none active:outline-none mr-2'
  >
    <div
      className='flex items-center leading-none'
    >
      {pendingTransactionsCount > 0 && <>
        <span>
          <div
            className='relative inline-block ml-2 mr-1'
          >
            <LoadingDots />
          </div> {pendingCount} <span className='hidden sm:inline-block'>pending</span><span className='sm:hidden'></span>
        </span>
      </>}

      {pendingTransactionsCount.length}

      <span
        className={classnames(
          'flex items-center leading-none bg-default hover:bg-card rounded-full border-2 border-highlight-2 px-3 sm:px-5 py-1 trans leading-none',
          // {
          //   'px-4': pendingCount === 0,
          //   'px-3 ml-2': pendingCount > 0,
          // }
        )}
      >
        {image} {name}
      </span>
    </div>
  </button>
}
