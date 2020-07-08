import React, { useState, useEffect } from 'react'
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

  const handleShowDashboard = (e) => {
    e.preventDefault()

    router.push('/dashboard')
  }

  useEffect(() => {
    const get3BoxProfile = async () => {
      const boxProfile = await getProfile(usersAddress)

      if (!isEmptyObject(boxProfile)) {
        setProfile(boxProfile)
      }
    }

    if (usersAddress) {
      get3BoxProfile()
    }
  }, [usersAddress])

  return <Button
    outline
    onClick={handleShowDashboard}
  >
    <div className='flex items-center'>
    {(profile && isValidImage(profile.image)) && <>
      <img
        alt='profile avatar'
        src={`https://ipfs.infura.io/ipfs/${profile.image[0].contentUrl['/']}`}
        className='inline-block rounded-full w-6 h-6 mr-1'
      />
    </>} {(profile && profile.name) ? profile.name : 'Account'}
    </div>
  </Button>
}
