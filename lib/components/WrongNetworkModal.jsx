import React, { useContext, useState } from 'react'

import { SUPPORTED_NETWORKS } from 'lib/constants'
import { useTranslation } from 'lib/../i18n'
import { AuthControllerContext } from 'lib/components/contextProviders/AuthControllerContextProvider'
import { Modal } from 'lib/components/Modal'
import { chainIdToNetworkName } from 'lib/utils/chainIdToNetworkName'
import { networkTextColorClassname } from 'lib/utils/networkColorClassnames'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

const onlyUnique = (value, index, self) => {
  return self.indexOf(value) === index
}

export function WrongNetworkModal(props) {
  const { t } = useTranslation()

  const [bypassed, setBypassed] = useState(false)

  const { networkName, supportedNetwork } = useContext(AuthControllerContext)

  let supportedNetworkNames = SUPPORTED_NETWORKS.map((_chainId) => chainIdToNetworkName(_chainId))
  supportedNetworkNames = supportedNetworkNames
    .filter(onlyUnique)
    .filter((name) => name !== 'localhost')

  const handleClose = (e) => {
    e.preventDefault()

    setBypassed(true)
  }

  if (supportedNetwork) {
    return null
  }

  return (
    <>
      {bypassed && (
        <>
          <div
            className='r-0 l-0 fixed w-10/12 sm:w-1/4 bg-red px-4 py-2 font-bold mx-auto text-center rounded-lg z-50 text-white capitalize'
            style={{
              bottom: '10vh'
            }}
          >
            {t('unsupportedNetwork')} {networkName}
          </div>
        </>
      )}

      <Modal
        handleClose={handleClose}
        visible={!supportedNetwork && !bypassed}
        header={t('ethereumNetworkMismatch')}
      >
        {t('yourEthereumNetworkIsUnsupported')}{' '}
        <div className='flex flex-col items-start justify-start text-center mt-2'>
          {supportedNetworkNames.map((name) => {
            const chainId = networkNameToChainId(name)
            return (
              <div
                key={`network-${name}`}
                className={`block text-${networkTextColorClassname(chainId)} mt-2`}
              >
                <span className='capitalize font-bold'>{name}</span>{' '}
                <span className='opacity-20 text-inverse'> (chainId: {chainId})</span>
              </div>
            )
          })}
        </div>
      </Modal>
    </>
  )
}
