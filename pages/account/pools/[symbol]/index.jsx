import { AccountLoggedIn } from 'lib/components/AccountLoggedIn'
import { AccountPoolShowUI } from 'lib/components/AccountPoolShowUI'

export default function AccountPool(props) {
  return <AccountLoggedIn>
    <AccountPoolShowUI />
  </AccountLoggedIn>
}
