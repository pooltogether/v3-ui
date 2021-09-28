import { useSendTransaction } from '@pooltogether/hooks'
import { useOnboard } from '@pooltogether/bnc-onboard-hooks'
import { useTranslation } from 'react-i18next'
import { poolToast } from '@pooltogether/react-components'

export const useSendTransactionWrapper = () => {
  const { address: usersAddress, provider, network: chainId } = useOnboard()
  const { t } = useTranslation()

  return useSendTransaction(t, poolToast, usersAddress, provider, chainId)
}
