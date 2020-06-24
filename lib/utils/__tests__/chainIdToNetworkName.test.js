import { chainIdToNetworkName } from '../chainIdToNetworkName'

describe('chainIdToNetworkName', () => {

  it('gives the names', () => {
    expect(
      chainIdToNetworkName(1)
    ).toEqual('mainnet')

    expect(
      chainIdToNetworkName(3)
    ).toEqual('ropsten')

    expect(
      chainIdToNetworkName(4)
    ).toEqual('rinkeby')

    expect(
      chainIdToNetworkName(42)
    ).toEqual('kovan')

    expect(() => {
      chainIdToNetworkName(678)
    }).toThrow()
  })

})