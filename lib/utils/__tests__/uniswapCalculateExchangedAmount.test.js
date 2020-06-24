import { ethers } from 'ethers'

import { uniswapCalculateExchangedAmount } from '../uniswapCalculateExchangedAmount'

const bn = ethers.utils.bigNumberify

describe('uniswapCalculateExchangedAmount', () => {

  describe('regular Eth => Token', () => {
    it('gives exchanged amount in Dai when provided Ether & basic rate', () => {
      expect(
        uniswapCalculateExchangedAmount(
          bn('3000000000000000000'),
          '174',
          18
        ).toString()
      ).toEqual('522000000000000000000')
    })

    it('gives exchanged amount in USDC when provided Ether & basic rate', () => {
      expect(
        uniswapCalculateExchangedAmount(
          bn('2000000000000000000'), // 2 Ether
          '122',
          6
        ).toString()
      ).toEqual('244000000')
    })
  })


  describe('inverted Token => Eth', () => {
    it('gives exchanged amount in Wei when provided Dai & inverted rate', () => {
      expect(
        uniswapCalculateExchangedAmount(
          bn('120000000000000000000'), // 120 Dai
          '0.005681949396555407',
          18
        ).toString()
      ).toEqual('681833927586648840')
    })

    it('gives exchanged amount in Wei when provided USDC & inverted rate', () => {
      expect(
        uniswapCalculateExchangedAmount(
          bn('400000000'), // 400 USDC
          '0.0012345',
          6
        ).toString()
      ).toEqual('493800000000000000')
    })
  })
})
