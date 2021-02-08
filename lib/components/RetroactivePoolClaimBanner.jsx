import React, { useContext, useEffect } from 'react'
import { useAtom } from 'jotai'

import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Banner } from 'lib/components/Banner'
import { Button } from 'lib/components/Button'
import { showClaimWizardAtom } from 'lib/components/ClaimRetroactivePoolWizard'
import { useTranslation } from 'lib/../i18n'
import { useRetroactivePoolClaimData } from 'lib/hooks/useRetroactivePoolClaimData'

import Bell from 'assets/images/bell@2x.png'

export const RetroactivePoolClaimBanner = (props) => {
  const { t } = useTranslation()
  const [showClaimWizard, setShowClaimWizard] = useAtom(showClaimWizardAtom)
  const { chainId, usersAddress } = useContext(AuthControllerContext)
  const { data, loading } = useRetroactivePoolClaimData()

  useEffect(() => {
    setShowClaimWizard(false)
  }, [usersAddress])

  // TODO:  Remove. Temporary block on mainnet so nobody gets confused while testing.
  if (chainId === 1) return null

  if (loading || data?.isClaimed) {
    return null
  }

  return (
    <Banner gradient={'rainbow'} className='mb-12'>
      <div className='flex sm:flex-row flex-col'>
        <div className='mb-3 sm:mb-2 ml-0 mr-auto sm:mb-auto sm:mr-4 sm:mt-1'>
          <img className='shake' src={Bell} style={{ maxWidth: 30 }} />
        </div>
        <div>
          <h6>{t('youCanClaimPool')}</h6>
          <p className='mt-1 mb-5 text-xs sm:text-sm w-full xs:w-10/12 sm:w-9/12'>
            {t('retroactivePoolBannerDescription')}
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
            {t('claimPool')}
          </Button>
        </div>
      </div>
    </Banner>
  )
}
