import { useAppEnv } from '@pooltogether/hooks'
import { useEffect } from 'react'

export const useOnEnvChange = (callback) => {
  const { appEnv } = useAppEnv()
  useEffect(callback, [appEnv])
}
