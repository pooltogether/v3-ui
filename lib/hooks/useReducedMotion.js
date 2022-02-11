import { useReducedMotion as framerUseReducedMotion } from 'framer-motion'

export function useReducedMotion(props) {
  return process.env.NEXT_PUBLIC_REDUCE_MOTION || framerUseReducedMotion()
}
