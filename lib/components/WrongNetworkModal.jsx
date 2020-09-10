import React, { useContext } from 'react'

import {
  SUPPORTED_CHAIN_IDS,
} from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Modal } from 'lib/components/Modal'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { networkBgColorClassname } from 'lib/utils/networkColorClassnames'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index
}

export const WrongNetworkModal = (props) => {
  const { t } = useTranslation()

  const authControllerContext = useContext(AuthControllerContext)
  const { supportedNetwork } = authControllerContext

  let supportedNetworkNames = SUPPORTED_CHAIN_IDS.map(chainId => 
    chainIdToNetworkName(chainId)
  )
  supportedNetworkNames = supportedNetworkNames.filter(onlyUnique)
    .filter(name => name !== 'localhost')

  return <>
    <Modal
      visible={!supportedNetwork}
      header={t('ethereumNetworkMismatch')}
    >
      {t('yourEthereumNetworkIsUnsupported')} <div
        className='inline-flex items-start justify-start font-bold text-white text-center mt-2'
      >
        {supportedNetworkNames.map(name => {
          return <div
            key={`network-${name}`}
            className={`inline-block bg-${networkBgColorClassname(
              networkNameToChainId(name)
            )} px-2 py-1 w-24 rounded-full mr-2 mt-2 mr-2`}
          >
            {name}
          </div>
        })}
      </div>
    </Modal>
  </>
}
