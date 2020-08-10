import React, { useState, useEffect } from 'react'
import FeatherIcon from 'feather-icons-react'
import { useRouter } from 'next/router'

import { Button } from 'lib/components/Button'
import { isEmptyObject } from 'lib/utils/isEmptyObject'

const { getProfile } = require('3box/lib/api')

const isValidImage = (image) => {
  if (image && image[0] && image[0].contentUrl) {
    return true
  }

  return false
}

export const AccountButton = (props) => {
  const router = useRouter()
  const { usersAddress } = props
  const [profile, setProfile] = useState()

  const handleShowAccount = (e) => {
    e.preventDefault()

    router.push('/account', '/account', { shallow: true })
  }

  useEffect(() => {
    const get3BoxProfile = async () => {
      const boxProfile = await getProfile(usersAddress)
      setProfile(boxProfile)
    }

    if (usersAddress) {
      get3BoxProfile()
    }
  }, [usersAddress])

  return <button
    onClick={handleShowAccount}
    className='font-bold text-secondary hover:text-blue text-xxs sm:text-base py-1 sm:py-2 pl-3 sm:pl-6 trans tracking-wider outline-none focus:outline-none active:outline-none'
  >
    <div className='flex items-center'>
      <FeatherIcon
        icon='user'
        className='stroke-current w-4 h-4 sm:hidden'
        strokeWidth='3'
      />

      <div
        className='hidden sm:block'
      >
        {(profile && isValidImage(profile.image)) && <>
          <img
            alt='profile avatar'
            src={`https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`}
            className='relative inline-block rounded-full w-8 h-8 mr-1'
            style={{
              top: -3
            }}
          />
        </>} {(profile && profile.name) && profile.name}
      </div>
    </div>
  </button>
}
