import React from 'react'
import { omit } from 'lodash'

import { getButtonClasses } from 'lib/components/ButtonLink'

export const Button = (props) => {
  const classes = getButtonClasses(props)

  let newProps = omit(props, [
    'noAnim',
    'outline',
    'textSize',
  ])

  return <button
    {...newProps}
    className={classes}
  />
}
