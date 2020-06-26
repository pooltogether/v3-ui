import React, { useEffect } from 'react'

export const ThemeSwitcher = (props) => {
  if (!window) {
    return null
  }

  useEffect(() => {
    var body = document.body,
      currentValue = localStorage.getItem('theme')

    body.classList.add('theme-light')

    if (currentValue == 'dark') {
      body.classList.add('theme-dark')
      body.classList.remove('theme-dark')
    }
  }, [])

  const toggleTheme = (e) => {
    e.preventDefault()

    const body = document.body

    if (body.classList.contains('theme-dark')) {
      body.classList.remove('theme-dark')
      body.classList.add('theme-light')
      localStorage.removeItem('theme')
    } else {
      body.classList.remove('theme-light')
      body.classList.add('theme-dark')
      localStorage.setItem('theme', 'dark')
    }
  }

  return <label
    onClick={toggleTheme}
    className='theme-toggler m-0 relative'
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
          &nbsp;
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
          &nbsp;
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
