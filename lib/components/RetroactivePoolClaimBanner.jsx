import React, { useContext, useState } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Banner } from 'lib/components/Banner'
import Bell from 'assets/images/bell.svg'
import { Button } from 'lib/components/Button'
import { showClaimWizardAtom } from 'lib/components/ClaimRetroactivePoolWizard'
import { useAtom } from 'jotai'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'

export const RetroactivePoolClaimBanner = props => {
  const [showClaimWizard, setShowClaimWizard] = useAtom(showClaimWizardAtom)
  const { chainId } = useContext(AuthControllerContext)
  const { data, loading, error } = useRetroactivePoolClaimData()

  // TODO:  Remove. Temporary block on mainnet so nobody gets confused while testing.
  if (chainId === 1) return null

  if (loading || data?.isClaimed) {
    return null
  }

  return (
    <Banner gradient={'rainbow'} className='mb-12'>
      <div className='flex sm:flex-row flex-col'>
        <img className='mb-4 mx-auto sm:ml-0 sm:mr-8 sm:mb-auto' src={Bell} />
        <div>
          <h6>You can claim POOL tokens!</h6>
          <p className='mb-8 text-xs xs:text-sm sm:text-base'>
            PoolTogether is now fully decentralized with the POOL token. Claim
            your token and take part in governance!
          </p>
          <Button
            type='button'
            onClick={() => setShowClaimWizard(true)}
            className='w-full sm:w-auto'
            border='transparent'
            text='green'
            bg='secondary'
            hoverBorder='transparent'
            hoverText='green'
            hoverBg='primary'
            textSize='sm'
          >
            Claim POOL
          </Button>
        </div>
      </div>
    </Banner>
  )
}
