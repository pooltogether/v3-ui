import React from 'react'
import FeatherIcon from 'feather-icons-react'
import classnames from 'classnames'
import { shorten as shortenHash } from '@pooltogether/utilities'

import { CopyIcon } from 'lib/components/CopyIcon'
import { formatBlockExplorerAddressUrl, formatBlockExplorerTxUrl } from 'lib/utils/networks'

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
        className={`trans hover:text-highlight-1 ${className} inline-flex`}
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
              {shortenHash({ hash: display })}
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
    icon='arrow-up-right'
    className={classnames('w-4 h-4 ml-1 my-auto inline-block', props.className)}
  />
)
