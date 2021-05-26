import React from 'react'
import { ethers } from 'ethers'

import { SECONDS_PER_DAY } from 'lib/constants'
import { Trans } from 'react-i18next'
import { Banner } from 'lib/components/Banner'
import { displayPercentage } from 'lib/utils/displayPercentage'

import Bell from 'assets/images/bell-red@2x.png'

const bn = ethers.BigNumber.from

export const DepositExpectationsWarning = (props) => {
  const { pool } = props

  /// @return creditLimitMantissa The credit limit fraction
  //          This number is used to calculate both the credit limit and early exit fee.
  const creditLimitMantissa = pool.config.tokenCreditRates[0].creditLimitMantissa
  if (!creditLimitMantissa) {
    return null
  }

  const creditLimitMantissaBN = creditLimitMantissa ? bn(creditLimitMantissa) : bn(0)
  const percent = ethers.utils.formatEther(creditLimitMantissaBN.mul(100)) || '-'

  /// @return creditRateMantissa The credit rate. This is the amount of tokens that accrue per second
  const creditRateMantissaBN = bn(pool.config.tokenCreditRates[0].creditRateMantissa)
  const durationInSecondsBN = creditLimitMantissaBN.div(creditRateMantissaBN)
  const days = durationInSecondsBN.toNumber() / SECONDS_PER_DAY

  return (
    <Banner
      gradient={null}
      className='bg-primary mt-4 sm:mt-8 mx-auto w-full text-accent-1 text-xxs'
      style={{ maxWidth: 380 }}
    >
      <img className='mx-auto mb-3 h-8' src={Bell} />

      <span className='sm:leading-tight sm:ml-2'>
        <Trans
          i18nKey='youCanWithdrawWithNoPenaltyDescription'
          defaults='You can withdraw with no penalty {{days}} days after depositing. Funds withdrawn earlier are subjected to up to a {{percent}}% early exit fee. <a>Learn more</a>'
          components={{
            a: (
              <a
                className='underline'
                href='https://docs.pooltogether.com/protocol/prize-pool/fairness'
                target='_blank'
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
