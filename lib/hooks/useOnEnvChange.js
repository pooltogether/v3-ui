import { useIsTestnets } from '@pooltogether/hooks'
import { useEffect } from 'react'

export const useOnEnvChange = (callback) => {
  const { isTestnets } = useIsTestnets()
  useEffect(callback, [isTestnets])
}
