import React, { useState } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, MenuPopover } from '@reach/menu-button'
import { positionMatchWidth } from '@reach/popover'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'

export const DropdownInputGroup = (props) => {
  // Dropdown Logic

  const { id, formatValue, label, placeHolder, values, currentValue, onValueSet, disabled } = props

  const handleChangeValueClick = (newValue) => {
    onValueSet(newValue)
  }

  let valuesArray = []
  if (typeof values === 'object') {
    valuesArray = Object.keys(values).map((v) => v)
  }

  const menuItems = valuesArray.map((valueItem) => {
    let value = valueItem

    const selected = value === currentValue

    return (
      <MenuItem
        key={`${id}-value-picker-item-${value}`}
        onSelect={() => {
          handleChangeValueClick(value)
        }}
        className={classnames({
          selected
        })}
      >
        {formatValue ? formatValue(value) : value}
      </MenuItem>
    )
  })

  // Styling

  let {
    textClasses,
    roundedClasses,
    marginClasses,
    paddingClasses,
    borderClasses,
    backgroundClasses,
    iconSizeClasses,
    labelClassName,
    unitsClassName,
    containerClassName,
    isError,
    isSuccess
  } = props

  iconSizeClasses = iconSizeClasses ?? 'w-4 h-4 sm:w-8 sm:h-8'

  textClasses =
    textClasses ??
    classnames('text-xs xs:text-sm sm:text-xl lg:text-2xl trans', {
      'text-accent-1': disabled || !currentValue
    })

  containerClassName = containerClassName ?? 'w-full'

  roundedClasses = roundedClasses ?? 'rounded-full'

  marginClasses = marginClasses ?? 'mb-2 lg:mb-2'

  paddingClasses = paddingClasses ?? 'py-2 px-5 sm:py-4 sm:px-10'

  borderClasses =
    borderClasses ??
    classnames('border', {
      'border-red-1': isError,
      'border-green-2': isSuccess,
      'border-transparent': !isError && !isSuccess,
      'hover:border-accent-3 focus-within:border-accent-3 focus-within:shadow-green': !disabled
    })

  backgroundClasses =
    backgroundClasses ??
    classnames('bg-body', {
      'bg-grey': disabled
    })

  labelClassName =
    labelClassName ??
    classnames('mt-0 mb-1 text-xs sm:text-sm', {
      'cursor-not-allowed opacity-30': disabled,
      'text-accent-1': !disabled
    })

  unitsClassName =
    unitsClassName ??
    classnames('font-bold text-xs sm:text-sm whitespace-no-wrap', {
      'cursor-not-allowed opacity-30': disabled,
      'font-white': !disabled
    })

  const className = classnames(
    'trans',
    containerClassName,
    textClasses,
    roundedClasses,
    marginClasses,
    paddingClasses,
    borderClasses,
    backgroundClasses
  )

  let selectedItem = placeHolder ?? null
  if (currentValue) {
    selectedItem = formatValue ? formatValue(currentValue) : currentValue
  }

  return (
    <>
      <Menu>
        {({ isExpanded }) => (
          <>
            <MenuButton className={classnames(className, 'focus:outline-none')}>
              <div className='flex flex-col items-center text-left'>
                {label && (
                  <label htmlFor={id} className={labelClassName}>
                    {label}
                  </label>
                )}
                <div className='w-full flex items-center justify-between'>
                  <div className='flex'>{selectedItem}</div>
                  <FeatherIcon
                    icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                    className={classnames(`relative inline-block my-auto`, iconSizeClasses)}
                    strokeWidth='0.15rem'
                  />
                </div>
              </div>
            </MenuButton>

            <MenuPopover position={positionMatchWidth}>
              <MenuItems>{menuItems}</MenuItems>
            </MenuPopover>
          </>
        )}
      </Menu>
    </>
  )
}
