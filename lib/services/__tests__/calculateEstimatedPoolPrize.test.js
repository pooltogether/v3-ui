import { ethers } from 'ethers'

import { calculateEstimatedPoolPrize } from '../calculateEstimatedPoolPrize'

const bn = ethers.utils.bigNumberify

describe('calculateEstimatedPoolPrize', () => {

  it('returns 0 if loading data', () => {
    const result = calculateEstimatedPoolPrize({
      underlyingCollateralDecimals: undefined,
      awardBalance: undefined,
      ticketSupply: undefined,
      sponsorshipSupply: undefined,
      supplyRatePerBlock: undefined,
      prizePeriodRemainingSeconds: undefined,
    })

    expect(
      result.toString()
    ).toEqual('0')
  })

  it('returns the correct estimate for a default 18 token precision set of contracts', () => {
    const result = calculateEstimatedPoolPrize({
      awardBalance: ethers.utils.parseEther('200'),
      ticketSupply: ethers.utils.parseEther('4000000'),
      sponsorshipSupply: ethers.utils.parseEther('1000000'),
      supplyRatePerBlock: bn('123456701'),
      prizePeriodRemainingSeconds: bn('3600'),
    })

    expect(
      result.toString()
    ).toEqual('200158641860785000000')
  })

  it('returns the correct estimate for a default 18 token precision set of contracts', () => {
    const underlyingCollateralDecimals = '6'
    const result = calculateEstimatedPoolPrize({
      underlyingCollateralDecimals,
      awardBalance: ethers.utils.parseUnits('400', underlyingCollateralDecimals),
      ticketSupply: ethers.utils.parseUnits('6000000', underlyingCollateralDecimals),
      sponsorshipSupply: ethers.utils.parseUnits('3000000', underlyingCollateralDecimals),
      supplyRatePerBlock: bn('12345670123'),
      prizePeriodRemainingSeconds: bn('500'),
    })

    expect(
      result.toString()
    ).toEqual('403888886')
  })

})
