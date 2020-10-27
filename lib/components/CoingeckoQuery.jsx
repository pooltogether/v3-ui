import { useContext, useEffect } from 'react'
import { useQuery } from '@apollo/client'
import { useInterval } from 'beautiful-react-hooks'

import { MAINNET_POLLING_INTERVAL } from 'lib/constants'
import { GeneralContext } from 'lib/components/contextProviders/GeneralContextProvider'
import { externalAwardsQuery } from 'lib/queries/externalAwardsQuery'
import { coingeckoDataVar } from 'lib/apollo/cache'

const COINGECKO_LAMBDA_PATH = `/.netlify/functions/coingecko-price-api`

export const CoingeckoQuery = (props) => {
  const { paused } = useContext(GeneralContext)

  const {
    loading,
    error,
    data
  } = useQuery(externalAwardsQuery, {
    fetchPolicy: 'network-only',
    pollInterval: paused ? 0 : MAINNET_POLLING_INTERVAL
  })

  if (error) {
    console.error(error)
  }
  
  const getCoingeckoData = async () => {
    try {
      const addressesString = data.externalErc20Awards.map(award => award.address).join(',')
      const postData = {
        addressesString
      }
      
      const response = await fetch(COINGECKO_LAMBDA_PATH, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData) // body data type must match "Content-Type" header
      })
      const result = await response.json()

      coingeckoDataVar(result)
    } catch (error) {
      console.error(error)
    }
  }

  useInterval(() => {
    if (!loading && data) {
      getCoingeckoData()
    }
  }, 30000)

  useEffect(() => {
    if (!loading && data) {
      getCoingeckoData()
    }
  }, [])

  return null
}
