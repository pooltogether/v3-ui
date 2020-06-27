import React, { useEffect } from 'react'
import Cookies from 'js-cookie'

const THEME = 'theme'

let cookieOptions = { sameSite: 'strict' }
if (process.env.NEXT_JS_DOMAIN_NAME) {
  cookieOptions = {
    ...cookieOptions,
    domain: `.${process.env.NEXT_JS_DOMAIN_NAME}`
  }
}

export const ThemeSwitcher = (props) => {
  if (!window) {
    return null
  }

  useEffect(() => {
    let stored = Cookies.get(THEME)
    
    const body = document.body
    body.classList.add('theme-light')

    if (window && window.matchMedia) {
      const setThemeAutomatically = (newValue) => {
        if (newValue === 'theme-dark') {
          body.classList.add('theme-dark')
          body.classList.remove('theme-light')
        } else if (newValue === 'theme-light') {
          body.classList.add('theme-light')
          body.classList.remove('theme-dark')
        }
      }

      // register an onChange listener if we don't have a cookie set
      if (!stored && window.matchMedia) {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
          const newValue = e.matches ? 'theme-dark' : 'theme-light'
          setThemeAutomatically(newValue)
        })

        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        stored = prefersDark ? 'theme-dark' : 'theme-light'
      }

      // onLoad
      setThemeAutomatically(stored)
    }
  }, [])

  const toggleTheme = (e) => {
    e.preventDefault()

    const body = document.body

    if (body.classList.contains('theme-dark')) {
      Cookies.set(
        THEME,
        'light',
        cookieOptions
      )

      body.classList.remove('theme-dark')
      body.classList.add('theme-light')
    } else {
      body.classList.remove('theme-light')
      body.classList.add('theme-dark')

      Cookies.set(
        THEME,
        'dark',
        cookieOptions
      )
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
