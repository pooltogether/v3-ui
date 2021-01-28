import React, { useContext } from 'react'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Banner } from 'lib/components/Banner'
import { Button } from 'lib/components/Button'
import { showClaimWizardAtom } from 'lib/components/ClaimRetroactivePoolWizard'
import { useAtom } from 'jotai'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'

import Bell from 'assets/images/bell@2x.png'

export const RetroactivePoolClaimBanner = props => {
  const [showClaimWizard, setShowClaimWizard] = useAtom(showClaimWizardAtom)
  const { chainId } = useContext(AuthControllerContext)
  const { data, loading } = useRetroactivePoolClaimData()

  // TODO:  Remove. Temporary block on mainnet so nobody gets confused while testing.
  if (chainId === 1) return null

  if (loading || data?.isClaimed) {
    return null
  }

  return (
    <Banner gradient={'rainbow'} className='mb-12'>
      <div className='flex sm:flex-row flex-col'>
        <img className='mb-3 sm:mb-2 ml-0 mr-auto sm:mb-auto sm:mr-4 sm:mt-1' src={Bell} style={{ maxWidth: 30 }} />
        <div>
          <h6>You can claim POOL tokens!</h6>
          <p className='mt-1 mb-5 text-xs sm:text-sm w-full xs:w-10/12 sm:w-9/12'>
            PoolTogether is now fully decentralized with the POOL token. Claim
            your token and take part in governance!
          </p>
          <Button
            type='button'
            onClick={() => setShowClaimWizard(true)}
            className='w-full xs:w-auto'
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
