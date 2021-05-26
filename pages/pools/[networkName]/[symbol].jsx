import React from 'react'

import { PoolShow } from 'lib/components/PoolShow'

export default function PoolShowPage(props) {
  return (
    <>
      <PoolShow {...props} />
    </>
  )
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false
  }
}
