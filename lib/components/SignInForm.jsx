import React from 'react'
import { useOnboard } from '@pooltogether/hooks'

import { useTranslation } from 'lib/../i18n'
import { Button } from 'lib/components/Button'
import { PTHint } from 'lib/components/PTHint'

import PoolTogetherTrophyDetailed from 'assets/images/pooltogether-trophy--detailed.svg'
import PoolTogetherPOOLToken from 'assets/images/pool-icon.svg'

export function SignInForm(props) {
  const { descriptionClassName, hideImg, retroClaim, postSignInCallback } = props

  const { t } = useTranslation()

  const { connectWallet } = useOnboard()

  return (
    <div className='text-inverse'>
      {!hideImg && (
        <img
          src={retroClaim ? PoolTogetherPOOLToken : PoolTogetherTrophyDetailed}
          className='mx-auto mb-6 w-16 xs:w-1/12'
        />
      )}

      <h5 className={descriptionClassName}>
        {retroClaim
          ? t('connectWalletToClaimPoolTokens')
          : t('connectAWalletToManageTicketsAndRewards')}
      </h5>

      <Button
        textSize='lg'
        onClick={(e) => {
          e.preventDefault()
          connectWallet(postSignInCallback)
        }}
      >
        {t('connectWallet')}
      </Button>

      {!retroClaim && (
        <PTHint
          title='Ethereum'
          className='mt-4 mx-auto w-48'
          tip={
            <>
              <div className='my-2 text-xs sm:text-sm'>{t('whatIsEthereumOne')}</div>
              <div className='text-xs sm:text-sm'>{t('whatIsEthereumTwo')}</div>
            </>
          }
        >
          <span className='opacity-60 font-bold text-caption w-48'>{t('whatsAnEthereum')}</span>
        </PTHint>
      )}
    </div>
  )
}
