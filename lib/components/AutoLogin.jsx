import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { Magic, RPCError, RPCErrorCode } from 'magic-sdk'

import {
  COOKIE_OPTIONS,
  MAGIC_EMAIL,
  MAGIC_IS_LOGGED_IN
} from 'lib/constants'

export const AutoLogin = (props) => {

  useEffect(() => {
    const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

    const magic = new Magic(
      process.env.NEXT_JS_MAGIC_PUB_KEY,
      { network: networkName === 'homestead' ? 'mainnet' : networkName }
    )
    const email = Cookies.get(MAGIC_EMAIL)
    console.log({ email })

    const autoSignIn = async () => {
      if (await magic.user.isLoggedIn()) {
        // const didToken = await magic.user.getIdToken()

        Cookies.set(
          MAGIC_IS_LOGGED_IN,
          true,
          COOKIE_OPTIONS
        )
      }/* else {
        // Log in the user
        const user = await magic.auth.loginWithMagicLink({ email })
      }*/
    }

    if (email) {
      autoSignIn()
    }
  })
  
  return null  
}
