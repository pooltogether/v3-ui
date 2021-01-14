import { AuthControllerContext } from "lib/components/contextProviders/AuthControllerContextProvider"
import { QUERY_KEYS } from "lib/constants"
import { useContext } from "react"
import { useQuery } from "react-query"


export const useRetroactivePoolClaimData = () => {
  const { refetch, data, isFetching, isFetched, error } = useFetchRetroactivePoolClaimData()

  return {
    loading: !isFetched || (isFetching && !isFetched),
    refetch,
    data, 
    isFetching,
    isFetched,
    error
  }
}

const useFetchRetroactivePoolClaimData = () => {
  const { usersAddress, pauseQueries, provider } = useContext(AuthControllerContext)

  return useQuery(
    [QUERY_KEYS.retroactivePoolClaimDataQuery],
    async () => {
      return getRetroactivePoolClaimData(provider, usersAddress)
    },
    {
      enabled: usersAddress && !pauseQueries,
    }
  )
}

const getRetroactivePoolClaimData =  async (provider, usersAddress) => {

  const merkleDistributionData = await getMerkeDistributionData(usersAddress)
  const isClaimed = await getIsClaimed(merkleDistributionData.index)

  return {
    ...merkleDistributionData,
    isClaimed
  }
}

// TODO: Fetch this
const getMerkeDistributionData = async (usersAddress) => {
  return {
    "index":0,
    "amount":"0x15af1d78b58c400000",
    // TODO: FOrmat amount
    "formattedAmount": "400",
    "proof":[
      "0xb1bcfa5de1b8585bb7c22411cd0c7ee3ac895000053f72ed782d475d31b9c1ee","0xe79bbbfb9c1e4a64fe29a3a0e1f457de1bfea98bcd79626f168d44f10976a96a","0x0dcbac62f9582c69faf2c9ae1006247250c79d3f4751e6977dfca0449e3bd7be","0x82c3119f1abaded54d1e5c2885114afe7e9027e73524d74ccc07a64187eff1ef","0x166372f4d7a998c57022e9ff0b3991a836b65c9dc14f89b02d61c3fa3719f912","0x3f989a38cb736649d32bbe3adb3b47890ffa2cd00d110679fe62b098631e544a","0x684111c5a17e8fcf15309a665b94659797b98e8b00ea2a1382df42d9b2aef291","0xd030429c1f0aebde9f653c2b64ba160999ce6ddebf364a6945c89960d6b2c1d0","0x2c4b5dbbda9a15cf7332c738c8443c52d941028ae5a4830ae7ca78a3e42355ae","0x78c0ffe4e41863b4abb2f76be94a908d6263eccf608ed569c87dc7243138ca53","0x75fc639ce315996ae068c1ea0996d1246b8c6351c8caa4ab8bc53fd77c95ace6","0x1bc1e685bd3df50227c5ab93475814bb11641b5a84bfd8a5d4eee02396dc5297","0x627ddd1e7ef9c1e3a641d0226ecd7a298c6a2272181d3af505c156225846c283","0x2f97c1284514856376fa0d4cc248da5fac156797e1a62ee4d4e5b79330cd18ce","0x5665fc633c28726ccf726054971b13edd877c99c8d2a64fb0d74c92bb7d39e1d","0x6d79bbfc56dbc08f3c0ab6a11753883b322781b949cd36778c2f313f13212977","0x26ecbdae89fc55ef1d8ef396bfd7ed36d54fc821c8f283fdbb5dcebec5f739df","0xdeab88d76ca5389f96456da4fb9f1b2d7a54cb9ed14aab85dadcd9ab1d8e9cba"
    ],
    "flags": {
      "isSOCKS":false,
      "isLP":true,
      "isUser":true
    }
  }
}

// TODO: need Merkle distributor abi,
// read from chain
const getIsClaimed = async (index) => {
  return false
  // return true
}