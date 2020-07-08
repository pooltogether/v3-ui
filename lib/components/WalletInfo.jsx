import React, { useContext } from 'react'
import classnames from 'classnames'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Button } from 'lib/components/Button'
import { networkColorClassname } from 'lib/utils/networkColorClassname'
import { chainIdToName } from 'lib/utils/chainIdToName'
import { shortenAddress } from 'lib/utils/shortenAddress'

export const WalletInfo = () => {
  const authControllerContext = useContext(AuthControllerContext)
  const { usersAddress, chainId, walletName } = authControllerContext

  let innerContent = null
  let networkName = null

  if (chainId && chainId !== 1) {
    networkName = <span
      className={classnames(
        networkColorClassname(chainId),
        'inline-block'
      )}
    >
      {chainIdToName(chainId)}
    </span>
  }

  if (usersAddress && walletName) {
    innerContent = <>
      <div className='text-base sm:text-lg lg:text-xl leading-snug text-default trans'>
        <h2
          className='text-default-soft mt-10'
        >
          ETH Address:
        </h2>
        <div
          className='overflow-ellipsis w-full no-underline text-secondary'
        >
          {shortenAddress(usersAddress)}
        </div>

        <h2
          className='text-default-soft mt-10'
        >
          Wallet:
        </h2>
        <div
          className='rounded-lg capitalize text-secondary'
        >
          {walletName}
        </div>

        <h2
          className='text-default-soft mt-10'
        >
          Network:
        </h2>
        <div
          className='rounded-lg capitalize text-secondary'
        >
          {networkName}
        </div>
{/* 
        {magic && signedIn && <>
          <div className='mt-16'>
            <Button
              outline
              onClick={authControllerContext.signOut}
            >
              Sign out
          </Button>
          </div>
        </>} */}
      </div>

      <div className='mt-16'>
        <Button 
          outline
          onClick={authControllerContext.signOut}
        >
          Sign out
        </Button>
      </div>
    </>
  }

  return <>
    <div
      className='relative flex flex-col justify-center items-center'
    > 
      {innerContent}
    </div>
  </>

}
