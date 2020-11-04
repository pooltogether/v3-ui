import { useContext, useState, useEffect } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { shorten } from 'lib/utils/shorten'

const { getProfile } = require('3box/lib/api')

export function ProfileName(props) {
  const [profile, setProfile] = useState()

  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress } = authControllerContext

  useEffect(() => {
    const get3BoxProfile = async () => {
      const boxProfile = await getProfile(usersAddress)
      setProfile(boxProfile)
    }

    if (usersAddress) {
      get3BoxProfile()
    }
  }, [usersAddress])

  const name = (profile && profile.name) ?
    profile.name :
    shorten(usersAddress)

  return name
}
