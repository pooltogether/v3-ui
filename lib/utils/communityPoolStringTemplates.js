export const nameTemplate = (poolGraphData) => `${poolGraphData.underlyingCollateralSymbol} Community Pool`

export const symbolTemplate = (poolGraphData) =>
  `${poolGraphData.underlyingCollateralSymbol}-${poolGraphData.id.substr(0, 8)}`