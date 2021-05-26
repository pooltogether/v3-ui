import React from 'react'

import { AccountLoggedIn } from 'lib/components/AccountLoggedIn'
import { AccountUI } from 'lib/components/AccountUI'

export default function AccountManage(props) {
  return (
    <AccountLoggedIn>
      <AccountUI />
    </AccountLoggedIn>
  )
}

export { getStaticProps } from 'lib/utils/getI18nStaticProps'
export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
