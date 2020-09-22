export const addTokenToMetaMask = async (pool) => {
  try {
    // wasAdded is a boolean. Like any RPC method, an error may be thrown.
    const wasAdded = await ethereum.request({
      method: 'wallet_watchAsset',
      params: {
        type: 'ERC20', // Initially only supports ERC20, but eventually more!
        options: {
          address: pool?.ticket, // The address that the token is at.
          symbol: 'POOLT', // A ticker symbol or shorthand, up to 5 chars.
          // symbol: pool?.symbol?.substring(0, 5), // A ticker symbol or shorthand, up to 5 chars.
          decimals: pool?.underlyingCollateralDecimals, // The number of decimals in the token
          image: 'https://pooltogether.com/pooltogether-token-logo@2x.png', // A string url of the token logo
        },
      },
    });

    if (wasAdded) {
      console.log('Thanks for your interest!');
    } else {
      console.log('Token not added');
    }
  } catch (error) {
    console.log(error);
  }
}
