export const addTokenToMetaMask = async (pool) => {
  try {
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20',
        options: {
          address: pool?.ticket?.id,
          symbol: 'POOLT', // A ticker symbol or shorthand, up to 5 chars.
          // symbol: pool?.symbol?.substring(0, 5), // A ticker symbol or shorthand, up to 5 chars.
          decimals: pool?.underlyingCollateralDecimals, // The number of decimals in the token
          image: 'https://app.pooltogether.com/pooltogether-token-logo@2x.png',
        },
      },
    })

    if (wasAdded) {
      // console.log('Thanks for your interest!')
    } else {
      console.log('Token not added')
    }
  } catch (error) {
    console.log(error)
  }
}
