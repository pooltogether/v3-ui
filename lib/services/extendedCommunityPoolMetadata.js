import { symbolTemplate, nameTemplate } from 'lib/utils/communityPoolStringTemplates'

export const extendedCommunityPoolMetadata = (poolGraphData) => {
  return {
    isCommunityPool: true,
    name: nameTemplate(poolGraphData),
    symbol: symbolTemplate(poolGraphData)
  }
}
