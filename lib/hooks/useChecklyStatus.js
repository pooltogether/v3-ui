import { useEffect } from 'react'

const CHECKLY_LAMBDA_PATH = `/.netlify/functions/checklyCheckStatuses`

export const useChecklyStatus = () => {
  useEffect(() => {
    getChecklyChecks()
  }, [])
}

const getChecklyChecks = async () => {
  const response = await fetch(CHECKLY_LAMBDA_PATH)
  const body = await response.json()
  console.log(body)
}

// Bearer 948dd46edb74449196f7620931716e62
