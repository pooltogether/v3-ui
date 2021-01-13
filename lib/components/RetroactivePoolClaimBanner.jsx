import { useAtom } from 'jotai'
import { Banner } from 'lib/components/Banner'
import { Button } from 'lib/components/Button'
import { showClaimWizardAtom } from 'lib/components/ClaimRetroactivePoolWIzard'
import React from 'react'

import Bell from 'assets/images/bell.svg'

export const RetroactivePoolClaimBanner = (props) => {
  const [showClaimWizard, setShowClaimWizard] = useAtom(showClaimWizardAtom)

  // TODO: Fetch users claimable balance / if they've claimed, show accordingly.

  return <Banner gradient={'rainbow'} className='mb-8'>
    <div className='flex sm:flex-row flex-col'>
      <img className='mb-8 mr-auto sm:mr-8 sm:mb-auto' src={Bell} />
      <div>
        <h4>You can claim POOL tokens!</h4>
        <p className='mb-8 text-sm sm:text-base'>We’ve launched governance tokens to push forward our mission for decentralization. Token holders now own and direct the protocol. Claim your token and take part in our governance!</p>
        <Button type='button' onClick={() => setShowClaimWizard(true)}>Claim POOL</Button>
      </div>
    </div>
  </Banner>
}