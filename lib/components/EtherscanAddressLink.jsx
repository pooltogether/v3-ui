import React from 'react'
import FeatherIcon from 'feather-icons-react'

import { formatEtherscanAddressUrl } from 'lib/utils/formatEtherscanAddressUrl'
import { networkNameToChainId } from 'lib/utils/networkNameToChainId'

export const EtherscanAddressLink = (props) => {
  const {
    address,
    children,
    className,
    networkName,
    size,
  } = props

  const chainId = networkNameToChainId(networkName)
  const url = formatEtherscanAddressUrl(address, chainId)

  let textSizeClasses = 'text-xs sm:text-base lg:text-lg'
  if (size === 'xxs') {
    textSizeClasses = 'text-xxs sm:text-xxxs lg:text-xs'
  }

  return <>
    <a
      href={url}
      className={`trans no-underline ${textSizeClasses} ${className}`}
      target='_blank'
      rel='noopener noreferrer'
      title='View on Etherscan'
    >
      {children}  <FeatherIcon
        icon='external-link'
        className='is-etherscan-arrow inline-block'
      />
    </a>
  </>
}