import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import React from 'react'

import { CopyIcon } from 'lib/components/CopyIcon'
import { formatBlockExplorerAddressUrl, formatBlockExplorerTxUrl } from 'lib/utils/networks'
import { shorten as shortenHash } from 'lib/utils/shorten'

export const BlockExplorerLink = (props) => {
  const {
    address,
    txHash,
    children,
    className,
    shorten,
    noIcon,
    iconClassName,
    copyable,
    chainId
  } = props

  let url
  if (txHash) {
    url = formatBlockExplorerTxUrl(txHash, chainId)
  } else if (address) {
    url = formatBlockExplorerAddressUrl(address, chainId)
  }

  const display = txHash || address

  return (
    <>
      <a
        href={url}
        className={`trans hover:opacity-70 ${className} inline-flex`}
        target='_blank'
        rel='noopener noreferrer'
        title='View on Block Explorer'
      >
        {children || (
          <div className='flex'>
            <span
              className={classnames('inline-block', {
                'sm:hidden': !shorten
              })}
            >
              {shortenHash(display)}
            </span>
            <span
              className={classnames('hidden', {
                'sm:inline-block': !shorten
              })}
            >
              {display}
            </span>
            {!noIcon && <LinkIcon className={iconClassName} />}
          </div>
        )}
      </a>
      {copyable && <CopyIcon className='ml-2 my-auto' text={display} />}
    </>
  )
}

BlockExplorerLink.defaultProps = {
  noIcon: false
}

export const LinkIcon = (props) => (
  <FeatherIcon
    icon='external-link'
    className={classnames('em-1 ml-1 my-auto inline-block', props.className)}
  />
)
