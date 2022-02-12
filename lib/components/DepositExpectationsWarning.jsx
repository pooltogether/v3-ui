import React from 'react'
import classnames from 'classnames'
import { ethers } from 'ethers'
import { ExternalLink, LinkTheme } from '@pooltogether/react-components'
import { Trans } from 'react-i18next'
import Image from 'next/image'

import { SECONDS_PER_DAY } from 'lib/constants'
import { Banner } from 'lib/components/Banner'
import { displayPercentage } from 'lib/utils/displayPercentage'

import Bell from 'images/bell-red@2x.png'

const bn = ethers.BigNumber.from

export const DepositExpectationsWarning = (props) => {
  const { creditLimitMantissa, creditRateMantissa, className } = props

  /// @return creditLimitMantissa The credit limit fraction
  //          This number is used to calculate both the credit limit and early exit fee.
  if (!creditLimitMantissa) {
    return null
  }

  const creditLimitMantissaBN = creditLimitMantissa ? bn(creditLimitMantissa) : bn(0)
  const percent = ethers.utils.formatEther(creditLimitMantissaBN.mul(100)) || '-'

  /// @return creditRateMantissa The credit rate. This is the amount of tokens that accrue per second
  const creditRateMantissaBN = bn(creditRateMantissa)
  const durationInSecondsBN = !creditRateMantissaBN.isZero()
    ? creditLimitMantissaBN.div(creditRateMantissaBN)
    : ethers.constants.Zero
  const days = durationInSecondsBN.toNumber() / SECONDS_PER_DAY

  return (
    <Banner
      gradient={null}
      className={classnames(
        'flex items-center mx-auto w-full bg-primary text-accent-1 text-xxs xs:text-xs lg:text-sm mt-4 sm:mt-8 max-w-lg',
        className
      )}
    >
      <Image className='mx-auto h-8 mr-4' src={Bell} />

      <span className='sm:ml-2'>
        <Trans
          i18nKey='youCanWithdrawWithNoPenaltyDescription'
          defaults='You can withdraw with no penalty {{days}} days after depositing. Funds withdrawn earlier are subjected to up to a {{percent}}% early exit fee. <a>Learn more</a>'
          components={{
            a: (
              <ExternalLink
                theme={LinkTheme.accent}
                underline
                href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
                className='text-xxs'
              />
            )
          }}
          values={{
            days,
            percent: displayPercentage(percent)
          }}
        />
      </span>
    </Banner>
  )
}
