import React, { useContext } from 'react'

import { useUserTickets } from 'lib/hooks/useUserTickets'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'

export default function TestPage(props) {
  const { usersAddress } = useContext(AuthControllerContext)
  useUserTickets(usersAddress)

  return null
}
