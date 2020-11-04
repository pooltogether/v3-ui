import React from 'react'

import { Trans, useTranslation } from 'lib/../i18n'
import { ButtonLink } from 'lib/components/ButtonLink'
import { Tagline } from 'lib/components/Tagline'

import ChillWalletIllustration from 'assets/images/pt-illustration-chill@2x.png'

export const VoteUI = (
  props,
) => {

  return <>
    <div className='sm:w-2/3 lg:w-7/12 text-center mx-auto mb-20'>
      <img
        src={ChillWalletIllustration}
        alt="chillin' wallet illustration"
        className='w-1/2 xs:w-1/3 lg:w-2/3 mx-auto relative mb-4'
        style={{
          right: -30
        }}
      />
      <h4
        className='mb-6'
      >
        Direct the future of PoolTogether!
      </h4>
      <div
        className='mb-6 text-sm xs:text-base sm:text-lg text-green'
      >
        Community is at the heart of our success. Therefore, only those with tickets will be able participate.
        <br />Each ticket holder can vote once per proposal.
      </div>

      <ButtonLink
        as='https://snapshot.page/#/pooltogether'
        href='https://snapshot.page/#/pooltogether'
        target='_blank'
        rel='noreferrer noopener'
      >
        See proposals
        </ButtonLink>
      </div>
    <Tagline />
  </>
}
