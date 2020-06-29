import Cookies from 'js-cookie'
import { useEffect } from 'react'
import { Magic, RPCError, RPCErrorCode } from 'magic-sdk'

import { MAGIC_EMAIL } from 'lib/constants'

export const AuthMagic = async (props) => {

  // useEffect(() => {
    const networkName = process.env.NEXT_JS_DEFAULT_ETHEREUM_NETWORK_NAME

    const magic = new Magic(
      process.env.NEXT_JS_MAGIC_PUB_KEY,
      { network: networkName === 'homestead' ? 'mainnet' : networkName }
    )
    const email = Cookies.get(MAGIC_EMAIL)
    console.log({ email })

    if (email) {

      if (await magic.user.isLoggedIn()) {
        const didToken = await magic.user.getIdToken()

        // Do something with the DID token.
        // For instance, this could be a `fetch` call
        // to a protected backend endpoint.
        // document.getElementById('your-access-token').innerHTML = didToken
      }/* else {
        // Log in the user
        const user = await magic.auth.loginWithMagicLink({ email })
      }*/

    }
    
    // if (email) {
    //   autoSignIn()
    // }
  // })
  
  // return null  
}
