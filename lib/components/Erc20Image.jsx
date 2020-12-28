import React from 'react'

import { TOKEN_IMAGES } from 'lib/constants'

export const Erc20Image = (props) => {
  const src = TOKEN_IMAGES[props.address]

  return src ? <img
    src={src}
    className='inline-block mr-2 w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full'
  /> : <div
    className='inline-block mr-2 bg-overlay-white w-3 h-3 xs:w-4 xs:h-4 sm:w-5 sm:h-5 rounded-full'
    style={{
      minWidth: 12
    }}
  />
}
