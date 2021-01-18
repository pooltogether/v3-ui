import { useClaimablePoolComptrollerAddresses } from "lib/hooks/useClaimablePoolComptrollerAddresses"
import ComptrollerV2ABI from "@pooltogether/pooltogether-contracts/abis/ComptrollerV2"
import { useQuery } from "react-query"
import { QUERY_KEYS } from "lib/constants"
import { testAddress } from "lib/utils/testAddress"
import { useContext } from "react"
import { AuthControllerContext } from "lib/components/contextProviders/AuthControllerContextProvider"
import { batch, contract } from "@pooltogether/etherplex"
import { ethers } from "ethers"


export const useTotalClaimablePool = () => {
  const { data: comptrollerAddresses } = useClaimablePoolComptrollerAddresses()
  const { usersAddress, pauseQueries, provider } = useContext(AuthControllerContext)
  
  const addressError = testAddress(usersAddress)

  
  // TODO: ensure that the comptroller is v2?
  return useQuery(
    [QUERY_KEYS.claimablePoolQuery, comptrollerAddresses],
    async () => {
      return getTotalClaimablePool(provider, usersAddress, comptrollerAddresses)
    },
    {
      enabled: comptrollerAddresses && comptrollerAddresses.length > 0 && !pauseQueries && usersAddress && !addressError
    }
  )
}


// TODO: Ideally this data is just shared from the other components
// but the way the hooks are structured it's tricky to get the full list vs
// the individual pools data
async function getTotalClaimablePool (provider, usersAddress, comptrollerAddresses) {

  const batchCalls = []
  comptrollerAddresses.forEach(comptrollerAddress => {
    const comptrollerContract = contract(comptrollerAddress, ComptrollerV2ABI, comptrollerAddress)
    batchCalls.push(comptrollerContract.claim(usersAddress))
  })

  const comptrollerResponse = await batch(
    provider,
    ...batchCalls
  )

  let totalClaimable = 0
  Object.keys(comptrollerResponse).forEach(comptrollerAddress => {
    const response = comptrollerResponse[comptrollerAddress]
    totalClaimable += Number(ethers.utils.formatUnits(response.claim[0], 18))
  })

  return totalClaimable
}
