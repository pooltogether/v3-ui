import React from 'react'
import classnames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import {
  Menu,
  MenuList,
  MenuButton,
  MenuItem,
} from '@reach/menu-button'

export function DropdownInputGroup(props) {
  const {
    id,
    className,
    current,
    setCurrent,
    label,
    textColor,
    hoverTextColor,
    options,
  } = props

  let optionsArray = []
  if (typeof options === 'object') {
    optionsArray = Object.keys(options).map(v => v)
  }

  console.log(current)
  console.log(optionsArray)
  const currentValue = current ? current : optionsArray?.[0]

  const handleChange = (newValue) => {
    setCurrent(newValue)
  }

  const menuItems = optionsArray.map(valueItem => {
    let value = valueItem

    const selected = value === currentValue

    return <MenuItem
      key={`${id}-value-picker-item-${value}`}
      onSelect={() => { handleChange(value) }}
      className={classnames(
        {
          selected
        }
      )}
    >
      {options[value]}
    </MenuItem>
  })

  const inactiveTextColorClasses = `${textColor} hover:${hoverTextColor}`
  const activeTextColorClasses = `${hoverTextColor} hover:${hoverTextColor}`

  console.log(currentValue)

  return <>
    <div
      className='mx-auto'
      style={{
        maxWidth: 500
      }}
    >
      <label
        className='text-accent-3 font-bold text-xxxs xs:text-xxs pl-8'
      >
        {label}
      </label>
      <Menu>
        {({ isExpanded }) => (
          <>
            <MenuButton
              className={classnames(
                className,
                'w-full text-xxs xs:text-sm sm:text-base lg:text-xl bg-transparent border rounded-full inline-flex px-8 py-3 items-center justify-between trans font-bold',
                {
                  [inactiveTextColorClasses]: !isExpanded,
                  [activeTextColorClasses]: isExpanded,
                }
              )}
            >
              <span>{options[currentValue]}</span> <FeatherIcon
                icon={isExpanded ? 'chevron-up' : 'chevron-down'}
                className='relative w-4 h-4 inline-block ml-2'
                strokeWidth='0.15rem'
              />
            </MenuButton>

            <MenuList className='slide-down'>
              {menuItems}
            </MenuList>
          </>
        )}
      </Menu>
    </div>

  </>
}