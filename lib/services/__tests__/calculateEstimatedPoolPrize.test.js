import { ethers } from 'ethers'

import { calculateEstimatedPoolPrize } from '../calculateEstimatedPoolPrize'

const bn = ethers.utils.bigNumberify

describe('calculateEstimatedPoolPrize', () => {

  it('returns 0 if loading data', () => {
    const result = calculateEstimatedPoolPrize({
      underlyingCollateralDecimals: undefined,
      awardBalance: undefined,
      totalSupply: undefined,
      totalSponsorship: undefined,
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
      totalSupply: ethers.utils.parseEther('4000000'),
      totalSponsorship: ethers.utils.parseEther('1000000'),
      supplyRatePerBlock: bn('123456701'),
      prizePeriodRemainingSeconds: bn('3600'),
    })

    expect(
      result.toString()
    ).toEqual('202222220618000000000')
  })

  it('returns the correct estimate for a default 18 token precision set of contracts', () => {
    const underlyingCollateralDecimals = '6'
    const result = calculateEstimatedPoolPrize({
      underlyingCollateralDecimals,
      awardBalance: ethers.utils.parseUnits('400', underlyingCollateralDecimals),
      totalSupply: ethers.utils.parseUnits('6000000', underlyingCollateralDecimals),
      totalSponsorship: ethers.utils.parseUnits('3000000', underlyingCollateralDecimals),
      supplyRatePerBlock: bn('12345670123'),
      prizePeriodRemainingSeconds: bn('500'),
    })

    expect(
      result.toString()
    ).toEqual('455555515')
  })

})
