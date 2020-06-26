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

  return <button onClick={toggleTheme} type='button'>Dark/Light</button>
}
