import React from 'react'

import { AccountUI } from 'lib/components/AccountUI'

export default function PlayerPage(props) {
  return <AccountUI />
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: false
  }
}
