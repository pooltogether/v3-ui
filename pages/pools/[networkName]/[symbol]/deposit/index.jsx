import React from 'react'

import { PoolShow } from 'lib/components/PoolShow'

export default function DepositPage(props) {
  return (
    <>
      <PoolShow {...props} />
    </>
  )
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
