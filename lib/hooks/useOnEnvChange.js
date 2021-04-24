import { useAppEnv } from 'lib/hooks/useAppEnv'
import { useEffect } from 'react'

export const useOnEnvChange = (callback) => {
  const { appEnv } = useAppEnv()
  useEffect(callback, [appEnv])
}
