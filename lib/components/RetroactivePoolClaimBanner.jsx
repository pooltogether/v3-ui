import { useAtom } from 'jotai'
import { Banner } from 'lib/components/Banner'
import { Button } from 'lib/components/Button'
import { showClaimWizardAtom } from 'lib/components/ClaimRetroactivePoolWizard'
import React, { useState } from 'react'

import Bell from 'assets/images/bell.svg'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'

export const RetroactivePoolClaimBanner = (props) => {
  const [showClaimWizard, setShowClaimWizard] = useAtom(showClaimWizardAtom)

  const {
    data, 
    loading,
    error
  } = useRetroactivePoolClaimData()

  if (loading || data?.isClaimed) {
    return null
  }

  return <Banner gradient={'rainbow'} className='mb-12'>
    <div className='flex sm:flex-row flex-col'>
      <img className='mb-4 mx-auto sm:ml-0 sm:mr-8 sm:mb-auto' src={Bell} />
      <div>
        <h4>You can claim POOL tokens!</h4>
        <p className='mb-8 text-xs xs:text-sm sm:text-base'>We’ve launched governance tokens to push forward our mission for decentralization. Token holders now own and direct the protocol. Claim your token and take part in our governance!</p>
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
}
