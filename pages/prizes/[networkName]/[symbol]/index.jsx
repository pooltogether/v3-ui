import React from 'react'

import { PoolPrizesShow } from 'lib/components/PoolPrizesShow'

export default function PrizesIndexPage() {
  return <PoolPrizesShow />
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false
  }
}
