import React, { useContext } from 'react'

import { ThemeContext } from 'lib/components/contextProviders/ThemeContextProvider'

export const ThemeSwitcher = (props) => {
  const { toggleTheme } = useContext(ThemeContext)

  return <label
    onClick={toggleTheme}
    className='theme-toggler m-0 relative select-none'
  >
    <div className='toggle'></div>
    <div
      className='theme-toggler--names relative z-10 flex items-center justify-between'
    >
      <span
        className='theme-toggler--light font-bold text-xxs ml-4'
      >
        <span
          className='sm:hidden'
        >
        </span>
        <span
          className='hidden sm:block'
        >
          Light
        </span>
      </span>
      <span
        className='theme-toggler--dark font-bold text-xxs mr-4'
      >
        <span
          className='sm:hidden'
        >
        </span>
        <span
          className='hidden sm:block'
        >
          Dark
        </span>
      </span>
    </div>
  </label>
}
